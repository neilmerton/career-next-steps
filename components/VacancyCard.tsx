import Link from 'next/link'
import type { JobVacancy } from '@/types/database'
import { formatDate } from '@/lib/utils/dates'
import StatusBadge from './StatusBadge'
import styles from './VacancyCard.module.css'

interface Props {
  vacancy: JobVacancy
}

export default function VacancyCard({ vacancy }: Props) {
  return (
    <Link href={`/vacancies/${vacancy.id}`} className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{vacancy.title}</span>
        <StatusBadge status={vacancy.status} />
      </div>
      <div className={styles.meta}>
        {vacancy.company && <span>{vacancy.company}</span>}
        {vacancy.company && vacancy.date_applied && <span>&bull;</span>}
        {vacancy.date_applied && <span>Applied {formatDate(vacancy.date_applied)}</span>}
      </div>
    </Link>
  )
}
