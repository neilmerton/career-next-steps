'use client'

import { useActionState, useState } from 'react'
import { createVacancy } from '@/lib/actions/vacancies'
import { ALL_SOURCES, ALL_STATUSES, SOURCE_LABELS, STATUS_LABELS } from '@/lib/utils/vacancies'
import SubmitButton from '@/components/SubmitButton'
import Link from 'next/link'
import styles from './new.module.css'

interface Contact {
  id: string
  name: string
}

interface Props {
  contacts: Contact[]
}

export default function NewVacancyForm({ contacts }: Props) {
  const [state, action] = useActionState(createVacancy, null)

  const [fields, setFields] = useState({
    title: '',
    company: '',
    status: 'applied',
    date_applied: '',
    source: '',
    source_other: '',
    contact_id: '',
    description: '',
  })

  function set(field: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFields((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <>
      {state?.error && <p className="alert-error">{state.error}</p>}

      <form action={action} className="form-stack">
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="title" className="form-label">Job title <span className="form-required">*</span></label>
            <input id="title" name="title" type="text" required autoFocus value={fields.title} onChange={set('title')} />
          </div>
          <div className="form-field">
            <label htmlFor="company" className="form-label">Company</label>
            <input id="company" name="company" type="text" value={fields.company} onChange={set('company')} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="status" className="form-label">Status</label>
            <select id="status" name="status" value={fields.status} onChange={set('status')}>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="date_applied" className="form-label">Date applied <span className="form-hint">(leave blank for today)</span></label>
            <input id="date_applied" name="date_applied" type="date" value={fields.date_applied} onChange={set('date_applied')} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="source" className="form-label">Source</label>
            <select id="source" name="source" value={fields.source} onChange={set('source')}>
              <option value="">— Select —</option>
              {ALL_SOURCES.map((s) => (
                <option key={s} value={s}>{SOURCE_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="source_other" className="form-label">Source detail <span className="form-hint">(if Other)</span></label>
            <input id="source_other" name="source_other" type="text" value={fields.source_other} onChange={set('source_other')} />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="contact_id" className={`form-label ${styles.labelWithAction}`}>
            Contact
            <Link href="/contacts/new" className="text-link" target="_blank" rel="noreferrer">
              + Create new
            </Link>
          </label>
          <select id="contact_id" name="contact_id" value={fields.contact_id} onChange={set('contact_id')}>
            <option value="">— None —</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="description" className="form-label">Notes / description</label>
          <textarea id="description" name="description" rows={4} value={fields.description} onChange={set('description')} />
        </div>

        <div className="form-actions-start">
          <Link href="/vacancies" className="btn-cancel">Cancel</Link>
          <SubmitButton label="Add vacancy" pendingLabel="Saving…" className="btn-primary" />
        </div>
      </form>
    </>
  )
}
