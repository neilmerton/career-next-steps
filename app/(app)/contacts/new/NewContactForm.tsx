'use client'

import { useActionState, useState } from 'react'
import { createContact } from '@/lib/actions/contacts'
import SubmitButton from '@/components/SubmitButton'
import Link from 'next/link'

export default function NewContactForm() {
  const [state, action] = useActionState(createContact, null)

  const [fields, setFields] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    next_contact_date: '',
  })

  function set(field: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <>
      {state?.error && <p className="alert-error">{state.error}</p>}

      <form action={action} className="form-stack">
        <div className="form-field">
          <label htmlFor="name" className="form-label">Name <span className="form-required">*</span></label>
          <input id="name" name="name" type="text" required autoFocus value={fields.name} onChange={set('name')} />
        </div>

        <div className="form-field">
          <label htmlFor="company" className="form-label">Company</label>
          <input id="company" name="company" type="text" value={fields.company} onChange={set('company')} />
        </div>

        <div className="form-field">
          <label htmlFor="email" className="form-label">Email</label>
          <input id="email" name="email" type="email" value={fields.email} onChange={set('email')} />
        </div>

        <div className="form-field">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input id="phone" name="phone" type="tel" value={fields.phone} onChange={set('phone')} />
        </div>

        <div className="form-field">
          <label htmlFor="next_contact_date" className="form-label">Next contact date</label>
          <input id="next_contact_date" name="next_contact_date" type="date" value={fields.next_contact_date} onChange={set('next_contact_date')} />
        </div>

        <div className="form-actions-start">
          <Link href="/contacts" className="btn-cancel">Cancel</Link>
          <SubmitButton label="Add contact" pendingLabel="Saving…" className="btn-primary" />
        </div>
      </form>
    </>
  )
}
