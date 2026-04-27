import LatestUpdates from '@/components/LatestUpdates'
import StatusSummary from '@/components/StatusSummary'
import UpcomingContacts from '@/components/UpcomingContacts'
import { getDashboardData } from '@/lib/data/dashboard'
import { getQueryClient } from '@/lib/queries/get-query-client'
import { queryKeys } from '@/lib/queries/keys'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './dashboard.module.css'

/**
 * Server component
 *  └─ prefetchQuery → hits Supabase directly → populates QueryClient cache
 *  └─ dehydrate(queryClient) → serializes cache to JSON
 *  └─ <HydrationBoundary state={...}> → embeds JSON in HTML
 *
 * Browser
 *  └─ HydrationBoundary rehydrates → injects data into client QueryClient
 *  └─ useQuery() → finds data already in cache → renders immediately
 *
 * This is why there are no loading.tsx files in this project; data arrives with the page,
 * not after it.
 */

const pageTitle = 'Dashboard'

export const metadata: Metadata = {
  title: pageTitle,
}

export default async function DashboardPage() {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: queryKeys.dashboard.data(),
    queryFn: getDashboardData,
  })

  return (
    <div className="page-container">
      <h1 className={styles.title}>{pageTitle}</h1>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <section className={styles.section}>
          <header className={styles.sectionHeader}>
            <h2 className="section-title">Vacancies by status</h2>
            <Link href="/vacancies/new" className="btn-primary-link">Add vacancy</Link>
          </header>
          <StatusSummary />
        </section>

        <section className={styles.section}>
          <header className={styles.sectionHeader}>
            <h2 className="section-title">Contacts due soon</h2>
            <Link href="/contacts/new" className="btn-primary-link">Add contact</Link>
          </header>
          <UpcomingContacts />
        </section>

        <section className={styles.section}>
          <h2 className="section-title">Previous 7 days activity</h2>
          <LatestUpdates />
        </section>
      </HydrationBoundary>
    </div>
  )
}
