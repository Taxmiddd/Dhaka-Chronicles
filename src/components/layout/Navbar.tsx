"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["Politics", "Tech", "Culture", "Edgy", "Opinion"];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
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
            {CATEGORIES.map((link) => (
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
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-black hover:text-brand-red transition-all active:scale-95"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 top-[73px] z-50 bg-white md:hidden border-t border-black p-8 overflow-hidden"
          >
            <div className="flex flex-col space-y-8">
              {CATEGORIES.map((link, i) => (
                <motion.div
                  key={link}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <Link
                    href={`/category/${link.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    className="text-4xl font-serif font-black uppercase italic hover:text-brand-red transition-colors"
                  >
                    {link}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.4 }}
                className="pt-8 border-t border-black/10"
              >
                <Link 
                   href="/login" 
                   onClick={() => setIsOpen(false)}
                   className="text-xs font-black uppercase tracking-[0.3em] text-black/40 hover:text-brand-red"
                >
                  Editorial Login
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
