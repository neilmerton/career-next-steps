import type { Metadata } from 'next'
import { updatePassword } from '@/lib/actions/auth'
import SubmitButton from '@/components/SubmitButton'

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

      {error && <p className="alert-error">{error}</p>}

      <form action={updatePassword} className="form-stack">
        <div className="form-field">
          <label htmlFor="password" className="form-label">New password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
        </div>

        <div className="form-field">
          <label htmlFor="confirmPassword" className="form-label">Confirm new password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
        </div>

        <SubmitButton label="Update password" pendingLabel="Updating…" className={`btn-primary ${styles.submit}`} />
      </form>
    </>
  )
}
