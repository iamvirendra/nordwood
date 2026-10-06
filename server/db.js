import mariadb from 'mariadb';
import { readFile } from 'node:fs/promises';

export const createPool = config => mariadb.createPool(config.db);

export async function transaction(pool, callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function migrate(pool) {
  const connection = await pool.getConnection();
  let locked = false;
  try {
    const rows = await connection.query("SELECT GET_LOCK('nordwood_schema_v1', 30) AS acquired");
    if (Number(rows[0].acquired) !== 1) throw new Error('Unable to acquire database migration lock.');
    locked = true;
    await connection.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      version INT NOT NULL PRIMARY KEY, applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB`);
    const applied = await connection.query('SELECT version FROM schema_migrations WHERE version = ?', [1]);
    if (applied.length) return;
    const sql = await readFile(new URL('./schema.sql', import.meta.url), 'utf8');
    // This controlled schema contains no routines or semicolons inside literals.
    for (const statement of sql.split(';').map(value => value.trim()).filter(Boolean)) await connection.query(statement);
    await connection.query('INSERT INTO schema_migrations (version) VALUES (?)', [1]);
  } finally {
    if (locked) await connection.query("SELECT RELEASE_LOCK('nordwood_schema_v1')");
    connection.release();
  }
}

export async function cleanExpiredRecords(pool) {
  for (const table of ['sessions', 'password_resets']) await pool.query(`DELETE FROM ${table} WHERE expires_at < UTC_TIMESTAMP(3)`);
  await pool.query('DELETE FROM rate_limits WHERE resets_at < UTC_TIMESTAMP(3)');
}
