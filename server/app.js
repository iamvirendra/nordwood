import express from 'express';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, extname } from 'node:path';
import { ApiError, createSession, csrfProtection, enforceLimit, hashPassword, publicUser, randomToken, readCookie, requireAdmin, requireUser, setSessionCookie, tokenHash, verifyPassword } from './security.js';
import { emailField, numericId, passwordField, statuses, textField, validateOrder } from './validation.js';
import { transaction } from './db.js';
import { getAdminOrders, getOrder, getUserOrders, placeOrder, updateOrderStatus } from './orders.js';
import { createMailer } from './mail.js';

export function createApp({ pool, config, sendResetEmail = createMailer(config), logger = console }) {
  const app = express();
  app.disable('x-powered-by');
  if (config.trustProxy) app.set('trust proxy', config.trustProxy);
  app.use((_req, res, next) => {
    res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()' });
    if (config.production) res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });
  app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  app.use('/api', express.json({ limit: '32kb' }));
  app.get('/api/health', async (_req, res) => {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  });
  app.use('/api', async (req, _res, next) => {
    const token = readCookie(req.get('cookie'), config.cookieName);
    req.session = null;
    req.user = null;
    if (token) {
      const [row] = await pool.query(`SELECT s.token_hash, s.user_id, s.csrf_token, s.expires_at,
        u.id, u.name, u.email, u.role FROM sessions s LEFT JOIN users u ON u.id = s.user_id
        WHERE s.token_hash = ? AND s.expires_at > UTC_TIMESTAMP(3)`, [tokenHash(token)]);
      if (row) {
        req.session = row;
        if (row.user_id) req.user = publicUser(row);
      }
    }
    next();
  });
  app.use('/api', csrfProtection(config));

  app.get('/api/auth/session', async (req, res) => {
    if (!req.session) {
      await enforceLimit(pool, `session:${req.ip}`, 120, 15);
      const session = await createSession(pool, null);
      setSessionCookie(res, config, session);
      return res.json({ user: null, csrfToken: session.csrfToken });
    }
    res.json({ user: req.user, csrfToken: req.session.csrf_token });
  });

  const authenticationLimit = async req => {
    await enforceLimit(pool, `auth-ip:${req.ip}`, 50, 15);
    if (typeof req.body?.email === 'string') await enforceLimit(pool, `auth-email:${req.body.email.trim().toLowerCase().slice(0, 254)}`, 12, 15);
  };

  app.post('/api/auth/signup', async (req, res) => {
    await authenticationLimit(req);
    const name = textField(req.body?.name, 'Name', 2, 100);
    const email = emailField(req.body?.email);
    const password = passwordField(req.body?.password);
    const passwordHash = await hashPassword(password);
    let result;
    try {
      result = await transaction(pool, async connection => {
        // A browser cannot assign or elevate roles through registration fields.
        const inserted = await connection.query("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'customer')", [name, email, passwordHash]);
        const user = { id: Number(inserted.insertId), name, email, role: 'customer' };
        const session = await createSession(connection, user.id, { previousHash: req.session.token_hash });
        return { user, session };
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new ApiError(409, 'Unable to create an account with this email. Try signing in or resetting your password.', { email: 'Try signing in or resetting your password.' });
      throw error;
    }
    setSessionCookie(res, config, result.session);
    res.status(201).json({ user: result.user, csrfToken: result.session.csrfToken });
  });

  app.post('/api/auth/login', async (req, res) => {
    await authenticationLimit(req);
    const email = emailField(req.body?.email);
    const password = req.body?.password;
    if (typeof password !== 'string' || password.length < 1 || password.length > 128) throw new ApiError(401, 'The email or password is incorrect.');
    const [user] = await pool.query('SELECT id, name, email, role, password_hash FROM users WHERE email = ?', [email]);
    const valid = await verifyPassword(password, user?.password_hash);
    if (!user || !valid) throw new ApiError(401, 'The email or password is incorrect.');
    const session = await transaction(pool, async connection => {
      // Re-read under a lock so an old password cannot race a reset to mint a session.
      const [current] = await connection.query('SELECT password_hash FROM users WHERE id = ? FOR UPDATE', [user.id]);
      if (current.password_hash !== user.password_hash) throw new ApiError(401, 'The email or password is incorrect.');
      return createSession(connection, user.id, { previousHash: req.session.token_hash, remember: req.body.remember === true });
    });
    setSessionCookie(res, config, session);
    res.json({ user: publicUser(user), csrfToken: session.csrfToken });
  });

  app.post('/api/auth/logout', async (req, res) => {
    const session = await transaction(pool, connection => createSession(connection, null, { previousHash: req.session.token_hash }));
    setSessionCookie(res, config, session);
    res.json({ user: null, csrfToken: session.csrfToken, message: 'You have been signed out.' });
  });

  app.post('/api/auth/forgot-password', async (req, res) => {
    await enforceLimit(pool, `reset-ip:${req.ip}`, 10, 30);
    const email = emailField(req.body?.email);
    await enforceLimit(pool, `reset-email:${email}`, 3, 30);
    if (!sendResetEmail) throw new ApiError(503, 'Password recovery is not available yet. Please contact NordWood for help.');
    const [user] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (user) {
      const token = randomToken();
      await transaction(pool, async connection => {
        await connection.query('SELECT id FROM users WHERE id = ? FOR UPDATE', [user.id]);
        await connection.query('DELETE FROM password_resets WHERE user_id = ?', [user.id]);
        await connection.query('INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES (?, ?, TIMESTAMPADD(MINUTE, 30, UTC_TIMESTAMP(3)))', [tokenHash(token), user.id]);
      });
      try {
        await sendResetEmail({ email, token });
      } catch {
        await pool.query('DELETE FROM password_resets WHERE token_hash = ?', [tokenHash(token)]);
        // Never expose SMTP details or reveal an account through a send error.
        logger.error('Password reset email delivery failed. Check SMTP configuration.');
      }
    }
    res.json({ message: 'If an account exists for this email, a password reset link will be sent shortly.' });
  });

  app.post('/api/auth/reset-password', async (req, res) => {
    await enforceLimit(pool, `reset-token:${req.ip}`, 15, 15);
    const token = req.body?.token;
    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) throw new ApiError(400, 'This reset link is invalid or has expired. Request a new link.');
    const password = passwordField(req.body?.password);
    const passwordHash = await hashPassword(password);
    await transaction(pool, async connection => {
      const [candidate] = await connection.query('SELECT user_id FROM password_resets WHERE token_hash = ? AND expires_at > UTC_TIMESTAMP(3)', [tokenHash(token)]);
      if (!candidate) throw new ApiError(400, 'This reset link is invalid or has expired. Request a new link.');
      await connection.query('SELECT id FROM users WHERE id = ? FOR UPDATE', [candidate.user_id]);
      const [reset] = await connection.query('SELECT user_id FROM password_resets WHERE token_hash = ? AND expires_at > UTC_TIMESTAMP(3) FOR UPDATE', [tokenHash(token)]);
      if (!reset) throw new ApiError(400, 'This reset link is invalid or has expired. Request a new link.');
      await connection.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, reset.user_id]);
      await connection.query('DELETE FROM password_resets WHERE user_id = ?', [reset.user_id]);
      await connection.query('DELETE FROM sessions WHERE user_id = ?', [reset.user_id]);
    });
    const session = await transaction(pool, connection => createSession(connection, null, { previousHash: req.session.token_hash }));
    setSessionCookie(res, config, session);
    res.json({ user: null, csrfToken: session.csrfToken, message: 'Your password has been reset. Sign in with your new password.' });
  });

  app.post('/api/auth/change-password', requireUser, async (req, res) => {
    await enforceLimit(pool, `password-change:${req.user.id}`, 6, 15);
    const password = passwordField(req.body?.password);
    if (typeof req.body?.currentPassword !== 'string' || req.body.currentPassword.length > 128) throw new ApiError(422, 'Enter your current password.');
    const [user] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    if (!await verifyPassword(req.body.currentPassword, user.password_hash)) throw new ApiError(422, 'Your current password is incorrect.', { currentPassword: 'Your current password is incorrect.' });
    if (password === req.body.currentPassword) throw new ApiError(422, 'Choose a password different from your current password.');
    const passwordHash = await hashPassword(password);
    const session = await transaction(pool, async connection => {
      const [current] = await connection.query('SELECT password_hash FROM users WHERE id = ? FOR UPDATE', [req.user.id]);
      if (current.password_hash !== user.password_hash) throw new ApiError(409, 'Your password changed in another session. Sign in again.');
      await connection.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, req.user.id]);
      await connection.query('DELETE FROM sessions WHERE user_id = ?', [req.user.id]);
      await connection.query('DELETE FROM password_resets WHERE user_id = ?', [req.user.id]);
      return createSession(connection, req.user.id);
    });
    setSessionCookie(res, config, session);
    res.json({ user: req.user, csrfToken: session.csrfToken, message: 'Password updated. Your other sessions have been signed out.' });
  });

  app.get('/api/orders', requireUser, async (req, res) => res.json({ orders: await getUserOrders(pool, req.user.id) }));
  app.post('/api/orders', requireUser, async (req, res) => {
    await enforceLimit(pool, `place-order:${req.user.id}`, 20, 15);
    const result = await placeOrder(pool, req.user, validateOrder(req.body));
    res.status(result.created ? 201 : 200).json({ order: result.order });
  });
  app.get('/api/orders/:id', requireUser, async (req, res) => res.json({ order: await getOrder(pool, numericId(req.params.id), req.user) }));
  app.get('/api/admin/orders', requireAdmin, async (req, res) => {
    const search = typeof req.query.search === 'string' ? req.query.search.trim().slice(0, 100) : '';
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    if (status && !statuses.includes(status)) throw new ApiError(422, 'Choose a valid order status.');
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    if (!Number.isInteger(page) || page < 1 || page > 100000) throw new ApiError(422, 'Choose a valid page number.');
    res.json(await getAdminOrders(pool, { search, status, page }));
  });
  app.patch('/api/admin/orders/:id', requireAdmin, async (req, res) => {
    if (!statuses.includes(req.body?.status)) throw new ApiError(422, 'Choose a valid order status.');
    res.json({ order: await updateOrderStatus(pool, numericId(req.params.id), req.body.status, req.user) });
  });
  app.use('/api', (_req, _res, next) => next(new ApiError(404, 'Endpoint not found.')));

  const dist = fileURLToPath(new URL('../dist/', import.meta.url));
  if (config.production && existsSync(resolve(dist, 'index.html'))) {
    app.use(express.static(dist, { index: 'index.html', maxAge: '1h', setHeaders: (res, path) => { if (extname(path) === '.html') res.set('Cache-Control', 'no-cache'); } }));
    app.get('/{*path}', (req, res, next) => {
      if (extname(req.path)) return next();
      res.set('Cache-Control', 'no-cache').sendFile(resolve(dist, 'index.html'));
    });
  }
  app.use((error, _req, res, _next) => {
    if (error instanceof ApiError) {
      if (error.retryAfter) res.set('Retry-After', String(error.retryAfter));
      return res.status(error.status).json({ message: error.message, ...(error.fields ? { fields: error.fields } : {}), ...(error.code ? { code: error.code } : {}) });
    }
    if (error.type === 'entity.parse.failed') return res.status(400).json({ message: 'The request contains invalid JSON.' });
    if (error.type === 'entity.too.large') return res.status(413).json({ message: 'This request is too large.' });
    logger.error('API request failed:', error.code || error.name || 'UnknownError');
    const unavailable = ['ER_GET_CONNECTION_TIMEOUT', 'ECONNREFUSED', 'ER_ACCESS_DENIED_ERROR', 'ER_BAD_DB_ERROR', 'ER_NO_SUCH_TABLE'].includes(error.code);
    res.status(unavailable ? 503 : 500).json({ message: unavailable ? 'Our service is temporarily unavailable. Please try again shortly.' : 'Something went wrong. Please try again.' });
  });
  return app;
}
