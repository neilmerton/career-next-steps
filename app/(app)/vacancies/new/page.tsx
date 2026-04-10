import type { Metadata } from 'next'
import { getContactsForSelect } from '@/lib/data/vacancies'

export const metadata: Metadata = {
  title: 'Add Vacancy',
}
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
        <Link href="/vacancies" className={styles.back}>← Vacancies</Link>
        <h1 className={styles.title}>Add vacancy</h1>
      </div>

      {error && <p className="alert-error">{error}</p>}

      <form action={createVacancy} className="form-stack">
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="title" className="form-label">Job title <span className="form-required">*</span></label>
            <input id="title" name="title" type="text" required autoFocus />
          </div>
          <div className="form-field">
            <label htmlFor="company" className="form-label">Company</label>
            <input id="company" name="company" type="text" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="status" className="form-label">Status</label>
            <select id="status" name="status" defaultValue="applied">
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="date_applied" className="form-label">Date applied</label>
            <input id="date_applied" name="date_applied" type="date" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="source" className="form-label">Source</label>
            <select id="source" name="source">
              <option value="">— Select —</option>
              {ALL_SOURCES.map((s) => (
                <option key={s} value={s}>{SOURCE_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="source_other" className="form-label">Source detail <span className="form-hint">(if Other)</span></label>
            <input id="source_other" name="source_other" type="text" />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="contact_id" className={`form-label ${styles.labelWithAction}`}>
            Contact
            <Link href="/contacts/new" className={styles.createLink} target="_blank" rel="noreferrer">
              + Create new
            </Link>
          </label>
          <select id="contact_id" name="contact_id">
            <option value="">— None —</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="description" className="form-label">Notes / description</label>
          <textarea id="description" name="description" rows={4} />
        </div>

        <div className="form-actions-start">
          <Link href="/vacancies" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-primary">Add vacancy</button>
        </div>
      </form>
    </div>
  )
}
