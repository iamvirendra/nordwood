import assert from 'node:assert/strict';
import test from 'node:test';
import { randomUUID } from 'node:crypto';
import { getConfig } from '../config.js';
import { csrfProtection, hashPassword, readCookie, safeEqual, tokenHash, verifyPassword } from '../security.js';
import { emailField, numericId, passwordField, validateOrder } from '../validation.js';
import { products } from '../../src/data/products.js';

test('passwords use distinct salted hashes and verify safely', async () => {
  const password = 'A long passphrase 🌳 123';
  const first = await hashPassword(password);
  const second = await hashPassword(password);
  assert.notEqual(first, second);
  assert.ok(await verifyPassword(password, first));
  assert.equal(await verifyPassword('Wrong passphrase', first), false);
  assert.equal(await verifyPassword(password), false);
  assert.equal(await verifyPassword(password, 'malformed'), false);
  assert.ok(!first.includes(password));
});

test('tokens and cookies reject malformed input', () => {
  const token = 'a'.repeat(64);
  assert.equal(readCookie(`other=abc; nordwood_session=${token}`, 'nordwood_session'), token);
  assert.equal(readCookie('nordwood_session=bad', 'nordwood_session'), null);
  assert.equal(safeEqual(token, token), true);
  assert.equal(safeEqual(token, 'a'), false);
  assert.equal(safeEqual(undefined, token), false);
  assert.notEqual(tokenHash(token), token);
});

test('CSRF requires an allowed origin, session token and JSON', () => {
  const middleware = csrfProtection({ origin: 'http://localhost:5173' });
  const headers = { origin: 'http://localhost:5173', 'x-csrf-token': 'valid' };
  const run = ({ method = 'POST', currentHeaders = headers, session = { csrf_token: 'valid' }, json = true } = {}) => {
    let result;
    middleware({ method, session, get: name => currentHeaders[name], is: () => json }, {}, error => { result = error; });
    return result;
  };
  assert.equal(run(), undefined);
  assert.equal(run({ currentHeaders: { ...headers, origin: 'https://evil.example' } }).status, 403);
  assert.equal(run({ currentHeaders: { ...headers, 'x-csrf-token': 'wrong' } }).status, 403);
  assert.equal(run({ session: null }).status, 403);
  assert.equal(run({ json: false }).status, 415);
  assert.equal(run({ method: 'GET', session: null }), undefined);
});

test('validation normalizes identity and bounds input', () => {
  assert.equal(emailField(' TEST@example.com '), 'test@example.com');
  for (const email of ['bad', 'a@x', '<x>@example.com', 'a@.example.com']) assert.throws(() => emailField(email));
  assert.throws(() => passwordField('x'.repeat(7)));
  assert.throws(() => passwordField('x'.repeat(129)));
  assert.equal(passwordField('x'.repeat(8)), 'x'.repeat(8));
  assert.equal(passwordField('x'.repeat(128)), 'x'.repeat(128));
  assert.throws(() => numericId('-1'));
  assert.throws(() => numericId('1 OR 1=1'));
  assert.equal(numericId('42'), 42);
});

test('checkout ignores client prices, aggregates duplicates and fingerprints requests', () => {
  const first = products[0];
  const body = {
    requestId: randomUUID(), items: [{ productId: first.id, quantity: 2, price: 1 }, { productId: first.id, quantity: 1 }],
    shipping: { name: 'Sample Buyer', phone: '+91 9876543210', address: '42 Oak Street', city: 'Mumbai', postalCode: '400001' }, subtotal: 1,
  };
  const validated = validateOrder(body);
  assert.equal(validated.items.length, 1);
  assert.equal(validated.items[0].quantity, 3);
  assert.equal(validated.subtotal, first.price * 3);
  assert.equal(validated.items[0].unitPrice, first.price);
  assert.equal(validateOrder({ ...body, items: [{ productId: first.id, quantity: 3 }] }).requestHash, validated.requestHash);
  assert.notEqual(validateOrder({ ...body, notes: 'A different delivery note' }).requestHash, validated.requestHash);
  assert.equal(validateOrder({ ...body, notes: 'First line\nSecond line\tWith a tab' }).notes, 'First line\nSecond line\tWith a tab');
  assert.throws(() => validateOrder({ ...body, items: [{ productId: first.id, quantity: -1 }] }));
  assert.throws(() => validateOrder({ ...body, items: [{ productId: first.id, quantity: 100 }, { productId: first.id, quantity: 1 }] }));
  assert.throws(() => validateOrder({ ...body, items: [{ productId: 999999, quantity: 1 }] }));
  assert.throws(() => validateOrder({ ...body, requestId: 'not-a-uuid' }));
});

test('production refuses an insecure origin and missing database password', () => {
  assert.throws(() => getConfig({ NODE_ENV: 'production', APP_ORIGIN: 'http://example.com', DB_PASSWORD: 'secret' }));
  assert.throws(() => getConfig({ NODE_ENV: 'production', APP_ORIGIN: 'https://example.com' }));
  assert.equal(getConfig({ NODE_ENV: 'production', APP_ORIGIN: 'https://example.com', DB_PASSWORD: 'secret' }).cookieName, '__Host-nordwood_session');
  assert.throws(() => getConfig({ APP_ORIGIN: 'https://example.com/path' }));
});
