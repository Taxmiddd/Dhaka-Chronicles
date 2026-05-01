'use client'

import { useState, useEffect } from 'react'
import { Plus, Headphones, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Series {
  id: string
  title: string
  slug: string
  description: string
  cover_image_url: string
}

export default function PodcastsAdminPage() {
  const [seriesList, setSeriesList] = useState<Series[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const res = await fetch('/api/podcasts')
        const data = await res.json()
        if (data.success) {
          setSeriesList(data.data)
        } else {
          toast.error(data.error || 'Failed to fetch podcasts')
        }
      } catch (err) {
        toast.error('Failed to load podcasts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSeries()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold text-white flex items-center gap-2">
            <Headphones className="w-6 h-6 text-dc-green" />
            Podcasts Management
          </h1>
          <p className="text-dc-text-muted text-sm mt-1">Manage podcast series and episodes.</p>
        </div>
        
        <button 
          className="btn-primary py-2 px-4 flex items-center justify-center gap-2"
          onClick={() => toast.info('Series creation modal coming soon')}
        >
          <Plus className="w-4 h-4" />
          New Series
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-dc-surface rounded-xl"></div>
          <div className="h-32 bg-dc-surface rounded-xl"></div>
        </div>
      ) : seriesList.length === 0 ? (
        <div className="glass p-12 rounded-xl text-center">
          <Headphones className="w-12 h-12 text-dc-border mx-auto mb-4" />
          <h3 className="text-lg font-headline font-bold text-white mb-2">No Podcasts Yet</h3>
          <p className="text-dc-text-muted mb-6">Create your first podcast series to get started.</p>
          <button className="btn-primary mx-auto">Create Series</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seriesList.map(series => (
            <div key={series.id} className="glass rounded-xl overflow-hidden flex flex-col">
              <div className="h-48 bg-dc-surface relative">
                {series.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={series.cover_image_url} alt={series.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Headphones className="w-12 h-12 text-dc-border" />
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-headline font-bold text-white mb-2">{series.title}</h3>
                <p className="text-sm text-dc-text-muted line-clamp-2 flex-1">{series.description}</p>
                
                <div className="flex gap-2 mt-4 pt-4 border-t border-dc-border">
                  <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md bg-dc-surface-2 hover:bg-dc-surface hover:text-dc-green transition-colors text-sm">
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button className="flex items-center justify-center px-3 rounded-md bg-dc-surface-2 hover:bg-dc-red/10 hover:text-dc-red transition-colors">
                    <Trash2 className="w-4 h-4" />
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
