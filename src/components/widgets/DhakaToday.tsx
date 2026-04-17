"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Wind, Gauge, Car, CloudRain } from "lucide-react";

export default function DhakaToday() {
  const [data, setData] = useState({
    aqi: 156,
    traffic: "High",
    temp: 32,
    status: "Partly Cloudy"
  });

  // Simplified mock for real-time feel
  useEffect(() => {
    const timer = setInterval(() => {
      setData(prev => ({
        ...prev,
        aqi: Math.floor(Math.random() * (180 - 140) + 140),
      }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="neo-border bg-white p-6 flex flex-col justify-between h-full group hover:bg-black/5 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-serif text-2xl font-bold uppercase italic leading-none">
          Dhaka<br/><span className="text-brand-red">Today</span>
        </h3>
        <div className="bg-brand-red text-white text-[10px] font-bold px-2 py-1 uppercase translate-x-2 -translate-y-2">
          Live
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-black/50">
            <Gauge size={14} />
            <span className="text-[10px] uppercase font-bold tracking-widest">AQI</span>
          </div>
          <div className="text-2xl font-serif font-black text-brand-red leading-none">
            {data.aqi}
          </div>
          <div className="text-[8px] uppercase font-bold text-black/30">Unhealthy</div>
        </div>

        <div className="space-y-1 text-right">
          <div className="flex items-center justify-end space-x-2 text-black/50">
            <span className="text-[10px] uppercase font-bold tracking-widest">Traffic</span>
            <Car size={14} />
          </div>
          <div className="text-2xl font-serif font-black text-brand-green leading-none uppercase">
            {data.traffic}
          </div>
          <div className="text-[8px] uppercase font-bold text-black/30">Gulshan - Farmgate</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-black/50">
            <CloudRain size={14} />
            <span className="text-[10px] uppercase font-bold tracking-widest">Weather</span>
          </div>
          <div className="text-2xl font-serif font-black leading-none">
            {data.temp}°C
          </div>
          <div className="text-[8px] uppercase font-bold text-black/30">{data.status}</div>
        </div>

        <div className="flex items-end justify-end">
          <div className="w-12 h-12 neo-border border-dashed border-black/20 flex items-center justify-center group-hover:border-brand-red transition-colors relative">
            <div className="w-2 h-2 bg-brand-red animate-pulse rounded-full absolute top-1 right-1" />
            <Image 
              src="/logomark 2.svg" 
              alt="DC Logo" 
              width={24} 
              height={24} 
              className="opacity-20 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
