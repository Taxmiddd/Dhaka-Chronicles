'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { User, Lock, Save } from 'lucide-react'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile')
  
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    bio: '',
    phone: '',
    avatar_url: '',
    facebook_url: '',
    twitter_url: '',
    linkedin_url: ''
  })
  
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          setProfile({
            full_name: data.profile.full_name || '',
            email: data.profile.email || '',
            bio: data.profile.bio || '',
            phone: data.profile.phone || '',
            avatar_url: data.profile.avatar_url || '',
            facebook_url: data.profile.facebook_url || '',
            twitter_url: data.profile.twitter_url || '',
            linkedin_url: data.profile.linkedin_url || ''
          })
        }
      } catch {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: profile.full_name,
          bio: profile.bio,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
          facebook_url: profile.facebook_url,
          twitter_url: profile.twitter_url,
          linkedin_url: profile.linkedin_url
        })
      })
      
      if (res.ok) {
        toast.success('Profile updated successfully')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to update profile')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (passwords.new_password !== passwords.confirm_password) {
      toast.error('New passwords do not match')
      return
    }
    
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: passwords.current_password,
          new_password: passwords.new_password
        })
      })
      
      if (res.ok) {
        toast.success('Password changed successfully')
        setPasswords({ current_password: '', new_password: '', confirm_password: '' })
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to change password')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6 text-gray-400">Loading profile...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-gray-400 text-sm">Manage your personal information and account security.</p>
      </div>

      <div className="flex gap-4 border-b border-white/10 mb-8">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'profile' ? 'border-[#00A651] text-[#00A651]' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" /> Personal Info
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'security' ? 'border-[#00A651] text-[#00A651]' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4" /> Security
        </button>
      </div>

      {activeTab === 'profile' ? (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="bg-[#111] border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                <input
                  required
                  value={profile.full_name}
                  onChange={e => setProfile({...profile, full_name: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00A651]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                <input
                  disabled
                  value={profile.email}
                  className="w-full bg-black/50 border border-white/5 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                <input
                  value={profile.phone}
                  onChange={e => setProfile({...profile, phone: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00A651]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Avatar URL</label>
                <input
                  value={profile.avatar_url}
                  onChange={e => setProfile({...profile, avatar_url: e.target.value})}
                  placeholder="https://..."
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00A651]"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Bio</label>
              <textarea
                value={profile.bio}
                onChange={e => setProfile({...profile, bio: e.target.value})}
                rows={4}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00A651] resize-y"
              />
            </div>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">Social Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Facebook Profile URL</label>
                <input
                  value={profile.facebook_url}
                  onChange={e => setProfile({...profile, facebook_url: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00A651]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Twitter Profile URL</label>
                <input
                  value={profile.twitter_url}
                  onChange={e => setProfile({...profile, twitter_url: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00A651]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">LinkedIn Profile URL</label>
                <input
                  value={profile.linkedin_url}
                  onChange={e => setProfile({...profile, linkedin_url: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00A651]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-[#00A651] hover:bg-[#009040] disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div className="bg-[#111] border border-white/10 rounded-xl p-6 max-w-xl">
            <h2 className="text-lg font-bold text-white mb-6">Change Password</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                <input
                  required
                  type="password"
                  value={passwords.current_password}
                  onChange={e => setPasswords({...passwords, current_password: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00A651]"
                />
              </div>
              
              <hr className="border-white/10 my-6" />
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">New Password</label>
                <input
                  required
                  type="password"
                  minLength={8}
                  value={passwords.new_password}
                  onChange={e => setPasswords({...passwords, new_password: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00A651]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
                <input
                  required
                  type="password"
                  minLength={8}
                  value={passwords.confirm_password}
                  onChange={e => setPasswords({...passwords, confirm_password: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00A651]"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-[#00A651] hover:bg-[#009040] disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
              >
                <Lock className="w-4 h-4" /> {saving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
