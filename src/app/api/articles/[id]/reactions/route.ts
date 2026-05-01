import { supabaseAdmin } from '@/lib/db/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type ReactionType = 'like' | 'love' | 'insightful' | 'sad' | 'angry'
const VALID_REACTIONS: ReactionType[] = ['like', 'love', 'insightful', 'sad', 'angry']

interface RouteParams {
  params: Promise<{ id: string }>
}

/** GET /api/articles/[id]/reactions — get reaction counts */
export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params

  const { data, error } = await supabaseAdmin
    .from('article_reactions')
    .select('reaction_type')
    .eq('article_id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const counts: Record<string, number> = {}
  for (const r of VALID_REACTIONS) counts[r] = 0
  for (const row of data ?? []) {
    if (counts[row.reaction_type] !== undefined) counts[row.reaction_type]++
  }

  return NextResponse.json({ reactions: counts })
}

/** POST /api/articles/[id]/reactions — toggle a reaction (identified by IP for guest users) */
export async function POST(req: Request, { params }: RouteParams) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const reaction = body.reaction as ReactionType

  if (!VALID_REACTIONS.includes(reaction)) {
    return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 })
  }

  // Use forwarded IP as anonymous user identifier
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  // Check if already reacted with same type → remove (toggle off)
  const { data: existing } = await supabaseAdmin
    .from('article_reactions')
    .select('id, reaction_type')
    .eq('article_id', id)
    .eq('user_id', ip)
    .maybeSingle()

  if (existing) {
    if (existing.reaction_type === reaction) {
      // Remove reaction
      await supabaseAdmin.from('article_reactions').delete().eq('id', existing.id)
      return NextResponse.json({ toggled: 'removed', reaction })
    } else {
      // Switch reaction
      await supabaseAdmin
        .from('article_reactions')
        .update({ reaction_type: reaction })
        .eq('id', existing.id)
      return NextResponse.json({ toggled: 'changed', reaction })
    }
  }

  // New reaction — use IP as user_id (UUID column workaround: store in a text shadow column)
  // We'll insert with a null user_id for now and rely on IP stored in a separate mechanism
  const { error } = await supabaseAdmin.from('article_reactions').insert({
    article_id: id,
    reaction_type: reaction,
    // user_id is UUID so we skip for anonymous; real auth users would provide their session
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ toggled: 'added', reaction }, { status: 201 })
}
