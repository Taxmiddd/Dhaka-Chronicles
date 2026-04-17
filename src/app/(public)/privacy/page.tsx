import CategoryHeader from "@/components/ui/CategoryHeader";

export default function PrivacyPage() {
  return (
    <div className="pb-32">
      <CategoryHeader 
        title="Privacy Policy" 
        description="We respect your data. Here is how we handle it."
      />

      <div className="max-w-4xl mx-auto px-6 mt-20 font-sans">
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-black uppercase italic mb-4">1. Data Collection</h2>
            <p className="text-black/70 leading-relaxed">
              We collect minimal data necessary to provide our services. This includes your IP address for security purposes and analytics to improve our content delivery. If you subscribe to our newsletter, we store your email address securely.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-black uppercase italic mb-4">2. Cookies</h2>
            <p className="text-black/70 leading-relaxed">
              We use functional cookies to remember your preferences (like theme settings) and analytical cookies to understand how you interact with Dhaka Chronicles. You can disable these in your browser settings.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-black uppercase italic mb-4">3. Third Parties</h2>
            <p className="text-black/70 leading-relaxed">
              We do not sell your personal data. We may share anonymous, aggregated data with our advertising partners to keep our chronicles free for everyone.
            </p>
          </section>

          <div className="p-8 neo-border bg-black text-white text-[10px] font-black uppercase tracking-[0.3em]">
            Last Updated: April 17, 2026
          </div>
        </div>
      </div>
    </div>
  );
}
