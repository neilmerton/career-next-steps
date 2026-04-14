import VacancyList from '@/components/VacancyList'
import { getVacancies } from '@/lib/data/vacancies'
import { getQueryClient } from '@/lib/queries/get-query-client'
import { queryKeys } from '@/lib/queries/keys'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { Metadata } from 'next'
import Link from 'next/link'

const pageTitle = 'Vacancies'

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
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{pageTitle}</h1>
        <Link href="/vacancies/new" className="btn-primary-link">Add vacancy</Link>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <VacancyList />
      </HydrationBoundary>
    </div>
  )
}
