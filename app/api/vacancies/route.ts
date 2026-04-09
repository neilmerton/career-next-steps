import { createClient } from '@/lib/supabase/server'
import { getVacancies } from '@/lib/data/vacancies'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const vacancies = await getVacancies()
  return NextResponse.json(vacancies)
}
