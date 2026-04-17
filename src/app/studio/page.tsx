import { createClient } from "@/lib/supabase/server";
import { Plus, Eye, FileText, Layout } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function StudioPage() {
  const supabase = await createClient();
  
  // Fetch real aggregate stats
  const { data: posts } = await supabase.from('posts').select('views, is_published, title, created_at');
  
  const totalViews = posts?.reduce((acc, p) => acc + (Number(p.views) || 0), 0) || 0;
  const publishedCount = posts?.filter(p => p.is_published).length || 0;
  const drafts = posts?.filter(p => !p.is_published).slice(0, 5) || [];

  const stats = [
    { label: "Total Channel Views", value: totalViews >= 1000 ? `${(totalViews/1000).toFixed(1)}K` : totalViews, icon: Eye, color: "text-black" },
    { label: "Articles Published", value: publishedCount, icon: FileText, color: "text-brand-red" },
    { label: "Engagement Hub", value: "Active", icon: Layout, color: "text-brand-green" },
  ];

  return (
    <div className="p-12">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-serif font-black uppercase italic leading-none">
            Welcome, <span className="text-brand-red">Chronicle Team</span>
          </h1>
          <p className="text-xs font-black uppercase tracking-widest text-black/40 mt-4">
            Dhaka Chronicles Content Control Center
          </p>
        </div>
        <Link 
          href="/studio/articles" 
          className="bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-brand-red transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>New Article</span>
        </Link>
      </header>

      <div className="grid grid-cols-3 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="neo-border p-8 bg-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] transition-all group overflow-hidden relative">
            <stat.icon className="absolute right-4 top-4 text-black/5 group-hover:text-black/10 transition-colors" size={64} />
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/40">{stat.label}</span>
              <div className={`text-5xl font-serif font-black mt-2 ${stat.color}`}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-serif font-black uppercase italic mb-6 border-b border-black pb-2">
          Current Drafts
        </h2>
        {drafts.length > 0 ? (
          <div className="space-y-4">
            {drafts.map((draft: any) => (
              <div key={draft.title} className="flex items-center justify-between p-6 border border-black/10 hover:border-black transition-all bg-white group">
                <div>
                  <h3 className="text-lg font-serif font-bold uppercase italic group-hover:text-brand-red transition-colors">
                    {draft.title}
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/30">
                    Created {format(new Date(draft.created_at), 'MMM dd, yyyy')}
                  </span>
                </div>
                <button className="px-6 py-2 border border-black text-[10px] font-black uppercase hover:bg-black hover:text-white transition-all">
                  Continue Editing
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 neo-border-sm bg-black/5 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-black/30">No current drafts found.</p>
          </div>
        )}
      </section>
    </div>
  );
}
