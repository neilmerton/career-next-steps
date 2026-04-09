import Link from 'next/link'
import type { Contact } from '@/types/database'
import { formatDate, isOverdue } from '@/lib/utils/dates'
import styles from './ContactCard.module.css'

interface Props {
  contact: Contact
}

export default function ContactCard({ contact }: Props) {
  const overdue = contact.next_contact_date
    ? isOverdue(contact.next_contact_date)
    : false

  return (
    <Link href={`/contacts/${contact.id}`} className={styles.card}>
      <div className={styles.header}>
        <span className={styles.name}>{contact.name}</span>
        {contact.next_contact_date && (
          <span className={overdue ? styles.dateBadgeOverdue : styles.dateBadge}>
            {formatDate(contact.next_contact_date)}
          </span>
        )}
      </div>
      {contact.company && (
        <div className={styles.company}>{contact.company}</div>
      )}
      {(contact.email || contact.phone) && (
        <div className={styles.meta}>
          {contact.email && <span>{contact.email}</span>}
          {contact.email && contact.phone && <span>&bull;</span>}
          {contact.phone && <span>{contact.phone}</span>}
        </div>
      )}
    </Link>
  )
}
