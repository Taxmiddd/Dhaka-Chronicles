import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/admin'
import { getSession } from '@/lib/auth/session'

export async function GET(request: Request) {
  const session = await getSession()
  if (!session || !['admin', 'founder'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('id, email, name, status, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    console.error('[Admin Subscribers]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
