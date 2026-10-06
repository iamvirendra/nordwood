import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const derive = promisify(scrypt);
const SCRYPT = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
export const randomToken = () => randomBytes(32).toString('hex');
export const tokenHash = value => createHash('sha256').update(value).digest('hex');

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const key = await derive(password, salt, 64, SCRYPT);
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt}$${key.toString('hex')}`;
}

// A missing account still performs the same expensive password derivation.
const dummyHash = `scrypt$32768$8$3$${'0'.repeat(32)}$${'0'.repeat(128)}`;
export async function verifyPassword(password, encoded = dummyHash) {
  const [algorithm, n, r, p, salt, digest] = encoded.split('$');
  if (algorithm !== 'scrypt' || Number(n) !== SCRYPT.N || Number(r) !== SCRYPT.r || Number(p) !== SCRYPT.p || !/^[a-f0-9]{32}$/.test(salt || '') || !/^[a-f0-9]{128}$/.test(digest || '')) return false;
  const key = await derive(password, salt, 64, SCRYPT);
  return timingSafeEqual(key, Buffer.from(digest, 'hex'));
}

export function safeEqual(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string') return false;
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function readCookie(header, name) {
  if (!header || header.length > 8192) return null;
  const entries = header.split(';').map(value => value.trim());
  const value = entries.find(entry => entry.startsWith(`${name}=`))?.slice(name.length + 1);
  return value && /^[a-f0-9]{64}$/.test(value) ? value : null;
}

export class ApiError extends Error {
  constructor(status, message, fields) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

export function publicUser(row) {
  return { id: Number(row.id), name: row.name, email: row.email, role: row.role };
}

export function requireUser(req, _res, next) {
  if (!req.user) return next(new ApiError(401, 'Please sign in to continue.'));
  next();
}

export function requireAdmin(req, _res, next) {
  if (!req.user) return next(new ApiError(401, 'Please sign in to continue.'));
  if (req.user.role !== 'admin') return next(new ApiError(403, 'You do not have access to this page.'));
  next();
}

export async function enforceLimit(pool, key, max, windowMinutes = 15) {
  const bucket = tokenHash(key);
  await pool.query(`INSERT INTO rate_limits (bucket_key, hits, resets_at) VALUES (?, 1, TIMESTAMPADD(MINUTE, ?, UTC_TIMESTAMP(3)))
    ON DUPLICATE KEY UPDATE hits = IF(resets_at <= UTC_TIMESTAMP(3), 1, hits + 1),
    resets_at = IF(resets_at <= UTC_TIMESTAMP(3), VALUES(resets_at), resets_at)`, [bucket, windowMinutes]);
  const [row] = await pool.query('SELECT hits, GREATEST(TIMESTAMPDIFF(SECOND, UTC_TIMESTAMP(3), resets_at), 1) AS retry_after FROM rate_limits WHERE bucket_key = ?', [bucket]);
  if (Number(row.hits) > max) {
    const error = new ApiError(429, 'Too many attempts. Please try again in a few minutes.');
    error.retryAfter = Number(row.retry_after);
    throw error;
  }
}

export async function createSession(connection, userId, { remember = false, previousHash } = {}) {
  const token = randomToken();
  const csrfToken = randomToken();
  const maxAge = userId ? (remember ? 30 * 86400000 : 12 * 3600000) : 2 * 3600000;
  if (previousHash) await connection.query('DELETE FROM sessions WHERE token_hash = ?', [previousHash]);
  await connection.query('INSERT INTO sessions (token_hash, user_id, csrf_token, expires_at) VALUES (?, ?, ?, TIMESTAMPADD(SECOND, ?, UTC_TIMESTAMP(3)))', [tokenHash(token), userId, csrfToken, maxAge / 1000]);
  return { token, csrfToken, maxAge, remember };
}

export function setSessionCookie(res, config, session) {
  res.cookie(config.cookieName, session.token, {
    httpOnly: true, secure: config.production, sameSite: 'lax', path: '/',
    ...(session.remember ? { maxAge: session.maxAge } : {}),
  });
}

export function csrfProtection(config) {
  return (req, _res, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
    if (req.get('origin') !== config.origin || req.get('sec-fetch-site') === 'cross-site') return next(new ApiError(403, 'This request is not from the NordWood website.'));
    if (!req.is('application/json')) return next(new ApiError(415, 'Send this request as JSON.'));
    if (!req.session || !safeEqual(req.get('x-csrf-token'), req.session.csrf_token)) {
      const error = new ApiError(403, 'Your security token has expired. Refresh the page and try again.');
      error.code = 'CSRF_EXPIRED';
      return next(error);
    }
    next();
  };
}
