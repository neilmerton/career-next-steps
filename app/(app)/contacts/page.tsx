import { getContacts } from '@/lib/data/contacts'
import ContactList from '@/components/ContactList'
import styles from './contacts.module.css'
import Link from 'next/link'

export default async function ContactsPage() {
  const contacts = await getContacts()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Contacts</h1>
        <Link href="/contacts/new" className={styles.addButton}>Add contact</Link>
      </div>
      <ContactList contacts={contacts} />
    </div>
  )
}
