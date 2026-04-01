import Link from 'next/link'
import { STATUS_LABELS, STATUS_ORDER } from '@/lib/utils/vacancies'
import type { VacancyStatus } from '@/types/database'
import styles from './StatusSummary.module.css'

interface Props {
  counts: Partial<Record<VacancyStatus, number>>
  total: number
}

export default function StatusSummary({ counts, total }: Props) {
  if (total === 0) {
    return (
      <p className={styles.empty}>
        No vacancies yet. <Link href="/vacancies/new">Add one</Link>
      </p>
    )
  }

  return (
    <div className={styles.grid}>
      {STATUS_ORDER.map((status) => {
        const count = counts[status] ?? 0
        return (
          <Link key={status} href="/vacancies" className={styles.card}>
            <span className={`${styles.count} ${styles[status]}`}>{count}</span>
            <span className={styles.label}>{STATUS_LABELS[status]}</span>
          </Link>
        )
      })}
    </div>
  )
}
