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
    // Basic aggregation for traffic sources from article_views table
    // Note: Requires complex SQL or RPC in Supabase. We return a placeholder structure.
    
    // Example:
    // const { data, error } = await supabaseAdmin.rpc('get_traffic_sources')

    const mockData = {
      sources: [
        { source: 'Direct', count: 4520, percentage: 45 },
        { source: 'Facebook', count: 3010, percentage: 30 },
        { source: 'Google', count: 1500, percentage: 15 },
        { source: 'Twitter', count: 500, percentage: 5 },
        { source: 'Other', count: 500, percentage: 5 }
      ],
      devices: [
        { type: 'Mobile', percentage: 65 },
        { type: 'Desktop', percentage: 30 },
        { type: 'Tablet', percentage: 5 }
      ]
    }

    return NextResponse.json({ success: true, data: mockData })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
