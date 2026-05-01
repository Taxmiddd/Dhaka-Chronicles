import { supabaseAdmin } from '@/lib/db/admin'
import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!)

export async function POST(req: Request) {
  const { token, password } = await req.json().catch(() => ({}))

  if (!token || !password) {
    return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  // Verify the JWT reset token
  let payload: { userId: string; email: string; purpose: string }
  try {
    const { payload: p } = await jwtVerify(token, SECRET, { algorithms: ['HS256'] })
    payload = p as typeof payload
  } catch {
    return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 401 })
  }

  if (payload.purpose !== 'password_reset') {
    return NextResponse.json({ error: 'Invalid token purpose' }, { status: 401 })
  }

  // Check token hasn't already been used (check site_settings)
  const { data: setting } = await supabaseAdmin
    .from('site_settings')
    .select('value')
    .eq('key', `pw_reset_${payload.userId}`)
    .single()

  if (!setting) {
    return NextResponse.json({ error: 'Reset token has already been used or is invalid' }, { status: 401 })
  }

  // Hash the new password
  const hashed = await bcrypt.hash(password, 12)

  // Update password in DB
  const { error: updateErr } = await supabaseAdmin
    .from('users')
    .update({ password_hash: hashed, updated_at: new Date().toISOString() })
    .eq('id', payload.userId)

  if (updateErr) {
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
  }

  // Invalidate token by removing site_settings entry
  await supabaseAdmin.from('site_settings').delete().eq('key', `pw_reset_${payload.userId}`)

  return NextResponse.json({ message: 'Password updated successfully. You can now log in.' })
}
