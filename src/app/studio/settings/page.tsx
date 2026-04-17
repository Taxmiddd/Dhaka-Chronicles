"use client";

import { Save, User, Bell, Shield, Globe } from "lucide-react";

export default function StudioSettingsPage() {
  return (
    <div className="p-12">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-serif font-black uppercase italic leading-none">
            Studio <span className="text-brand-red">Settings</span>
          </h1>
          <p className="text-xs font-black uppercase tracking-widest text-black/40 mt-4">
            Configure your editorial environment
          </p>
        </div>
        <button className="bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-brand-red transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center space-x-2">
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </header>

      <div className="max-w-5xl">
        <div className="grid grid-cols-4 gap-12">
          {/* Settings Navigation */}
          <div className="col-span-1 space-y-2">
            {[
              { label: "Profile", icon: User },
              { label: "Notifications", icon: Bell },
              { label: "Security", icon: Shield },
              { label: "Site Config", icon: Globe },
            ].map((section, i) => (
              <button 
                key={section.label} 
                className={`w-full flex items-center space-x-3 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                  i === 0 ? "bg-black text-white border-black" : "hover:bg-black/5 border-transparent hover:border-black"
                }`}
              >
                <section.icon size={14} />
                <span>{section.label}</span>
              </button>
            ))}
          </div>

          {/* Settings Form */}
          <div className="col-span-3 space-y-12">
            <section className="p-10 neo-border bg-white">
              <h2 className="text-2xl font-serif font-black uppercase italic mb-8 border-b border-black pb-4">
                Profile Information
              </h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4 col-span-2 flex items-center space-x-8">
                  <div className="w-24 h-24 neo-border bg-black/5 flex items-center justify-center font-serif italic text-4xl text-black/20">
                    ED
                  </div>
                  <button className="bg-black text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-brand-red transition-all">
                    Change Avatar
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Display Name</label>
                  <input type="text" defaultValue="Editorial Team" className="w-full neo-border-sm px-4 py-3 outline-none focus:ring-2 focus:ring-brand-red" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Public Email</label>
                  <input type="email" defaultValue="editor@dhaka.com" className="w-full neo-border-sm px-4 py-3 outline-none focus:ring-2 focus:ring-brand-red" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Editorial Bio</label>
                  <textarea rows={4} className="w-full neo-border-sm px-4 py-3 outline-none focus:ring-2 focus:ring-brand-red" defaultValue="The collective voice of the Dhaka Chronicles editorial board."></textarea>
                </div>
              </div>
            </section>

            <section className="p-10 neo-border bg-brand-green/10">
              <h2 className="text-2xl font-serif font-black uppercase italic mb-8 border-b border-black pb-4 text-black">
                Danger Zone
              </h2>
              <p className="text-xs font-black uppercase tracking-widest text-black/60 mb-6">
                Irreversible actions that affect your entire account access.
              </p>
              <div className="flex space-x-4">
                <button className="bg-transparent border-2 border-brand-red text-brand-red px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all">
                  Deactivate Account
                </button>
                <button className="bg-brand-red text-white border-2 border-brand-red px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:border-black transition-all">
                  Delete All Data
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
