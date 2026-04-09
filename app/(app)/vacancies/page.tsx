import VacancyList from '@/components/VacancyList'
import { getVacancies } from '@/lib/data/vacancies'
import { getQueryClient } from '@/lib/queries/get-query-client'
import { queryKeys } from '@/lib/queries/keys'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './vacancies.module.css'

const pageTitle = 'Job Vacancies'

export const metadata: Metadata = {
  title: pageTitle,
}

export default async function VacanciesPage() {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: queryKeys.vacancies.list(),
    queryFn: getVacancies,
  })

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{pageTitle}</h1>
        <Link href="/vacancies/new" className={styles.addButton}>Add vacancy</Link>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <VacancyList />
      </HydrationBoundary>
    </div>
  )
}
