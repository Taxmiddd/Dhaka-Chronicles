'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function SubmitTipPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [form, setForm] = useState({
    subject: '',
    description: '',
    tipsterName: '',
    tipsterEmail: '',
    tipsterPhone: '',
    location: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/tips/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, isAnonymous }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        toast.success('Your tip has been submitted securely.')
      } else {
        toast.error(data.error ?? 'Failed to submit tip')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-[#00A651]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-[#00A651]">✓</span>
        </div>
        <h1 className="text-3xl font-bold font-headline mb-4">Tip Received</h1>
        <p className="text-gray-400 text-lg mb-8">
          Thank you for sharing your information with our newsroom. Our investigative team will review your tip.
        </p>
        <Link href="/" className="btn-primary inline-flex">
          Return to Homepage
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold font-headline mb-4">Send a News Tip</h1>
        <p className="text-gray-400 text-lg">
          Do you have a story that needs to be told? Share your tip with the Dhaka Chronicles investigative team.
          We take your privacy seriously.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Subject <span className="text-red-500">*</span></label>
          <input
            required
            maxLength={200}
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="Brief summary of the tip"
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description <span className="text-red-500">*</span></label>
          <textarea
            required
            rows={6}
            maxLength={5000}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Provide as much detail as possible. Who, what, when, where, and why?"
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651] outline-none resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Location (Optional)</label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="City, neighborhood, or specific location"
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651] outline-none"
          />
        </div>

        <div className="border-t border-white/10 pt-6">
          <div className="flex items-center gap-3 mb-6 bg-[#1a1a1a] p-4 rounded-lg border border-white/5">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-5 h-5 accent-[#00A651] cursor-pointer"
            />
            <label htmlFor="anonymous" className="cursor-pointer text-gray-300 select-none">
              <strong className="text-white block">Submit anonymously</strong>
              <span className="text-sm text-gray-500">We will not collect or store your contact information.</span>
            </label>
          </div>

          {!isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  value={form.tipsterName}
                  onChange={(e) => setForm({ ...form, tipsterName: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00A651] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={form.tipsterEmail}
                  onChange={(e) => setForm({ ...form, tipsterEmail: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00A651] outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={form.tipsterPhone}
                  onChange={(e) => setForm({ ...form, tipsterPhone: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00A651] outline-none"
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#00A651] hover:bg-[#009040] disabled:bg-[#00A651]/50 text-white font-bold rounded-lg transition-colors text-lg"
        >
          {loading ? 'Submitting securely...' : 'Submit News Tip'}
        </button>
      </form>
    </main>
  )
}
