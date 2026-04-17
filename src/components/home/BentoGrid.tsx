import { createClient } from "@/lib/supabase/server";
import DhakaToday from "../widgets/DhakaToday";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function BentoGrid() {
  const supabase = await createClient();
  
  // Fetch Top 4 published articles for the grid
  const { data: articles } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(4);

  // Fallback if no articles are published yet
  if (!articles || articles.length < 1) {
    return (
      <div className="p-12 neo-border bg-black/5 text-center mt-6">
        <p className="text-xs font-black uppercase tracking-widest text-black/40 italic">Waiting for the next Chronicle...</p>
      </div>
    );
  }

  // Define sizes for the grid layout logic
  const gridPositions = [
    "md:col-span-2 md:row-span-2", // Featured Large
    "md:col-span-1 md:row-span-1", // Medium 1
    "md:col-span-1 md:row-span-1", // Small/Iconic 1
    "md:col-span-1 md:row-span-2", // Tall
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-4 p-6">
      {/* Dhaka Today Widget - Static Position */}
      <div className="md:col-span-1 md:row-span-1">
        <DhakaToday />
      </div>

      {articles.map((article, index) => {
        const positionClass = gridPositions[index] || "md:col-span-1 md:row-span-1";
        
        return (
          <Link 
            key={article.id} 
            href={`/article/${article.id}`}
            className={`${positionClass} group relative overflow-hidden neo-border bg-white`}
          >
            {article.cover_image && (
              <Image 
                src={article.cover_image} 
                alt={article.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-0 left-0 p-6 z-20 space-y-2">
              <h2 className="text-xl md:text-2xl font-serif font-black leading-tight uppercase italic text-white group-hover:text-brand-red transition-colors">
                {article.title}
              </h2>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
