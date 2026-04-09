import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './keys'
import type { DashboardData } from '@/lib/data/dashboard'

export function useDashboardData() {
  return useQuery({
    queryKey: queryKeys.dashboard.data(),
    queryFn: async ({ signal }) => {
      const res = await fetch('/api/dashboard', { signal })
      if (!res.ok) throw new Error('Failed to fetch dashboard data')
      return res.json() as Promise<DashboardData>
    },
  })
}
