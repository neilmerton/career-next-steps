import { createClient } from '@/lib/supabase/server'
import { addDays } from '@/lib/utils/dates'
import StatusSummary from '@/components/StatusSummary'
import UpcomingContacts from '@/components/UpcomingContacts'
import LatestUpdates from '@/components/LatestUpdates'
import type { VacancyStatus } from '@/types/database'
import type { UpdateWithRelations } from '@/types/database'
import styles from './dashboard.module.css'

export default async function DashboardPage() {
  const supabase = await createClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().slice(0, 10)
  const in3DaysStr = addDays(todayStr, 3)

  const [
    { data: vacancies },
    { data: upcomingContacts },
    { data: updates },
  ] = await Promise.all([
    supabase.from('job_vacancies').select('status'),
    supabase
      .from('contacts')
      .select('id, name, next_contact_date')
      .lte('next_contact_date', in3DaysStr)
      .not('next_contact_date', 'is', null)
      .order('next_contact_date', { ascending: true }),
    supabase
      .from('updates')
      .select(`
        *,
        job_vacancy:job_vacancies(id, title, company),
        contact:contacts(id, name)
      `)
      .order('occurred_at', { ascending: false })
      .limit(10),
  ])

  // Tally vacancy counts by status
  const counts: Partial<Record<VacancyStatus, number>> = {}
  let total = 0
  for (const v of vacancies ?? []) {
    const s = v.status as VacancyStatus
    counts[s] = (counts[s] ?? 0) + 1
    total++
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Vacancies by status</h2>
        <StatusSummary counts={counts} total={total} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contacts due soon</h2>
        <UpcomingContacts contacts={upcomingContacts ?? []} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent activity</h2>
        <LatestUpdates updates={(updates ?? []) as UpdateWithRelations[]} />
      </section>
    </div>
  )
}
