import { defineConfig, devices } from '@playwright/test'
import { config } from 'dotenv'

// Playwright's test runner doesn't load Next.js env files automatically.
// Load .env.local so E2E_EMAIL / E2E_PASSWORD are available in test files.
config({ path: '.env.local' })

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3322',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3322',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
