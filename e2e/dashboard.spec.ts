import { test, expect } from '@playwright/test'

const VACANCY_DETAIL_URL = /\/vacancies\/[0-9a-f]{8}-/

test('root path redirects to /dashboard', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL('/dashboard')
})

test('status summary reflects vacancy counts', async ({ page }) => {
  const title = `E2E Dashboard Vacancy ${Date.now()}`

  // Create an "Applied" vacancy
  await page.goto('/vacancies/new')
  await page.getByLabel('Job title').fill(title)
  await page.getByRole('button', { name: 'Add vacancy' }).click()
  await page.waitForURL(VACANCY_DETAIL_URL)

  // Dashboard status summary should show at least 1 for Applied
  await page.goto('/dashboard')
  const appliedCard = page.locator('a').filter({ hasText: 'Applied' })
  const countText = await appliedCard.locator('span').first().textContent()
  expect(Number(countText)).toBeGreaterThanOrEqual(1)

  // Clean up
  await page.goto('/vacancies')
  await page.getByRole('link', { name: title }).click()
  await page.waitForURL(VACANCY_DETAIL_URL)
  await page.getByRole('button', { name: 'Delete vacancy' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Delete vacancy' }).click()
  await page.waitForURL('/vacancies')
})

test('clicking a status card navigates to /vacancies', async ({ page }) => {
  await page.goto('/dashboard')
  // Click any status card in the summary grid
  await page.locator('a').filter({ hasText: 'Applied' }).click()
  await expect(page).toHaveURL('/vacancies')
})

test('recent activity shows latest vacancy update', async ({ page }) => {
  const title = `E2E Activity Vacancy ${Date.now()}`
  const note = `Activity test note ${Date.now()}`

  // Create a vacancy and add an update
  await page.goto('/vacancies/new')
  await page.getByLabel('Job title').fill(title)
  await page.getByRole('button', { name: 'Add vacancy' }).click()
  await page.waitForURL(VACANCY_DETAIL_URL)

  // Use the name attribute to avoid ambiguity with "Notes / description" in the edit form
  await page.locator('textarea[name="notes"]').fill(note)
  await page.getByRole('button', { name: 'Add update' }).click()
  await expect(page.getByText(note)).toBeVisible()

  // Visit dashboard — note should appear in recent activity
  await page.goto('/dashboard')
  const activitySection = page.locator('section').filter({ hasText: 'Recent activity' })
  await expect(activitySection.getByText(note)).toBeVisible()

  // Clean up
  await page.goto('/vacancies')
  await page.getByRole('link', { name: title }).click()
  await page.waitForURL(VACANCY_DETAIL_URL)
  await page.getByRole('button', { name: 'Delete vacancy' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Delete vacancy' }).click()
  await page.waitForURL('/vacancies')
})
