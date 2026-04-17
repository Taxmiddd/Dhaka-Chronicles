"use client";

import { useActionState } from "react";
import { createTeamMember } from "@/lib/actions/auth";
import { UserPlus, Shield, Mail, Lock, User } from "lucide-react";

export default function TeamManagementPage() {
  const [state, action, isPending] = useActionState(createTeamMember, null);

  return (
    <div className="p-12">
      <header className="mb-12">
        <h1 className="text-5xl font-serif font-black uppercase italic leading-none">
          Team <span className="text-brand-red">Onboarding</span>
        </h1>
        <p className="text-xs font-black uppercase tracking-widest text-black/40 mt-4 max-w-lg">
          Create editorial accounts for your journalists and editors. Account holders will be able to set their own biographies and profile pictures after logging in.
        </p>
      </header>

      <div className="max-w-2xl">
        <form action={action} className="neo-border p-10 bg-white">
          <div className="space-y-8">
            <h2 className="text-2xl font-serif font-black uppercase italic border-b border-black pb-4 flex items-center space-x-3">
              <UserPlus size={24} />
              <span>New Member Details</span>
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 flex items-center space-x-2">
                  <User size={12} />
                  <span>Full Name</span>
                </label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="E.G. ZAYAN AHMED"
                  className="w-full neo-border-sm px-4 py-3 outline-none focus:ring-2 focus:ring-brand-red font-bold uppercase transition-all" 
                />
              </div>

              <div className="space-y-2 col-span-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 flex items-center space-x-2">
                  <Mail size={12} />
                  <span>Email Address</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="EDITOR@DHAKA.COM"
                  className="w-full neo-border-sm px-4 py-3 outline-none focus:ring-2 focus:ring-brand-red font-bold transition-all" 
                />
              </div>

              <div className="space-y-2 col-span-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 flex items-center space-x-2">
                  <Shield size={12} />
                  <span>Role</span>
                </label>
                <select 
                  name="role"
                  className="w-full neo-border-sm px-4 py-3 outline-none focus:ring-2 focus:ring-brand-red font-bold uppercase appearance-none bg-white font-black text-xs"
                >
                  <option value="editor">Editor</option>
                  <option value="sub_editor">Sub-Editor</option>
                  <option value="founder">Founder (Admin)</option>
                </select>
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 flex items-center space-x-2">
                  <Lock size={12} />
                  <span>Initial Password</span>
                </label>
                <input 
                  type="text" 
                  name="password"
                  required
                  placeholder="ASSIGN A SECURE INITIAL KEY"
                  className="w-full neo-border-sm px-4 py-3 outline-none focus:ring-2 focus:ring-brand-red font-bold transition-all" 
                />
              </div>
            </div>

            {state?.error && (
              <div className="bg-brand-red text-white p-4 text-[10px] font-black uppercase tracking-widest neo-border-sm">
                {state.error}
              </div>
            )}

            {state?.success && (
              <div className="bg-brand-green text-white p-4 text-[10px] font-black uppercase tracking-widest neo-border-sm">
                {state.success}
              </div>
            )}

            <button 
              type="submit"
              disabled={isPending}
              className="w-full bg-black text-white px-8 py-5 font-black uppercase tracking-[0.2em] hover:bg-brand-red transition-all disabled:opacity-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
            >
              {isPending ? "Inviting to Chronicles..." : "Authorize & Create Account"}
            </button>
          </div>
        </form>

        <div className="mt-8 p-6 bg-black/5 neo-border-sm text-[10px] font-black uppercase tracking-widest text-black/40 leading-loose">
          <p>⚠️ PRO-TIP: New members should change their password immediately after their first successful login via the Studio Settings.</p>
        </div>
      </div>
    </div>
  );
}
