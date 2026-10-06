import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { getConfig } from './config.js';
import { createPool, migrate, transaction } from './db.js';
import { hashPassword } from './security.js';
import { emailField, passwordField, textField } from './validation.js';

const help = `Create an administrator:\n  npm run admin:create\n\nThe interactive prompt hides password input.\nFor unattended setup, provide ADMIN_EMAIL, ADMIN_NAME and ADMIN_PASSWORD through your secret manager.\nTo promote an existing account without changing its password:\n  npm run admin:create -- --promote person@example.com\n\nThere is no default administrator or default password.`;

if (process.argv.includes('--help')) {
  console.log(help);
  process.exit(0);
}

async function askHidden(prompt) {
  let muted = false;
  const output = new Writable({ write(chunk, _encoding, callback) { if (!muted) process.stdout.write(chunk); callback(); } });
  const reader = createInterface({ input: process.stdin, output, terminal: true });
  try {
    const response = reader.question(prompt);
    muted = true;
    const value = await response;
    process.stdout.write('\n');
    return value;
  } finally { reader.close(); }
}

const pool = createPool(getConfig());
try {
  await migrate(pool);
  const promoteIndex = process.argv.indexOf('--promote');
  if (promoteIndex >= 0) {
    const email = emailField(process.argv[promoteIndex + 1]);
    await transaction(pool, async connection => {
      const [user] = await connection.query('SELECT id FROM users WHERE email = ? FOR UPDATE', [email]);
      if (!user) throw new Error('No account exists with this email. Register first or use the administrator creation prompt.');
      await connection.query("UPDATE users SET role = 'admin' WHERE id = ?", [user.id]);
      await connection.query('DELETE FROM sessions WHERE user_id = ?', [user.id]);
    });
    console.log('Administrator access granted. Sign in again to use the admin panel.');
  } else {
    let email = process.env.ADMIN_EMAIL;
    let name = process.env.ADMIN_NAME;
    let password = process.env.ADMIN_PASSWORD;
    if ((!email || !name || !password) && !process.stdin.isTTY) throw new Error(`Interactive terminal required, or set ADMIN_EMAIL, ADMIN_NAME and ADMIN_PASSWORD.\n${help}`);
    if (!email || !name) {
      const reader = createInterface({ input: process.stdin, output: process.stdout });
      try {
        if (!name) name = await reader.question('Administrator name: ');
        if (!email) email = await reader.question('Administrator email: ');
      } finally { reader.close(); }
    }
    if (!password) {
      password = await askHidden('Administrator password (at least 8 characters): ');
      if (await askHidden('Confirm password: ') !== password) throw new Error('Passwords do not match.');
    }
    email = emailField(email);
    name = textField(name, 'Name', 2, 100);
    const passwordHash = await hashPassword(passwordField(password));
    try {
      await pool.query("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')", [name, email, passwordHash]);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new Error('This account already exists. Use --promote to grant access without replacing its password.');
      throw error;
    }
    console.log('Administrator created. Sign in to open the admin panel.');
  }
} catch (error) {
  console.error(error.code ? `Administrator setup failed (${error.code}). Check database configuration.` : error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
