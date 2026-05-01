'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { RefreshCw, Check, X, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { Facebook } from '@/components/ui/BrandIcons'
import Link from 'next/link'

interface ImportedPost {
  id: string
  facebook_post_id: string
  message: string
  link: string
  image_url: string
  video_url: string
  post_type: string
  created_time: string
  import_status: 'pending' | 'imported' | 'skipped' | 'failed'
}

export default function FacebookSyncPage() {
  const [posts, setPosts] = useState<ImportedPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({})
  const [isSyncing, setIsSyncing] = useState(false)

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/facebook-sync?status=pending&limit=50')
      const data = await res.json()
      if (data.success) {
        setPosts(data.data)
      } else {
        toast.error(data.error || 'Failed to fetch posts')
      }
    } catch (err) {
      toast.error('Failed to load posts')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleManualSync = async () => {
    setIsSyncing(true)
    toast.info('Starting manual sync...')
    try {
      const res = await fetch('/api/cron/facebook-sync')
      const data = await res.json()
      if (data.success) {
        toast.success(`Sync complete. Found ${data.newly_imported} new posts.`)
        fetchPosts()
      } else {
        toast.error(data.error || 'Sync failed')
      }
    } catch (err) {
      toast.error('Sync failed')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleImport = async (id: string) => {
    setIsProcessing({ ...isProcessing, [id]: true })
    try {
      const res = await fetch('/api/admin/facebook-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Successfully drafted article!')
        setPosts(posts.filter(p => p.id !== id))
        // Optional: window.open(`/admin/articles/${data.articleId}/edit`, '_blank')
      } else {
        toast.error(data.error || 'Failed to import')
      }
    } catch (err) {
      toast.error('Error importing post')
    } finally {
      setIsProcessing({ ...isProcessing, [id]: false })
    }
  }

  const handleSkip = async (id: string) => {
    setIsProcessing({ ...isProcessing, [id]: true })
    try {
      const res = await fetch('/api/admin/facebook-sync', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'skipped' })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Post skipped')
        setPosts(posts.filter(p => p.id !== id))
      } else {
        toast.error(data.error || 'Failed to skip')
      }
    } catch (err) {
      toast.error('Error skipping post')
    } finally {
      setIsProcessing({ ...isProcessing, [id]: false })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold text-white flex items-center gap-2">
            <Facebook className="w-6 h-6 text-blue-500" />
            Facebook Sync Queue
          </h1>
          <p className="text-dc-text-muted text-sm mt-1">Review pending Facebook posts to draft as articles.</p>
        </div>
        
        <button 
          onClick={handleManualSync} 
          disabled={isSyncing}
          className="btn-primary py-2 px-4 flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Manual Sync'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-dc-muted" />
        </div>
      ) : posts.length === 0 ? (
        <div className="glass p-12 rounded-xl text-center">
          <Facebook className="w-12 h-12 text-dc-border mx-auto mb-4" />
          <h3 className="text-lg font-headline font-bold text-white mb-2">No pending posts</h3>
          <p className="text-dc-text-muted">The queue is clear. New Facebook posts will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post.id} className="glass rounded-xl overflow-hidden flex flex-col">
              {post.image_url ? (
                <div className="h-48 w-full bg-dc-surface relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.image_url} alt="Post media" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white capitalize">
                    {post.post_type}
                  </div>
                </div>
              ) : (
                <div className="h-48 w-full bg-dc-surface flex items-center justify-center relative">
                  <ImageIcon className="w-12 h-12 text-dc-border" />
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white capitalize">
                    {post.post_type}
                  </div>
                </div>
              )}
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs text-dc-text-muted mb-2 flex justify-between items-center">
                  <span>{format(new Date(post.created_time), 'MMM d, yyyy • h:mm a')}</span>
                  {post.link && (
                    <Link href={post.link} target="_blank" className="hover:text-dc-green inline-flex items-center gap-1">
                      View Original <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
                
                <p className="text-sm text-dc-text line-clamp-4 flex-1 whitespace-pre-wrap">
                  {post.message || <span className="italic text-dc-text-muted">No text content</span>}
                </p>
                
                <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-dc-border">
                  <button
                    onClick={() => handleSkip(post.id)}
                    disabled={isProcessing[post.id]}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-dc-border text-dc-text-muted hover:text-white hover:bg-dc-surface-2 transition-colors disabled:opacity-50 text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    Skip
                  </button>
                  <button
                    onClick={() => handleImport(post.id)}
                    disabled={isProcessing[post.id]}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-dc-green hover:bg-green-600 text-white transition-colors disabled:opacity-50 text-sm font-medium"
                  >
                    {isProcessing[post.id] ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Import Draft
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
