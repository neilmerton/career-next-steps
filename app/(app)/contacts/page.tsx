import ContactList from '@/components/ContactList'
import { getContacts } from '@/lib/data/contacts'
import { getQueryClient } from '@/lib/queries/get-query-client'
import { queryKeys } from '@/lib/queries/keys'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { Metadata } from 'next'
import Link from 'next/link'

const pageTitle = 'Contacts'

export const metadata: Metadata = {
  title: pageTitle,
}

export default async function ContactsPage() {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: queryKeys.contacts.list(),
    queryFn: getContacts,
  })

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{pageTitle}</h1>
        <Link href="/contacts/new" className="btn-primary-link">Add contact</Link>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ContactList />
      </HydrationBoundary>
    </div>
  )
}
