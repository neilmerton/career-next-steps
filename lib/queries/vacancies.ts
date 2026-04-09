import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './keys'
import type { Contact, JobVacancy, Update } from '@/types/database'

export function useVacancies() {
  return useQuery({
    queryKey: queryKeys.vacancies.list(),
    queryFn: async ({ signal }) => {
      const res = await fetch('/api/vacancies', { signal })
      if (!res.ok) throw new Error('Failed to fetch vacancies')
      return res.json() as Promise<JobVacancy[]>
    },
  })
}

export function useVacancy(id: string) {
  return useQuery({
    queryKey: queryKeys.vacancies.detail(id),
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/vacancies/${id}`, { signal })
      if (!res.ok) throw new Error('Failed to fetch vacancy')
      return res.json() as Promise<{
        vacancy: JobVacancy
        updates: Update[]
        contacts: Pick<Contact, 'id' | 'name'>[]
      }>
    },
  })
}
