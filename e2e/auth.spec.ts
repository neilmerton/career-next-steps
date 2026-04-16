import { test, expect } from '@playwright/test'

// These tests verify auth-specific behaviour and do not use the saved auth state.
test.use({ storageState: { cookies: [], origins: [] } })

test('unauthenticated visit to /dashboard redirects to /login', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login/)
})

test('login with wrong password shows an error', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('wrong@example.com')
  await page.getByLabel('Password').fill('wrongpassword')
  await page.getByRole('button', { name: 'Log in' }).click()
  await expect(page.locator('.alert-error')).toBeVisible()
  await expect(page).toHaveURL(/\/login/)
})

test('successful login redirects to /dashboard', async ({ page }) => {
  const email = process.env.NEXT_PUBLIC_E2E_EMAIL!
  const password = process.env.NEXT_PUBLIC_E2E_PASSWORD!

  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Log in' }).click()
  await expect(page).toHaveURL('/dashboard')
})
