import { getContactsForSelect } from '@/lib/data/vacancies'
import { createVacancy } from '@/lib/actions/vacancies'
import { ALL_STATUSES, ALL_SOURCES, STATUS_LABELS, SOURCE_LABELS } from '@/lib/utils/vacancies'
import styles from './new.module.css'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function NewVacancyPage({ searchParams }: Props) {
  const { error } = await searchParams

  const contacts = await getContactsForSelect()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/vacancies" className={styles.back}>← Job Vacancies</Link>
        <h1 className={styles.title}>Add vacancy</h1>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <form action={createVacancy} className={styles.form}>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>Job title <span className={styles.required}>*</span></label>
            <input id="title" name="title" type="text" required autoFocus className={styles.input} />
          </div>
          <div className={styles.field}>
            <label htmlFor="company" className={styles.label}>Company</label>
            <input id="company" name="company" type="text" className={styles.input} />
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="status" className={styles.label}>Status</label>
            <select id="status" name="status" defaultValue="applied" className={styles.select}>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="date_applied" className={styles.label}>Date applied</label>
            <input id="date_applied" name="date_applied" type="date" className={styles.input} />
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="source" className={styles.label}>Source</label>
            <select id="source" name="source" className={styles.select}>
              <option value="">— Select —</option>
              {ALL_SOURCES.map((s) => (
                <option key={s} value={s}>{SOURCE_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="source_other" className={styles.label}>Source detail <span className={styles.hint}>(if Other)</span></label>
            <input id="source_other" name="source_other" type="text" className={styles.input} />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="contact_id" className={styles.label}>
            Contact
            <Link href="/contacts/new" className={styles.createLink} target="_blank" rel="noreferrer">
              + Create new
            </Link>
          </label>
          <select id="contact_id" name="contact_id" className={styles.select}>
            <option value="">— None —</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="description" className={styles.label}>Notes / description</label>
          <textarea id="description" name="description" rows={4} className={styles.textarea} />
        </div>

        <div className={styles.actions}>
          <Link href="/vacancies" className={styles.cancel}>Cancel</Link>
          <button type="submit" className={styles.submit}>Add vacancy</button>
        </div>
      </form>
    </div>
  )
}
