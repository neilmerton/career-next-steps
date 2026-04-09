import { createClient } from '@/lib/supabase/server'
import { getVacancy } from '@/lib/data/vacancies'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const result = await getVacancy(id)
  if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(result)
}
