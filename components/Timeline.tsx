import DateTime from './DateTime'
import styles from './Timeline.module.css'

interface TimelineItem {
  id: string
  occurred_at: string
  notes: string
  meta?: string
}

interface Props {
  items: TimelineItem[]
}

export default function Timeline({ items }: Props) {
  return (
    <ol className={styles.timeline}>
      {items.map((item) => (
        <li key={item.id} className={styles.item}>
          <DateTime isoStr={item.occurred_at} className={styles.date} />
          <p className={styles.notes}>{item.notes}</p>
          {item.meta && <p className={styles.meta}>{item.meta}</p>}
        </li>
      ))}
    </ol>
  )
}
