import test from 'node:test';
import assert from 'node:assert/strict';

let moduleId = 0;

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json' },
});

async function clientFixture(t, responses = []) {
  const calls = [];
  const events = [];
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { dispatchEvent: (event) => { events.push(event); return true; } },
  });
  t.after(() => {
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
    else delete globalThis.window;
  });
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, options });
    assert.ok(responses.length, `Unexpected request: ${url}`);
    const response = responses.shift();
    if (response instanceof Error) throw response;
    return typeof response === 'function' ? response() : response;
  });
  const client = await import(`../src/lib/api.js?test=${++moduleId}`);
  return { ...client, calls, events };
}

function readableError(error, ApiError, status) {
  assert.ok(error instanceof ApiError);
  assert.equal(error.status, status);
  assert.equal(typeof error.message, 'string');
  assert.ok(error.message.trim().length > 0);
  assert.doesNotMatch(error.message, /\[object Object\]|<html|<!doctype/i);
  return true;
}

test('ApiError normalizes nested and array messages and readable field errors', async (t) => {
  const { ApiError } = await clientFixture(t);
  for (const message of [
    'Please enter a valid email.',
    { message: 'Please enter a valid email.' },
    { error: { message: 'Please enter a valid email.' } },
    [{ message: 'Please enter a valid email.' }, 'Please try again.'],
  ]) {
    const error = new ApiError(message, 422, {
      email: { message: 'Enter a valid email address.' },
      password: ['Use at least 8 characters.', { message: 'Choose a stronger password.' }],
    });
    readableError(error, ApiError, 422);
    assert.match(error.message, /valid email/);
    assert.match(error.fields.email, /valid email address/);
    assert.equal(typeof error.fields.password, 'string');
    assert.match(error.fields.password, /8 characters/);
    assert.doesNotMatch(error.fields.password, /\[object Object\]/);
  }
});

test('unusable error values receive a readable fallback', async (t) => {
  const { ApiError } = await clientFixture(t);
  for (const message of [undefined, null, '', '   ', '[object Object]', {}, { code: 'UNKNOWN' }, []]) {
    readableError(new ApiError(message, 500), ApiError, 500);
  }
});

test('API errors support flat messages and nested error messages and codes', async (t) => {
  const { api, ApiError, events } = await clientFixture(t, [
    json({ message: 'That email is already registered.', fields: { email: ['Use another email.'] }, code: 'EMAIL_TAKEN' }, 409),
    json({ error: { message: 'Your sign-in details did not match.', code: 'INVALID_CREDENTIALS' } }, 401),
  ]);
  await assert.rejects(api('/auth/signup'), (error) => {
    readableError(error, ApiError, 409);
    assert.equal(error.message, 'That email is already registered.');
    assert.equal(error.fields.email, 'Use another email.');
    assert.equal(error.code, 'EMAIL_TAKEN');
    return true;
  });
  await assert.rejects(api('/auth/login'), (error) => {
    readableError(error, ApiError, 401);
    assert.equal(error.message, 'Your sign-in details did not match.');
    assert.equal(error.code, 'INVALID_CREDENTIALS');
    return true;
  });
  assert.equal(events.length, 0, 'Invalid credentials must not expire another page session.');
});

for (const [name, response] of [
  ['HTML fallback page', () => new Response('<!doctype html><html>NordWood</html>', { headers: { 'Content-Type': 'text/html' } })],
  ['invalid JSON', () => new Response('{ broken json', { headers: { 'Content-Type': 'application/json' } })],
  ['null JSON', () => json(null)],
  ['array JSON', () => json([])],
  ['string JSON', () => json('Not a session')],
  ['empty session object', () => json({})],
  ['session without a CSRF token', () => json({ user: null })],
  ['session without a user field', () => json({ csrfToken: 'anonymous-token' })],
]) {
  test(`successful HTTP status with ${name} fails without creating a session`, async (t) => {
    const { getSession, ApiError, events } = await clientFixture(t, [response()]);
    await assert.rejects(getSession(), (error) => {
      readableError(error, ApiError, 502);
      assert.equal(error.code, 'INVALID_RESPONSE');
      return true;
    });
    assert.equal(events.length, 0);
  });
}

test('live Vercel auth session 404 becomes a friendly account service error', async (t) => {
  const { getSession, ApiError, calls, events } = await clientFixture(t, [
    json({ error: { code: '404', message: 'The page could not be found' } }, 404),
  ]);
  await assert.rejects(getSession(), (error) => {
    readableError(error, ApiError, 404);
    assert.equal(error.message, 'Account services are temporarily unavailable. Please try again shortly.');
    assert.equal(error.code, '404');
    return true;
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/auth/session');
  assert.equal(calls[0].options.method || 'GET', 'GET');
  assert.equal(calls[0].options.headers.Accept, 'application/json');
  assert.equal(events.length, 0);
});

test('session lookup is shared, auth sends CSRF, and session changes still dispatch', async (t) => {
  let resolveSession;
  const pendingSession = new Promise((resolve) => { resolveSession = resolve; });
  const user = { id: 7, name: 'Asha', role: 'customer' };
  const { getSession, api, calls, events } = await clientFixture(t, [
    () => pendingSession,
    json({ user, csrfToken: 'signed-in-token' }),
    json({ user: null, csrfToken: 'signed-out-token' }),
  ]);
  const firstSession = getSession();
  assert.equal(getSession(), firstSession);
  resolveSession(json({ user: null, csrfToken: 'anonymous-token' }));
  await firstSession;
  const credentials = { email: 'asha@example.com', password: 'Example123!' };
  assert.deepEqual(await api('/auth/login', { method: 'post', body: credentials }), { user, csrfToken: 'signed-in-token' });
  await api('/auth/logout', { method: 'POST' });
  assert.equal(calls.length, 3);
  assert.equal(calls[1].url, '/api/auth/login');
  assert.equal(calls[1].options.credentials, 'same-origin');
  assert.equal(calls[1].options.method, 'POST');
  assert.equal(calls[1].options.headers['Content-Type'], 'application/json');
  assert.equal(calls[1].options.headers['X-CSRF-Token'], 'anonymous-token');
  assert.deepEqual(JSON.parse(calls[1].options.body), credentials);
  assert.equal(calls[2].options.headers['X-CSRF-Token'], 'signed-in-token');
  assert.deepEqual(events.map(({ type, detail }) => ({ type, detail })), [
    { type: 'nordwood:session-updated', detail: null },
    { type: 'nordwood:session-updated', detail: user },
    { type: 'nordwood:session-updated', detail: null },
  ]);
});

test('failed session lookup can be retried and never sends a mutation without CSRF setup', async (t) => {
  const { api, calls, ApiError } = await clientFixture(t, [
    json(null),
    json({ user: null, csrfToken: 'recovered-token' }),
    json({ user: { id: 7 }, csrfToken: 'login-token' }),
  ]);
  await assert.rejects(api('/auth/login', { method: 'POST', body: {} }), (error) => readableError(error, ApiError, 502));
  assert.equal(calls.length, 1);
  await api('/auth/login', { method: 'POST', body: {} });
  assert.deepEqual(calls.map(({ url }) => url), ['/api/auth/session', '/api/auth/session', '/api/auth/login']);
  assert.equal(calls[2].options.headers['X-CSRF-Token'], 'recovered-token');
});

test('nested CSRF expiry refreshes and retries a mutation once for the same account', async (t) => {
  const user = { id: 7 };
  const { api, calls } = await clientFixture(t, [
    json({ user, csrfToken: 'old-token' }),
    json({ error: { message: 'Session check expired.', code: 'CSRF_EXPIRED' } }, 403),
    json({ user, csrfToken: 'new-token' }),
    json({ order: { id: 99 } }),
  ]);
  assert.deepEqual(await api('/orders', { method: 'POST', body: { items: [] } }), { order: { id: 99 } });
  assert.equal(calls.length, 4);
  assert.equal(calls[1].options.headers['X-CSRF-Token'], 'old-token');
  assert.equal(calls[3].options.headers['X-CSRF-Token'], 'new-token');
  assert.equal(calls[3].options.body, calls[1].options.body);
});

test('CSRF recovery refuses to repeat an order when the signed-in account changes', async (t) => {
  const { api, calls, ApiError } = await clientFixture(t, [
    json({ user: { id: 7 }, csrfToken: 'old-token' }),
    json({ message: 'Session check expired.', code: 'CSRF_EXPIRED' }, 403),
    json({ user: { id: 8 }, csrfToken: 'other-account-token' }),
  ]);
  await assert.rejects(api('/orders', { method: 'POST', body: {} }), (error) => {
    readableError(error, ApiError, 409);
    assert.match(error.message, /account changed/i);
    return true;
  });
  assert.equal(calls.length, 3);
});

test('intentional login can retry after the account changes but CSRF retries are bounded', async (t) => {
  const { api, calls, ApiError } = await clientFixture(t, [
    json({ user: null, csrfToken: 'old-token' }),
    json({ error: { message: 'Session check expired.', code: 'CSRF_EXPIRED' } }, 403),
    json({ user: { id: 8 }, csrfToken: 'new-token' }),
    json({ message: 'Session check expired again.', code: 'CSRF_EXPIRED' }, 403),
  ]);
  await assert.rejects(api('/auth/login', { method: 'POST', body: {} }), (error) => {
    readableError(error, ApiError, 403);
    assert.equal(error.code, 'CSRF_EXPIRED');
    return true;
  });
  assert.equal(calls.length, 4);
});

test('non-auth unauthorized responses still dispatch session expiry', async (t) => {
  const { api, ApiError, events } = await clientFixture(t, [json({ message: 'Please sign in again.' }, 401)]);
  await assert.rejects(api('/orders'), (error) => readableError(error, ApiError, 401));
  assert.deepEqual(events.map(({ type }) => type), ['nordwood:session-expired']);
});

test('network failures are readable and request aborts remain aborts', async (t) => {
  const abort = new DOMException('Request cancelled', 'AbortError');
  const { api, ApiError } = await clientFixture(t, [new TypeError('Failed to fetch'), abort]);
  await assert.rejects(api('/auth/session'), (error) => readableError(error, ApiError, 0));
  await assert.rejects(api('/auth/session'), (error) => error === abort);
});

test('absolute and protocol-relative API paths are rejected before fetch', async (t) => {
  const { api, calls } = await clientFixture(t);
  for (const path of ['https://example.com/login', '//example.com/login', 'auth/login']) {
    await assert.rejects(api(path), /relative API path/);
  }
  assert.equal(calls.length, 0);
});
