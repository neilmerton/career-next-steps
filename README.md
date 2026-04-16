# Career Next Steps

A web application for managing your job search. Track applications, monitor status changes, and stay on top of recruiter relationships, all in one place.

I'm using this to track my job applications, and also to improve my working experience using Next.js (and React) along with using Claude.ai in the modern world of Frontend engineering.

## Features

- **Dashboard** — at-a-glance view of application statuses, upcoming recruiter follow-ups, and recent activity
- **Vacancies** — track job applications by status (Applied, Interviewing, Offered, Rejected, etc.), log updates and status changes
- **Contacts** — manage recruitment consultant relationships with follow-up date reminders and interaction history

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth (email/password) |
| Styling | CSS Modules with custom design tokens |
| Validation | Zod |
| Unit testing | Vitest + React Testing Library |
| E2E testing | Playwright |

## Project Structure

```
career-next-steps/
├── app/
│   ├── (app)/              # Authenticated routes
│   │   ├── dashboard/      # Main dashboard
│   │   ├── vacancies/      # Job applications list, detail, and forms
│   │   └── contacts/       # Recruiter contacts list, detail, and forms
│   └── (auth)/             # Login, sign up, password reset
├── components/             # Shared React components
├── lib/
│   ├── actions/            # Server Actions (form mutations)
│   ├── data/               # Server-side data fetching functions
│   ├── supabase/           # Supabase client setup (browser + server)
│   └── utils/              # Shared utility functions
├── types/                  # TypeScript interfaces for database tables
├── supabase/migrations/    # Database schema SQL files
└── middleware.ts           # Auth route protection
```

## Data Model

### `job_vacancies`
Tracks each job application — title, company, source (LinkedIn, Indeed, recruiter, etc.), status, and an optional linked contact.

### `contacts`
Stores recruiter and consultant details — name, company, email, phone, and a `next_contact_date` for follow-up scheduling.

### `updates`
An append-only log of notes attached to either a vacancy or a contact. Status changes on vacancies are also recorded here.

## Getting Started

### Prerequisites

- Node.js
- A [Supabase](https://supabase.com) project

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

Run the SQL migrations in order against your Supabase project:

```
supabase/migrations/20260401000000_initial_schema.sql
supabase/migrations/20260402000000_add_company_to_contacts.sql
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3322
```

`NEXT_PUBLIC_SITE_URL` is used to construct the redirect link in password reset emails.

### 4. Start the development server

```bash
npm run dev
```

The app runs on [http://localhost:3322](http://localhost:3322).

## Testing

### Unit tests

Tests are written with [Vitest](https://vitest.dev) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro), co-located with the source files they cover (`*.test.ts` / `*.test.tsx`).

| Command | Description |
|---|---|
| `npm test` | Watch mode — re-runs on file changes |
| `npm run test:run` | Single run — use in CI |

#### Coverage

| Area | Files |
|---|---|
| Date utilities | `lib/utils/dates.test.ts` |
| Vacancy utilities | `lib/utils/vacancies.test.ts` |
| ConfirmDialog component | `components/ConfirmDialog.test.tsx` |
| ContactCard component | `components/ContactCard.test.tsx` |
| ContactList component | `components/ContactList.test.tsx` |
| DangerZone component | `components/DangerZone.test.tsx` |
| DateTime component | `components/DateTime.test.tsx` |
| LatestUpdates component | `components/LatestUpdates.test.tsx` |
| Loading component | `components/Loading.test.tsx` |
| StatusBadge component | `components/StatusBadge.test.tsx` |
| StatusSummary component | `components/StatusSummary.test.tsx` |
| SubmitButton component | `components/SubmitButton.test.tsx` |
| Timeline component | `components/Timeline.test.tsx` |
| UpcomingContacts component | `components/UpcomingContacts.test.tsx` |
| VacancyCard component | `components/VacancyCard.test.tsx` |
| VacancyList component | `components/VacancyList.test.tsx` |

### E2E tests

End-to-end tests are written with [Playwright](https://playwright.dev) and live in the `e2e/` directory. They run against a locally running dev server and require a dedicated test Supabase account.

#### Setup

Add the following to `.env.local`:

```bash
NEXT_PUBLIC_E2E_EMAIL=your-test-account@example.com
NEXT_PUBLIC_E2E_PASSWORD=your-test-password
```

| Command | Description |
|---|---|
| `npm run test:e2e` | Run all E2E tests (headless) |
| `npm run test:e2e:ui` | Open the Playwright UI for interactive debugging |

#### Coverage

| File | Flows |
|---|---|
| `e2e/auth.spec.ts` | Unauthenticated redirect, wrong password error, successful login |
| `e2e/vacancies.spec.ts` | Create, list grouping by status, add note update, add status-change update, edit, delete |
| `e2e/contacts.spec.ts` | Create, add note, edit, set next contact date, delete |
| `e2e/dashboard.spec.ts` | Root redirect, status summary counts, status card navigation, recent activity |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3322 |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests in watch mode |
| `npm run test:run` | Run unit tests once |
| `npm run test:e2e` | Run E2E tests (headless) |
| `npm run test:e2e:ui` | Open Playwright UI |

## Deployment

The app is designed to deploy on Vercel. Push the repository to GitHub, create a Vercel project linked to it, and add the three environment variables above in the Vercel project settings.
