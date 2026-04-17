interface CategoryHeaderProps {
  title: string;
  description?: string;
  color?: string;
}

export default function CategoryHeader({ 
  title, 
  description, 
  color = "bg-brand-red" 
}: CategoryHeaderProps) {
  return (
    <header className="py-16 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5 pointer-events-none select-none overflow-hidden h-64">
        <h2 className="text-[18rem] font-serif font-black uppercase italic leading-none whitespace-nowrap">
          {title}
        </h2>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center space-x-4 mb-6">
          <div className={`h-1 w-20 ${color}`} />
          <span className="text-xs font-black uppercase tracking-[0.5em] text-black/40">
            Topic Explorer
          </span>
        </div>
        
        <h1 className="text-8xl font-serif font-black uppercase italic tracking-tighter text-black leading-none mb-8">
          {title}
        </h1>
        
        {description && (
          <p className="max-w-2xl text-xl text-black/60 font-medium italic border-l-4 border-black pl-8 mt-10">
            {description}
          </p>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black/10" />
    </header>
  );
}
