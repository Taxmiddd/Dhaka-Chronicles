"use client";

import { useActionState } from "react";
import { loginAdmin, logoutAdmin } from "@/lib/actions/auth";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAdmin, null);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-serif font-black uppercase italic tracking-tighter mb-4">
            Studio <span className="text-brand-red">Login</span>
          </h1>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-black/30">
            Authorization Required
          </p>
        </div>

        <form action={action} className="neo-border p-8 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Editorial Email</label>
              <input 
                type="email" 
                name="email"
                required
                className="w-full neo-border-sm px-4 py-3 outline-none focus:ring-2 focus:ring-brand-red font-bold" 
                placeholder="editor@dhaka.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Editorial Password</label>
              <input 
                type="password" 
                name="password"
                required
                className="w-full neo-border-sm px-4 py-3 outline-none focus:ring-2 focus:ring-brand-red font-bold" 
                placeholder="••••••••••••"
              />
            </div>

            {state?.error && (
              <div className="bg-brand-red text-white p-4 text-[10px] font-black uppercase tracking-widest neo-border-sm">
                {state.error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isPending}
              className="w-full bg-black text-white px-8 py-4 font-black uppercase tracking-widest hover:bg-brand-red transition-all disabled:opacity-50"
            >
              {isPending ? "Validating Identity..." : "Enter Studio"}
            </button>
          </div>
        </form>

        <div className="text-center mt-12">
          <p className="text-[10px] font-black uppercase tracking-widest text-black/20">
            Dhaka Chronicles © 2026<br/>
            Secure Content Control
          </p>
        </div>
      </div>
    </div>
  );
}
