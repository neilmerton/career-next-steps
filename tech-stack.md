# Tech Stack

## Framework

- **Next.js 15** (App Router) — server-side rendering, file-based routing, Server Components, and Server Actions
- **TypeScript** — type safety throughout the codebase

## Frontend

- **Styling**: CSS Modules — standard CSS scoped per component, co-located alongside each component file (e.g. `Dashboard.module.css`)
- No third-party UI libraries
- No Tailwind CSS
- **Form Validation**: use zod to validate form fields

## Backend

- **Supabase** — PostgreSQL database and authentication
- **`@supabase/ssr`** — official Supabase package for Next.js App Router, enabling server-side data fetching and auth handling via Server Components and Server Actions
- No separate API layer required — data access is handled via Server Components and Server Actions directly

## Authentication

- Supabase Auth — covers sign up, login, logout, and password reset
- Each user must have their own Supabase account and project
- The app is configured via environment variables pointing to the user's Supabase project:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Deployment

- **Vercel** — recommended deployment target; native Next.js support, free tier is sufficient for personal use
- Environment variables are configured in the Vercel project settings

## Constraints

- Must be responsive and usable on both desktop and mobile devices
- No third-party UI component libraries
- Styling in standard CSS only (no Tailwind CSS)
- Supabase required for data storage and authentication

> ctx7sk-24756580-21cb-4342-ae83-178d93c230ff