import ContactList from '@/components/ContactList'
import { getContacts } from '@/lib/data/contacts'
import { getQueryClient } from '@/lib/queries/get-query-client'
import { queryKeys } from '@/lib/queries/keys'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './contacts.module.css'

const pageTitle = 'Contacts'

export const metadata: Metadata = {
  title: pageTitle,
}

export default function ContactsPage() {
  const queryClient = getQueryClient()
  queryClient.prefetchQuery({
    queryKey: queryKeys.contacts.list(),
    queryFn: getContacts,
  })

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{pageTitle}</h1>
        <Link href="/contacts/new" className={styles.addButton}>Add contact</Link>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ContactList />
      </HydrationBoundary>
    </div>
  )
}
