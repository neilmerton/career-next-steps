import type { Metadata } from 'next'
import NewContactForm from './NewContactForm'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Add Contact',
}

export default function NewContactPage() {
  return (
    <div className="page-container">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link href="/contacts" className="back-link" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>← Contacts</Link>
        <h1 className="page-title">Add contact</h1>
      </div>

      <NewContactForm />
    </div>
  )
}
