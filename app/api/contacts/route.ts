import { createClient } from '@/lib/supabase/server'
import { getContacts } from '@/lib/data/contacts'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const contacts = await getContacts()
  return NextResponse.json(contacts)
}
