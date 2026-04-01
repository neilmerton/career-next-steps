import { createClient } from '@/lib/supabase/server'
import { addDays } from '@/lib/utils/dates'
import ContactList from '@/components/ContactList'
import type { Contact } from '@/types/database'
import styles from './contacts.module.css'
import Link from 'next/link'

export default async function ContactsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: true })

  const contacts: Contact[] = (data ?? []).sort((a, b) => {
    const aDate = a.next_contact_date ?? addDays(a.created_at.slice(0, 10), 10)
    const bDate = b.next_contact_date ?? addDays(b.created_at.slice(0, 10), 10)
    return aDate.localeCompare(bDate)
  })

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
