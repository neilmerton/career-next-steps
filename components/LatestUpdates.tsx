import Link from 'next/link'
import { formatDateTime } from '@/lib/utils/dates'
import { STATUS_LABELS } from '@/lib/utils/vacancies'
import type { UpdateWithRelations } from '@/types/database'
import styles from './LatestUpdates.module.css'

interface Props {
  updates: UpdateWithRelations[]
}

export default function LatestUpdates({ updates }: Props) {
  if (updates.length === 0) {
    return <p className={styles.empty}>No updates yet.</p>
  }

  return (
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
              <span className={styles.date}>{formatDateTime(u.occurred_at)}</span>
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
  )
}
