import { createClient } from '@/lib/supabase/server'
import { addDays } from '@/lib/utils/dates'
import type { Contact, UpdateWithRelations, VacancyStatus } from '@/types/database'

export interface DashboardData {
  statusCounts: Partial<Record<VacancyStatus, number>>
  totalVacancies: number
  upcomingContacts: Pick<Contact, 'id' | 'name' | 'next_contact_date'>[]
  latestUpdates: UpdateWithRelations[]
}

export async function getDashboardData(): Promise<DashboardData> {
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

  const statusCounts: Partial<Record<VacancyStatus, number>> = {}
  let totalVacancies = 0
  for (const v of vacancies ?? []) {
    const s = v.status as VacancyStatus
    statusCounts[s] = (statusCounts[s] ?? 0) + 1
    totalVacancies++
  }

  return {
    statusCounts,
    totalVacancies,
    upcomingContacts: upcomingContacts ?? [],
    latestUpdates: (updates ?? []) as UpdateWithRelations[],
  }
}
