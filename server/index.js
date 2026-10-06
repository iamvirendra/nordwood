import { getConfig } from './config.js';
import { cleanExpiredRecords, createPool, migrate } from './db.js';
import { createApp } from './app.js';

const config = getConfig();
const pool = createPool(config);
try {
  await migrate(pool);
  await cleanExpiredRecords(pool);
  const app = createApp({ pool, config });
  const server = app.listen(config.port, () => {
    console.log(`NordWood API is listening on port ${config.port}.`);
    if (!config.smtp) console.log('Password recovery is unavailable until SMTP_HOST and SMTP_FROM are configured.');
  });
  const cleanup = setInterval(() => cleanExpiredRecords(pool).catch(() => console.error('Expired session cleanup failed.')), 15 * 60000);
  cleanup.unref();
  const shutdown = () => {
    clearInterval(cleanup);
    server.close(async () => { await pool.end(); process.exit(0); });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
} catch (error) {
  console.error(`NordWood could not start (${error.code || error.message}). Ensure MariaDB is running and DB_* settings are correct.`);
  await pool.end();
  process.exitCode = 1;
}
