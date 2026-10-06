import 'dotenv/config';
import { spawnSync } from 'node:child_process';

// Only these isolated databases are created; no existing rows are changed.
const dbUser = process.env.DB_USER || 'nordwood';
if (!/^[a-zA-Z0-9_]+$/.test(dbUser)) throw new Error('DB_USER must use letters, numbers or underscores for Docker test setup.');
const statements = ['nordwood_test', 'nordwood_e2e_test'].map(name => `CREATE DATABASE IF NOT EXISTS ${name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; GRANT ALL ON ${name}.* TO '${dbUser}'@'%';`).join('\n');
const result = spawnSync('docker', ['compose', 'exec', '-T', 'db', 'sh', '-c', 'MYSQL_PWD="$MARIADB_ROOT_PASSWORD" exec mariadb -uroot'], { input: statements, stdio: ['pipe', 'inherit', 'inherit'] });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
console.log('Dedicated MariaDB test databases are ready.');
