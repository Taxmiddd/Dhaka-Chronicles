"use client";

import { useActionState } from "react";
import { updateProfile, updatePassword } from "@/lib/actions/profile";
import { User, FileText, ImageIcon, Key, Save } from "lucide-react";
import Image from "next/image";

interface ProfileFormProps {
  profile: any;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [profileState, profileAction, profilePending] = useActionState(updateProfile, null);
  const [passwordState, passwordAction, passwordPending] = useActionState(updatePassword, null);

  return (
    <div className="space-y-12">
      {/* Identity Section */}
      <section className="p-10 neo-border bg-white">
        <form action={profileAction} className="space-y-8">
          <h2 className="text-2xl font-serif font-black uppercase italic border-b border-black pb-4 flex items-center space-x-3">
            <User size={24} />
            <span>Public Identity</span>
          </h2>

          <div className="grid grid-cols-2 gap-8">
            <div className="col-span-2 flex items-center space-x-8">
              <div className="w-24 h-24 neo-border bg-black/5 flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <Image src={profile.avatar_url} alt={profile.name} width={96} height={96} className="object-cover" />
                ) : (
                  <span className="font-serif italic text-4xl text-black/20">{profile?.name?.charAt(0) || 'D'}</span>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 flex items-center space-x-2">
                  <ImageIcon size={12} />
                  <span>Avatar URL (PFP)</span>
                </label>
                <input 
                  type="text" 
                  name="avatar_url"
                  defaultValue={profile?.avatar_url || ""}
                  placeholder="HTTPS://..."
                  className="w-full neo-border-sm px-4 py-2 outline-none focus:ring-2 focus:ring-brand-red font-bold text-xs" 
                />
              </div>
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Display Name</label>
              <input 
                type="text" 
                name="name" 
                defaultValue={profile?.name || ""}
                required
                className="w-full neo-border-sm px-4 py-3 outline-none focus:ring-2 focus:ring-brand-red font-bold uppercase" 
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 flex items-center space-x-2">
                <FileText size={12} />
                <span>Editorial Bio</span>
              </label>
              <textarea 
                name="bio"
                defaultValue={profile?.bio || ""}
                rows={4} 
                className="w-full neo-border-sm px-4 py-3 outline-none focus:ring-2 focus:ring-brand-red font-bold text-sm"
                placeholder="TELL YOUR STORY..."
              ></textarea>
            </div>
          </div>

          {profileState?.error && <div className="bg-brand-red text-white p-4 text-[10px] font-black uppercase tracking-widest neo-border-sm">{profileState.error}</div>}
          {profileState?.success && <div className="bg-brand-green text-white p-4 text-[10px] font-black uppercase tracking-widest neo-border-sm">{profileState.success}</div>}

          <button 
            type="submit"
            disabled={profilePending}
            className="bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-brand-red transition-all flex items-center space-x-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
          >
            <Save size={16} />
            <span>{profilePending ? "UPDATING..." : "SAVE PROFILE"}</span>
          </button>
        </form>
      </section>

      {/* Security Section */}
      <section className="p-10 neo-border bg-black/5">
        <form action={passwordAction} className="space-y-8">
          <h2 className="text-2xl font-serif font-black uppercase italic border-b border-black pb-4 flex items-center space-x-3 text-black">
            <Key size={24} />
            <span>Security Threshold</span>
          </h2>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2 col-span-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40">New Password</label>
              <input 
                type="password" 
                name="password"
                required
                className="w-full neo-border-sm px-4 py-3 outline-none focus:ring-2 focus:ring-brand-red font-bold" 
              />
            </div>
            <div className="space-y-2 col-span-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Confirm Password</label>
              <input 
                type="password" 
                name="confirm_password"
                required
                className="w-full neo-border-sm px-4 py-3 outline-none focus:ring-2 focus:ring-brand-red font-bold" 
              />
            </div>
          </div>

          {passwordState?.error && <div className="bg-brand-red text-white p-4 text-[10px] font-black uppercase tracking-widest neo-border-sm">{passwordState.error}</div>}
          {passwordState?.success && <div className="bg-brand-green text-white p-4 text-[10px] font-black uppercase tracking-widest neo-border-sm">{passwordState.success}</div>}

          <button 
            type="submit"
            disabled={passwordPending}
            className="bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-brand-red transition-all flex items-center space-x-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
          >
            <Key size={16} />
            <span>{passwordPending ? "UPDATING KEY..." : "UPDATE PASSWORD"}</span>
          </button>
        </form>
      </section>
    </div>
  );
}
