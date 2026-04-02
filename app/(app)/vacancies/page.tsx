import type { Metadata } from 'next'
import { getVacancies } from '@/lib/data/vacancies'

export const metadata: Metadata = {
  title: 'Job Vacancies',
}
import VacancyList from '@/components/VacancyList'
import styles from './vacancies.module.css'
import Link from 'next/link'

export default async function VacanciesPage() {
  const vacancies = await getVacancies()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Job Vacancies</h1>
        <Link href="/vacancies/new" className={styles.addButton}>Add vacancy</Link>
      </div>
      <VacancyList vacancies={vacancies} />
    </div>
  )
}
