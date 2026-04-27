'use client'

import type { DashboardData } from '@/lib/data/dashboard'
import type { UpdateWithRelations } from '@/types/database'
import DateTime from '@/components/DateTime'
import { useDashboardData } from '@/lib/queries/dashboard'
import { STATUS_LABELS } from '@/lib/utils/vacancies'
import { formatDate } from '@/lib/utils/dates'
import Link from 'next/link'
import styles from './LatestUpdates.module.css'

type RecentVacancy = DashboardData['recentVacancies'][number]
type AnyItem =
  | { type: 'update'; date: string; data: UpdateWithRelations }
  | { type: 'vacancy'; date: string; data: RecentVacancy }

export default function LatestUpdates() {
  const { data, isPending } = useDashboardData()

  if (isPending || !data) return null

  const { latestUpdates, recentVacancies } = data

  if (latestUpdates.length === 0 && recentVacancies.length === 0) {
    return <p className={styles.empty}>No recent activity.</p>
  }

  const allItems: AnyItem[] = [
    ...latestUpdates.map(u => ({ type: 'update' as const, date: u.occurred_at.slice(0, 10), data: u })),
    ...recentVacancies
      .filter((v): v is RecentVacancy & { date_applied: string } => v.date_applied !== null)
      .map(v => ({ type: 'vacancy' as const, date: v.date_applied, data: v })),
  ].sort((a, b) => b.date.localeCompare(a.date))

  const grouped = new Map<string, { label: string; items: AnyItem[] }>()
  for (const item of allItems) {
    if (!grouped.has(item.date)) {
      grouped.set(item.date, { label: formatDate(item.date), items: [] })
    }
    grouped.get(item.date)!.items.push(item)
  }

  return (
    <div className={styles.groups}>
      {[...grouped.entries()].map(([dateKey, { label, items }]) => (
        <div key={dateKey} className={styles.group}>
          <p className={styles.groupHeading}>{label}</p>
          <ol className={styles.list}>
            {items.map((item) => {
              if (item.type === 'update') {
                const u = item.data
                const isVacancy = u.job_vacancy_id !== null
                const href = isVacancy
                  ? `/vacancies/${u.job_vacancy_id}`
                  : `/contacts/${u.contact_id}`
                const subject = isVacancy
                  ? u.job_vacancy?.title ?? 'Vacancy'
                  : u.contact?.name ?? 'Contact'
                const sub = isVacancy && u.job_vacancy?.company
                  ? u.job_vacancy.company
                  : u.contact?.company ?? null

                return (
                  <li key={`update-${u.id}`} className={styles.item}>
                    <div className={styles.header}>
                      <Link href={href} className={styles.subject}>
                        <span>{subject}</span>
                        {sub && <><span>&bull;</span><span>{sub}</span></>}
                      </Link>
                      <DateTime isoStr={u.occurred_at} format="time" className={styles.date} />
                    </div>
                    <p className={styles.notes}>{u.notes}</p>
                    {u.new_status && <p className={styles.meta}>Status → {STATUS_LABELS[u.new_status]}</p>}
                    {u.new_next_contact_date && <p className={styles.meta}>Next contact → {u.new_next_contact_date}</p>}
                  </li>
                )
              }

              const v = item.data
              return (
                <li key={`vacancy-${v.id}`} className={styles.item}>
                  <div className={styles.header}>
                    <Link href={`/vacancies/${v.id}`} className={styles.subject}>
                      <span>{v.title}</span>
                      {v.company && <><span>&bull;</span><span>{v.company}</span></>}
                    </Link>
                    <span className={styles.badge}>Applied</span>
                  </div>
                  {v.status !== 'applied' && <p className={styles.meta}>{STATUS_LABELS[v.status]}</p>}
                </li>
              )
            })}
          </ol>
        </div>
      ))}
    </div>
  )
}
