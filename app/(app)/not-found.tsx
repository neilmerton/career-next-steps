import Link from 'next/link'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Page not found</h2>
      <p className={styles.message}>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/dashboard" className={styles.link}>Go to dashboard</Link>
    </div>
  )
}
