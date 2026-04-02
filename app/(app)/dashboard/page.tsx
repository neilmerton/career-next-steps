import type { Metadata } from 'next'
import { getDashboardData } from '@/lib/data/dashboard'

export const metadata: Metadata = {
  title: 'Dashboard',
}
import StatusSummary from '@/components/StatusSummary'
import UpcomingContacts from '@/components/UpcomingContacts'
import LatestUpdates from '@/components/LatestUpdates'
import styles from './dashboard.module.css'

export default async function DashboardPage() {
  const { statusCounts, totalVacancies, upcomingContacts, latestUpdates } = await getDashboardData()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>

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
