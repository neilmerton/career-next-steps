'use client'

import { useDashboardData } from '@/lib/queries/dashboard'
import { formatDate, formatTime } from '@/lib/utils/dates'
import { STATUS_LABELS } from '@/lib/utils/vacancies'
import Link from 'next/link'
import styles from './LatestUpdates.module.css'

export default function LatestUpdates() {
  const { data, isPending } = useDashboardData()

  if (isPending || !data) return null

  const { latestUpdates } = data

  if (latestUpdates.length === 0) {
    return <p className={styles.empty}>No updates yet.</p>
  }

  const grouped = new Map<string, { label: string; updates: typeof latestUpdates }>()
  for (const u of latestUpdates) {
    const dateKey = u.occurred_at.slice(0, 10)
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, { label: formatDate(dateKey), updates: [] })
    }
    grouped.get(dateKey)!.updates.push(u)
  }

  return (
    <div className={styles.groups}>
      {[...grouped.entries()].map(([dateKey, { label, updates }]) => (
        <div key={dateKey} className={styles.group}>
          <p className={styles.groupHeading}>{label}</p>
          <ol className={styles.list}>
            {updates.map((u) => {
              const isVacancy = u.job_vacancy_id !== null
              const href = isVacancy
                ? `/vacancies/${u.job_vacancy_id}`
                : `/contacts/${u.contact_id}`
              const subject = isVacancy
                ? u.job_vacancy?.title ?? 'Vacancy'
                : u.contact?.name ?? 'Contact'
              const sub = isVacancy && u.job_vacancy?.company
                ? u.job_vacancy.company
                : u.contact?.company
                  ? u.contact.company
                  : null

              return (
                <li key={u.id} className={styles.item}>
                  <div className={styles.header}>
                    <Link href={href} className={styles.subject}>
                      {subject}
                      {sub && <span className={styles.sub}> — {sub}</span>}
                    </Link>
                    <span className={styles.date} suppressHydrationWarning>{formatTime(u.occurred_at)}</span>
                  </div>
                  <p className={styles.notes}>{u.notes}</p>
                  {u.new_status && (
                    <p className={styles.meta}>
                      Status → {STATUS_LABELS[u.new_status]}
                    </p>
                  )}
                  {u.new_next_contact_date && (
                    <p className={styles.meta}>
                      Next contact → {u.new_next_contact_date}
                    </p>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      ))}
    </div>
  )
}
