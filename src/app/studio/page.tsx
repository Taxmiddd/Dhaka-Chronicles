"use client";

export default function StudioPage() {
  return (
    <div className="p-12">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-serif font-black uppercase italic leading-none">
            Welcome, <span className="text-brand-red">Editor</span>
          </h1>
          <p className="text-xs font-black uppercase tracking-widest text-black/40 mt-4">
            Dhaka Chronicles Content Control Center
          </p>
        </div>
        <button className="bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-brand-red transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          New Article
        </button>
      </header>

      <div className="grid grid-cols-3 gap-8">
        {[
          { label: "Total Views", value: "1.2M", color: "text-black" },
          { label: "Articles Published", value: "48", color: "text-brand-red" },
          { label: "Engagement Rate", value: "14.2%", color: "text-brand-green" },
        ].map((stat) => (
          <div key={stat.label} className="neo-border p-8 bg-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] transition-all">
            <span className="text-[10px] font-black uppercase tracking-widest text-black/40">{stat.label}</span>
            <div className={`text-5xl font-serif font-black mt-2 ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-serif font-black uppercase italic mb-6 border-b border-black pb-2">
          Recent Drafts
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-6 border border-black/10 hover:border-black transition-all bg-white group">
              <div>
                <h3 className="text-lg font-serif font-bold uppercase italic group-hover:text-brand-red transition-colors">
                  The Future of Metro Rail: A New Perspective
                </h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-black/30">
                  Last edited 2 hours ago
                </span>
              </div>
              <button className="px-6 py-2 border border-black text-[10px] font-black uppercase hover:bg-black hover:text-white transition-all">
                Edit
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
