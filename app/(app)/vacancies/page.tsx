import VacancyList from '@/components/VacancyList'
import { getVacancies } from '@/lib/data/vacancies'
import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './vacancies.module.css'

const pageTitle = 'Job Vacancies'

export const metadata: Metadata = {
  title: pageTitle,
}
export default async function VacanciesPage() {
  const vacancies = await getVacancies()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{pageTitle}</h1>
        <Link href="/vacancies/new" className={styles.addButton}>Add vacancy</Link>
      </div>
      <VacancyList vacancies={vacancies} />
    </div>
  )
}
