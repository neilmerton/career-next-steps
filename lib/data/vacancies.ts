import { createClient } from '@/lib/supabase/server'
import type { Contact, JobVacancy, Update } from '@/types/database'

export async function getVacancies(): Promise<JobVacancy[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('job_vacancies')
    .select('*')
    .order('date_applied', { ascending: true, nullsFirst: false })

  return data ?? []
}

export async function getVacancyTitle(id: string): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('job_vacancies')
    .select('title')
    .eq('id', id)
    .single()

  return data?.title ?? null
}

export async function getVacancy(id: string): Promise<{
  vacancy: JobVacancy
  updates: Update[]
  contacts: Pick<Contact, 'id' | 'name'>[]
} | null> {
  const supabase = await createClient()

  const [{ data: vacancy }, { data: updates }, { data: contacts }] = await Promise.all([
    supabase.from('job_vacancies').select('*').eq('id', id).single(),
    supabase
      .from('updates')
      .select('*')
      .eq('job_vacancy_id', id)
      .order('occurred_at', { ascending: false }),
    supabase.from('contacts').select('id, name').order('name', { ascending: true }),
  ])

  if (!vacancy) return null

  return { vacancy, updates: updates ?? [], contacts: contacts ?? [] }
}

export async function getContactsForSelect(): Promise<Pick<Contact, 'id' | 'name'>[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('contacts')
    .select('id, name')
    .order('name', { ascending: true })

  return data ?? []
}
