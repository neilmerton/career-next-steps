import type { Metadata } from 'next'
import { createContact } from '@/lib/actions/contacts'
import SubmitButton from '@/components/SubmitButton'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Add Contact',
}

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function NewContactPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <div className="page-container">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link href="/contacts" className="back-link" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>← Contacts</Link>
        <h1 className="page-title">Add contact</h1>
      </div>

      {error && <p className="alert-error">{error}</p>}

      <form action={createContact} className="form-stack">
        <div className="form-field">
          <label htmlFor="name" className="form-label">Name <span className="form-required">*</span></label>
          <input id="name" name="name" type="text" required autoFocus />
        </div>

        <div className="form-field">
          <label htmlFor="company" className="form-label">Company</label>
          <input id="company" name="company" type="text" />
        </div>

        <div className="form-field">
          <label htmlFor="email" className="form-label">Email</label>
          <input id="email" name="email" type="email" />
        </div>

        <div className="form-field">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input id="phone" name="phone" type="tel" />
        </div>

        <div className="form-field">
          <label htmlFor="next_contact_date" className="form-label">Next contact date</label>
          <input id="next_contact_date" name="next_contact_date" type="date" />
        </div>

        <div className="form-actions-start">
          <Link href="/contacts" className="btn-cancel">Cancel</Link>
          <SubmitButton label="Add contact" pendingLabel="Saving…" className="btn-primary" />
        </div>
      </form>
    </div>
  )
}
