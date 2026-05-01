'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Send, Loader2, User, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Note {
  id: string
  content: string
  created_at: string
  author: { full_name: string } | null
}

export default function EditorialNotes({ articleId }: { articleId: string }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchNotes = async () => {
    try {
      const res = await fetch(`/api/admin/articles/${articleId}/notes`)
      const data = await res.json()
      if (data.success) {
        setNotes(data.data)
      }
    } catch (err) {
      toast.error('Failed to load notes')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [articleId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/articles/${articleId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote })
      })

      const data = await res.json()
      if (data.success) {
        setNotes([data.data, ...notes])
        setNewNote('')
        toast.success('Note added')
      }
    } catch (err) {
      toast.error('Failed to add note')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="glass rounded-xl border border-dc-border h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-dc-border bg-dc-surface flex items-center justify-between">
        <h3 className="font-headline font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-dc-green" />
          Editorial Notes
        </h3>
        <span className="text-[10px] bg-dc-surface-2 text-dc-text-muted px-2 py-0.5 rounded uppercase font-black">
          Internal Only
        </span>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[500px]">
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-dc-green" /></div>
        ) : notes.length === 0 ? (
          <p className="text-sm text-dc-text-muted italic text-center py-10">No notes yet. Start the conversation.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-dc-surface-2 p-3 rounded-lg border border-dc-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <User className="w-3 h-3 text-dc-green" />
                  {note.author?.full_name || 'System'}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-dc-text-muted">
                  <Clock className="w-3 h-3" />
                  {format(new Date(note.created_at), 'MMM d, HH:mm')}
                </div>
              </div>
              <p className="text-sm text-dc-text leading-relaxed whitespace-pre-wrap">{note.content}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-dc-border bg-dc-surface">
        <div className="relative">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note for the editorial team..."
            className="form-input text-sm pr-12 min-h-[80px] resize-none"
            rows={2}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newNote.trim()}
            className="absolute right-3 bottom-3 p-2 rounded-lg bg-dc-green text-white disabled:opacity-50 hover:shadow-lg transition-all"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  )
}
