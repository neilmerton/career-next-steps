import { getContactsForSelect } from '@/lib/data/vacancies'
import NewVacancyForm from './NewVacancyForm'
import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './new.module.css'

export const metadata: Metadata = {
  title: 'Add Vacancy',
}

export default async function NewVacancyPage() {
  const contacts = await getContactsForSelect()

  return (
    <div className="page-container">
      <div className={styles.header}>
        <Link href="/vacancies" className={`back-link ${styles.back}`}>← Vacancies</Link>
        <h1 className="page-title">Add vacancy</h1>
      </div>

      <NewVacancyForm contacts={contacts} />
    </div>
  )
}
