import { test, expect } from '@playwright/test'

// UUID pattern — matches /contacts/{uuid} but never /contacts/new.
// Without this specificity, waitForURL(/\/contacts\//) resolves immediately
// when called from /contacts/new and creates a race with the server action INSERT.
const CONTACT_DETAIL_URL = /\/contacts\/[0-9a-f]{8}-/

// Creates a contact via the UI and leaves the browser on its detail page.
// The server action redirects directly to /contacts/{id} after creation.
async function createContact(page: Parameters<Parameters<typeof test>[1]>[0], name: string) {
  await page.goto('/contacts/new')
  await page.getByLabel('Name').fill(name)
  await page.getByLabel('Company').fill('E2E Recruitment Ltd')
  await page.getByRole('button', { name: 'Add contact' }).click()
  await page.waitForURL(CONTACT_DETAIL_URL)
}

// Deletes the contact on the current detail page via the ConfirmDialog.
async function deleteCurrentContact(page: Parameters<Parameters<typeof test>[1]>[0]) {
  await page.getByRole('button', { name: 'Delete contact' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Delete contact' }).click()
  await page.waitForURL('/contacts')
}

test('create a contact — appears in the contact list', async ({ page }) => {
  const name = `E2E Contact ${Date.now()}`

  await page.goto('/contacts/new')
  await page.getByLabel('Name').fill(name)
  await page.getByLabel('Company').fill('Playwright Recruitment')
  await page.getByRole('button', { name: 'Add contact' }).click()
  await page.waitForURL(CONTACT_DETAIL_URL)

  // Navigate to the list to verify the card is there
  await page.goto('/contacts')
  await expect(page.getByRole('link', { name: name })).toBeVisible()

  // Clean up
  await page.getByRole('link', { name: name }).click()
  await page.waitForURL(CONTACT_DETAIL_URL)
  await deleteCurrentContact(page)
})

test('add a note to a contact — appears in history', async ({ page }) => {
  const name = `E2E Contact ${Date.now()}`
  const note = `E2E note ${Date.now()}`

  await createContact(page, name)

  await page.getByLabel('Notes').fill(note)
  await page.getByRole('button', { name: 'Add update' }).click()

  await expect(page.getByText(note)).toBeVisible()

  await deleteCurrentContact(page)
})

test('edit a contact — changes persist after reload', async ({ page }) => {
  const name = `E2E Contact ${Date.now()}`
  const updatedEmail = `e2e-${Date.now()}@example.com`

  await createContact(page, name)

  const editSection = page.locator('section').filter({ hasText: 'Edit contact' })
  await editSection.getByLabel('Email').fill(updatedEmail)
  await editSection.getByRole('button', { name: 'Save changes' }).click()
  await page.waitForURL(/message=/)

  await page.reload()
  await expect(editSection.getByLabel('Email')).toHaveValue(updatedEmail)

  await deleteCurrentContact(page)
})

test('set next contact date — contact appears in dashboard upcoming contacts', async ({ page }) => {
  const name = `E2E Contact ${Date.now()}`
  // Use tomorrow's date so it shows in "due soon"
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dateStr = tomorrow.toISOString().slice(0, 10) // YYYY-MM-DD

  await createContact(page, name)

  const editSection = page.locator('section').filter({ hasText: 'Edit contact' })
  await editSection.getByLabel('Next contact date').fill(dateStr)
  await editSection.getByRole('button', { name: 'Save changes' }).click()
  // Wait for the updateContact redirect to complete before navigating away,
  // so the next_contact_date is committed before the dashboard prefetches.
  await page.waitForURL(/message=/)

  // Check dashboard shows the contact in upcoming contacts
  await page.goto('/dashboard')
  const upcomingSection = page.locator('section').filter({ hasText: 'Contacts due soon' })
  await expect(upcomingSection.getByText(name)).toBeVisible()

  // Clean up
  await page.goto('/contacts')
  await page.getByRole('link', { name: name }).click()
  await page.waitForURL(CONTACT_DETAIL_URL)
  await deleteCurrentContact(page)
})

test('delete a contact — removed from the contact list', async ({ page }) => {
  const name = `E2E Contact ${Date.now()}`

  await createContact(page, name)
  await deleteCurrentContact(page)

  await expect(page).toHaveURL('/contacts')
  await expect(page.getByRole('link', { name: name })).not.toBeVisible()
})
