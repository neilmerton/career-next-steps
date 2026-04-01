import { signIn } from '@/lib/actions/auth'
import styles from '../form.module.css'

interface Props {
  searchParams: Promise<{ error?: string; message?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { error, message } = await searchParams

  return (
    <>
      <h1 className={styles.title}>Log in</h1>

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.message}>{message}</p>}

      <form action={signIn} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.submit}>Log in</button>
      </form>

      <p className={styles.footer}>
        <a href="/reset-password">Forgot your password?</a>
      </p>
      <p className={styles.footer}>
        No account? <a href="/signup">Sign up</a>
      </p>
    </>
  )
}
