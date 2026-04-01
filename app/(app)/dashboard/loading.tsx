import styles from './loading.module.css'

export default function Loading() {
  return (
    <div className={styles.page}>
      <div className={styles.skeleton} style={{ width: '8rem', height: '2rem', marginBottom: '2rem' }} />
      <div className={styles.skeleton} style={{ height: '7rem', marginBottom: '2rem' }} />
      <div className={styles.skeleton} style={{ height: '5rem', marginBottom: '2rem' }} />
      <div className={styles.skeleton} style={{ height: '10rem' }} />
    </div>
  )
}
