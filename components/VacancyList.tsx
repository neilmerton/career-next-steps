import { STATUS_LABELS, STATUS_ORDER } from '@/lib/utils/vacancies'
import type { JobVacancy, VacancyStatus } from '@/types/database'
import Link from 'next/link'
import VacancyCard from './VacancyCard'
import styles from './VacancyList.module.css'

interface Props {
  vacancies: JobVacancy[]
}

export default function VacancyList({ vacancies }: Props) {
  if (vacancies.length === 0) {
    return (
      <p className={styles.empty}>
        No vacancies yet. <Link href="/vacancies/new">Add one</Link>.
      </p>
    )
  }

  // Group by status, preserving display order
  const grouped = STATUS_ORDER.reduce<Record<VacancyStatus, JobVacancy[]>>(
    (acc, status) => {
      acc[status] = vacancies.filter((v) => v.status === status)
      return acc
    },
    {} as Record<VacancyStatus, JobVacancy[]>,
  )

  return (
    <div className={styles.groups}>
      {STATUS_ORDER.filter((status) => grouped[status].length > 0).map((status) => (
        <section key={status} className={styles.group}>
          <h2 className={styles.groupTitle}>
            {STATUS_LABELS[status]}
            <span className={styles.count}>{grouped[status].length}</span>
          </h2>
          <ul className={styles.list}>
            {grouped[status].map((vacancy) => (
              <li key={vacancy.id}>
                <VacancyCard vacancy={vacancy} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
