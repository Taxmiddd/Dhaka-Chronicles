import { supabaseAdmin } from '@/lib/db/admin'
import { getSession, updateSession } from '@/lib/auth/session'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

/** GET /api/profile — get current user profile */
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, email, full_name, role, avatar_url, bio, phone, facebook_url, twitter_url, linkedin_url')
    .eq('id', session.id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ profile: data })
}

/** PATCH /api/profile — update current user profile */
export async function PATCH(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  
  // Extract only allowed fields
  const {
    full_name,
    bio,
    phone,
    avatar_url,
    facebook_url,
    twitter_url,
    linkedin_url,
    current_password,
    new_password
  } = body

  // If changing password, verify current password first
  if (new_password) {
    if (!current_password) {
      return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 })
    }
    
    // Fetch full user record to check password hash
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('password_hash')
      .eq('id', session.id)
      .single()
      
    if (!user || !user.password_hash) {
      return NextResponse.json({ error: 'Cannot update password' }, { status: 400 })
    }
    
    const isValid = await bcrypt.compare(current_password, user.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }
    
    if (new_password.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
    }
  }

  const updateData: any = { updated_at: new Date().toISOString() }
  
  if (full_name !== undefined) updateData.full_name = full_name
  if (bio !== undefined) updateData.bio = bio
  if (phone !== undefined) updateData.phone = phone
  if (avatar_url !== undefined) updateData.avatar_url = avatar_url
  if (facebook_url !== undefined) updateData.facebook_url = facebook_url
  if (twitter_url !== undefined) updateData.twitter_url = twitter_url
  if (linkedin_url !== undefined) updateData.linkedin_url = linkedin_url
  
  if (new_password) {
    updateData.password_hash = await bcrypt.hash(new_password, 12)
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .update(updateData)
    .eq('id', session.id)
    .select('id, email, full_name, role, avatar_url, bio, phone, facebook_url, twitter_url, linkedin_url')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  // If name or avatar changed, we might need to refresh the session token,
  // but usually session just holds basic info. Let's trigger a session update.
  if (full_name !== undefined || avatar_url !== undefined) {
    // In our implementation, session update doesn't automatically refetch from DB,
    // so we skip it or update the session manually. We'll rely on client-side state for now.
  }

  return NextResponse.json({ success: true, profile: data })
}
