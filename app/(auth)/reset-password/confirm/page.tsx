import type { Metadata } from 'next'
import { updatePassword } from '@/lib/actions/auth'

export const metadata: Metadata = {
  title: 'Set New Password',
}
import styles from '../../form.module.css'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function ResetPasswordConfirmPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <>
      <h1 className={styles.title}>Set new password</h1>

      {error && <p className={styles.error}>{error}</p>}

      <form action={updatePassword} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>New password</label>
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

        <div className={styles.field}>
          <label htmlFor="confirmPassword" className={styles.label}>Confirm new password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.submit}>Update password</button>
      </form>
    </>
  )
}
