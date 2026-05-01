import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/db/admin'

const VERIFY_TOKEN = process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN
const APP_SECRET = process.env.FACEBOOK_APP_SECRET

// Meta Webhook Verification (GET)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED')
      return new NextResponse(challenge, { status: 200 })
    } else {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  return new NextResponse('Bad Request', { status: 400 })
}

// Meta Webhook Payload (POST)
export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-hub-signature-256')

    // 1. Verify Signature
    if (APP_SECRET && signature) {
      const expectedSignature = 'sha256=' + crypto.createHmac('sha256', APP_SECRET).update(rawBody).digest('hex')
      if (signature !== expectedSignature) {
        console.error('Invalid signature')
        return new NextResponse('Invalid signature', { status: 401 })
      }
    } else if (APP_SECRET && !signature) {
      console.warn('Missing signature but APP_SECRET is set')
      return new NextResponse('Missing signature', { status: 401 })
    }

    // 2. Parse Payload
    const body = JSON.parse(rawBody)

    // Check if it's a page event
    if (body.object === 'page') {
      for (const entry of body.entry) {
        const changes = entry.changes

        if (changes) {
          for (const change of changes) {
            // We only care about feed updates (new posts)
            if (change.field === 'feed') {
              const item = change.value

              // Process only statuses, photos, videos, or links created by the page itself
              if (['status', 'photo', 'video', 'link'].includes(item.item) && item.verb === 'add') {
                
                // Extract post details
                const facebookPostId = item.post_id
                const message = item.message || ''
                const link = item.link || ''
                const postType = item.item
                const createdTime = new Date(item.created_time * 1000).toISOString()
                
                // Images/Videos might be in attachments (needs further Graph API calls in a real prod app)
                // For webhooks, photos usually come with a link or image URL if expanded.
                const imageUrl = item.photo_id ? `https://graph.facebook.com/v19.0/${item.photo_id}/picture` : (item.link && item.item === 'photo' ? item.link : '')
                const videoUrl = item.item === 'video' ? item.video_id : ''

                // Insert into facebook_imported_posts as pending
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
                  // Use ON CONFLICT DO NOTHING to avoid duplicate processing
                  // Unfortunately, standard insert doesn't support UPSERT without .upsert()
                  // So we will just try to insert and catch duplicate errors gracefully
                
                if (error && error.code !== '23505') { // 23505 is unique violation
                  console.error('Error inserting FB post:', error.message)
                }
              }
            }
          }
        }
      }

      return new NextResponse('EVENT_RECEIVED', { status: 200 })
    }

    return new NextResponse('Not a page event', { status: 404 })
  } catch (err) {
    console.error('Webhook error:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
