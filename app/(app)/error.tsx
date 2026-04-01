'use client'

import styles from './error.module.css'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: Props) {
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Something went wrong</h2>
      <p className={styles.message}>{error.message}</p>
      <button onClick={reset} className={styles.button}>Try again</button>
    </div>
  )
}
