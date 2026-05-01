import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-dc-black">
      <AdminSidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
