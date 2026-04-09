'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { VacancyStatus, VacancySource } from '@/types/database'

// ── Schemas ───────────────────────────────────────────────────────────────────

const VACANCY_STATUSES: VacancyStatus[] = [
  'applied', 'interviewing', 'offered', 'rejected', 'withdrawn', 'accepted',
]

const VACANCY_SOURCES: VacancySource[] = [
  'linkedin', 'indeed', 'referral', 'company_website', 'recruiter', 'other',
]

const vacancySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string(),
  description: z.string(),
  date_applied: z.string(),
  status: z.enum(VACANCY_STATUSES as [VacancyStatus, ...VacancyStatus[]]),
  source: z.enum(VACANCY_SOURCES as [VacancySource, ...VacancySource[]]).or(z.literal('')),
  source_other: z.string(),
  contact_id: z.string(),
})

const updateNoteSchema = z.object({
  notes: z.string().min(1, 'Notes are required'),
  new_status: z.enum(VACANCY_STATUSES as [VacancyStatus, ...VacancyStatus[]]).or(z.literal('')),
  occurred_at: z.string(),
})

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getAuthenticatedClient() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect('/login')
  return { supabase, userId: data.claims.sub }
}

// ── Create vacancy ────────────────────────────────────────────────────────────

export async function createVacancy(formData: FormData) {
  const parsed = vacancySchema.safeParse({
    title: formData.get('title'),
    company: formData.get('company') ?? '',
    description: formData.get('description') ?? '',
    date_applied: formData.get('date_applied') ?? '',
    status: formData.get('status') ?? 'applied',
    source: formData.get('source') ?? '',
    source_other: formData.get('source_other') ?? '',
    contact_id: formData.get('contact_id') ?? '',
  })

  if (!parsed.success) {
    const message = parsed.error.issues[0].message
    redirect(`/vacancies/new?error=${encodeURIComponent(message)}`)
  }

  const { supabase, userId } = await getAuthenticatedClient()

  const { data, error } = await supabase
    .from('job_vacancies')
    .insert({
      user_id: userId,
      title: parsed.data.title,
      company: parsed.data.company || null,
      description: parsed.data.description || null,
      date_applied: parsed.data.date_applied || null,
      status: parsed.data.status,
      source: parsed.data.source || null,
      source_other: parsed.data.source_other || null,
      contact_id: parsed.data.contact_id || null,
    })
    .select('id')
    .single()

  if (error) {
    redirect(`/vacancies/new?error=${encodeURIComponent(error.message)}`)
  }

  redirect(`/vacancies/${data.id}`)
}

// ── Update vacancy fields ─────────────────────────────────────────────────────

export async function updateVacancy(id: string, formData: FormData) {
  const parsed = vacancySchema.safeParse({
    title: formData.get('title'),
    company: formData.get('company') ?? '',
    description: formData.get('description') ?? '',
    date_applied: formData.get('date_applied') ?? '',
    status: formData.get('status') ?? 'applied',
    source: formData.get('source') ?? '',
    source_other: formData.get('source_other') ?? '',
    contact_id: formData.get('contact_id') ?? '',
  })

  if (!parsed.success) {
    const message = parsed.error.issues[0].message
    redirect(`/vacancies/${id}?error=${encodeURIComponent(message)}`)
  }

  const { supabase } = await getAuthenticatedClient()

  const { error } = await supabase
    .from('job_vacancies')
    .update({
      title: parsed.data.title,
      company: parsed.data.company || null,
      description: parsed.data.description || null,
      date_applied: parsed.data.date_applied || null,
      status: parsed.data.status,
      source: parsed.data.source || null,
      source_other: parsed.data.source_other || null,
      contact_id: parsed.data.contact_id || null,
    })
    .eq('id', id)

  if (error) {
    redirect(`/vacancies/${id}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath(`/vacancies/${id}`)
  revalidatePath('/vacancies')
  revalidatePath('/dashboard')
  redirect(`/vacancies/${id}?message=Vacancy+updated`)
}

// ── Delete vacancy ────────────────────────────────────────────────────────────

export async function deleteVacancy(id: string) {
  const { supabase } = await getAuthenticatedClient()

  const { error } = await supabase.from('job_vacancies').delete().eq('id', id)

  if (error) {
    redirect(`/vacancies/${id}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/vacancies')
  revalidatePath('/dashboard')
  redirect('/vacancies')
}

// ── Add update / change status ────────────────────────────────────────────────

export async function addVacancyUpdate(vacancyId: string, formData: FormData) {
  const parsed = updateNoteSchema.safeParse({
    notes: formData.get('notes'),
    new_status: formData.get('new_status') ?? '',
    occurred_at: formData.get('occurred_at') ?? '',
  })

  if (!parsed.success) {
    const message = parsed.error.issues[0].message
    redirect(`/vacancies/${vacancyId}?error=${encodeURIComponent(message)}`)
  }

  const { supabase, userId } = await getAuthenticatedClient()

  const newStatus = parsed.data.new_status || null

  const { error } = await supabase.from('updates').insert({
    user_id: userId,
    job_vacancy_id: vacancyId,
    notes: parsed.data.notes,
    occurred_at: parsed.data.occurred_at || new Date().toISOString(),
    new_status: newStatus,
  })

  if (error) {
    redirect(`/vacancies/${vacancyId}?error=${encodeURIComponent(error.message)}`)
  }

  // If a status change was requested, update the vacancy record too
  if (newStatus) {
    const { error: vacancyUpdateError } = await supabase
      .from('job_vacancies')
      .update({ status: newStatus })
      .eq('id', vacancyId)
    if (vacancyUpdateError) {
      redirect(`/vacancies/${vacancyId}?error=${encodeURIComponent(vacancyUpdateError.message)}`)
    }
  }

  revalidatePath(`/vacancies/${vacancyId}`)
  revalidatePath('/vacancies')
  revalidatePath('/dashboard')
  redirect(`/vacancies/${vacancyId}`)
}
