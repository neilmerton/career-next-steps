import { resetPassword } from '@/lib/actions/auth'
import styles from '../form.module.css'

interface Props {
  searchParams: Promise<{ error?: string; message?: string }>
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { error, message } = await searchParams

  return (
    <>
      <h1 className={styles.title}>Reset password</h1>

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.message}>{message}</p>}

      {!message && (
        <form action={resetPassword} className={styles.form}>
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

          <button type="submit" className={styles.submit}>Send reset link</button>
        </form>
      )}

      <p className={styles.footer}>
        <a href="/login">Back to log in</a>
      </p>
    </>
  )
}
