import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/admin'
import { RegisterSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'
import { createSession } from '@/lib/auth/session'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = RegisterSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, password, role } = validated.data

    // Check if user exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Insert user into Supabase
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert({
        full_name: name,
        email,
        password_hash: hashedPassword,
        role,
        is_active: true,
      })
      .select('id, email, full_name, role, avatar_url')
      .single()

    if (error || !newUser) {
      throw new Error(error?.message || 'Failed to create user')
    }

    // Create session
    await createSession({
      id: newUser.id,
      email: newUser.email,
      name: newUser.full_name || '',
      role: newUser.role,
      avatar_url: newUser.avatar_url
    })

    return NextResponse.json({ success: true, data: newUser })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
