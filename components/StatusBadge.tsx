import type { VacancyStatus } from '@/types/database'
import { STATUS_LABELS } from '@/lib/utils/vacancies'
import styles from './StatusBadge.module.css'

interface Props {
  status: VacancyStatus
}

export default function StatusBadge({ status }: Props) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
