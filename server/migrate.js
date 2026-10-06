import { getConfig } from './config.js';
import { createPool, migrate } from './db.js';

const pool = createPool(getConfig());
try {
  await migrate(pool);
  console.log('NordWood database schema is up to date.');
} catch (error) {
  console.error(`Migration failed (${error.code || error.message}). Check MariaDB and the DB_* configuration.`);
  process.exitCode = 1;
} finally {
  await pool.end();
}
