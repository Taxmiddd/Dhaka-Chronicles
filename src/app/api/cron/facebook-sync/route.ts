import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/admin'

const PAGE_ID = process.env.FACEBOOK_PAGE_ID
const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN

export async function GET(request: Request) {
  // Optional: Verify cron secret if triggered externally via Vercel Cron
  // const authHeader = request.headers.get('authorization')
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response('Unauthorized', { status: 401 })
  // }

  if (!PAGE_ID || !ACCESS_TOKEN) {
    return NextResponse.json({ error: 'Missing Facebook credentials' }, { status: 500 })
  }

  try {
    // Fetch latest posts from the Facebook Page feed
    // We request attachments to get images/videos and standard fields
    const fbApiUrl = `https://graph.facebook.com/v19.0/${PAGE_ID}/posts?fields=id,message,created_time,permalink_url,attachments,status_type&access_token=${ACCESS_TOKEN}&limit=10`
    
    const response = await fetch(fbApiUrl)
    if (!response.ok) {
      const err = await response.text()
      console.error('FB API Error:', err)
      return NextResponse.json({ error: 'Failed to fetch from Facebook' }, { status: 500 })
    }

    const json = await response.json()
    const posts = json.data || []
    
    let importedCount = 0

    for (const post of posts) {
      const facebookPostId = post.id
      const message = post.message || ''
      const link = post.permalink_url || ''
      const createdTime = post.created_time
      
      // Determine type and media URL from attachments
      let postType = 'status'
      let imageUrl = ''
      let videoUrl = ''

      if (post.attachments?.data?.[0]) {
        const attachment = post.attachments.data[0]
        if (attachment.type === 'photo' || attachment.type === 'album') {
          postType = 'photo'
          imageUrl = attachment.media?.image?.src || ''
        } else if (attachment.type === 'video' || attachment.type === 'video_inline') {
          postType = 'video'
          videoUrl = attachment.url || ''
          imageUrl = attachment.media?.image?.src || '' // thumbnail
        } else if (attachment.type === 'share' || attachment.type === 'share_link') {
          postType = 'link'
          imageUrl = attachment.media?.image?.src || ''
        }
      }

      // Try inserting
      const { error } = await supabaseAdmin
        .from('facebook_imported_posts')
        .insert({
          facebook_post_id: facebookPostId,
          message,
          link,
          image_url: imageUrl,
          video_url: videoUrl,
          post_type: postType,
          created_time: createdTime,
          import_status: 'pending'
        })
      
      if (!error) {
        importedCount++
      } else if (error.code !== '23505') {
        // Log non-duplicate errors
        console.error('Insert error for post', facebookPostId, error.message)
      }
    }

    return NextResponse.json({ success: true, processed: posts.length, newly_imported: importedCount })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
