import { supabaseAdmin } from '@/lib/db/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const start = Date.now()
  const checks: Record<string, { status: string; latencyMs?: number; error?: string }> = {}

  // Database check
  try {
    const { error } = await supabaseAdmin.from('articles').select('id').limit(1)
    checks.database = error
      ? { status: 'unhealthy', error: error.message }
      : { status: 'healthy', latencyMs: Date.now() - start }
  } catch (err) {
    checks.database = { status: 'unhealthy', error: String(err) }
  }

  const allHealthy = Object.values(checks).every((c) => c.status === 'healthy')

  return NextResponse.json(
    {
      status: allHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version ?? '0.1.0',
      checks,
    },
    {
      status: allHealthy ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    }
  )
}
