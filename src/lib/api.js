let csrfToken = null;
let sessionRequest = null;
let sessionUserId;

export class ApiError extends Error {
  constructor(message, status, fields, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields || {};
    this.code = code;
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
  const data = await response.json().catch(() => ({}));
  if (data.csrfToken) csrfToken = data.csrfToken;
  if (!response.ok) {
    if (response.status === 401 && !path.startsWith('/auth/')) {
      window.dispatchEvent(new Event('nordwood:session-expired'));
    }
    throw new ApiError(data.message || data.error || 'Something went wrong. Please try again shortly.', response.status, data.fields, data.code);
  }
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
