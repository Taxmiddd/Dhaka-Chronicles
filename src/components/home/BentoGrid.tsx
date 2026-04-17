"use client";

import { motion } from "framer-motion";
import DhakaToday from "../widgets/DhakaToday";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

interface Article {
  id: string;
  title: string;
  category: string;
  image: string;
  size: "small" | "medium" | "large" | "tall";
}

const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "The Rise of Underground Fashion in Old Dhaka",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1518005020251-095c182749ad?w=800&q=80",
    size: "large"
  },
  {
    id: "2",
    title: "Traffic Woes: Why Gulshan is Frozen",
    category: "News",
    image: "https://images.unsplash.com/photo-1545143333-6382f1d5b893?w=800&q=80",
    size: "medium"
  },
  {
    id: "3",
    title: "Gen-Z and the Digital Taka",
    category: "Tech",
    image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&q=80",
    size: "small"
  },
  {
    id: "4",
    title: "Rickshaws: The Iconic Soul of the City",
    category: "Opinion",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80",
    size: "tall"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function BentoGrid() {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-4 p-6"
    >
      {/* Dhaka Today Widget - Static Position */}
      <motion.div variants={item} className="md:col-span-1 md:row-span-1">
        <DhakaToday />
      </motion.div>

      {/* Featured Large Article */}
      <motion.div variants={item} className="md:col-span-2 md:row-span-2 group relative overflow-hidden neo-border bg-white">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity" />
        <Image 
          src={MOCK_ARTICLES[0].image} 
          alt={MOCK_ARTICLES[0].title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 p-8 z-20 space-y-2">
          <span className="bg-brand-red text-white text-[10px] font-bold px-2 py-1 uppercase">
            {MOCK_ARTICLES[0].category}
          </span>
          <h2 className="text-4xl font-serif font-black leading-tight uppercase italic text-white group-hover:text-brand-red transition-colors cursor-pointer">
            {MOCK_ARTICLES[0].title}
          </h2>
          <div className="flex items-center space-x-4 pt-4 text-white">
            <button className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest hover:text-brand-red transition-colors">
              <span>Read Full Story</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tall Article */}
      <motion.div variants={item} className="md:col-span-1 md:row-span-2 group relative overflow-hidden neo-border bg-white">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 opacity-60" />
        <Image 
          src={MOCK_ARTICLES[3].image} 
          alt={MOCK_ARTICLES[3].title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 p-6 z-20 space-y-2">
          <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-brand-green px-2 py-1">
            {MOCK_ARTICLES[3].category}
          </span>
          <h2 className="text-2xl font-serif font-black leading-tight uppercase italic text-white">
            {MOCK_ARTICLES[3].title}
          </h2>
        </div>
      </motion.div>

      {/* Medium Article */}
      <motion.div variants={item} className="md:col-span-1 md:row-span-1 group relative overflow-hidden neo-border bg-white">
        <Image 
          src={MOCK_ARTICLES[1].image} 
          alt={MOCK_ARTICLES[1].title}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-all z-10" />
        <div className="absolute inset-0 p-6 z-20 flex flex-col justify-end">
          <h3 className="text-lg font-serif font-bold uppercase leading-tight italic text-white">
            {MOCK_ARTICLES[1].title}
          </h3>
        </div>
      </motion.div>

      {/* Small/Digital Article */}
      <motion.div variants={item} className="md:col-span-1 md:row-span-1 neo-border bg-white p-6 flex flex-col justify-between hover:border-brand-red transition-colors cursor-pointer group hover:bg-black/5">
        <div className="flex justify-between items-start">
          <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:border-brand-red transition-colors">
            <ArrowUpRight size={14} className="text-black/50 group-hover:text-brand-red transition-colors" />
          </div>
          <span className="text-[10px] font-bold uppercase text-black/30 tracking-tighter">12 Mins Read</span>
        </div>
        <div>
          <span className="text-brand-green text-[8px] font-bold uppercase block mb-1">Blockchain</span>
          <h3 className="text-lg font-serif font-bold uppercase leading-tight text-black">
            {MOCK_ARTICLES[2].title}
          </h3>
        </div>
      </motion.div>
    </motion.div>
  );
}
