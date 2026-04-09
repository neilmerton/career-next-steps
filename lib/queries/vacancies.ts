import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './keys'
import type { JobVacancy } from '@/types/database'

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
