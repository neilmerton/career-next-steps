import { test, expect } from '@playwright/test'

// UUID pattern — matches /vacancies/{uuid} but never /vacancies/new.
// Without this specificity, waitForURL(/\/vacancies\//) resolves immediately
// when called from /vacancies/new and creates a race with the server action INSERT.
const VACANCY_DETAIL_URL = /\/vacancies\/[0-9a-f]{8}-/

// Creates a vacancy via the UI and leaves the browser on its detail page.
// The server action redirects directly to /vacancies/{id} after creation.
async function createVacancy(page: Parameters<Parameters<typeof test>[1]>[0], title: string) {
  await page.goto('/vacancies/new')
  await page.getByLabel('Job title').fill(title)
  await page.getByLabel('Company').fill('E2E Corp')
  await page.getByRole('button', { name: 'Add vacancy' }).click()
  await page.waitForURL(VACANCY_DETAIL_URL)
}

// Deletes the vacancy on the current detail page via the ConfirmDialog.
async function deleteCurrentVacancy(page: Parameters<Parameters<typeof test>[1]>[0]) {
  await page.getByRole('button', { name: 'Delete vacancy' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Delete vacancy' }).click()
  await page.waitForURL('/vacancies')
}

test('create a vacancy — appears in the vacancy list', async ({ page }) => {
  const title = `E2E Vacancy ${Date.now()}`

  await page.goto('/vacancies/new')
  await page.getByLabel('Job title').fill(title)
  await page.getByLabel('Company').fill('Playwright Co')
  await page.getByRole('button', { name: 'Add vacancy' }).click()
  await page.waitForURL(VACANCY_DETAIL_URL)

  // Navigate to the list to verify the card is there
  await page.goto('/vacancies')
  await expect(page.getByRole('link', { name: title })).toBeVisible()

  // Clean up
  await page.getByRole('link', { name: title }).click()
  await page.waitForURL(VACANCY_DETAIL_URL)
  await deleteCurrentVacancy(page)
})

test('vacancy list groups vacancies by status', async ({ page }) => {
  const appliedTitle = `E2E Applied ${Date.now()}`
  const interviewingTitle = `E2E Interviewing ${Date.now()}`

  // Create an "Applied" vacancy
  await page.goto('/vacancies/new')
  await page.getByLabel('Job title').fill(appliedTitle)
  await page.getByRole('button', { name: 'Add vacancy' }).click()
  await page.waitForURL(VACANCY_DETAIL_URL)

  // Create an "Interviewing" vacancy
  await page.goto('/vacancies/new')
  await page.getByLabel('Job title').fill(interviewingTitle)
  await page.locator('select[name="status"]').selectOption('interviewing')
  await page.getByRole('button', { name: 'Add vacancy' }).click()
  await page.waitForURL(VACANCY_DETAIL_URL)

  await page.goto('/vacancies')

  // Both appear under their respective group headings.
  // Filter by heading to avoid false matches — VacancyCard meta always shows "Applied {date}"
  // regardless of status, so filter({ hasText: 'Applied' }) would match multiple sections.
  const appliedSection = page.locator('section').filter({
    has: page.getByRole('heading', { name: /^Applied/, level: 2 }),
  })
  await expect(appliedSection.getByRole('link', { name: appliedTitle })).toBeVisible()

  const interviewingSection = page.locator('section').filter({
    has: page.getByRole('heading', { name: /^Interviewing/, level: 2 }),
  })
  await expect(interviewingSection.getByRole('link', { name: interviewingTitle })).toBeVisible()

  // Clean up
  await page.getByRole('link', { name: appliedTitle }).click()
  await page.waitForURL(VACANCY_DETAIL_URL)
  await deleteCurrentVacancy(page)

  await page.goto('/vacancies')
  await page.getByRole('link', { name: interviewingTitle }).click()
  await page.waitForURL(VACANCY_DETAIL_URL)
  await deleteCurrentVacancy(page)
})

test('add a note update to a vacancy — appears in history', async ({ page }) => {
  const title = `E2E Vacancy ${Date.now()}`
  const note = `E2E note ${Date.now()}`

  await createVacancy(page, title)

  await page.locator('textarea[name="notes"]').fill(note)
  await page.getByRole('button', { name: 'Add update' }).click()

  await expect(page.getByText(note)).toBeVisible()

  await deleteCurrentVacancy(page)
})

test('add an update with a status change — history shows status change', async ({ page }) => {
  const title = `E2E Vacancy ${Date.now()}`

  await createVacancy(page, title)

  await page.locator('textarea[name="notes"]').fill('Moving to interviews')
  await page.getByLabel('Change status').selectOption('interviewing')
  await page.getByRole('button', { name: 'Add update' }).click()

  await expect(page.getByText('Status changed to Interviewing')).toBeVisible()

  await deleteCurrentVacancy(page)
})

test('edit a vacancy — changes persist after reload', async ({ page }) => {
  const title = `E2E Vacancy ${Date.now()}`
  const updatedTitle = `${title} Updated`

  await createVacancy(page, title)

  // Edit the title
  const editSection = page.locator('section').filter({ hasText: 'Edit job vacancy' })
  await editSection.getByLabel('Job title').fill(updatedTitle)
  await editSection.getByRole('button', { name: 'Save changes' }).click()

  // Page heading should reflect the new title
  await expect(page.getByRole('heading', { name: updatedTitle, level: 1 })).toBeVisible()

  // Confirm persistence after reload
  await page.reload()
  await expect(page.getByRole('heading', { name: updatedTitle, level: 1 })).toBeVisible()

  await deleteCurrentVacancy(page)
})

test('delete a vacancy — removed from the vacancy list', async ({ page }) => {
  const title = `E2E Vacancy ${Date.now()}`

  await createVacancy(page, title)
  await deleteCurrentVacancy(page)

  // Should be back on /vacancies with the card gone
  await expect(page).toHaveURL('/vacancies')
  await expect(page.getByRole('link', { name: title })).not.toBeVisible()
})
