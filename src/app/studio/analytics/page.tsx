"use client";

import { TrendingUp, Users, Clock, MousePointer2 } from "lucide-react";

export default function StudioAnalyticsPage() {
  return (
    <div className="p-12">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-serif font-black uppercase italic leading-none">
            Deep <span className="text-brand-red">Insights</span>
          </h1>
          <p className="text-xs font-black uppercase tracking-widest text-black/40 mt-4">
            Audience engagement and traffic metrics
          </p>
        </div>
        <div className="flex space-x-2">
           {['7D', '30D', '90D', 'ALL'].map(period => (
             <button key={period} className="px-4 py-2 neo-border-sm text-[10px] font-black hover:bg-black hover:text-white transition-all">
               {period}
             </button>
           ))}
        </div>
      </header>

      {/* Analytics Grid */}
      <div className="grid grid-cols-4 gap-8 mb-12">
        {[
          { label: "UNIQUE READERS", value: "242K", icon: Users, trend: "+12.5%" },
          { label: "AVG. READ TIME", value: "4:22", icon: Clock, trend: "+2.1%" },
          { label: "CTR", value: "8.4%", icon: MousePointer2, trend: "-1.2%" },
          { label: "PAGE RANK", value: "#4", icon: TrendingUp, trend: "+2" },
        ].map((stat) => (
          <div key={stat.label} className="neo-border p-8 bg-white overflow-hidden relative">
            <stat.icon className="absolute right-4 top-4 text-black/5" size={64} />
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/40">{stat.label}</span>
              <div className="text-4xl font-serif font-black mt-2">{stat.value}</div>
              <div className={`text-[10px] font-black mt-2 ${stat.trend.startsWith('+') ? 'text-brand-green' : 'text-brand-red'}`}>
                {stat.trend} VS PREVIOUS PERIOD
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Mock Chart Section */}
        <div className="neo-border p-10 bg-black text-white h-[400px] flex flex-col">
          <h3 className="text-xl font-serif font-black uppercase italic mb-8">Traffic Velocity</h3>
          <div className="flex-1 flex items-end space-x-4">
            {[40, 70, 45, 90, 65, 80, 50, 95, 75, 85].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 bg-brand-red group relative" 
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black">
                  {h}K
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-[10px] font-black uppercase tracking-widest text-white/30">
            <span>MON</span>
            <span>WED</span>
            <span>FRI</span>
            <span>SUN</span>
          </div>
        </div>

        <div className="neo-border p-10 bg-white">
          <h3 className="text-xl font-serif font-black uppercase italic mb-8 border-b border-black pb-4">Top Performing Sections</h3>
          <div className="space-y-6">
            {[
              { cat: "Politics", val: "45%", color: "bg-brand-red" },
              { cat: "Tech", val: "25%", color: "bg-black" },
              { cat: "Culture", val: "18%", color: "bg-brand-green" },
              { cat: "Others", val: "12%", color: "bg-black/20" },
            ].map((entry) => (
              <div key={entry.cat}>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                  <span>{entry.cat}</span>
                  <span>{entry.val}</span>
                </div>
                <div className="h-4 bg-black/5 neo-border-sm overflow-hidden">
                  <div className={`h-full ${entry.color}`} style={{ width: entry.val }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
