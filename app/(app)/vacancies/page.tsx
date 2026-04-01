import { createClient } from '@/lib/supabase/server'
import VacancyList from '@/components/VacancyList'
import type { JobVacancy } from '@/types/database'
import styles from './vacancies.module.css'

export default async function VacanciesPage() {
  const supabase = await createClient()

  // Fetch ordered by date_applied ascending (oldest first) within each status group
  const { data } = await supabase
    .from('job_vacancies')
    .select('*')
    .order('date_applied', { ascending: true, nullsFirst: false })

  const vacancies: JobVacancy[] = data ?? []

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Job Vacancies</h1>
        <a href="/vacancies/new" className={styles.addButton}>Add vacancy</a>
      </div>
      <VacancyList vacancies={vacancies} />
    </div>
  )
}
