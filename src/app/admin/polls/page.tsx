'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, BarChart2 } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface PollOption {
  id?: string
  option_text: string
  option_text_bn?: string
  vote_count?: number
}

interface Poll {
  id: string
  question: string
  poll_type: string
  is_active: boolean
  total_votes: number
  created_at: string
  options?: PollOption[]
}

export default function AdminPollsPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  
  // Form State
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState<PollOption[]>([{ option_text: '' }, { option_text: '' }])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchPolls()
  }, [])

  async function fetchPolls() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/polls')
      if (res.ok) {
        const data = await res.json()
        setPolls(data.polls)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const validOptions = options.filter(o => o.option_text.trim() !== '')
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 options')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          options: validOptions,
          is_active: true
        })
      })

      if (res.ok) {
        toast.success('Poll created successfully')
        setShowAdd(false)
        setQuestion('')
        setOptions([{ option_text: '' }, { option_text: '' }])
        fetchPolls()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to create poll')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this poll?')) return
    
    try {
      const res = await fetch(`/api/polls/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Poll deleted')
        setPolls(polls.filter(p => p.id !== id))
      } else {
        toast.error('Failed to delete poll')
      }
    } catch {
      toast.error('Network error')
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-[#00A651]" />
            Polls
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage interactive polls for your readers.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00A651] hover:bg-[#009040] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {showAdd ? 'Cancel' : <><Plus className="w-4 h-4" /> Create Poll</>}
        </button>
      </div>

      {showAdd && (
        <div className="bg-[#111] border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Create New Poll</h2>
          <form onSubmit={handleCreate} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Question</label>
              <input
                required
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="What is your opinion on...?"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00A651]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Options</label>
              <div className="space-y-3">
                {options.map((opt, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      required={index < 2}
                      value={opt.option_text}
                      onChange={e => {
                        const newOpts = [...options]
                        newOpts[index].option_text = e.target.value
                        setOptions(newOpts)
                      }}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00A651]"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setOptions(options.filter((_, i) => i !== index))}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setOptions([...options, { option_text: '' }])}
                className="mt-3 text-sm text-[#00A651] hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add another option
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#00A651] hover:bg-[#009040] disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Poll'}
            </button>
          </form>
        </div>
      )}

      {/* List of Polls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-gray-500">Loading polls...</p>
        ) : polls.length === 0 ? (
          <p className="text-gray-500">No polls created yet.</p>
        ) : (
          polls.map(poll => (
            <div key={poll.id} className="bg-[#111] border border-white/10 rounded-xl p-5 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-white">{poll.question}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${poll.is_active ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                  {poll.is_active ? 'Active' : 'Closed'}
                </span>
              </div>
              
              <div className="space-y-2 mb-4 flex-1">
                {poll.options?.map(opt => {
                  const percentage = poll.total_votes > 0 ? Math.round(((opt.vote_count || 0) / poll.total_votes) * 100) : 0
                  return (
                    <div key={opt.id} className="relative bg-black/40 rounded overflow-hidden">
                      <div className="absolute top-0 left-0 bottom-0 bg-[#00A651]/20" style={{ width: `${percentage}%` }}></div>
                      <div className="relative p-2 flex justify-between text-sm">
                        <span className="text-gray-300">{opt.option_text}</span>
                        <span className="text-gray-400">{percentage}% ({opt.vote_count || 0})</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 border-t border-white/10 pt-3 mt-auto">
                <span>{poll.total_votes} total votes</span>
                <div className="flex items-center gap-3">
                  <span>Created {format(new Date(poll.created_at), 'MMM d, yyyy')}</span>
                  <button onClick={() => handleDelete(poll.id)} className="text-red-500 hover:text-red-400" title="Delete Poll">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
