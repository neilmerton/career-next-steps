# Implementation Plan

## Phase 1 — Project Setup

- [ ] Initialise a new Next.js 15 project with TypeScript (`create-next-app`)
- [ ] Remove boilerplate files and reset default styles
- [ ] Create base folder structure: `app/`, `components/`, `lib/`, `types/`
- [ ] Install `@supabase/ssr` and `@supabase/supabase-js`
- [ ] Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` placeholders
- [ ] Create Supabase client helpers: `lib/supabase/client.ts` (browser) and `lib/supabase/server.ts` (server)
- [ ] Add a root layout (`app/layout.tsx`) with a minimal CSS Module for global base styles

---

## Phase 2 — Database Schema

- [ ] Create a new Supabase project
- [ ] Define and apply the `contacts` table: `id`, `user_id`, `name`, `phone`, `email`, `next_contact_date`, `created_at`
- [ ] Define and apply the `job_vacancies` table: `id`, `user_id`, `title`, `description`, `date_applied`, `company`, `contact_id` (nullable FK), `source`, `source_other`, `status`, `created_at`
- [ ] Define and apply the `updates` table: `id`, `user_id`, `job_vacancy_id` (nullable FK), `contact_id` (nullable FK), `notes`, `occurred_at`, `new_status` (nullable), `new_next_contact_date` (nullable), `created_at`
- [ ] Enable Row Level Security on all tables
- [ ] Write RLS policies so users can only access their own rows
- [ ] Set up cascading deletes: deleting a job vacancy cascades to its updates; deleting a contact cascades to its updates (job vacancy `contact_id` set to null on contact delete)

---

## Phase 3 — Authentication

- [ ] Create the auth layout (`app/(auth)/layout.tsx`) with a centred card style
- [ ] Build the sign-up page (`app/(auth)/signup/page.tsx`) with Server Action
- [ ] Build the login page (`app/(auth)/login/page.tsx`) with Server Action
- [ ] Build the password-reset request page (`app/(auth)/reset-password/page.tsx`) with Server Action
- [ ] Build the password-reset confirm page (`app/(auth)/reset-password/confirm/page.tsx`) with Server Action
- [ ] Add logout as a Server Action callable from the nav
- [ ] Create middleware (`middleware.ts`) to redirect unauthenticated users to `/login` and authenticated users away from auth pages

---

## Phase 4 — Shell Layout (Authenticated Area)

- [ ] Create the app layout (`app/(app)/layout.tsx`) with a persistent navigation (links to Dashboard, Job Vacancies, Contacts) and a logout button
- [ ] Style the navigation with a CSS Module; ensure it collapses to a mobile-friendly layout
- [ ] Add a placeholder page for each of the three main sections so navigation can be verified end-to-end

---

## Phase 5 — Contacts

- [ ] Create the contacts list page (`app/(app)/contacts/page.tsx`) — Server Component, ordered by next contact date (fallback: `created_at + 10 days`)
- [ ] Build the `ContactList` component with a CSS Module
- [ ] Build the `ContactCard` component (name, email, phone, next contact date)
- [ ] Create the add-contact page (`app/(app)/contacts/new/page.tsx`) with a Server Action to insert a contact
- [ ] Create the contact detail page (`app/(app)/contacts/[id]/page.tsx`) — shows contact fields and update history
- [ ] Build the edit-contact form (inline on the detail page) with a Server Action to update contact fields
- [ ] Build the add-update form (on the detail page) with a Server Action — includes notes, optional `occurred_at` override, and optional new next contact date
- [ ] Build the delete-contact control with a Server Action (hard delete; cascades to updates)

---

## Phase 6 — Job Vacancies

- [ ] Create the vacancies list page (`app/(app)/vacancies/page.tsx`) — Server Component, grouped by status then date applied (oldest first)
- [ ] Build the `VacancyList` component grouped by status with a CSS Module
- [ ] Build the `VacancyCard` component (title, company, date applied, status)
- [ ] Create the add-vacancy page (`app/(app)/vacancies/new/page.tsx`) with a Server Action — includes all fields; contact selector with an inline "create new contact" option
- [ ] Create the vacancy detail page (`app/(app)/vacancies/[id]/page.tsx`) — shows all fields and update history
- [ ] Build the edit-vacancy form (inline on the detail page) with a Server Action to update data fields
- [ ] Build the add-update / change-status form (on the detail page) — notes required; optional status change; if status changes, the new status is saved via the update record
- [ ] Build the delete-vacancy control with a Server Action (hard delete; cascades to updates; contact unaffected)

---

## Phase 7 — Dashboard

- [ ] Create the dashboard page (`app/(app)/dashboard/page.tsx`) as the default post-login route
- [ ] Build the `StatusSummary` component — counts of job vacancies grouped by status
- [ ] Build the `UpcomingContacts` component — contacts that are overdue or have a next contact date within the next 3 days
- [ ] Build the `LatestUpdates` component — combined feed of the last 10 updates across all vacancies and contacts, each linking to the relevant record
- [ ] Redirect the app root (`app/(app)/page.tsx` or middleware) to `/dashboard`

---

## Phase 8 — Responsive Styling Pass

- [ ] Review and test all pages on a narrow viewport (≤ 375 px)
- [ ] Fix layout issues in navigation, forms, cards, and tables
- [ ] Ensure touch targets are large enough on mobile (minimum 44 px)

---

## Phase 9 — Deployment

- [ ] Create a Vercel project linked to the repository
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel environment variables
- [ ] Deploy and smoke-test the production build end-to-end
- [ ] Verify authentication flow, all CRUD operations, and the dashboard in production
