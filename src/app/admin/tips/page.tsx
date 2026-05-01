'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Tip {
  id: string
  subject: string
  description: string
  tipster_name: string | null
  tipster_email: string | null
  tipster_phone: string | null
  is_anonymous: boolean
  location: string | null
  status: string
  priority: string
  internal_notes: string | null
  submitted_at: string
}

export default function AdminTipsQueue() {
  const [tips, setTips] = useState<Tip[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('new')
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null)
  const [notes, setNotes] = useState('')

  const fetchTips = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/tips?status=${filter}`)
      if (res.ok) {
        const data = await res.json()
        setTips(data.tips)
      }
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchTips()
  }, [fetchTips])

  async function updateStatus(id: string, newStatus: string) {
    try {
      const res = await fetch(`/api/admin/tips/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        toast.success(`Status updated to ${newStatus}`)
        if (selectedTip?.id === id) {
          setSelectedTip(prev => prev ? { ...prev, status: newStatus } : null)
        }
        setTips(tips.map(t => t.id === id ? { ...t, status: newStatus } : t))
        if (filter !== 'all' && filter !== newStatus) {
           setTips(prev => prev.filter(t => t.id !== id))
           if(selectedTip?.id === id) setSelectedTip(null)
        }
      }
    } catch {
      toast.error('Failed to update status')
    }
  }

  async function saveNotes() {
    if (!selectedTip) return
    try {
      const res = await fetch(`/api/admin/tips/${selectedTip.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internal_notes: notes }),
      })
      if (res.ok) {
        toast.success('Notes saved')
        const data = await res.json()
        setSelectedTip(data.tip)
        setTips(tips.map(t => t.id === selectedTip.id ? data.tip : t))
      }
    } catch {
      toast.error('Failed to save notes')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">News Tips Queue</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[#111] border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#00A651]"
        >
          <option value="all">All Tips</option>
          <option value="new">New</option>
          <option value="reviewing">Reviewing</option>
          <option value="investigating">Investigating</option>
          <option value="published">Published</option>
          <option value="spam">Spam / Archived</option>
        </select>
      </div>

      <div className="flex gap-6 h-[calc(100vh-140px)]">
        {/* List */}
        <div className="w-1/3 bg-[#111] border border-white/10 rounded-xl flex flex-col overflow-hidden">
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {loading ? (
              <p className="p-4 text-gray-500 text-center">Loading tips...</p>
            ) : tips.length === 0 ? (
              <p className="p-4 text-gray-500 text-center">No tips found in this queue.</p>
            ) : (
              tips.map((tip) => (
                <button
                  key={tip.id}
                  onClick={() => {
                    setSelectedTip(tip)
                    setNotes(tip.internal_notes || '')
                  }}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedTip?.id === tip.id
                      ? 'bg-white/5 border-[#00A651]'
                      : 'bg-transparent border-transparent hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-white line-clamp-1">{tip.subject}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 shrink-0 ml-2">
                      {tip.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    {format(new Date(tip.submitted_at), 'MMM d, yyyy h:mm a')}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2">{tip.description}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 bg-[#111] border border-white/10 rounded-xl overflow-hidden flex flex-col">
          {selectedTip ? (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-white/10 flex-shrink-0">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-white">{selectedTip.subject}</h2>
                  <select
                    value={selectedTip.status}
                    onChange={(e) => updateStatus(selectedTip.id, e.target.value)}
                    className="bg-black border border-white/20 text-white rounded px-3 py-1 text-sm focus:outline-none focus:border-[#00A651]"
                  >
                    <option value="new">New</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="investigating">Investigating</option>
                    <option value="published">Published</option>
                    <option value="spam">Spam / Archived</option>
                  </select>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                  <p><strong>Date:</strong> {format(new Date(selectedTip.submitted_at), 'MMMM d, yyyy h:mm a')}</p>
                  <p><strong>From:</strong> {selectedTip.is_anonymous ? 'Anonymous' : `${selectedTip.tipster_name || 'N/A'} <${selectedTip.tipster_email || 'no email'}>`}</p>
                  {selectedTip.tipster_phone && <p><strong>Phone:</strong> {selectedTip.tipster_phone}</p>}
                  {selectedTip.location && <p><strong>Location:</strong> {selectedTip.location}</p>}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Description</h3>
                <div className="bg-white/5 rounded-lg p-4 text-gray-300 whitespace-pre-wrap leading-relaxed mb-8">
                  {selectedTip.description}
                </div>

                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Internal Notes</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add private notes for the investigative team..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[#00A651] resize-y min-h-[150px] mb-3"
                />
                <div className="flex justify-end">
                  <button
                    onClick={saveNotes}
                    className="px-4 py-2 bg-[#00A651] hover:bg-[#009040] text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a tip to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
