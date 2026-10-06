import 'dotenv/config';

function integer(value, fallback, min, max) {
  const number = Number(value ?? fallback);
  if (!Number.isInteger(number) || number < min || number > max) throw new Error('Invalid numeric server configuration.');
  return number;
}

export function getConfig(env = process.env) {
  const production = env.NODE_ENV === 'production';
  const origin = new URL(env.APP_ORIGIN || 'http://localhost:5173');
  if (!['http:', 'https:'].includes(origin.protocol) || origin.origin !== (env.APP_ORIGIN || 'http://localhost:5173').replace(/\/$/, '')) {
    throw new Error('APP_ORIGIN must be a single origin, such as https://nordwood.com.');
  }
  if (production && origin.protocol !== 'https:') throw new Error('APP_ORIGIN must use HTTPS in production.');
  if (production && !env.DB_PASSWORD) throw new Error('DB_PASSWORD is required in production.');
  return {
    production,
    port: integer(env.PORT, 3001, 1, 65535),
    origin: origin.origin,
    // Set only when the deployment has exactly this many trusted reverse proxies.
    trustProxy: integer(env.TRUST_PROXY_HOPS, 0, 0, 10),
    cookieName: production ? '__Host-nordwood_session' : 'nordwood_session',
    db: {
      host: env.DB_HOST || '127.0.0.1',
      port: integer(env.DB_PORT, 3306, 1, 65535),
      user: env.DB_USER || 'nordwood',
      password: env.DB_PASSWORD || '',
      database: env.DB_NAME || 'nordwood',
      connectionLimit: integer(env.DB_CONNECTION_LIMIT, 5, 1, 50),
      timezone: 'Z',
      bigIntAsNumber: true,
      decimalAsNumber: true,
      insertIdAsNumber: true,
      acquireTimeout: 10000,
      connectTimeout: 5000,
      multipleStatements: false,
    },
    smtp: env.SMTP_HOST && env.SMTP_FROM ? {
      host: env.SMTP_HOST,
      port: integer(env.SMTP_PORT, 587, 1, 65535),
      secure: env.SMTP_SECURE === 'true',
      requireTLS: env.SMTP_SECURE !== 'true' && production,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD || '' } : undefined,
      from: env.SMTP_FROM,
    } : null,
  };
}
