import LatestUpdates from '@/components/LatestUpdates'
import StatusSummary from '@/components/StatusSummary'
import UpcomingContacts from '@/components/UpcomingContacts'
import { getDashboardData } from '@/lib/data/dashboard'
import type { Metadata } from 'next'
import styles from './dashboard.module.css'

const pageTitle = 'Dashboard'

export const metadata: Metadata = {
  title: pageTitle,
}

export default async function DashboardPage() {
  const { statusCounts, totalVacancies, upcomingContacts, latestUpdates } = await getDashboardData()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{pageTitle}</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Vacancies by status</h2>
        <StatusSummary counts={statusCounts} total={totalVacancies} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contacts due soon</h2>
        <UpcomingContacts contacts={upcomingContacts} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent activity</h2>
        <LatestUpdates updates={latestUpdates} />
      </section>
    </div>
  )
}
