import { supabaseAdmin } from '@/lib/db/admin'
import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { sendEmail } from '@/lib/email/resend'

export const dynamic = 'force-dynamic'

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!)
const RESET_TTL_MS = 60 * 60 * 1000 // 1 hour

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}))

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  // Always return 200 to prevent email enumeration
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, email, name')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (!user) {
    return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' })
  }

  // Generate a signed reset token (JWT)
  const token = await new SignJWT({ userId: user.id, email: user.email, purpose: 'password_reset' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(SECRET)

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://dhakachronicles.com'}/reset-password?token=${token}`

  // Send the email using Resend
  await sendEmail({
    to: user.email,
    subject: 'Password Reset - Dhaka Chronicles',
    html: `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
        <h2>Password Reset</h2>
        <p>Hello ${user.name || 'User'},</p>
        <p>We received a request to reset your password for your Dhaka Chronicles account.</p>
        <p>Click the button below to set a new password. This link will expire in 1 hour.</p>
        <div style="margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #00A651; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">Dhaka Chronicles</p>
      </div>
    `,
  })

  // Store token hash in DB for invalidation after use
  await supabaseAdmin.from('site_settings').upsert({
    key: `pw_reset_${user.id}`,
    value: { token_issued_at: new Date().toISOString(), expires_at: new Date(Date.now() + RESET_TTL_MS).toISOString() },
    description: 'Password reset token tracking',
    category: 'auth',
  })

  return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' })
}
