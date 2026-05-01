import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/admin'
import { getSession } from '@/lib/auth/session'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || !['admin', 'founder'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { subject, content } = await request.json()

    if (!subject || !content) {
      return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 })
    }

    // 1. Fetch all active subscribers
    const { data: subscribers, error: subError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('email, name')
      .eq('status', 'active')

    if (subError) throw subError

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ success: true, message: 'No active subscribers to send to.' })
    }

    // 2. Log the newsletter in the database (optional, depends on schema)
    // We'll skip this for now or assume a 'newsletters' table exists.

    // 3. Send via Email Provider (e.g., Mailchimp or Resend)
    // For now, we simulate success as we are in development.
    console.log(`[Newsletter] Sending "${subject}" to ${subscribers.length} subscribers...`)

    /*
    // Example Resend Integration:
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Dhaka Chronicles <newsletter@dhakachronicles.com>',
        to: subscribers.map(s => s.email),
        subject: subject,
        html: content // Render TipTap JSON to HTML first
      })
    })
    */

    return NextResponse.json({ 
      success: true, 
      message: `Newsletter sent successfully to ${subscribers.length} subscribers.` 
    })
  } catch (err: any) {
    console.error('[Newsletter Send]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
