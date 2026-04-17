import { MOCK_ARTICLES } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ArticleCard from "@/components/ui/ArticleCard";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = MOCK_ARTICLES.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  const relatedArticles = MOCK_ARTICLES.filter(
    (a) => a.category === article.category && a.id !== article.id
  ).slice(0, 3);

  return (
    <article className="pb-32">
      {/* Article Header */}
      <header className="pt-20 pb-12 px-6 border-b border-black">
        <div className="max-w-4xl mx-auto">
          <Link 
            href={`/category/${article.category.toLowerCase()}`}
            className="inline-block bg-brand-red text-white text-xs font-black uppercase tracking-[0.3em] px-4 py-1 neo-border-sm mb-8 hover:bg-black transition-colors"
          >
            {article.category}
          </Link>
          
          <h1 className="text-6xl md:text-8xl font-serif font-black uppercase italic tracking-tighter leading-none mb-10">
            {article.title}
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 border-y-2 border-black/10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-serif italic font-black text-xl">
                {article.author.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-black/50">Written By</p>
                <p className="font-serif font-black uppercase italic tracking-tight">{article.author}</p>
              </div>
            </div>
            
            <div className="flex space-x-12">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-black/50">Published</p>
                <p className="font-bold uppercase tracking-tight">{article.date}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-black/50">Reading Time</p>
                <p className="font-bold uppercase tracking-tight">{article.readTime}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="relative h-[600px] w-full neo-border overflow-hidden">
          <Image 
            src={article.image} 
            alt={article.title} 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute bottom-4 right-10 bg-white/90 backdrop-blur-sm neo-border-sm px-4 py-2 text-[10px] font-black uppercase tracking-widest">
          Chronicle Visual / {article.category}
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 mt-20">
        <div className="prose prose-xl max-w-none">
          <p className="text-2xl font-serif italic font-medium leading-relaxed mb-12 border-l-8 border-brand-green pl-10 text-black/80">
            {article.excerpt}
          </p>
          
          <div className="font-sans text-xl leading-loose space-y-8 text-black/90">
            {/* Mock content blocks */}
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            
            <figure className="my-16 py-12 border-y-2 border-black/5">
              <blockquote className="text-4xl font-serif font-black uppercase italic tracking-tighter leading-tight text-center">
                "The future of Dhaka isn't just about buildings, it's about the pulse of the streets."
              </blockquote>
              <figcaption className="text-center mt-6 text-xs font-black uppercase tracking-[0.5em] text-black/30">
                — Field Observation
              </figcaption>
            </figure>

            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
            </p>
            <p>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
          </div>
        </div>

        {/* Share Section */}
        <div className="mt-20 pt-10 border-t-2 border-black flex items-center justify-between">
          <div className="flex items-center space-x-4">
             <span className="text-xs font-black uppercase tracking-widest">Share this chronicle</span>
             <div className="flex space-x-2">
               {['Twitter', 'FB', 'WA'].map(social => (
                 <button key={social} className="w-10 h-10 neo-border-sm hover:bg-black hover:text-white transition-all text-[10px] font-black uppercase">
                   {social}
                 </button>
               ))}
             </div>
          </div>
          <Link href="/" className="text-xs font-black uppercase tracking-widest hover:text-brand-red transition-colors">
            Back to Front Page ←
          </Link>
        </div>
      </div>

      {/* Related Stories */}
      {relatedArticles.length > 0 && (
        <section className="bg-black/5 mt-32 py-24 px-6 border-t border-black">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-serif font-black uppercase italic tracking-tighter mb-12">
              Related <span className="text-brand-red">Chronicles</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map(rel => (
                <ArticleCard key={rel.id} article={rel} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
