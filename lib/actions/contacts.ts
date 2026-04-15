'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// ── Schemas ───────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company: z.string(),
  email: z.email('Enter a valid email address').or(z.literal('')),
  phone: z.string(),
  next_contact_date: z.string().refine(
    (val) => !val || val >= new Date().toISOString().split('T')[0],
    { message: 'Next contact date cannot be in the past' },
  ),
})

const updateNoteSchema = z.object({
  notes: z.string().min(1, 'Notes are required'),
  occurred_at: z.string(), // ISO datetime or empty (defaults to now)
  new_next_contact_date: z.string(), // YYYY-MM-DD or empty
})

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getAuthenticatedClient() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect('/login')
  return { supabase, userId: data.claims.sub }
}

// ── Create contact ────────────────────────────────────────────────────────────

export type CreateContactState = { error: string } | null

export async function createContact(
  _prev: CreateContactState,
  formData: FormData,
): Promise<CreateContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    company: formData.get('company') ?? '',
    email: formData.get('email') ?? '',
    phone: formData.get('phone') ?? '',
    next_contact_date: formData.get('next_contact_date') ?? '',
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { supabase, userId } = await getAuthenticatedClient()

  const { data, error } = await supabase
    .from('contacts')
    .insert({
      user_id: userId,
      name: parsed.data.name,
      company: parsed.data.company || null,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      next_contact_date: parsed.data.next_contact_date || null,
    })
    .select('id')
    .single()

  if (error) {
    return { error: error.message }
  }

  redirect(`/contacts/${data.id}`)
}

// ── Update contact ────────────────────────────────────────────────────────────

export async function updateContact(id: string, formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    company: formData.get('company') ?? '',
    email: formData.get('email') ?? '',
    phone: formData.get('phone') ?? '',
    next_contact_date: formData.get('next_contact_date') ?? '',
  })

  if (!parsed.success) {
    const message = parsed.error.issues[0].message
    redirect(`/contacts/${id}?error=${encodeURIComponent(message)}`)
  }

  const { supabase } = await getAuthenticatedClient()

  const { error } = await supabase
    .from('contacts')
    .update({
      name: parsed.data.name,
      company: parsed.data.company || null,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      next_contact_date: parsed.data.next_contact_date || null,
    })
    .eq('id', id)

  if (error) {
    redirect(`/contacts/${id}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath(`/contacts/${id}`)
  revalidatePath('/contacts')
  revalidatePath('/dashboard')
  redirect(`/contacts/${id}?message=Contact+updated`)
}

// ── Delete contact ────────────────────────────────────────────────────────────

export async function deleteContact(id: string) {
  const { supabase } = await getAuthenticatedClient()

  const { error } = await supabase.from('contacts').delete().eq('id', id)

  if (error) {
    redirect(`/contacts/${id}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/contacts')
  revalidatePath('/dashboard')
  redirect('/contacts')
}

// ── Add update (note) to a contact ───────────────────────────────────────────

export async function addContactUpdate(contactId: string, formData: FormData) {
  const parsed = updateNoteSchema.safeParse({
    notes: formData.get('notes'),
    occurred_at: formData.get('occurred_at') ?? '',
    new_next_contact_date: formData.get('new_next_contact_date') ?? '',
  })

  if (!parsed.success) {
    const message = parsed.error.issues[0].message
    redirect(`/contacts/${contactId}?error=${encodeURIComponent(message)}`)
  }

  const { supabase, userId } = await getAuthenticatedClient()

  const { error } = await supabase.from('updates').insert({
    user_id: userId,
    contact_id: contactId,
    notes: parsed.data.notes,
    occurred_at: parsed.data.occurred_at || new Date().toISOString(),
    new_next_contact_date: parsed.data.new_next_contact_date || null,
  })

  if (error) {
    redirect(`/contacts/${contactId}?error=${encodeURIComponent(error.message)}`)
  }

  // If a new next_contact_date was provided, update the contact record too
  if (parsed.data.new_next_contact_date) {
    const { error: contactUpdateError } = await supabase
      .from('contacts')
      .update({ next_contact_date: parsed.data.new_next_contact_date })
      .eq('id', contactId)
    if (contactUpdateError) {
      redirect(`/contacts/${contactId}?error=${encodeURIComponent(contactUpdateError.message)}`)
    }
  }

  revalidatePath(`/contacts/${contactId}`)
  revalidatePath('/contacts')
  revalidatePath('/dashboard')
  redirect(`/contacts/${contactId}`)
}
