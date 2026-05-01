import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/admin'
import { LoginSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'
import { createSession } from '@/lib/auth/session'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = LoginSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 400 }
      )
    }

    const { email, password } = validated.data

    // Find user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      // Note: the schema in implementation.md didn't specify the password field explicitly in the SQL,
      // but typically we'll store it as 'password_hash'. We will select it here.
      .select('id, email, full_name, role, avatar_url, password_hash, is_active')
      .eq('email', email)
      .single()

    if (error || !user || !user.password_hash) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    if (!user.is_active) {
      return NextResponse.json(
        { success: false, error: 'Account is deactivated.' },
        { status: 403 }
      )
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    // Create session
    await createSession({
      id: user.id,
      email: user.email,
      name: user.full_name || '',
      role: user.role,
      avatar_url: user.avatar_url
    })

    // Update last login
    await supabaseAdmin
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id)

    return NextResponse.json({ success: true, redirect: '/admin/dashboard' })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
