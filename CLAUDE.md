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

### Prefetching — do not use `await`

Each route has a `loading.tsx` skeleton. Using `await queryClient.prefetchQuery(...)` blocks the server component render and triggers that skeleton on every navigation, even when the client already has cached data.

Always call `prefetchQuery` without `await`:

```ts
// correct
queryClient.prefetchQuery({ queryKey: ..., queryFn: ... })

// wrong — triggers loading.tsx skeleton on every navigation
await queryClient.prefetchQuery({ queryKey: ..., queryFn: ... })
```

The `shouldDehydrateQuery` option in `get-query-client.ts` is configured to include pending queries, so the in-flight fetch is streamed to the client correctly. On return visits within `staleTime`, the client cache already has data and renders immediately.

### Adding a new query

1. Add keys to `lib/queries/keys.ts` under the relevant domain.
2. Add an API route handler in `app/api/` that checks auth and calls the `lib/data/` function.
3. Add a `useQuery` hook in `lib/queries/<domain>.ts` that fetches the API route, passing `signal`.
4. In the page server component, call `queryClient.prefetchQuery` (no `await`) with the matching key and `lib/data/` function, then wrap the consumer in `<HydrationBoundary>`.