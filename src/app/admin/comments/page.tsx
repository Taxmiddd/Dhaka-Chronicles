'use client'

import { useState, useEffect, useCallback } from 'react'
import { MessageSquare, CheckCircle, XCircle, AlertTriangle, Loader2, RefreshCw, Filter } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

interface Comment {
  id: string
  content: string
  author_name: string
  author_email: string
  author_ip: string
  article_id: string
  status: 'pending' | 'approved' | 'rejected' | 'spam'
  created_at: string
}

type StatusFilter = 'pending' | 'approved' | 'rejected' | 'spam'

export default function CommentsModerationPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<StatusFilter>('pending')
  const [actioning, setActioning] = useState<string | null>(null)

  const fetchComments = useCallback(async () => {
    setLoading(true)
    try {
      // We query all articles' comments by status using admin endpoint
      const res = await fetch(`/api/comments?status=${filter}`)
      if (res.ok) {
        const json = await res.json()
        setComments(json.data || [])
      }
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { fetchComments() }, [fetchComments])

  async function moderate(commentId: string, articleId: string, status: string) {
    setActioning(commentId)
    try {
      const res = await fetch(`/api/articles/${articleId}/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(`Comment ${status}`)
      setComments(prev => prev.filter(c => c.id !== commentId))
    } catch {
      toast.error('Action failed')
    } finally {
      setActioning(null)
    }
  }

  async function deleteComment(commentId: string, articleId: string) {
    setActioning(commentId)
    try {
      const res = await fetch(`/api/articles/${articleId}/comments/${commentId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      toast.success('Comment deleted')
      setComments(prev => prev.filter(c => c.id !== commentId))
    } catch {
      toast.error('Delete failed')
    } finally {
      setActioning(null)
    }
  }

  const filters: { value: StatusFilter; label: string; color: string }[] = [
    { value: 'pending', label: 'Pending', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
    { value: 'approved', label: 'Approved', color: 'text-dc-green bg-dc-green/10 border-dc-green/20' },
    { value: 'rejected', label: 'Rejected', color: 'text-dc-red bg-dc-red/10 border-dc-red/20' },
    { value: 'spam', label: 'Spam', color: 'text-dc-text-muted bg-dc-surface border-dc-border' },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-headline font-bold text-white flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-dc-green" />
            Comment Moderation
          </h1>
          <p className="text-dc-text-muted text-sm mt-1">Review and moderate user comments</p>
        </div>
        <button
          onClick={fetchComments}
          className="btn-ghost px-3 py-2 text-sm flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="w-4 h-4 text-dc-text-muted" />
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              filter === f.value ? f.color : 'text-dc-text-muted bg-dc-surface border-dc-border hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-dc-text-muted gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <div className="glass p-10 rounded-xl text-center text-dc-text-muted">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No {filter} comments</p>
          <p className="text-sm mt-1">All caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map(comment => (
            <div key={comment.id} className="glass p-5 rounded-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="font-semibold text-white text-sm">{comment.author_name || 'Anonymous'}</span>
                    {comment.author_email && (
                      <span className="text-dc-text-muted text-xs">{comment.author_email}</span>
                    )}
                    <span className="text-dc-text-muted text-xs">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                    <span className="text-dc-text-muted text-xs font-mono">IP: {comment.author_ip}</span>
                  </div>
                  <p className="text-dc-text text-sm leading-relaxed">{comment.content}</p>
                </div>

                {/* Actions */}
                {actioning === comment.id ? (
                  <Loader2 className="w-5 h-5 animate-spin text-dc-text-muted shrink-0" />
                ) : (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {filter !== 'approved' && (
                      <button
                        onClick={() => moderate(comment.id, comment.article_id, 'approved')}
                        title="Approve"
                        className="p-1.5 rounded-lg text-dc-green hover:bg-dc-green/10 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {filter !== 'rejected' && (
                      <button
                        onClick={() => moderate(comment.id, comment.article_id, 'rejected')}
                        title="Reject"
                        className="p-1.5 rounded-lg text-dc-red hover:bg-dc-red/10 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    {filter !== 'spam' && (
                      <button
                        onClick={() => moderate(comment.id, comment.article_id, 'spam')}
                        title="Mark as Spam"
                        className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-400/10 transition-colors"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteComment(comment.id, comment.article_id)}
                      title="Delete"
                      className="p-1.5 rounded-lg text-dc-text-muted hover:text-dc-red hover:bg-dc-red/10 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
