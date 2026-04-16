import { test as setup } from '@playwright/test'
import path from 'path'

const authFile = path.join(__dirname, '../playwright/.auth/user.json')

setup('authenticate', async ({ page }) => {
  const email = process.env.NEXT_PUBLIC_E2E_EMAIL
  const password = process.env.NEXT_PUBLIC_E2E_PASSWORD

  if (!email || !password) {
    throw new Error('NEXT_PUBLIC_E2E_EMAIL and NEXT_PUBLIC_E2E_PASSWORD must be set in .env.local')
  }

  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Log in' }).click()
  await page.waitForURL('/dashboard')
  await page.context().storageState({ path: authFile })
})
