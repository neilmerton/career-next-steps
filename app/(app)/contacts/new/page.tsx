import { createContact } from '@/lib/actions/contacts'
import styles from './new.module.css'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function NewContactPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/contacts" className={styles.back}>← Contacts</Link>
        <h1 className={styles.title}>Add contact</h1>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <form action={createContact} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>Name <span className={styles.required}>*</span></label>
          <input id="name" name="name" type="text" required autoFocus className={styles.input} />
        </div>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input id="email" name="email" type="email" className={styles.input} />
        </div>

        <div className={styles.field}>
          <label htmlFor="phone" className={styles.label}>Phone</label>
          <input id="phone" name="phone" type="tel" className={styles.input} />
        </div>

        <div className={styles.field}>
          <label htmlFor="next_contact_date" className={styles.label}>Next contact date</label>
          <input id="next_contact_date" name="next_contact_date" type="date" className={styles.input} />
        </div>

        <div className={styles.actions}>
          <Link href="/contacts" className={styles.cancel}>Cancel</Link>
          <button type="submit" className={styles.submit}>Add contact</button>
        </div>
      </form>
    </div>
  )
}
