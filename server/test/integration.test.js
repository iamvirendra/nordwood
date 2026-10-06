import assert from 'node:assert/strict';
import test from 'node:test';
import { randomUUID } from 'node:crypto';
import { createApp } from '../app.js';
import { getConfig } from '../config.js';
import { createPool, migrate } from '../db.js';
import { enforceLimit, tokenHash } from '../security.js';
import { products } from '../../src/data/products.js';

const database = process.env.TEST_DB_NAME;

test('MariaDB authentication, checkout and administrator integration', { skip: !database && 'Set TEST_DB_NAME to a dedicated database ending in _test.' }, async t => {
  assert.match(database, /^[a-zA-Z0-9_]+_test$/, 'Integration tests only run against an explicit database ending in _test.');
  const config = getConfig({ ...process.env, NODE_ENV: 'test', APP_ORIGIN: 'http://localhost:5173', DB_NAME: database });
  const pool = createPool(config);
  let server;
  t.after(async () => {
    if (server) await new Promise(resolve => server.close(resolve));
    await pool.end();
  });
  await migrate(pool);
  await migrate(pool);
  for (const table of ['order_status_history', 'order_items', 'orders', 'password_resets', 'sessions', 'rate_limits', 'users']) await pool.query(`DELETE FROM ${table}`);
  const sentEmails = [];
  const app = createApp({ pool, config, sendResetEmail: async message => { sentEmails.push(message); }, logger: { error: (...args) => console.error(...args) } });
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api`;

  function browser() {
    return {
      cookie: '', csrf: '', user: null,
      async request(path, { method = 'GET', body, headers = {}, save = true } = {}) {
        const response = await fetch(`${base}${path}`, {
          method,
          headers: { ...(this.cookie ? { Cookie: this.cookie } : {}), ...(method !== 'GET' ? { Origin: config.origin, 'Content-Type': 'application/json', 'X-CSRF-Token': this.csrf } : {}), ...headers },
          body: body === undefined ? undefined : JSON.stringify(body),
        });
        const data = await response.json();
        if (save) {
          const cookie = response.headers.get('set-cookie');
          if (cookie) this.cookie = cookie.split(';')[0];
          if (data.csrfToken) this.csrf = data.csrfToken;
          if ('user' in data) this.user = data.user;
        }
        return { response, data, status: response.status };
      },
    };
  }
  const customer = browser();
  const stranger = browser();
  const admin = browser();
  const originalPassword = 'A sample strong password 2026';
  const customerEmail = 'customer@example.test';
  let orderId;
  let firstCookie;
  let firstCsrf;

  await t.test('anonymous session is HttpOnly and private routes require authentication', async () => {
    const session = await customer.request('/auth/session');
    assert.equal(session.status, 200);
    assert.equal(session.data.user, null);
    assert.match(session.response.headers.get('set-cookie'), /HttpOnly/);
    assert.match(session.response.headers.get('set-cookie'), /SameSite=Lax/i);
    assert.equal(session.response.headers.get('cache-control'), 'no-store');
    assert.equal((await customer.request('/orders')).status, 401);
    assert.equal((await customer.request('/admin/orders')).status, 401);
  });

  await t.test('CSRF, cross-origin writes and bad payloads are blocked', async () => {
    const body = { name: 'Buyer Name', email: customerEmail, password: originalPassword };
    assert.equal((await customer.request('/auth/signup', { method: 'POST', body, headers: { 'X-CSRF-Token': '' } })).status, 403);
    assert.equal((await customer.request('/auth/signup', { method: 'POST', body, headers: { Origin: 'https://evil.example' } })).status, 403);
    assert.equal((await customer.request('/auth/signup', { method: 'POST', body: { ...body, password: 'short' } })).status, 422);
    assert.equal((await pool.query('SELECT id FROM users')).length, 0);
  });

  await t.test('signup fixes role to customer and stores only password/token hashes', async () => {
    const oldCookie = customer.cookie;
    const result = await customer.request('/auth/signup', { method: 'POST', body: { name: 'Buyer Name', email: customerEmail.toUpperCase(), password: originalPassword, role: 'admin' } });
    assert.equal(result.status, 201);
    assert.equal(result.data.user.role, 'customer');
    assert.equal(result.data.user.email, customerEmail);
    assert.notEqual(customer.cookie, oldCookie);
    const [stored] = await pool.query('SELECT * FROM users WHERE email = ?', [customerEmail]);
    assert.match(stored.password_hash, /^scrypt\$/);
    assert.notEqual(stored.password_hash, originalPassword);
    assert.equal('password_hash' in result.data.user, false);
    const raw = customer.cookie.split('=')[1];
    const [session] = await pool.query('SELECT *, TIMESTAMPDIFF(SECOND, UTC_TIMESTAMP(3), expires_at) AS ttl FROM sessions WHERE user_id = ?', [stored.id]);
    assert.equal(session.token_hash, tokenHash(raw));
    assert.notEqual(session.token_hash, raw);
    assert.ok(session.ttl > 43190 && session.ttl <= 43200, 'Session expiry uses the database clock.');
    assert.equal((await customer.request('/admin/orders')).status, 403);
    firstCookie = customer.cookie;
    firstCsrf = customer.csrf;
  });

  await t.test('duplicate emails, wrong passwords and injection attempts fail safely', async () => {
    await stranger.request('/auth/session');
    assert.equal((await stranger.request('/auth/signup', { method: 'POST', body: { name: 'Duplicate', email: customerEmail, password: originalPassword } })).status, 409);
    assert.equal((await stranger.request('/auth/login', { method: 'POST', body: { email: customerEmail, password: 'Wrong password' } })).status, 401);
    assert.equal((await stranger.request('/auth/login', { method: 'POST', body: { email: "x' OR 1=1 --", password: originalPassword } })).status, 422);
    assert.equal((await stranger.request('/auth/signup', { method: 'POST', body: { name: 'Other Buyer', email: 'other@example.test', password: originalPassword } })).status, 201);
  });

  const orderBody = {
    requestId: randomUUID(), items: [{ productId: products[0].id, quantity: 2, unitPrice: 0.01 }], subtotal: 0.02,
    shipping: { name: 'Buyer Name', phone: '+91 9876543210', address: '123 Oak Lane', city: 'Mumbai', postalCode: '400001' }, notes: 'Call before delivery.',
  };

  await t.test('checkout uses catalog prices and deduplicates concurrent retries', async () => {
    const responses = await Promise.all([customer.request('/orders', { method: 'POST', body: orderBody }), customer.request('/orders', { method: 'POST', body: orderBody })]);
    assert.deepEqual(responses.map(result => result.status).sort(), [200, 201]);
    assert.equal(responses[0].data.order.id, responses[1].data.order.id);
    const order = responses[0].data.order;
    assert.equal(order.subtotal, products[0].price * 2);
    assert.equal(order.status, 'pending');
    assert.equal(order.shipping.address, orderBody.shipping.address);
    assert.equal(order.items[0].unitPrice, products[0].price);
    orderId = order.id;
    assert.equal((await customer.request('/orders', { method: 'POST', body: { ...orderBody, notes: 'Altered order' } })).status, 409);
    assert.equal((await customer.request('/orders', { method: 'POST', body: { ...orderBody, requestId: randomUUID(), items: [{ productId: 999999, quantity: 1 }] } })).status, 422);
    assert.equal((await customer.request('/orders')).data.orders.length, 1);
    const [count] = await pool.query('SELECT COUNT(*) AS total FROM orders');
    assert.equal(Number(count.total), 1);
  });

  await t.test('customers cannot inspect another customer order or update statuses', async () => {
    assert.equal((await stranger.request(`/orders/${orderId}`)).status, 404);
    assert.equal((await stranger.request('/orders')).data.orders.length, 0);
    assert.equal((await stranger.request(`/admin/orders/${orderId}`, { method: 'PATCH', body: { status: 'completed' } })).status, 403);
    assert.equal((await customer.request('/orders/1%20OR%201=1')).status, 404);
  });

  await t.test('administrator gets full details, search, stats, and audited status transitions', async () => {
    await admin.request('/auth/session');
    await admin.request('/auth/signup', { method: 'POST', body: { name: 'Administrator', email: 'admin@example.test', password: originalPassword } });
    await pool.query("UPDATE users SET role = 'admin' WHERE id = ?", [admin.user.id]);
    const result = await admin.request('/admin/orders?search=Buyer&status=pending&page=1');
    assert.equal(result.status, 200);
    assert.equal(result.data.total, 1);
    assert.equal(result.data.stats.pending, 1);
    assert.equal(result.data.orders[0].customer.email, customerEmail);
    assert.equal((await admin.request(`/orders/${orderId}`)).status, 200);
    assert.equal((await admin.request('/admin/orders?search=%25')).data.total, 0);
    assert.equal((await admin.request(`/admin/orders/${orderId}`, { method: 'PATCH', body: { status: 'completed' } })).status, 409);
    for (const status of ['confirmed', 'in_production', 'ready', 'completed']) {
      const changed = await admin.request(`/admin/orders/${orderId}`, { method: 'PATCH', body: { status } });
      assert.equal(changed.status, 200);
      assert.equal(changed.data.order.status, status);
    }
    assert.equal((await admin.request(`/admin/orders/${orderId}`, { method: 'PATCH', body: { status: 'cancelled' } })).status, 409);
    const history = await pool.query('SELECT * FROM order_status_history WHERE order_id = ?', [orderId]);
    assert.equal(history.length, 4);
    assert.ok(history.every(row => Number(row.actor_id) === admin.user.id));
  });

  await t.test('password changes rotate the session and revoke all other browser sessions', async () => {
    const secondBrowser = browser();
    await secondBrowser.request('/auth/session');
    assert.equal((await secondBrowser.request('/auth/login', { method: 'POST', body: { email: customerEmail, password: originalPassword, remember: true } })).status, 200);
    const newPassword = 'A changed strong password 2026';
    const result = await customer.request('/auth/change-password', { method: 'POST', body: { currentPassword: originalPassword, password: newPassword } });
    assert.equal(result.status, 200);
    assert.notEqual(customer.cookie, firstCookie);
    assert.notEqual(customer.csrf, firstCsrf);
    assert.equal((await customer.request('/orders')).status, 200);
    assert.equal((await secondBrowser.request('/orders')).status, 401);
  });

  await t.test('password recovery is generic, hashed, one-use and revokes existing sessions', async () => {
    const existing = await stranger.request('/auth/forgot-password', { method: 'POST', body: { email: customerEmail } });
    const unknown = await stranger.request('/auth/forgot-password', { method: 'POST', body: { email: 'nobody@example.test' } });
    assert.equal(existing.status, 200);
    assert.deepEqual(existing.data, unknown.data);
    assert.equal(sentEmails.length, 1);
    assert.equal('token' in existing.data, false);
    const { token } = sentEmails[0];
    const [reset] = await pool.query('SELECT *, TIMESTAMPDIFF(SECOND, UTC_TIMESTAMP(3), expires_at) AS ttl FROM password_resets');
    assert.equal(reset.token_hash, tokenHash(token));
    assert.ok(reset.ttl > 1790 && reset.ttl <= 1800, 'Reset links expire after 30 minutes on the database clock.');
    const result = await stranger.request('/auth/reset-password', { method: 'POST', body: { token, password: 'A reset strong password 2026' } });
    assert.equal(result.status, 200);
    assert.equal((await customer.request('/orders')).status, 401);
    assert.equal((await stranger.request('/auth/reset-password', { method: 'POST', body: { token, password: 'Another reset password 2026' } })).status, 400);
    assert.equal((await stranger.request('/auth/login', { method: 'POST', body: { email: customerEmail, password: 'A reset strong password 2026' } })).status, 200);
  });

  await t.test('logout and expired sessions deny subsequent authenticated reads', async () => {
    const token = stranger.cookie.split('=')[1];
    assert.equal((await stranger.request('/auth/logout', { method: 'POST', body: {} })).status, 200);
    assert.equal((await pool.query('SELECT * FROM sessions WHERE token_hash = ?', [tokenHash(token)])).length, 0);
    assert.equal((await stranger.request('/orders')).status, 401);
    await pool.query('UPDATE sessions SET expires_at = TIMESTAMPADD(SECOND, -1, UTC_TIMESTAMP(3)) WHERE user_id = ?', [admin.user.id]);
    assert.equal((await admin.request('/admin/orders')).status, 401);
  });

  await t.test('persistent rate limits cap repeated requests', async () => {
    await enforceLimit(pool, 'test-cap', 2);
    await enforceLimit(pool, 'test-cap', 2);
    await assert.rejects(enforceLimit(pool, 'test-cap', 2), error => error.status === 429 && error.retryAfter > 890 && error.retryAfter <= 900);
  });
});
