import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { supabaseAdmin } from '@/lib/db/admin'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const user = await getSession()
  if (!user || !['admin', 'founder'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') || 'json'

  try {
    const { data: articles, error } = await supabaseAdmin
      .from('articles')
      .select('id, title, status, view_count, published_at')

    if (error) throw error

    if (format === 'csv') {
      const csvHeader = 'id,title,status,view_count,published_at\n'
      const csvRows = articles.map(a => `"${a.id}","${a.title.replace(/"/g, '""')}","${a.status}",${a.view_count || 0},"${a.published_at || ''}"`).join('\n')
      
      const response = new NextResponse(csvHeader + csvRows, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="analytics_export.csv"',
        },
      })
      return response
    }

    // Default JSON
    return NextResponse.json({ success: true, data: articles })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
