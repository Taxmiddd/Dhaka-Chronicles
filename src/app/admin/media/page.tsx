'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { UploadCloud, Trash2, CheckSquare, Square, Image as ImageIcon, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface Media {
  id: string
  file_name: string
  file_url: string
  file_type: string
  file_size: number
  created_at: string
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/media')
      if (res.ok) {
        const data = await res.json()
        setMedia(data.media)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  function toggleSelection(id: string) {
    const newSelection = new Set(selectedIds)
    if (newSelection.has(id)) newSelection.delete(id)
    else newSelection.add(id)
    setSelectedIds(newSelection)
  }

  function toggleAll() {
    if (selectedIds.size === media.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(media.map(m => m.id)))
  }

  const handleCopy = (url: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(url)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
    toast.success('URL copied to clipboard')
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    let successCount = 0

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      const reader = new FileReader()
      const p = new Promise<void>((resolve) => {
        reader.onload = async (event) => {
          const base64 = event.target?.result
          if (base64) {
            try {
              const res = await fetch('/api/admin/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file: base64 })
              })
              if (res.ok) successCount++
            } catch (err) {
              console.error('Upload error', err)
            }
          }
          resolve()
        }
      })
      reader.readAsDataURL(file)
      await p
    }

    setUploading(false)
    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} files`)
      fetchMedia()
    } else {
      toast.error('Failed to upload files')
    }
    
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleBulkDelete() {
    if (selectedIds.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} files permanently from Cloudinary and the database?`)) return

    try {
      const idsQuery = Array.from(selectedIds).join(',')
      const res = await fetch(`/api/admin/media?ids=${idsQuery}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast.success(`Deleted ${selectedIds.size} files`)
        setSelectedIds(new Set())
        fetchMedia()
      } else {
        toast.error('Failed to delete files')
      }
    } catch {
      toast.error('Network error')
    }
  }

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-headline font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-dc-green" />
            Media Library
          </h1>
          <p className="text-dc-text-muted text-sm mt-1">Manage and upload assets using Cloudinary.</p>
        </div>
        
        <div className="flex gap-3">
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 text-sm font-semibold rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete ({selectedIds.size})
            </button>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/*,video/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-primary gap-2"
          >
            <UploadCloud className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Media'}
          </button>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault() }}
        onDrop={(e) => {
          e.preventDefault()
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            fileInputRef.current!.files = e.dataTransfer.files
            handleFileUpload({ target: { files: e.dataTransfer.files } } as any)
          }
        }}
        className="border-2 border-dashed border-dc-border hover:border-dc-green/50 hover:bg-dc-surface-2/30 rounded-xl p-10 text-center mb-8 transition-all cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud className="w-10 h-10 mx-auto mb-3 text-dc-text-muted" />
        <p className="text-white font-medium">Drag & drop files here to upload</p>
        <p className="text-dc-text-muted text-sm mt-1">Files will be instantly uploaded to Cloudinary</p>
      </div>

      <div className="glass border border-white/5 rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-black/20">
          <button 
            onClick={toggleAll}
            className="flex items-center gap-2 text-sm text-dc-text-muted hover:text-white transition-colors"
          >
            {media.length > 0 && selectedIds.size === media.length ? (
              <CheckSquare className="w-4 h-4 text-dc-green" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            Select All
          </button>
          <span className="text-sm text-dc-text-muted">{media.length} items</span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="p-12 text-center text-dc-text-muted">Loading media...</div>
        ) : media.length === 0 ? (
          <div className="p-12 text-center text-dc-text-muted">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No media files found. Upload some to get started.</p>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {media.map((item) => {
              const isSelected = selectedIds.has(item.id)
              return (
                <div 
                  key={item.id}
                  onClick={() => toggleSelection(item.id)}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                    isSelected ? 'border-dc-green' : 'border-transparent hover:border-white/10'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.file_url} alt={item.file_name} className="w-full h-full object-cover bg-dc-surface-2" />
                  
                  {/* Overlay for selection */}
                  <div className={`absolute inset-0 transition-opacity duration-200 ${
                    isSelected ? 'bg-dc-green/10 opacity-100' : 'bg-black/60 opacity-0 group-hover:opacity-100'
                  }`}>
                    <div className="absolute top-2 right-2">
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-white drop-shadow-md" />
                      ) : (
                        <Square className="w-5 h-5 text-white/50 drop-shadow-md" />
                      )}
                    </div>

                    {!isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center gap-2">
                        <button 
                          onClick={(e) => handleCopy(item.file_url, item.id, e)} 
                          className="p-2 rounded-lg bg-dc-surface hover:bg-dc-green transition-colors text-white"
                          title="Copy URL"
                        >
                          {copied === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Info bar on hover/selected */}
                  <div className={`absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-200 ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <p className="text-white text-xs truncate" title={item.file_name}>{item.file_name}</p>
                    <p className="text-dc-text-muted text-[10px]">{formatSize(item.file_size)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
