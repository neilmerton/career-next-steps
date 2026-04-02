# Career Next Steps

A web application for managing your job search. Track applications, monitor status changes, and stay on top of recruiter relationships — all in one place.

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

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3322 |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint |

## Deployment

The app is designed to deploy on Vercel. Push the repository to GitHub, create a Vercel project linked to it, and add the three environment variables above in the Vercel project settings.
