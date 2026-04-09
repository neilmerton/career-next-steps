'use client'

import { useContacts } from '@/lib/queries/contacts'
import Link from 'next/link'
import ContactCard from './ContactCard'
import styles from './ContactList.module.css'

export default function ContactList() {
  const { data: contacts = [], isPending } = useContacts()

  if (isPending) return null

  if (contacts.length === 0) {
    return <p className={styles.empty}>No contacts yet. <Link href="/contacts/new">Add one</Link>.</p>
  }

  return (
    <ul className={styles.list}>
      {contacts.map((contact) => (
        <li key={contact.id}>
          <ContactCard contact={contact} />
        </li>
      ))}
    </ul>
  )
}
