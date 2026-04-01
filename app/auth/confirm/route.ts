import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/dashboard'

  // Prevent open-redirect attacks — only allow relative paths
  if (!next.startsWith('/')) {
    next = '/dashboard'
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const base =
        forwardedHost ? `https://${forwardedHost}` : origin
      return NextResponse.redirect(`${base}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Could+not+confirm+your+account`)
}
