import { createClient } from '@/lib/supabase/server'
import { addDays } from '@/lib/utils/dates'
import type { Contact, JobVacancy, UpdateWithRelations, VacancyStatus } from '@/types/database'

export interface DashboardData {
  statusCounts: Partial<Record<VacancyStatus, number>>
  totalVacancies: number
  upcomingContacts: Pick<Contact, 'id' | 'name' | 'next_contact_date'>[]
  recentVacancies: Pick<JobVacancy, 'id' | 'title' | 'company' | 'date_applied' | 'status'>[]
  latestUpdates: UpdateWithRelations[]
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient()

  const todayStr = new Date().toISOString().slice(0, 10)
  const in3DaysStr = addDays(todayStr, 3)
  const sevenDaysAgoStr = addDays(todayStr, -7)

  const [
    { data: vacancies },
    { data: upcomingContacts },
    { data: recentVacancies },
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
      .from('job_vacancies')
      .select('id, title, company, date_applied, status')
      .gte('date_applied', sevenDaysAgoStr)
      .order('date_applied', { ascending: false }),
    supabase
      .from('updates')
      .select(`
        *,
        job_vacancy:job_vacancies(id, title, company),
        contact:contacts(id, name, company)
      `)
      .gte('occurred_at', sevenDaysAgoStr)
      .order('occurred_at', { ascending: false }),
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
    recentVacancies: (recentVacancies ?? []) as Pick<JobVacancy, 'id' | 'title' | 'company' | 'date_applied' | 'status'>[],
    latestUpdates: (updates ?? []) as UpdateWithRelations[],
  }
}
