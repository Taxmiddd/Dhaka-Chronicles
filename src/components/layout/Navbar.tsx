import Link from "next/link";
import Image from "next/image";
import { Search, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-black bg-white/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 md:top-auto z-40">
      <div className="flex items-center space-x-8">
        <Link href="/" className="group relative">
          <Image 
            src="/DC (2).svg" 
            alt="Dhaka Chronicles" 
            width={180} 
            height={60} 
            className="h-10 w-auto"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {["Politics", "Tech", "Culture", "Edgy", "Opinion"].map((link) => (
            <Link
              key={link}
              href={`/category/${link.toLowerCase()}`}
              className="text-xs uppercase tracking-widest font-sans font-black text-black hover:text-brand-red transition-colors"
            >
              {link}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <Link href="/search" className="text-black hover:text-brand-red transition-colors">
          <Search size={20} />
        </Link>
        <button className="md:hidden text-black hover:text-brand-red transition-colors">
          <Menu size={20} />
        </button>
      </div>
    </nav>
  );
}
