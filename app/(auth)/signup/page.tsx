import type { Metadata } from 'next'
import { signUp } from '@/lib/actions/auth'

export const metadata: Metadata = {
  title: 'Create Account',
}
import styles from '../form.module.css'

interface Props {
  searchParams: Promise<{ error?: string; message?: string }>
}

export default async function SignUpPage({ searchParams }: Props) {
  const { error, message } = await searchParams

  return (
    <>
      <h1 className={styles.title}>Create account</h1>

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.message}>{message}</p>}

      {!message && (
        <form action={signUp} className={styles.form}>
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
              autoComplete="new-password"
              required
              minLength={8}
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.submit}>Create account</button>
        </form>
      )}

      <p className={styles.footer}>
        Already have an account? <a href="/login">Log in</a>
      </p>
    </>
  )
}
