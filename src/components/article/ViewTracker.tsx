'use client'

import { useEffect, useRef } from 'react'

export default function ViewTracker({ articleId }: { articleId: string }) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current || !articleId) return
    tracked.current = true

    // Generate or retrieve a session ID for unique view tracking
    let sessionId = sessionStorage.getItem('dc_session_id')
    if (!sessionId) {
      sessionId = Math.random().toString(36).slice(2)
      sessionStorage.setItem('dc_session_id', sessionId)
    }

    fetch(`/api/articles/${articleId}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    }).catch(() => {}) // Silently fail — analytics should never break UX
  }, [articleId])

  return null
}
