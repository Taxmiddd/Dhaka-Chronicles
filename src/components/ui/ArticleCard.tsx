import Image from "next/image";
import Link from "next/link";
import { Article } from "@/lib/types";

interface ArticleCardProps {
  article: Article;
  showCategory?: boolean;
}

export default function ArticleCard({ article, showCategory = true }: ArticleCardProps) {
  return (
    <Link 
      href={`/article/${article.id}`}
      className="group block neo-border bg-white overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
    >
      <div className="relative h-64 overflow-hidden border-b-2 border-black">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
        />
        {showCategory && (
          <div className="absolute top-4 left-4">
            <span className="bg-brand-red text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 neo-border-sm">
              {article.category}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-black/40">
            {article.author}
          </span>
          <div className="w-1 h-1 rounded-full bg-black/20" />
          <span className="text-[10px] font-black uppercase tracking-widest text-black/40">
            {article.date}
          </span>
        </div>
        
        <h3 className="text-xl font-serif font-black uppercase italic leading-tight group-hover:text-brand-red transition-colors mb-3">
          {article.title}
        </h3>
        
        <p className="text-sm text-black/60 font-medium line-clamp-2 italic">
          {article.excerpt}
        </p>
        
        <div className="mt-6 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-green">
            {article.readTime} Read
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
            Read Story →
          </span>
        </div>
      </div>
    </Link>
  );
}
