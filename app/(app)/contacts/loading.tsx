import styles from './loading.module.css'

export default function Loading() {
  return (
    <div className={styles.page}>
      <div className={styles.skeleton} style={{ width: '10rem', height: '2rem', marginBottom: '1.5rem' }} />
      {[...Array(5)].map((_, i) => (
        <div key={i} className={styles.skeleton} style={{ height: '3rem', marginBottom: '0.75rem' }} />
      ))}
    </div>
  )
}
