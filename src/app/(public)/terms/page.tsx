import CategoryHeader from "@/components/ui/CategoryHeader";

export default function TermsPage() {
  return (
    <div className="pb-32">
      <CategoryHeader 
        title="Terms of Service" 
        description="The ground rules for engaging with Dhaka Chronicles."
      />

      <div className="max-w-4xl mx-auto px-6 mt-20 font-sans">
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-black uppercase italic mb-4">1. Content Ownership</h2>
            <p className="text-black/70 leading-relaxed">
              All content published on Dhaka Chronicles, including text, graphics, logos, and images, is the property of Dhaka Chronicles Agency or its content suppliers and is protected by copyright laws. 
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-black uppercase italic mb-4">2. User Conduct</h2>
            <p className="text-black/70 leading-relaxed">
              Users are expected to engage with our platform respectfully. Harassment, hate speech, or any form of illegal activity will result in an immediate ban from interactive features.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-black uppercase italic mb-4">3. Disclaimers</h2>
            <p className="text-black/70 leading-relaxed">
              Dhaka Chronicles provides news and analysis "as is". While we strive for absolute accuracy, we are not liable for any errors or omissions in the content provided.
            </p>
          </section>

          <div className="p-8 neo-border bg-brand-green text-black text-[10px] font-black uppercase tracking-[0.3em]">
            Agreement Effective: April 17, 2026
          </div>
        </div>
      </div>
    </div>
  );
}
