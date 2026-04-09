'use client'

import { useDashboardData } from '@/lib/queries/dashboard'
import { STATUS_LABELS, STATUS_ORDER } from '@/lib/utils/vacancies'
import Link from 'next/link'
import styles from './StatusSummary.module.css'

export default function StatusSummary() {
  const { data, isPending } = useDashboardData()

  if (isPending || !data) return null

  const { statusCounts, totalVacancies } = data

  if (totalVacancies === 0) {
    return (
      <p className={styles.empty}>
        No vacancies yet. <Link href="/vacancies/new">Add one</Link>
      </p>
    )
  }

  return (
    <div className={styles.grid}>
      {STATUS_ORDER.map((status) => {
        const count = statusCounts[status] ?? 0
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
