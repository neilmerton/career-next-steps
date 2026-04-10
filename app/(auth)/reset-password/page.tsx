import type { Metadata } from 'next'
import { resetPassword } from '@/lib/actions/auth'
import SubmitButton from '@/components/SubmitButton'

export const metadata: Metadata = {
  title: 'Reset Password',
}
import styles from '../form.module.css'

interface Props {
  searchParams: Promise<{ error?: string; message?: string }>
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { error, message } = await searchParams

  return (
    <>
      <h1 className={styles.title}>Reset password</h1>

      {error && <p className="alert-error">{error}</p>}
      {message && <p className="alert-success">{message}</p>}

      {!message && (
        <form action={resetPassword} className="form-stack">
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

          <SubmitButton label="Send reset link" pendingLabel="Sending…" className={`btn-primary ${styles.submit}`} />
        </form>
      )}

      <p className={styles.footer}>
        <a href="/login">Back to log in</a>
      </p>
    </>
  )
}
