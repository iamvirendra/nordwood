let csrfToken = null;
let sessionRequest = null;
let sessionUserId;

const requestFailed = 'Something went wrong. Please try again shortly.';
const serviceUnavailable = 'Our service is temporarily unavailable. Please try again shortly.';
const accountUnavailable = 'Account services are temporarily unavailable. Please try again shortly.';

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function errorText(value, depth = 0) {
  if (depth > 4) return undefined;
  if (typeof value === 'string') {
    const text = value.trim();
    return text && !/^\[object .+\]$/i.test(text) ? text : undefined;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const text = errorText(item, depth + 1);
      if (text) return text;
    }
  } else if (isRecord(value)) {
    return errorText(value.message, depth + 1) || errorText(value.error, depth + 1);
  }
  return undefined;
}

export class ApiError extends Error {
  constructor(message, status, fields, code) {
    super(errorText(message) || requestFailed);
    this.name = 'ApiError';
    this.status = status;
    this.fields = isRecord(fields)
      ? Object.fromEntries(Object.entries(fields).map(([field, value]) => [field, errorText(value) || 'Please check this value.']))
      : {};
    this.code = typeof code === 'string' ? code : undefined;
  }
}

async function request(path, options = {}) {
  const { body, headers, ...rest } = options;
  let response;
  try {
    response = await fetch(`/api${path}`, {
      credentials: 'same-origin',
      ...rest,
      headers: { Accept: 'application/json', ...((body !== undefined || !['GET', 'HEAD'].includes(options.method || 'GET')) ? { 'Content-Type': 'application/json' } : {}), ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}), ...headers },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('We couldn’t connect. Please check your connection and try again.', 0);
  }
  const data = await response.json().catch(() => null);
  const unavailableMessage = path.startsWith('/auth/') ? accountUnavailable : serviceUnavailable;
  if (!response.ok) {
    if (response.status === 401 && !path.startsWith('/auth/')) {
      window.dispatchEvent(new Event('nordwood:session-expired'));
    }
    const details = isRecord(data?.error) ? data.error : {};
    // Hosting providers can return { error: { code, message } } instead of our
    // API's { message, fields, code }. Never coerce those objects into text.
    const message = response.status === 404 && path.startsWith('/auth/')
      ? accountUnavailable
      : errorText(data?.message) || errorText(data?.error) || (response.status >= 500 ? unavailableMessage : requestFailed);
    throw new ApiError(message, response.status, data?.fields || details.fields, data?.code || details.code);
  }
  // An HTML fallback or malformed session response is not a successful login.
  if (!isRecord(data) || (path === '/auth/session' &&
      (!Object.hasOwn(data, 'user') || (data.user !== null && !isRecord(data.user)) || typeof data.csrfToken !== 'string' || !data.csrfToken))) {
    throw new ApiError(unavailableMessage, 502, undefined, 'INVALID_RESPONSE');
  }
  if (typeof data.csrfToken === 'string' && data.csrfToken) csrfToken = data.csrfToken;
  if (Object.hasOwn(data, 'user')) {
    sessionUserId = data.user?.id ?? null;
    window.dispatchEvent(new CustomEvent('nordwood:session-updated', { detail: data.user }));
  }
  return data;
}

export function getSession() {
  if (!sessionRequest) {
    sessionRequest = request('/auth/session').finally(() => { sessionRequest = null; });
  }
  return sessionRequest;
}

export async function api(path, options = {}) {
  if (!path.startsWith('/') || path.startsWith('//')) throw new Error('Use a relative API path.');
  const method = (options.method || 'GET').toUpperCase();
  if (!['GET', 'HEAD'].includes(method) && !csrfToken) await getSession();
  try {
    return await request(path, { ...options, method });
  } catch (error) {
    // A rejected CSRF check runs before the mutation. Recover once when another
    // tab rotated the cookie or the anonymous session expired.
    if (error.status !== 403 || error.code !== 'CSRF_EXPIRED') throw error;
    const previousUser = sessionUserId;
    const session = await getSession();
    const intentionalAuth = ['/auth/login', '/auth/signup', '/auth/reset-password', '/auth/forgot-password'].includes(path);
    if (!intentionalAuth && previousUser !== (session.user?.id ?? null)) {
      throw new ApiError('Your signed-in account changed. Please review this page before trying again.', 409);
    }
    return request(path, { ...options, method });
  }
}
