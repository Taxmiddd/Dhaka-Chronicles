import { UserPlus, Mail, Shield, Trash2 } from 'lucide-react'

export const metadata = { title: 'Users – Dhaka Chronicles Admin' }

const MOCK_USERS = [
  { id: '1', name: 'Tahmid Ashfaque', email: 'tahmid@dhakachronicles.com', role: 'founder', articles: 48, joined: '2025-01-01' },
  { id: '2', name: 'Rahim Uddin', email: 'rahim@dhakachronicles.com', role: 'admin', articles: 31, joined: '2025-03-15' },
  { id: '3', name: 'Nusrat Jahan', email: 'nusrat@dhakachronicles.com', role: 'publisher', articles: 87, joined: '2025-04-02' },
  { id: '4', name: 'Karim Hassan', email: 'karim@dhakachronicles.com', role: 'publisher', articles: 54, joined: '2025-05-10' },
]

const ROLE_BADGE: Record<string, string> = {
  founder: 'badge badge-red',
  admin: 'badge badge-green',
  publisher: 'badge badge-gray',
}

export default function AdminUsersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-headline font-bold text-white">Team & Users</h1>
          <p className="text-dc-text-muted text-sm mt-1">Manage editorial team members and their roles</p>
        </div>
        <button className="btn-primary gap-2">
          <UserPlus className="w-4 h-4" />
          Invite User
        </button>
      </div>

      {/* Role summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Founders', count: 1, color: 'var(--dc-red)' },
          { label: 'Admins', count: 1, color: 'var(--dc-green)' },
          { label: 'Publishers', count: 2, color: 'var(--dc-text-muted)' },
        ].map((item) => (
          <div key={item.label} className="glass p-5 rounded-xl">
            <p className="text-dc-text-muted text-sm">{item.label}</p>
            <p className="text-3xl font-headline font-bold mt-1" style={{ color: item.color }}>{item.count}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="dc-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Articles</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-dc-surface-2 flex items-center justify-center text-dc-green font-bold text-sm shrink-0">
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-dc-text-muted text-xs">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td><span className={ROLE_BADGE[user.role]}>{user.role}</span></td>
                <td className="text-dc-text-muted">{user.articles}</td>
                <td className="text-dc-text-muted">{user.joined}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-dc-surface-2 text-dc-text-muted hover:text-dc-green transition-colors" title="Send email">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-dc-surface-2 text-dc-text-muted hover:text-white transition-colors" title="Change role">
                      <Shield className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-dc-surface-2 text-dc-text-muted hover:text-dc-red transition-colors" title="Remove user">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
