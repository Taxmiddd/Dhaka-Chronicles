'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Users, 
  Settings, 
  BarChart3,
  MessageSquare,
  Tag,
  Layers,
  LogOut
} from 'lucide-react'
import { Facebook } from '@/components/ui/BrandIcons'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Articles', href: '/admin/articles', icon: FileText },
  { name: 'Categories', href: '/admin/categories', icon: Layers },
  { name: 'Comments', href: '/admin/comments', icon: MessageSquare },
  { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Facebook Sync', href: '/admin/facebook-sync', icon: Facebook },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-dc-surface border-r border-dc-border flex flex-col">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-dc-border">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-dc-green rounded-md flex items-center justify-center">
            <span className="text-white font-bold font-headline text-lg">D</span>
          </div>
          <span className="font-headline font-bold text-lg text-white">Chronicles</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'admin-sidebar-link group',
                isActive && 'active'
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-dc-green" : "text-dc-muted group-hover:text-dc-text")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-dc-border">
        <button 
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' })
            window.location.href = '/login'
          }}
          className="admin-sidebar-link w-full text-left group hover:text-dc-red"
        >
          <LogOut className="w-5 h-5 text-dc-muted group-hover:text-dc-red" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
