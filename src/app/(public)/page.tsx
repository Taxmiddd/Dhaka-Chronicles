import BentoGrid from "@/components/home/BentoGrid";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto w-full">
      <header className="p-6 pb-2">
        <div className="flex items-baseline space-x-2 text-black">
          <h2 className="text-6xl font-serif font-black uppercase italic tracking-tighter">
            The <span className="text-brand-red">Front</span> Page
          </h2>
          <div className="h-1 flex-1 bg-black/10 mb-2" />
          <span className="text-xs font-bold uppercase tracking-widest text-black/30 whitespace-nowrap">
            Updated 2 Mins Ago
          </span>
        </div>
      </header>

      <BentoGrid />
      
      {/* Secondary Section / Newsletter Hook */}
      <section className="p-6">
        <div className="neo-border bg-brand-red p-12 flex flex-col md:flex-row items-center justify-between">
          <div className="text-white mb-8 md:mb-0">
            <h3 className="text-4xl font-serif font-black uppercase italic leading-none">
              Subscribe to the<br/>Chronicle newsletter
            </h3>
            <p className="font-sans font-bold uppercase tracking-widest text-xs mt-4">
              No spam. Just highlights. Straight to your inbox.
            </p>
          </div>
          <div className="flex w-full md:w-auto space-x-2">
            <input 
              type="email" 
              placeholder="EMAIL@DHAKA.COM" 
              className="bg-white text-black px-6 py-4 font-bold border-none focus:ring-2 focus:ring-brand-green outline-none w-full md:w-80"
            />
            <button className="bg-black text-white px-8 py-4 font-black uppercase hover:bg-white hover:text-black transition-all">
              Join
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
