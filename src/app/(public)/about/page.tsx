import CategoryHeader from "@/components/ui/CategoryHeader";

export default function AboutPage() {
  return (
    <div className="pb-32">
      <CategoryHeader 
        title="About Us" 
        description="Dhaka Chronicles is more than just a news outlet. It's a lens into the chaotic, vibrant, and evolving soul of Bangladesh's capital."
      />

      <div className="max-w-4xl mx-auto px-6 mt-20 font-sans">
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-serif font-black uppercase italic mb-6">Our Mission</h2>
            <p className="text-xl leading-relaxed text-black/80">
              We started with a simple observation: the stories of Dhaka were being told in ways that didn't resonate with the people actually living them. Dhaka Chronicles was born to bridge that gap. We report on the city with the grit, style, and urgency it deserves.
            </p>
          </section>

          <section className="bg-brand-red text-white p-12 neo-border">
            <h2 className="text-3xl font-serif font-black uppercase italic mb-6">The Chronicle Ethos</h2>
            <ul className="space-y-4 font-bold uppercase tracking-widest text-sm">
              <li>• RADICAL HONESTY IN REPORTING</li>
              <li>• PREMIUM VISUAL STORYTELLING</li>
              <li>• GEN-Z & MILLENNIAL FOCUS</li>
              <li>• HYPER-LOCAL ROOTS</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-black uppercase italic mb-6">The Team</h2>
            <p className="text-lg leading-relaxed text-black/70 mb-8">
              Based in the heart of Banani, our team consists of journalists, photographers, and digital artists who breathe the city air every day. We don't just cover Dhaka; we live it.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-black/5 neo-border-sm flex items-center justify-center font-serif italic text-4xl text-black/10">
                  DC 0{i}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
