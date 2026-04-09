# Project Memory

## Documentation

Use Context7 MCP to fetch current documentation whenever the task involves a library, framework, SDK, API, CLI tool, or cloud service. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer — training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

### Steps

1. Always start with `resolve-library-id` using the library name and the question, unless an exact library ID in `/org/project` format is already known.
2. Pick the best match (ID format: `/org/project`) by: exact name match, description relevance, code snippet count, source reputation (High/Medium preferred), and benchmark score (higher is better). If results don't look right, try alternate names or queries. Use version-specific IDs when a version is mentioned.
3. `query-docs` with the selected library ID and the full question (not single words).
4. Answer using the fetched docs.

### Additional Skill

Use `better-drafting-SKILL.md` to help you improve your drafting abilities.

## Data Fetching

TanStack Query (`@tanstack/react-query`) is set up for client-side caching and query cancellation.

### Architecture

- **Server → client flow:** Pages (server components) prefetch data via existing `lib/data/` functions, dehydrate with `dehydrate(queryClient)`, and wrap client components in `<HydrationBoundary>`. Client components get prefetched data immediately with no loading flash.
- **Client refetch:** All `queryFn`s fetch from API route handlers (`app/api/`) and pass the TanStack-provided `signal` to `fetch` for automatic query cancellation.
- **Auth:** API routes verify the user via `supabase.auth.getUser()` before returning data.
- **staleTime:** 60 seconds globally (set in `lib/queries/get-query-client.ts`).

### Key files

| File | Purpose |
|---|---|
| `lib/queries/get-query-client.ts` | `QueryClient` factory — new instance per server request, singleton in browser |
| `lib/queries/keys.ts` | Central query key factory — all keys defined here |
| `lib/queries/contacts.ts` | `useContacts()`, `useContact(id)` |
| `lib/queries/vacancies.ts` | `useVacancies()`, `useVacancy(id)` |
| `lib/queries/dashboard.ts` | `useDashboardData()` |
| `app/providers.tsx` | `QueryClientProvider` wrapper (added to root layout) |
| `app/api/contacts/route.ts` | GET `/api/contacts` |
| `app/api/contacts/[id]/route.ts` | GET `/api/contacts/:id` |
| `app/api/vacancies/route.ts` | GET `/api/vacancies` |
| `app/api/vacancies/[id]/route.ts` | GET `/api/vacancies/:id` |
| `app/api/dashboard/route.ts` | GET `/api/dashboard` |

### Prefetching — always use `await`

Always `await queryClient.prefetchQuery(...)`. This ensures the server fetches data directly via Supabase before responding — fast because it is an in-region server-to-database call with no HTTP overhead.

```ts
// correct
await queryClient.prefetchQuery({ queryKey: ..., queryFn: ... })

// wrong — server sends no data; client must fetch over the network in production
queryClient.prefetchQuery({ queryKey: ..., queryFn: ... })
```

Without `await`, skipping the prefetch looks fine locally (localhost latency is imperceptible) but causes a visible loading state in production because the client has to fetch from the API routes over the real network while `isPending` is true.

### No `loading.tsx` files

There are no `loading.tsx` files in this project. They create Suspense boundaries that show a skeleton on every navigation — even return visits where the client cache already has data.

Without `loading.tsx`, Next.js keeps the current page visible while the server processes the new one, then transitions instantly with data already populated. The server-side Supabase prefetch is fast enough that this is imperceptible.

Do not add `loading.tsx` files to routes that use this data-fetching pattern.

### Adding a new query

1. Add keys to `lib/queries/keys.ts` under the relevant domain.
2. Add an API route handler in `app/api/` that checks auth and calls the `lib/data/` function.
3. Add a `useQuery` hook in `lib/queries/<domain>.ts` that fetches the API route, passing `signal`.
4. In the page server component (must be `async`), call `await queryClient.prefetchQuery` with the matching key and `lib/data/` function, then wrap the consumer in `<HydrationBoundary>`.