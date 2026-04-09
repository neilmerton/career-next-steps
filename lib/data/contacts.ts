import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Contact, Update } from '@/types/database'

export async function getContacts(): Promise<Contact[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('contacts')
    .select('*')
    .order('next_contact_date', { ascending: true, nullsFirst: false })

  return data ?? []
}

export const getContact = cache(async (id: string): Promise<{ contact: Contact; updates: Update[] } | null> => {
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
})
