import Image from "next/image";
import Link from "next/link";
import BreakingTicker from "@/components/layout/BreakingTicker";
import Navbar from "@/components/layout/Navbar";

import { Instagram, Facebook, Linkedin } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <BreakingTicker />
      <Navbar />
      
      <main className="flex-1">
        {children}
      </main>

      <footer className="pt-32 pb-12 px-6 border-t border-black bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
            <div className="col-span-1 md:col-span-1">
              <Image 
                src="/DC (2).svg" 
                alt="Dhaka Chronicles" 
                width={150} 
                height={50} 
                className="h-8 w-auto mb-6"
              />
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-black/60 leading-relaxed max-w-xs">
                Delivering timely, accurate and engaging news content that resonates. Reporting from the heart of Dhaka with grit, style, and absolute truth.
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-red mb-2">Sections</h4>
              <Link href="/category/politics" className="text-xs font-black uppercase tracking-widest hover:text-brand-red transition-colors">Politics</Link>
              <Link href="/category/tech" className="text-xs font-black uppercase tracking-widest hover:text-brand-red transition-colors">Tech</Link>
              <Link href="/category/culture" className="text-xs font-black uppercase tracking-widest hover:text-brand-red transition-colors">Culture</Link>
              <Link href="/category/edgy" className="text-xs font-black uppercase tracking-widest hover:text-brand-red transition-colors">Edgy</Link>
            </div>

            <div className="flex flex-col space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-red mb-2">Agency</h4>
              <Link href="/about" className="text-xs font-black uppercase tracking-widest hover:text-brand-red transition-colors">About Us</Link>
              <Link href="/contact" className="text-xs font-black uppercase tracking-widest hover:text-brand-red transition-colors">Contact</Link>
              <Link href="/privacy" className="text-xs font-black uppercase tracking-widest hover:text-brand-red transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-xs font-black uppercase tracking-widest hover:text-brand-red transition-colors">Terms of Service</Link>
            </div>

            <div className="flex flex-col space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-red mb-2">Connect</h4>
              <a href="https://www.facebook.com/p/Dhaka-Chronicles-61563127311472/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest hover:text-brand-red transition-colors group">
                <Facebook size={14} className="text-black group-hover:text-brand-red transition-colors" />
                <span>Facebook</span>
              </a>
              <a href="https://www.instagram.com/dhakachronicles/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest hover:text-brand-red transition-colors group">
                <Instagram size={14} className="text-black group-hover:text-brand-red transition-colors" />
                <span>Instagram</span>
              </a>
              <a href="https://www.linkedin.com/company/dhaka-chronicles" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest hover:text-brand-red transition-colors group">
                <Linkedin size={14} className="text-black group-hover:text-brand-red transition-colors" />
                <span>LinkedIn</span>
              </a>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-black flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] font-black uppercase tracking-widest">
            <div className="text-black/40">
              © {new Date().getFullYear()} Dhaka Chronicles Agency. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-1">
              <span className="text-black/20">Developed by</span>
              <a 
                href="https://noeticstudio.net" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-black hover:text-brand-red transition-colors underline decoration-black/10 underline-offset-4"
              >
                NOÉTIC Studio
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
