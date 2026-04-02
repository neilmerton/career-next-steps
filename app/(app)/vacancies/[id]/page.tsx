import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getVacancy } from '@/lib/data/vacancies'
import { updateVacancy, deleteVacancy, addVacancyUpdate } from '@/lib/actions/vacancies'
import { ALL_STATUSES, ALL_SOURCES, STATUS_LABELS, SOURCE_LABELS } from '@/lib/utils/vacancies'
import { formatDateTime } from '@/lib/utils/dates'
import styles from './detail.module.css'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; message?: string }>
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
    <div className={styles.page}>
      <Link href="/vacancies" className={styles.back}>← Job Vacancies</Link>

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.message}>{message}</p>}

      {/* ── Add update / change status ───────────────────── */}
      <section className={styles.section}>
        <h1 className={styles.title}>{vacancy.title}</h1>
        {vacancy.description && <p className={styles.description}>{vacancy.description}</p>}
        <h2 className={styles.sectionTitle}>Add update</h2>
        <form action={boundAddUpdate} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="notes" className={styles.label}>Notes <span className={styles.required}>*</span></label>
            <textarea id="notes" name="notes" rows={3} required className={styles.textarea} />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="new_status" className={styles.label}>Change status <span className={styles.hint}>(optional)</span></label>
              <select id="new_status" name="new_status" className={styles.select}>
                <option value="">— No change —</option>
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="occurred_at" className={styles.label}>Date &amp; time <span className={styles.hint}>(leave blank for now)</span></label>
              <input id="occurred_at" name="occurred_at" type="datetime-local" className={styles.input} />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>Add update</button>
          </div>
        </form>
      </section>

      {/* ── Update history ───────────────────────────────── */}
      {updates && updates.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>History</h2>
          <ol className={styles.timeline}>
            {updates.map((u) => (
              <li key={u.id} className={styles.timelineItem}>
                <span className={styles.timelineDate}>{formatDateTime(u.occurred_at)}</span>
                <p className={styles.timelineNotes}>{u.notes}</p>
                {u.new_status && (
                  <p className={styles.timelineMeta}>
                    Status changed to {STATUS_LABELS[u.new_status]}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── Edit vacancy ─────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Edit job vacancy</h2>
        <form action={boundUpdateVacancy} className={styles.form}>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="title" className={styles.label}>Job title <span className={styles.required}>*</span></label>
              <input
                id="title" name="title" type="text"
                defaultValue={vacancy.title} required
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="company" className={styles.label}>Company</label>
              <input
                id="company" name="company" type="text"
                defaultValue={vacancy.company ?? ''}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="status" className={styles.label}>Status</label>
              <select id="status" name="status" defaultValue={vacancy.status} className={styles.select}>
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="date_applied" className={styles.label}>Date applied</label>
              <input
                id="date_applied" name="date_applied" type="date"
                defaultValue={vacancy.date_applied ?? ''}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="source" className={styles.label}>Source</label>
              <select id="source" name="source" defaultValue={vacancy.source ?? ''} className={styles.select}>
                <option value="">— Select —</option>
                {ALL_SOURCES.map((s) => (
                  <option key={s} value={s}>{SOURCE_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="source_other" className={styles.label}>Source detail <span className={styles.hint}>(if Other)</span></label>
              <input
                id="source_other" name="source_other" type="text"
                defaultValue={vacancy.source_other ?? ''}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="contact_id" className={styles.label}>Contact</label>
            <select id="contact_id" name="contact_id" defaultValue={vacancy.contact_id ?? ''} className={styles.select}>
              <option value="">— None —</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>Notes / description</label>
            <textarea
              id="description" name="description" rows={6}
              defaultValue={vacancy.description ?? ''}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>Save changes</button>
          </div>
        </form>
      </section>

      {/* ── Delete ──────────────────────────────────────── */}
      <section className={styles.dangerZone}>
        <h2 className={styles.dangerTitle}>Delete vacancy</h2>
        <p className={styles.dangerText}>
          This will permanently delete the vacancy and all associated updates.
          The linked contact will not be affected.
        </p>
        <form action={boundDeleteVacancy}>
          <button type="submit" className={styles.deleteButton}>Delete vacancy</button>
        </form>
      </section>
    </div>
  )
}
