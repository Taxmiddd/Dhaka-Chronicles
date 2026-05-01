import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getSession()
  if (!user || !['admin', 'founder'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    // Real-time analytics typically requires querying an in-memory store (like Redis)
    // or a specialized analytics service.
    
    // We will return mock real-time data for the structure
    const mockRealTimeData = {
      active_visitors: Math.floor(Math.random() * 500) + 100, // Random number between 100-600
      top_active_pages: [
        { path: '/', active_users: Math.floor(Math.random() * 100) + 50 },
        { path: '/news/breaking-news-article', active_users: Math.floor(Math.random() * 50) + 10 },
        { path: '/category/politics', active_users: Math.floor(Math.random() * 30) + 5 }
      ]
    }

    return NextResponse.json({ success: true, data: mockRealTimeData })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
