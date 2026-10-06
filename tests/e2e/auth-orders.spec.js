import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { getConfig } from '../../server/config.js';
import { createPool } from '../../server/db.js';
import { tokenHash } from '../../server/security.js';

const pool = createPool(getConfig({ ...process.env, DB_NAME: 'nordwood_e2e_test' }));
const password = 'Timber welcome home 2026';
const email = `browser-${randomUUID()}@example.test`;
test.afterAll(() => pool.end());

test('signup → real saved order → customer boundaries → admin management → logout/login', async ({ page }) => {
  await page.goto('/checkout');
  await expect(page).toHaveURL(/\/login\?redirect/);
  await page.getByRole('link', { name: 'Create account', exact: true }).click();
  await page.getByLabel('Full name', { exact: true }).fill('Browser Customer');
  await page.getByLabel('Email address', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByLabel('Confirm password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page).toHaveURL('/checkout');
  await page.evaluate(() => localStorage.setItem('cartItems', JSON.stringify([{ id: 1, quantity: 2 }])));
  await page.reload();
  await page.getByLabel('Phone number', { exact: true }).fill('+91 9876543210');
  await page.getByLabel('Delivery address', { exact: true }).fill('123 Test Timber Lane');
  await page.getByLabel('City', { exact: true }).fill('Mumbai');
  await page.getByLabel('PIN / postal code', { exact: true }).fill('400001');
  await page.getByLabel(/A note for our team/).fill('Please call first.\nUse the front entrance.');
  await page.getByRole('button', { name: 'Submit order request' }).click();
  await expect(page.getByRole('heading', { name: /In good hands/ })).toBeVisible();
  await page.getByRole('link', { name: 'View my orders' }).click();
  await page.getByRole('button', { name: /View details/ }).click();
  await expect(page.getByText('123 Test Timber Lane', { exact: true })).toBeVisible();
  await expect(page.getByText('Please call first.', { exact: false })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: /View details/ })).toBeVisible();
  const forbidden = await page.request.get('/api/admin/orders');
  expect(forbidden.status()).toBe(403);
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'This space is for our team.' })).toBeVisible();
  await page.goto('/account');
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page).toHaveURL('/');
  await pool.query("UPDATE users SET role = 'admin' WHERE email = ?", [email]);
  await page.goto('/login');
  await page.getByLabel('Email address', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL('/admin');
  await page.getByRole('searchbox').fill(email);
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByText('1 order matching your filters')).toBeVisible();
  await page.getByRole('button', { name: /View details/ }).click();
  await expect(page.getByRole('link', { name: email, exact: true })).toBeVisible();
  await page.getByLabel('Update order status', { exact: true }).selectOption('confirmed');
  await page.getByRole('button', { name: 'Save status' }).click();
  await expect(page.getByRole('button', { name: /Close details/ })).toContainText('Confirmed');
  const [saved] = await pool.query('SELECT o.status, o.subtotal FROM orders o JOIN users u ON u.id = o.user_id WHERE u.email = ?', [email]);
  expect(saved.status).toBe('confirmed');
  expect(Number(saved.subtotal)).toBe(28700);
});

test('mobile authentication has no overflow and handles password validation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/signup');
  await page.getByLabel('Full name', { exact: true }).fill('Mobile Buyer');
  await page.getByLabel('Email address', { exact: true }).fill('mobile@example.test');
  await page.getByLabel('Password', { exact: true }).fill('short');
  await page.getByLabel('Confirm password', { exact: true }).fill('different');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByText('Use a password between 8 and 128 characters.')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Show password', exact: true }).click();
  await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'text');
});

async function register(page, name, address) {
  await page.goto('/signup');
  await page.getByLabel('Full name', { exact: true }).fill(name);
  await page.getByLabel('Email address', { exact: true }).fill(address);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByLabel('Confirm password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page).toHaveURL('/account');
}

test('expired sessions recover at sign-in and password reset clears the signed-in UI', async ({ page }) => {
  const address = `expiry-${randomUUID()}@example.test`;
  await register(page, 'Expiry Buyer', address);
  await pool.query('DELETE s FROM sessions s JOIN users u ON u.id = s.user_id WHERE u.email = ?', [address]);
  await page.getByRole('button', { name: 'Refresh orders' }).click();
  await expect(page).toHaveURL(/\/login/);
  await page.getByLabel('Email address', { exact: true }).fill(address);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL('/account');
  const token = randomUUID().replaceAll('-', '') + randomUUID().replaceAll('-', '');
  await pool.query('INSERT INTO password_resets (token_hash, user_id, expires_at) SELECT ?, id, TIMESTAMPADD(MINUTE, 30, UTC_TIMESTAMP(3)) FROM users WHERE email = ?', [tokenHash(token), address]);
  await page.goto(`/reset-password#token=${token}`);
  await page.getByLabel('New password', { exact: true }).fill('A fresh timber password 2026');
  await page.getByLabel('Confirm password', { exact: true }).fill('A fresh timber password 2026');
  await page.getByRole('button', { name: 'Save new password' }).click();
  await expect(page.getByRole('heading', { name: 'Your new key is ready.' })).toBeVisible();
  await page.locator('.auth-success').getByRole('link', { name: 'Back to sign in' }).click();
  await expect(page).toHaveURL('/login');
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeEnabled();
});

test('a tab with stale credentials never submits an order under a different account', async ({ page, context }) => {
  const first = `first-${randomUUID()}@example.test`;
  const second = `second-${randomUUID()}@example.test`;
  await register(page, 'First Buyer', first);
  await page.evaluate(() => localStorage.setItem('cartItems', JSON.stringify([{ id: 1, quantity: 1 }])));
  await page.goto('/checkout');
  await page.getByLabel('Phone number', { exact: true }).fill('9876543210');
  await page.getByLabel('Delivery address', { exact: true }).fill('123 First Buyer Lane');
  await page.getByLabel('City', { exact: true }).fill('Mumbai');
  await page.getByLabel('PIN / postal code', { exact: true }).fill('400001');
  const other = await context.newPage();
  await other.goto('/account');
  await other.getByRole('button', { name: 'Sign out', exact: true }).click();
  await register(other, 'Second Buyer', second);
  await page.getByRole('button', { name: 'Submit order request' }).click();
  await expect(page.getByLabel('Full name', { exact: true })).toHaveValue('Second Buyer');
  await expect(page.getByLabel('Delivery address', { exact: true })).toHaveValue('');
  const [count] = await pool.query('SELECT COUNT(*) AS total FROM orders o JOIN users u ON u.id = o.user_id WHERE u.email IN (?, ?)', [first, second]);
  expect(Number(count.total)).toBe(0);
});
