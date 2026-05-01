import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/admin'
import { z } from 'zod'

const Schema = z.object({ email: z.email() })

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Valid email required.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('newsletter_subscribers')
    .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
    .eq('email', parsed.data.email)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'You have been unsubscribed.' })
}
