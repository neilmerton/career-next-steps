import { createClient } from '@/lib/supabase/server'
import { addDays } from '@/lib/utils/dates'
import type { Contact, Update } from '@/types/database'

export async function getContacts(): Promise<Contact[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: true })

  return (data ?? []).sort((a, b) => {
    const aDate = a.next_contact_date ?? addDays(a.created_at.slice(0, 10), 10)
    const bDate = b.next_contact_date ?? addDays(b.created_at.slice(0, 10), 10)
    return aDate.localeCompare(bDate)
  })
}

export async function getContactName(id: string): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('contacts')
    .select('name')
    .eq('id', id)
    .single()

  return data?.name ?? null
}

export async function getContact(id: string): Promise<{ contact: Contact; updates: Update[] } | null> {
  const supabase = await createClient()

  const [{ data: contact }, { data: updates }] = await Promise.all([
    supabase.from('contacts').select('*').eq('id', id).single(),
    supabase
      .from('updates')
      .select('*')
      .eq('contact_id', id)
      .order('occurred_at', { ascending: false }),
  ])

  if (!contact) return null

  return { contact, updates: updates ?? [] }
}
