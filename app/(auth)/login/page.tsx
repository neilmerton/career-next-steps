import type { Metadata } from 'next'
import { signIn } from '@/lib/actions/auth'
import SubmitButton from '@/components/SubmitButton'

export const metadata: Metadata = {
  title: 'Log In',
}
import styles from '../form.module.css'

interface Props {
  searchParams: Promise<{ error?: string; message?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { error, message } = await searchParams

  return (
    <>
      <h1 className={styles.title}>Log in</h1>

      {error && <p className="alert-error">{error}</p>}
      {message && <p className="alert-success">{message}</p>}

      <form action={signIn} className="form-stack">
        <div className="form-field">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        <SubmitButton label="Log in" pendingLabel="Logging in…" className={`btn-primary ${styles.submit}`} />
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
