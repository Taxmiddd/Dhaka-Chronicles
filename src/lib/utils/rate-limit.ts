import { NextResponse } from 'next/server'

interface RateLimitTracker {
  count: number
  lastReset: number
}

// In-memory store. Note: In a serverless/edge environment (like Vercel),
// this memory will be scoped to the specific lambda instance. 
// For distributed strict rate limiting, consider migrating to @upstash/ratelimit.
const ipTracker = new Map<string, RateLimitTracker>()

export function rateLimit(request: Request, limit: number = 100, windowMs: number = 60000) {
  // Extract IP from headers
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'anonymous'

  const now = Date.now()
  let tracker = ipTracker.get(ip)

  if (!tracker) {
    tracker = { count: 1, lastReset: now }
    ipTracker.set(ip, tracker)
    return null // Allow request
  }

  // Reset window
  if (now - tracker.lastReset > windowMs) {
    tracker.count = 1
    tracker.lastReset = now
    ipTracker.set(ip, tracker)
    return null // Allow request
  }

  // Increment count
  tracker.count++
  ipTracker.set(ip, tracker)

  if (tracker.count > limit) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later.' },
      { status: 429, headers: { 'Retry-After': Math.ceil(windowMs / 1000).toString() } }
    )
  }

  return null // Allow request
}
