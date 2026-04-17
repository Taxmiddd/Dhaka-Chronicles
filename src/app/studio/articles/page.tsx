import { Plus } from "lucide-react";
import ArticlesTable from "@/components/studio/ArticlesTable";
import { createClient } from "@/lib/supabase/server";

export default async function StudioArticlesPage() {
  const supabase = await createClient();
  
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        name
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="p-12">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-serif font-black uppercase italic leading-none">
            Content <span className="text-brand-red">Library</span>
          </h1>
          <p className="text-xs font-black uppercase tracking-widest text-black/40 mt-4">
            Manage your chronicles and stories
          </p>
        </div>
        <button className="bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-brand-red transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center space-x-2">
          <Plus size={16} />
          <span>Create New</span>
        </button>
      </header>

      {error ? (
        <div className="p-8 neo-border bg-brand-red/10 text-brand-red text-xs font-black uppercase tracking-widest">
           Error fetching chronicles: {error.message}
        </div>
      ) : (
        <ArticlesTable initialPosts={posts || []} />
      )}
    </div>
  );
}
