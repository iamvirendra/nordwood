import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  workers: 1,
  timeout: 45000,
  use: { baseURL: 'http://localhost:5180', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: [
    { command: 'node server/index.js', url: 'http://127.0.0.1:3002/api/health', env: { DB_NAME: 'nordwood_e2e_test', PORT: '3002', APP_ORIGIN: 'http://localhost:5180', NODE_ENV: 'test' }, reuseExistingServer: false },
    { command: 'node node_modules/vite/bin/vite.js --port 5180', url: 'http://localhost:5180', env: { PORT: '3002' }, reuseExistingServer: false },
  ],
});
