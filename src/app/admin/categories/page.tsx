import { Plus, Edit, Trash2, Tag } from 'lucide-react'

export const metadata = { title: 'Categories – Dhaka Chronicles Admin' }

const CATEGORIES = [
  { id: '1', name: 'Politics', slug: 'politics', description: 'National and international political coverage', articles: 142, color: '#F42A41' },
  { id: '2', name: 'Business', slug: 'business', description: 'Economy, finance, and corporate news', articles: 98, color: '#00A651' },
  { id: '3', name: 'Sports', slug: 'sports', description: 'Cricket, football, and national sports', articles: 211, color: '#F59E0B' },
  { id: '4', name: 'Culture', slug: 'culture', description: 'Arts, entertainment, and social trends', articles: 67, color: '#8B5CF6' },
  { id: '5', name: 'Education', slug: 'education', description: 'Academic news and policy updates', articles: 44, color: '#06B6D4' },
  { id: '6', name: 'Technology', slug: 'technology', description: 'Tech startups, digital innovations', articles: 33, color: '#EC4899' },
]

export default function AdminCategoriesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-headline font-bold text-white">Categories</h1>
          <p className="text-dc-text-muted text-sm mt-1">Organise content into editorial sections</p>
        </div>
        <button className="btn-primary gap-2">
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="glass p-6 rounded-xl group hover:border-[rgba(255,255,255,0.15)] transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}20`, border: `1px solid ${cat.color}40` }}>
                  <Tag className="w-5 h-5" style={{ color: cat.color }} />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-white">{cat.name}</h3>
                  <p className="text-xs text-dc-text-muted">/{cat.slug}</p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-dc-surface-2 text-dc-text-muted hover:text-dc-green transition-colors">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-dc-surface-2 text-dc-text-muted hover:text-dc-red transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-dc-text-muted text-sm mb-4 line-clamp-2">{cat.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-dc-text-muted">{cat.articles} articles</span>
              <div className="h-1 flex-1 mx-3 rounded-full bg-dc-surface-2 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${Math.min(cat.articles / 2.5, 100)}%`, backgroundColor: cat.color }} />
              </div>
            </div>
          </div>
        ))}

        {/* Add New Category Card */}
        <button className="glass p-6 rounded-xl border-dashed hover:bg-dc-surface-2/50 transition-all flex flex-col items-center justify-center gap-3 text-dc-text-muted hover:text-white min-h-[160px]">
          <div className="w-10 h-10 rounded-full bg-dc-surface-2 flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">Add Category</span>
        </button>
      </div>
    </div>
  )
}
