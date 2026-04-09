import { createClient } from '@/lib/supabase/server'
import { getDashboardData } from '@/lib/data/dashboard'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dashboardData = await getDashboardData()
  return NextResponse.json(dashboardData)
}
