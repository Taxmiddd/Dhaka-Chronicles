import CategoryHeader from "@/components/ui/CategoryHeader";

export default function ContactPage() {
  return (
    <div className="pb-32">
      <CategoryHeader 
        title="Contact" 
        description="Have a tip? Want to collaborate? Or just want to say hello? Our line is always open."
      />

      <div className="max-w-7xl mx-auto px-6 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-serif font-black uppercase italic mb-4">The Studio</h2>
              <p className="font-sans text-black/60 leading-relaxed uppercase font-bold tracking-widest text-sm">
                Plaza 20, Road 11<br/>
                Banani, Dhaka 1213<br/>
                Bangladesh
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-black uppercase italic mb-4">Direct Lines</h2>
              <ul className="space-y-2 font-bold uppercase tracking-widest text-sm text-brand-red">
                <li><a href="mailto:tips@dhaka.com" className="hover:text-black transition-colors">tips@dhakachronicles.com</a></li>
                <li><a href="mailto:hello@dhaka.com" className="hover:text-black transition-colors">hello@dhakachronicles.com</a></li>
                <li><a href="tel:+8801700000000" className="hover:text-black transition-colors">+880 17 0000 0000</a></li>
              </ul>
            </section>

            <div className="p-8 neo-border bg-brand-green text-black">
              <h3 className="font-serif font-black uppercase italic text-xl mb-2">Anonymous Tips</h3>
              <p className="text-xs font-black uppercase tracking-widest leading-loose">
                We protect our sources. For sensitive information, use our encrypted PGP channel or drop a physical envelope at our studio.
              </p>
            </div>
          </div>

          <form className="neo-border p-10 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-serif font-black uppercase italic mb-8">Send a Message</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Full Name</label>
                <input type="text" className="w-full neo-border-sm px-4 py-3 outline-none focus:ring-2 focus:ring-brand-red" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Email Address</label>
                <input type="email" className="w-full neo-border-sm px-4 py-3 outline-none focus:ring-2 focus:ring-brand-red" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Subject</label>
                <select className="w-full neo-border-sm px-4 py-3 outline-none focus:ring-2 focus:ring-brand-red font-bold uppercase text-xs">
                  <option>News Tip</option>
                  <option>Advertising</option>
                  <option>Collaboration</option>
                  <option>Support</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Message</label>
                <textarea rows={5} className="w-full neo-border-sm px-4 py-3 outline-none focus:ring-2 focus:ring-brand-red"></textarea>
              </div>
              <button className="w-full bg-black text-white px-8 py-4 font-black uppercase hover:bg-brand-red transition-all">
                Dispatch Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
