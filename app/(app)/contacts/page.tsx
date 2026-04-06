import ContactList from '@/components/ContactList'
import { getContacts } from '@/lib/data/contacts'
import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './contacts.module.css'

const pageTitle = 'Contacts'

export const metadata: Metadata = {
  title: pageTitle,
}

export default async function ContactsPage() {
  const contacts = await getContacts()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{pageTitle}</h1>
        <Link href="/contacts/new" className={styles.addButton}>Add contact</Link>
      </div>
      <ContactList contacts={contacts} />
    </div>
  )
}
