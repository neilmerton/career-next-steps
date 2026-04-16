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

## Testing

### Unit tests

- **Vitest** — test runner; ESM-native, TypeScript-native, Jest-compatible API
- **React Testing Library** (`@testing-library/react`) — renders components and queries the DOM the way a user would
- **`@testing-library/user-event`** — simulates realistic user interactions (preferred over `fireEvent`)
- **`@testing-library/jest-dom`** — custom matchers (`toBeInTheDocument`, `toBeDisabled`, `toHaveClass`, etc.)
- **`happy-dom`** — lightweight DOM environment; used globally across all tests
- **`@vitejs/plugin-react`** — Vite/Vitest plugin for JSX/TSX transformation
- Test files are co-located with source files (`*.test.ts` / `*.test.tsx`)
- Run with `npm test` (watch) or `npm run test:run` (single pass / CI)

### E2E tests

- **Playwright** — browser automation for full user journey testing against a running dev server
- **`dotenv`** — loads `.env.local` in `playwright.config.ts` to supply test account credentials
- Auth is handled once via a setup project (`e2e/auth.setup.ts`) that saves session state to `playwright/.auth/user.json`; all other tests reuse it
- Tests live in `e2e/` and cover auth flows, vacancy and contact lifecycle, and dashboard integration
- Run with `npm run test:e2e` (headless) or `npm run test:e2e:ui` (interactive)

## Deployment

- **Vercel** — recommended deployment target; native Next.js support, free tier is sufficient for personal use
- Environment variables are configured in the Vercel project settings

## Constraints

- Must be responsive and usable on both desktop and mobile devices
- No third-party UI component libraries
- Styling in standard CSS only (no Tailwind CSS)
- Supabase required for data storage and authentication
