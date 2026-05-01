'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, User, Tag, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Assignment {
  id: string
  title: string
  description: string | null
  status: 'proposed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  priority: number
  deadline: string | null
  assignee: { full_name: string } | null
  category: { name: string, color: string } | null
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch('/api/admin/assignments')
        const data = await res.json()
        if (data.success) {
          setAssignments(data.data)
        }
      } catch (err) {
        toast.error('Failed to load assignments')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'proposed': return 'bg-blue-500/10 text-blue-500'
      case 'assigned': return 'bg-purple-500/10 text-purple-500'
      case 'in_progress': return 'bg-amber-500/10 text-amber-500'
      case 'completed': return 'bg-dc-green/10 text-dc-green'
      case 'cancelled': return 'bg-dc-red/10 text-dc-red'
      default: return 'bg-slate-500/10 text-slate-500'
    }
  }

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'text-dc-red'
      case 2: return 'text-amber-500'
      default: return 'text-dc-green'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold text-white">Story Assignments</h1>
          <p className="text-dc-text-muted text-sm mt-1">Track and manage editorial tasks.</p>
        </div>
        
        <button className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Create Assignment
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'assigned', 'in_progress', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize whitespace-nowrap ${
              filter === f ? 'bg-dc-green text-white shadow-lg' : 'bg-dc-surface text-dc-text-muted hover:bg-dc-surface-2'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-dc-green" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments
            .filter(a => filter === 'all' || a.status === filter)
            .map((a) => (
            <div key={a.id} className="glass group p-5 rounded-xl border border-dc-border hover:border-dc-green/30 transition-all flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded ${getStatusColor(a.status)}`}>
                  {a.status.replace('_', ' ')}
                </span>
                <span className={`text-xs font-bold flex items-center gap-1 ${getPriorityColor(a.priority)}`}>
                  <AlertCircle className="w-3 h-3" />
                  {a.priority === 1 ? 'High' : a.priority === 2 ? 'Medium' : 'Low'}
                </span>
              </div>

              <h3 className="text-white font-bold text-lg mb-2 leading-tight group-hover:text-dc-green transition-colors line-clamp-2">
                {a.title}
              </h3>
              
              <p className="text-dc-text-muted text-sm mb-4 line-clamp-3 flex-grow">
                {a.description || 'No description provided.'}
              </p>

              <div className="pt-4 border-t border-dc-border space-y-3 mt-auto">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-dc-text">
                    <User className="w-3.5 h-3.5 text-dc-green" />
                    <span>{a.assignee?.full_name || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-dc-text-muted">
                    <Tag className="w-3.5 h-3.5" style={{ color: a.category?.color }} />
                    <span>{a.category?.name || 'Uncategorized'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-dc-text-muted">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{a.deadline ? format(new Date(a.deadline), 'MMM d, yyyy') : 'No deadline'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-dc-text-muted">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Due: 5d</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
