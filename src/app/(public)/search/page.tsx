import { MOCK_ARTICLES } from "@/lib/data";
import ArticleCard from "@/components/ui/ArticleCard";
import CategoryHeader from "@/components/ui/CategoryHeader";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  
  const searchResults = q 
    ? MOCK_ARTICLES.filter(a => 
        a.title.toLowerCase().includes(q.toLowerCase()) || 
        a.excerpt.toLowerCase().includes(q.toLowerCase()) ||
        a.category.toLowerCase().includes(q.toLowerCase())
      )
    : [];

  return (
    <div className="pb-32">
      <CategoryHeader 
        title={q ? `Search: ${q}` : "Search Chronicles"} 
        description={q ? `Found ${searchResults.length} matches for your query.` : "Looking for something specific? Search the archives of Dhaka Chronicles."}
      />

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <form className="mb-20 flex max-w-2xl mx-auto">
          <input 
            type="text" 
            name="q" 
            defaultValue={q}
            placeholder="Type your search query..." 
            className="flex-1 neo-border px-6 py-4 font-bold text-xl outline-none focus:ring-2 focus:ring-brand-red"
          />
          <button 
            type="submit"
            className="bg-black text-white px-10 py-4 font-black uppercase neo-border border-l-0 hover:bg-white hover:text-black transition-all"
          >
            Search
          </button>
        </form>

        {q && searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : q ? (
          <div className="py-32 text-center neo-border bg-black/5">
            <h2 className="text-3xl font-serif font-black uppercase italic">
              No results found for "{q}"
            </h2>
            <p className="font-bold uppercase tracking-widest text-xs mt-4 text-black/40">
              Try different keywords or browse our categories.
            </p>
          </div>
        ) : (
          <div className="py-32 text-center neo-border bg-black/5 opacity-50">
            <p className="font-bold uppercase tracking-[0.5em] text-xs">
              Waiting for search parameters...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
