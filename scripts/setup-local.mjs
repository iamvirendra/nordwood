import { randomBytes } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const template = await readFile(new URL('../.env.example', import.meta.url), 'utf8');
try {
  await writeFile(new URL('../.env', import.meta.url), template
    .replace('replace-with-a-long-random-database-password', randomBytes(32).toString('hex'))
    .replace('replace-with-a-different-long-random-password', randomBytes(32).toString('hex')), { flag: 'wx', mode: 0o600 });
  console.log('Created .env with random local database credentials. Start MariaDB with npm run db:up.');
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
  console.log('.env already exists; your configuration was preserved.');
}
