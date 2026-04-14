import styles from './DangerZone.module.css'

interface Props {
  title: string
  description: string
  children: React.ReactNode
}

export default function DangerZone({ title, description, children }: Props) {
  return (
    <section className={styles.dangerZone}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {children}
    </section>
  )
}
