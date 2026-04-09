import LatestUpdates from '@/components/LatestUpdates'
import StatusSummary from '@/components/StatusSummary'
import UpcomingContacts from '@/components/UpcomingContacts'
import { getDashboardData } from '@/lib/data/dashboard'
import { getQueryClient } from '@/lib/queries/get-query-client'
import { queryKeys } from '@/lib/queries/keys'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { Metadata } from 'next'
import styles from './dashboard.module.css'

const pageTitle = 'Dashboard'

export const metadata: Metadata = {
  title: pageTitle,
}

export default function DashboardPage() {
  const queryClient = getQueryClient()
  queryClient.prefetchQuery({
    queryKey: queryKeys.dashboard.data(),
    queryFn: getDashboardData,
  })

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{pageTitle}</h1>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Vacancies by status</h2>
          <StatusSummary />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contacts due soon</h2>
          <UpcomingContacts />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent activity</h2>
          <LatestUpdates />
        </section>
      </HydrationBoundary>
    </div>
  )
}
