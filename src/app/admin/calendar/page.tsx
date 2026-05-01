'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react'
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday,
} from 'date-fns'
import { toast } from 'sonner'

interface CalendarEvent {
  id: string
  title: string
  event_type: string
  start_date: string
  color?: string
  article_id?: string
}

const TYPE_COLORS: Record<string, string> = {
  article_deadline: '#F42A41',
  scheduled_publish: '#00A651',
  meeting: '#F59E0B',
  event_coverage: '#8B5CF6',
}

export default function EditorialCalendarPage() {
  const [current, setCurrent] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [form, setForm] = useState({ title: '', event_type: 'article_deadline', start_date: '' })

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const from = format(startOfMonth(current), 'yyyy-MM-dd')
      const to = format(endOfMonth(current), 'yyyy-MM-dd')
      const res = await fetch(`/api/admin/calendar?from=${from}&to=${to}`)
      if (res.ok) {
        const data = await res.json()
        setEvents(data.events ?? [])
      }
    } finally {
      setLoading(false)
    }
  }, [current])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const weeks = (() => {
    const start = startOfWeek(startOfMonth(current), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(current), { weekStartsOn: 0 })
    const days = eachDayOfInterval({ start, end })
    const wks: Date[][] = []
    for (let i = 0; i < days.length; i += 7) wks.push(days.slice(i, i + 7))
    return wks
  })()

  const eventsForDay = (day: Date) =>
    events.filter((e) => isSameDay(new Date(e.start_date), day))

  async function addEvent(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      toast.success('Event added')
      setShowAdd(false)
      setForm({ title: '', event_type: 'article_deadline', start_date: '' })
      fetchEvents()
    } else {
      toast.error('Failed to add event')
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#00A651]" />
            Editorial Calendar
          </h1>
          <p className="text-gray-400 text-sm mt-1">Plan deadlines, scheduled publishes, and team events.</p>
        </div>
        <button
          id="add-event-btn"
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00A651] hover:bg-[#009040] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrent(subMonths(current, 1))} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>
        <h2 className="text-xl font-bold text-white">{format(current, 'MMMM yyyy')}</h2>
        <button onClick={() => setCurrent(addMonths(current, 1))} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="border border-white/10 rounded-xl overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-white/[0.03]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="px-3 py-2 text-xs font-semibold text-gray-500 text-center border-b border-white/10">
              {d}
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500">Loading…</div>
        ) : (
          weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 border-b border-white/5 last:border-0">
              {week.map((day) => {
                const dayEvents = eventsForDay(day)
                const inMonth = isSameMonth(day, current)
                const today = isToday(day)
                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => setSelectedDay(day)}
                    className={`min-h-[100px] p-2 border-r border-white/5 last:border-0 cursor-pointer transition-colors
                      ${inMonth ? 'bg-transparent hover:bg-white/[0.02]' : 'bg-white/[0.01]'}
                      ${selectedDay && isSameDay(day, selectedDay) ? 'ring-1 ring-inset ring-[#00A651]' : ''}`}
                  >
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium mb-1
                      ${today ? 'bg-[#00A651] text-white' : inMonth ? 'text-white' : 'text-gray-600'}`}>
                      {format(day, 'd')}
                    </span>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <div
                          key={ev.id}
                          className="text-xs px-1.5 py-0.5 rounded truncate font-medium"
                          style={{ backgroundColor: `${TYPE_COLORS[ev.event_type] ?? '#6b7280'}22`, color: TYPE_COLORS[ev.event_type] ?? '#9ca3af' }}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500">+{dayEvents.length - 3} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4">
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            {type.replace(/_/g, ' ')}
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-5">Add Calendar Event</h3>
            <form onSubmit={addEvent} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00A651]"
                  placeholder="Article deadline: Bangladesh Budget 2026"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Event Type</label>
                <select
                  value={form.event_type}
                  onChange={(e) => setForm({ ...form, event_type: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00A651]"
                >
                  <option value="article_deadline">Article Deadline</option>
                  <option value="scheduled_publish">Scheduled Publish</option>
                  <option value="meeting">Meeting</option>
                  <option value="event_coverage">Event Coverage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date &amp; Time</label>
                <input
                  required
                  type="datetime-local"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00A651]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2 border border-white/10 text-gray-400 hover:text-white rounded-lg text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-[#00A651] hover:bg-[#009040] text-white rounded-lg text-sm font-semibold transition-colors">
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
