import { v2 as cloudinary } from 'cloudinary'
import { getSession } from '@/lib/auth/session'
import { supabaseAdmin } from '@/lib/db/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/** GET /api/admin/media — List media from DB (synced with Cloudinary) */
export async function GET() {
  const user = await getSession()
  if (!user || !['founder', 'admin', 'publisher'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await supabaseAdmin
    .from('media')
    .select('*, uploader:users(full_name)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ media: data ?? [] })
}

/** POST /api/admin/media — Upload base64 image to Cloudinary and insert into DB */
export async function POST(req: Request) {
  const user = await getSession()
  if (!user || !['founder', 'admin', 'publisher'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { file, folder = 'dhaka_chronicles' } = await req.json()

    if (!file) {
      return NextResponse.json({ error: 'File data is required' }, { status: 400 })
    }

    // Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(file, { folder })

    // Save to DB
    const { data: mediaRecord, error } = await supabaseAdmin
      .from('media')
      .insert({
        file_name: uploadRes.original_filename || uploadRes.public_id,
        file_url: uploadRes.secure_url,
        file_type: uploadRes.format,
        file_size: uploadRes.bytes,
        uploaded_by: user.id,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    return NextResponse.json({ success: true, media: mediaRecord }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/** DELETE /api/admin/media — Bulk delete media from DB and Cloudinary */
export async function DELETE(req: Request) {
  const user = await getSession()
  if (!user || !['founder', 'admin'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const ids = searchParams.get('ids')?.split(',')

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 })
    }

    // 1. Fetch records to get file_urls for Cloudinary public_id extraction
    const { data: mediaRecords } = await supabaseAdmin
      .from('media')
      .select('id, file_url')
      .in('id', ids)

    if (mediaRecords && mediaRecords.length > 0) {
      const publicIds = mediaRecords.map(record => {
        // Extract public_id from Cloudinary URL:
        // https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
        // public_id = folder/filename (without extension)
        const parts = record.file_url.split('/')
        const filenameWithExt = parts.pop() || ''
        const folder = parts.pop() || ''
        const filename = filenameWithExt.split('.')[0]
        return `${folder}/${filename}`
      })

      // 2. Delete from Cloudinary (API allows bulk delete by public_ids, max 100)
      if (publicIds.length > 0) {
        await cloudinary.api.delete_resources(publicIds)
      }
    }

    // 3. Delete from DB
    const { error } = await supabaseAdmin.from('media').delete().in('id', ids)
    if (error) throw new Error(error.message)

    return NextResponse.json({ success: true, deleted: ids.length })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
