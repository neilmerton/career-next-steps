'use client'

import { useDashboardData } from '@/lib/queries/dashboard'
import { formatDate, isOverdue } from '@/lib/utils/dates'
import Link from 'next/link'
import styles from './UpcomingContacts.module.css'

export default function UpcomingContacts() {
  const { data, isPending } = useDashboardData()

  if (isPending || !data) return null

  const { upcomingContacts } = data

  if (upcomingContacts.length === 0) {
    return <p className={styles.empty}>No contacts due in the next 3 days.</p>
  }

  return (
    <ul className={styles.list}>
      {upcomingContacts.map((c) => {
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
