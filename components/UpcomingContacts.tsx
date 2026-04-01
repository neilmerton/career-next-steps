import Link from 'next/link'
import { formatDate, isOverdue } from '@/lib/utils/dates'
import type { Contact } from '@/types/database'
import styles from './UpcomingContacts.module.css'

interface Props {
  contacts: Pick<Contact, 'id' | 'name' | 'next_contact_date'>[]
}

export default function UpcomingContacts({ contacts }: Props) {
  if (contacts.length === 0) {
    return <p className={styles.empty}>No contacts due in the next 3 days.</p>
  }

  return (
    <ul className={styles.list}>
      {contacts.map((c) => {
        const overdue = c.next_contact_date ? isOverdue(c.next_contact_date) : false
        return (
          <li key={c.id} className={styles.item}>
            <Link href={`/contacts/${c.id}`} className={styles.name}>{c.name}</Link>
            {c.next_contact_date && (
              <span className={overdue ? styles.overdue : styles.due}>
                {overdue ? 'Overdue — ' : 'Due '}
                {formatDate(c.next_contact_date)}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
