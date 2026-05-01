import 'server-only'
import type { UserRole } from '@/types'
import { getSession } from './session'
import { redirect } from 'next/navigation'

/** Get the current session — returns null if not logged in */
export async function getCurrentUser() {
  return getSession()
}

/** Require authentication — redirects to /login if not authenticated */
export async function requireAuth() {
  const user = await getSession()
  if (!user) redirect('/login')
  return user
}

/** Require a minimum role — redirects to /admin/dashboard if insufficient */
export async function requireRole(minimumRole: UserRole) {
  const user = await requireAuth()
  const hierarchy: UserRole[] = ['publisher', 'admin', 'founder']
  const userLevel = hierarchy.indexOf(user.role)
  const requiredLevel = hierarchy.indexOf(minimumRole)

  if (userLevel < requiredLevel) {
    redirect('/admin/dashboard')
  }
  return user
}

/** Check if a user can perform an action */
export function canPerform(
  userRole: UserRole,
  action: 'publish' | 'manage_users' | 'manage_settings' | 'delete_article'
): boolean {
  const permissions: Record<typeof action, UserRole[]> = {
    publish: ['admin', 'founder'],
    manage_users: ['admin', 'founder'],
    manage_settings: ['founder'],
    delete_article: ['admin', 'founder'],
  }
  return permissions[action].includes(userRole)
}

/** Role display labels */
export const roleLabels: Record<UserRole, string> = {
  founder: 'Founder',
  admin: 'Admin',
  publisher: 'Publisher',
}

/** Role badge colors for UI */
export const roleBadgeColors: Record<UserRole, string> = {
  founder: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  admin: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  publisher: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
}
