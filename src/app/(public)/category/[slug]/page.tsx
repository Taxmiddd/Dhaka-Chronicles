import { MOCK_ARTICLES } from "@/lib/data";
import CategoryHeader from "@/components/ui/CategoryHeader";
import ArticleCard from "@/components/ui/ArticleCard";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  // Normalized comparison (Politics -> politics)
  const categoryArticles = MOCK_ARTICLES.filter(
    (a) => a.category.toLowerCase() === slug.toLowerCase()
  );

  if (categoryArticles.length === 0) {
    // Check if it's a valid category at least
    const validCategories = ["politics", "tech", "culture", "edgy", "opinion", "news"];
    if (!validCategories.includes(slug.toLowerCase())) {
      notFound();
    }
  }

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="pb-20">
      <CategoryHeader 
        title={categoryName} 
        description={`The latest reports, analysis, and breaking updates from the heart of ${categoryName}. Curated for the digital-first generation of Dhaka.`}
      />
      
      <div className="max-w-7xl mx-auto px-6 mt-12">
        {categoryArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryArticles.map((article) => (
              <ArticleCard key={article.id} article={article} showCategory={false} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center neo-border bg-black/5">
            <h2 className="text-2xl font-serif font-black uppercase italic italic">
              No stories found in this section yet.
            </h2>
            <p className="font-bold uppercase tracking-widest text-xs mt-4 text-black/40">
              Check back soon for fresh chronicles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
