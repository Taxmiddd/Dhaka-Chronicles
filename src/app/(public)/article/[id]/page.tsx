import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ViewTracker from "@/components/analytics/ViewTracker";
import { format } from "date-fns";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: article } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        name,
        bio,
        avatar_url
      )
    `)
    .eq('id', id)
    .single();

  if (!article) notFound();

  return (
    <article className="pb-32 bg-white min-h-screen">
      <ViewTracker articleId={article.id} />

      {/* Article Header */}
      <header className="relative h-[80vh] w-full overflow-hidden border-b border-black">
        {article.cover_image && (
          <Image 
            src={article.cover_image} 
            alt={article.title} 
            fill 
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        
        <div className="absolute bottom-0 left-0 p-12 z-20 max-w-6xl text-left">
          <span className="bg-brand-red text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1 neo-border-sm mb-6 inline-block">
             Dhaka Chronicle / {article.category || 'NEWS'}
          </span>
          <h1 className="text-5xl md:text-8xl font-serif font-black uppercase italic tracking-tighter leading-[0.85] text-white">
            {article.title}
          </h1>
        </div>
      </header>

      {/* Article Content & Author */}
      <div className="max-w-4xl mx-auto px-6 mt-20">
        <div className="flex items-center space-x-6 mb-16 border-y border-black/10 py-10">
           <div className="w-20 h-20 neo-border bg-black/5 flex-shrink-0 relative overflow-hidden">
             {article.profiles?.avatar_url && (
               <Image src={article.profiles.avatar_url} alt="Author" fill className="object-cover" />
             )}
           </div>
           <div className="text-left">
             <p className="text-[10px] font-black uppercase tracking-widest text-brand-red">Words by</p>
             <h3 className="text-2xl font-serif font-black uppercase italic">{article.profiles?.name || 'Dhaka Correspondent'}</h3>
             <p className="text-[10px] font-black uppercase tracking-widest text-black/30 mt-1">
               Published {format(new Date(article.created_at), 'MMMM dd, yyyy')}
             </p>
           </div>
        </div>

        <div className="prose prose-2xl font-serif leading-relaxed text-black/90 first-letter:text-8xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:text-brand-red text-left">
           {article.content?.text || (typeof article.content === 'string' ? article.content : "The full story is currently being processed...")}
        </div>

        {/* Share Section */}
        <div className="mt-24 pt-10 border-t-2 border-black flex items-center justify-between">
          <div className="flex items-center space-x-6">
             <span className="text-[10px] font-black uppercase tracking-widest">Broadcast this story</span>
             <div className="flex space-x-2">
               {['TW', 'FB', 'WA'].map(social => (
                 <button key={social} className="w-12 h-12 neo-border-sm hover:bg-black hover:text-white transition-all text-xs font-black uppercase">
                   {social}
                 </button>
               ))}
             </div>
          </div>
          <Link href="/" className="text-xs font-black uppercase tracking-widest hover:text-brand-red transition-all group">
            <span className="group-hover:mr-2 transition-all">←</span> Back to Front Page
          </Link>
        </div>
      </div>
    </article>
  );
}
