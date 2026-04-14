import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getContact } from '@/lib/data/contacts'
import { updateContact, deleteContact, addContactUpdate } from '@/lib/actions/contacts'
import { formatDate } from '@/lib/utils/dates'
import ConfirmDialog from '@/components/ConfirmDialog'
import DangerZone from '@/components/DangerZone'
import SubmitButton from '@/components/SubmitButton'
import Timeline from '@/components/Timeline'
import styles from './detail.module.css'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; message?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const result = await getContact(id)
  return { title: result?.contact.name ?? 'Contact' }
}

export default async function ContactDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const { error, message } = await searchParams

  const result = await getContact(id)
  if (!result) notFound()

  const { contact, updates } = result

  const boundUpdateContact = updateContact.bind(null, id)
  const boundDeleteContact = deleteContact.bind(null, id)
  const boundAddUpdate = addContactUpdate.bind(null, id)


  return (
    <div className="page-container">
      <Link href="/contacts" className={`back-link ${styles.back}`}>← Contacts</Link>

      {error && <p className="alert-error">{error}</p>}
      {message && <p className="alert-success">{message}</p>}

      {/* ── Add update ──────────────────────────────────── */}
      <section className={styles.section}>
        <h1 className={styles.title}>{contact.name}</h1>
        <h2 className="section-title">Add update</h2>
        <form action={boundAddUpdate} className="form-stack">
          <div className="form-field">
            <label htmlFor="notes" className="form-label">Notes <span className="form-required">*</span></label>
            <textarea
              id="notes" name="notes" rows={3} required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="occurred_at" className="form-label">Date &amp; time <span className="form-hint">(leave blank for now)</span></label>
              <input
                id="occurred_at" name="occurred_at" type="datetime-local" placeholder=" "
              />
            </div>
            <div className="form-field">
              <label htmlFor="new_next_contact_date" className="form-label">New next contact date <span className="form-hint">(optional)</span></label>
              <input
                id="new_next_contact_date" name="new_next_contact_date" type="date"
              />
            </div>
          </div>

          <div className="form-actions">
            <SubmitButton label="Add update" pendingLabel="Saving…" className="btn-primary" />
          </div>
        </form>
      </section>

      {/* ── Update history ──────────────────────────────── */}
      {updates && updates.length > 0 && (
        <section className={styles.section}>
          <h2 className="section-title">History</h2>
          <Timeline items={updates.map((u) => ({
            id: u.id,
            occurred_at: u.occurred_at,
            notes: u.notes,
            meta: u.new_next_contact_date
              ? `Next contact date set to ${formatDate(u.new_next_contact_date)}`
              : undefined,
          }))} />
        </section>
      )}

      {/* ── Edit contact ────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className="section-title">Edit contact</h2>
        <form action={boundUpdateContact} className="form-stack">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="name" className="form-label">Name <span className="form-required">*</span></label>
              <input
                id="name" name="name" type="text"
                defaultValue={contact.name} required
              />
            </div>
            <div className="form-field">
              <label htmlFor="next_contact_date" className="form-label">Next contact date</label>
              <input
                id="next_contact_date" name="next_contact_date" type="date"
                defaultValue={contact.next_contact_date ?? ''}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="company" className="form-label">Company</label>
            <input
              id="company" name="company" type="text"
              defaultValue={contact.company ?? ''}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email" name="email" type="email"
                defaultValue={contact.email ?? ''}
              />
            </div>
            <div className="form-field">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                id="phone" name="phone" type="tel"
                defaultValue={contact.phone ?? ''}
              />
            </div>
          </div>

          <div className="form-actions">
            <SubmitButton label="Save changes" pendingLabel="Saving…" className="btn-primary" />
          </div>
        </form>
      </section>

      {/* ── Delete ──────────────────────────────────────── */}
      <DangerZone
        title="Delete contact"
        description="This will permanently delete the contact and all associated updates."
      >
        <ConfirmDialog entity="contact" action={boundDeleteContact} />
      </DangerZone>
    </div>
  )
}
