'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

// ── Sign up ──────────────────────────────────────────────────────────────────

const signUpSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function signUp(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    const message = parsed.error.issues[0].message
    redirect(`/signup?error=${encodeURIComponent(message)}`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/confirm`,
    },
  })

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/signup?message=Check+your+email+to+confirm+your+account')
}

// ── Sign in ──────────────────────────────────────────────────────────────────

const signInSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
})

export async function signIn(formData: FormData) {
  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    const message = parsed.error.issues[0].message
    redirect(`/login?error=${encodeURIComponent(message)}`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/dashboard')
}

// ── Sign out ─────────────────────────────────────────────────────────────────

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

// ── Request password reset ────────────────────────────────────────────────────

const resetPasswordSchema = z.object({
  email: z.email('Enter a valid email address'),
})

export async function resetPassword(formData: FormData) {
  const parsed = resetPasswordSchema.safeParse({ email: formData.get('email') })

  if (!parsed.success) {
    const message = parsed.error.issues[0].message
    redirect(`/reset-password?error=${encodeURIComponent(message)}`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/auth/confirm?next=/reset-password/confirm`,
  })

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/reset-password?message=Check+your+email+for+a+password+reset+link')
}

// ── Update password (after reset link is clicked) ────────────────────────────

const updatePasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export async function updatePassword(formData: FormData) {
  const parsed = updatePasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!parsed.success) {
    const message = parsed.error.issues[0].message
    redirect(`/reset-password/confirm?error=${encodeURIComponent(message)}`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })

  if (error) {
    redirect(`/reset-password/confirm?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/dashboard')
}
