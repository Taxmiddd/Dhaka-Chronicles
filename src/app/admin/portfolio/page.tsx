'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Edit2, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface PortfolioItem {
  id: string
  brand_name: string
  project_name: string
  category: string
  description: string
  outcome: string | null
  logo_url: string | null
  featured_image_url: string | null
  external_link: string | null
  is_published: boolean
  display_order: number
  created_at: string
}

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [form, setForm] = useState({
    brand_name: '', project_name: '', category: 'Fashion', description: '', outcome: '',
    logo_url: '', featured_image_url: '', external_link: '', is_published: true, display_order: 0
  })

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/portfolio')
      if (res.ok) {
        const data = await res.json()
        setItems(data.items)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  function resetForm() {
    setForm({
      brand_name: '', project_name: '', category: 'Fashion', description: '', outcome: '',
      logo_url: '', featured_image_url: '', external_link: '', is_published: true, display_order: 0
    })
    setEditingId(null)
    setShowAdd(false)
  }

  function handleEdit(item: PortfolioItem) {
    setForm({
      brand_name: item.brand_name,
      project_name: item.project_name,
      category: item.category,
      description: item.description,
      outcome: item.outcome || '',
      logo_url: item.logo_url || '',
      featured_image_url: item.featured_image_url || '',
      external_link: item.external_link || '',
      is_published: item.is_published,
      display_order: item.display_order
    })
    setEditingId(item.id)
    setShowAdd(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const url = editingId ? `/api/admin/portfolio/${editingId}` : '/api/admin/portfolio'
      const method = editingId ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        toast.success(editingId ? 'Item updated' : 'Item created')
        resetForm()
        fetchItems()
      } else {
        toast.error('Operation failed')
      }
    } catch {
      toast.error('Network error')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Item deleted')
        setItems(items.filter(i => i.id !== id))
      }
    } catch {
      toast.error('Network error')
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage brand collaborations and case studies.</p>
        </div>
        <button
          onClick={() => showAdd ? resetForm() : setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00A651] hover:bg-[#009040] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {showAdd ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Item</>}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-[#111] border border-white/10 rounded-xl p-6 mb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Brand Name *</label>
              <input required value={form.brand_name} onChange={e => setForm({...form, brand_name: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Project Name *</label>
              <input required value={form.project_name} onChange={e => setForm({...form, project_name: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category *</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white">
                <option value="Fashion">Fashion</option>
                <option value="F&B">F&B</option>
                <option value="Tech">Tech</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">External Link</label>
              <input value={form.external_link} onChange={e => setForm({...form, external_link: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Description *</label>
              <textarea required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Outcome / Results</label>
              <input value={form.outcome} onChange={e => setForm({...form, outcome: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white" placeholder="e.g. 50% increase in engagement" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Logo URL</label>
              <input value={form.logo_url} onChange={e => setForm({...form, logo_url: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Featured Image URL</label>
              <input value={form.featured_image_url} onChange={e => setForm({...form, featured_image_url: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white" />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-gray-300">
                <input type="checkbox" checked={form.is_published} onChange={e => setForm({...form, is_published: e.target.checked})} className="accent-[#00A651]" />
                Published
              </label>
              <label className="flex items-center gap-2 text-gray-300">
                Order: <input type="number" value={form.display_order} onChange={e => setForm({...form, display_order: Number(e.target.value)})} className="w-16 bg-black border border-white/10 rounded px-2 py-1 text-white" />
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={resetForm} className="px-4 py-2 border border-white/10 text-gray-400 hover:text-white rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[#00A651] hover:bg-[#009040] text-white font-semibold rounded-lg">
              {editingId ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-[#111] border border-white/10 rounded-xl overflow-hidden flex flex-col">
              {item.featured_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.featured_image_url} alt={item.project_name} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-black/50 flex items-center justify-center text-gray-600 font-medium">No Image</div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-[#00A651] uppercase">{item.category}</span>
                  {item.is_published ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-gray-500" />}
                </div>
                <h3 className="font-bold text-white text-lg">{item.project_name}</h3>
                <p className="text-gray-400 text-sm mb-4">by {item.brand_name}</p>
                <div className="mt-auto flex justify-between items-center border-t border-white/10 pt-4">
                  <span className="text-xs text-gray-500">Order: {item.display_order}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-4 h-4" /></button>
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
