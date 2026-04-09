import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './keys'
import type { Contact } from '@/types/database'

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
