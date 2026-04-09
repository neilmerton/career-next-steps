import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './keys'
import type { Contact, Update } from '@/types/database'

export function useContacts() {
  return useQuery({
    queryKey: queryKeys.contacts.list(),
    queryFn: async ({ signal }) => {
      const res = await fetch('/api/contacts', { signal })
      if (!res.ok) throw new Error('Failed to fetch contacts')
      return res.json() as Promise<Contact[]>
    },
  })
}

export function useContact(id: string) {
  return useQuery({
    queryKey: queryKeys.contacts.detail(id),
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/contacts/${id}`, { signal })
      if (!res.ok) throw new Error('Failed to fetch contact')
      return res.json() as Promise<{ contact: Contact; updates: Update[] }>
    },
  })
}
