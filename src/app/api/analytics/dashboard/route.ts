import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { supabaseAdmin } from '@/lib/db/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getSession()
  
  if (!user || !['admin', 'founder'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    // Fetch top level stats: total articles, total views, active users, etc.
    // This is a simplified aggregated view.
    const [articlesCount, viewsData, usersCount] = await Promise.all([
      supabaseAdmin.from('articles').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('articles').select('view_count.sum()').single(),
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        total_articles: articlesCount.count || 0,
        total_views: viewsData.data?.sum || 0,
        total_users: usersCount.count || 0,
        recent_activity: [] // To be populated with recent events
      }
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
