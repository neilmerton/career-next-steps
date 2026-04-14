import ConfirmDialog from '@/components/ConfirmDialog'
import DangerZone from '@/components/DangerZone'
import SubmitButton from '@/components/SubmitButton'
import Timeline from '@/components/Timeline'
import { addVacancyUpdate, deleteVacancy, updateVacancy } from '@/lib/actions/vacancies'
import { getVacancy } from '@/lib/data/vacancies'
import { ALL_SOURCES, ALL_STATUSES, SOURCE_LABELS, STATUS_LABELS } from '@/lib/utils/vacancies'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import styles from './detail.module.css'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; message?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const result = await getVacancy(id)
  return { title: result?.vacancy.title ?? 'Vacancy' }
}

export default async function VacancyDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const { error, message } = await searchParams

  const result = await getVacancy(id)
  if (!result) notFound()

  const { vacancy, updates, contacts } = result

  const boundUpdateVacancy = updateVacancy.bind(null, id)
  const boundDeleteVacancy = deleteVacancy.bind(null, id)
  const boundAddUpdate = addVacancyUpdate.bind(null, id)


  return (
    <div className="page-container">
      <Link href="/vacancies" className={`back-link ${styles.back}`}>← Vacancies</Link>

      {error && <p className="alert-error">{error}</p>}
      {message && <p className="alert-success">{message}</p>}

      {/* ── Add update / change status ───────────────────── */}
      <section className={styles.section}>
        <h1 className={styles.title}>{vacancy.title}</h1>
        {vacancy.description && <p className={styles.description}>{vacancy.description}</p>}
        <h2 className="section-title">Add update</h2>
        <form action={boundAddUpdate} className="form-stack">
          <div className="form-field">
            <label htmlFor="notes" className="form-label">Notes <span className="form-required">*</span></label>
            <textarea id="notes" name="notes" rows={3} required />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="new_status" className="form-label">Change status <span className="form-hint">(optional)</span></label>
              <select id="new_status" name="new_status">
                <option value="">— No change —</option>
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="occurred_at" className="form-label">Date &amp; time <span className="form-hint">(leave blank for now)</span></label>
              <input id="occurred_at" name="occurred_at" type="datetime-local" placeholder=" " />
            </div>
          </div>

          <div className="form-actions">
            <SubmitButton label="Add update" pendingLabel="Saving…" className="btn-primary" />
          </div>
        </form>
      </section>

      {/* ── Update history ───────────────────────────────── */}
      {updates && updates.length > 0 && (
        <section className={styles.section}>
          <h2 className="section-title">History</h2>
          <Timeline items={updates.map((u) => ({
            id: u.id,
            occurred_at: u.occurred_at,
            notes: u.notes,
            meta: u.new_status ? `Status changed to ${STATUS_LABELS[u.new_status]}` : undefined,
          }))} />
        </section>
      )}

      {/* ── Edit vacancy ─────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className="section-title">Edit job vacancy</h2>
        <form action={boundUpdateVacancy} className="form-stack">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="title" className="form-label">Job title <span className="form-required">*</span></label>
              <input
                id="title" name="title" type="text"
                defaultValue={vacancy.title} required
              />
            </div>
            <div className="form-field">
              <label htmlFor="company" className="form-label">Company</label>
              <input
                id="company" name="company" type="text"
                defaultValue={vacancy.company ?? ''}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="status" className="form-label">Status</label>
              <select id="status" name="status" defaultValue={vacancy.status}>
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="date_applied" className="form-label">Date applied</label>
              <input
                id="date_applied" name="date_applied" type="date"
                defaultValue={vacancy.date_applied ?? ''}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="source" className="form-label">Source</label>
              <select id="source" name="source" defaultValue={vacancy.source ?? ''}>
                <option value="">— Select —</option>
                {ALL_SOURCES.map((s) => (
                  <option key={s} value={s}>{SOURCE_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="source_other" className="form-label">Source detail <span className="form-hint">(if Other)</span></label>
              <input
                id="source_other" name="source_other" type="text"
                defaultValue={vacancy.source_other ?? ''}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="contact_id" className="form-label">Contact</label>
            <select id="contact_id" name="contact_id" defaultValue={vacancy.contact_id ?? ''}>
              <option value="">— None —</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="description" className="form-label">Notes / description</label>
            <textarea
              id="description" name="description" rows={6}
              defaultValue={vacancy.description ?? ''}
            />
          </div>

          <div className="form-actions">
            <SubmitButton label="Save changes" pendingLabel="Saving…" className="btn-primary" />
          </div>
        </form>
      </section>

      {/* ── Delete ──────────────────────────────────────── */}
      <DangerZone
        title="Delete vacancy"
        description="This will permanently delete the vacancy and all associated updates. The linked contact will not be affected."
      >
        <ConfirmDialog entity="vacancy" action={boundDeleteVacancy} />
      </DangerZone>
    </div>
  )
}
