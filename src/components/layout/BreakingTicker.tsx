"use client";

import { motion } from "framer-motion";

const NEWS_ITEMS = [
  "BREAKING: Dhaka Air Quality hits index 300 - Hazardous levels reported.",
  "TRAFFIC ALERT: Massive gridlock at Farmgate due to metro rail maintenance.",
  "TECH: Gen-Z startups in Gulshan raising record seed funding.",
  "CULTURE: Rickshaw art festival starts this Friday in Dhanmondi.",
  "JUST IN: Bangladesh Bank announces new digital currency pilot.",
];

export default function BreakingTicker() {
  return (
    <div className="sticky top-0 z-50 w-full bg-brand-green text-white py-2 overflow-hidden border-b border-black">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            repeat: Infinity,
            duration: 30,
            ease: "linear",
          }}
          className="flex items-center space-x-12 px-4"
        >
          {NEWS_ITEMS.concat(NEWS_ITEMS).map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="font-bold uppercase tracking-tighter text-sm">
                [ {index % NEWS_ITEMS.length + 1} ]
              </span>
              <span className="font-sans font-bold uppercase text-sm italic">
                {item}
              </span>
              <span className="w-2 h-2 bg-white rounded-full" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
