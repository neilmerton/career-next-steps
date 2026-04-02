import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getContact } from '@/lib/data/contacts'
import { updateContact, deleteContact, addContactUpdate } from '@/lib/actions/contacts'
import { formatDate, formatDateTime } from '@/lib/utils/dates'
import styles from './detail.module.css'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; message?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('contacts')
    .select('name')
    .eq('id', id)
    .single()

  return { title: data?.name ?? 'Contact' }
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
    <div className={styles.page}>
      <Link href="/contacts" className={styles.back}>← Contacts</Link>

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.message}>{message}</p>}

      {/* ── Add update ──────────────────────────────────── */}
      <section className={styles.section}>
        <h1 className={styles.title}>{contact.name}</h1>
        <h2 className={styles.sectionTitle}>Add update</h2>
        <form action={boundAddUpdate} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="notes" className={styles.label}>Notes <span className={styles.required}>*</span></label>
            <textarea
              id="notes" name="notes" rows={3} required
              className={styles.textarea}
            />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="occurred_at" className={styles.label}>Date &amp; time <span className={styles.hint}>(leave blank for now)</span></label>
              <input
                id="occurred_at" name="occurred_at" type="datetime-local"
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="new_next_contact_date" className={styles.label}>New next contact date <span className={styles.hint}>(optional)</span></label>
              <input
                id="new_next_contact_date" name="new_next_contact_date" type="date"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>Add update</button>
          </div>
        </form>
      </section>

      {/* ── Update history ──────────────────────────────── */}
      {updates && updates.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>History</h2>
          <ol className={styles.timeline}>
            {updates.map((u) => (
              <li key={u.id} className={styles.timelineItem}>
                <span className={styles.timelineDate}>{formatDateTime(u.occurred_at)}</span>
                <p className={styles.timelineNotes}>{u.notes}</p>
                {u.new_next_contact_date && (
                  <p className={styles.timelineMeta}>
                    Next contact date set to {formatDate(u.new_next_contact_date)}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── Edit contact ────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Edit contact</h2>
        <form action={boundUpdateContact} className={styles.form}>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>Name <span className={styles.required}>*</span></label>
              <input
                id="name" name="name" type="text"
                defaultValue={contact.name} required
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="next_contact_date" className={styles.label}>Next contact date</label>
              <input
                id="next_contact_date" name="next_contact_date" type="date"
                defaultValue={contact.next_contact_date ?? ''}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="company" className={styles.label}>Company</label>
            <input
              id="company" name="company" type="text"
              defaultValue={contact.company ?? ''}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                id="email" name="email" type="email"
                defaultValue={contact.email ?? ''}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="phone" className={styles.label}>Phone</label>
              <input
                id="phone" name="phone" type="tel"
                defaultValue={contact.phone ?? ''}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>Save changes</button>
          </div>
        </form>
      </section>

      {/* ── Delete ──────────────────────────────────────── */}
      <section className={styles.dangerZone}>
        <h2 className={styles.dangerTitle}>Delete contact</h2>
        <p className={styles.dangerText}>
          This will permanently delete the contact and all associated updates.
        </p>
        <form action={boundDeleteContact}>
          <button type="submit" className={styles.deleteButton}>Delete contact</button>
        </form>
      </section>
    </div>
  )
}
