import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/admin'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  try {
    if (slug) {
      // Fetch specific series with its episodes
      const { data: series, error: seriesErr } = await supabaseAdmin
        .from('podcast_series')
        .select('*')
        .eq('slug', slug)
        .single()

      if (seriesErr) return NextResponse.json({ error: seriesErr.message }, { status: 500 })

      const { data: episodes, error: epsErr } = await supabaseAdmin
        .from('podcast_episodes')
        .select('*')
        .eq('series_id', series.id)
        .order('published_at', { ascending: false })

      if (epsErr) return NextResponse.json({ error: epsErr.message }, { status: 500 })

      return NextResponse.json({ success: true, series, episodes })
    } else {
      // Fetch all series
      const { data, error } = await supabaseAdmin
        .from('podcast_series')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true, data })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
