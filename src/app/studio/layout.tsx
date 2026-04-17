"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, LogOut, BarChart3 } from "lucide-react";
import { logoutAdmin } from "@/lib/actions/auth";

export const runtime = 'edge';

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/studio" },
    { name: "Articles", icon: FileText, href: "/studio/articles" },
    { name: "Analytics", icon: BarChart3, href: "/studio/analytics" },
    { name: "Settings", icon: Settings, href: "/studio/settings" },
  ];

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-black flex flex-col p-6 h-full">
        <div className="mb-12">
          <Link href="/">
            <Image 
              src="/DC (2).svg" 
              alt="Dhaka Chronicles Studio" 
              width={120} 
              height={40} 
              className="h-8 w-auto hover:grayscale transition-all"
            />
          </Link>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-red mt-2 block">
            Studio Panel
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 text-xs uppercase font-black tracking-widest transition-all group border ${
                  isActive 
                    ? "text-black bg-black/5 border-black" 
                    : "text-black/60 border-transparent hover:text-black hover:bg-black/5 hover:border-black"
                }`}
              >
                <item.icon size={16} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={() => logoutAdmin()}
          className="flex items-center space-x-3 px-4 py-3 text-xs uppercase font-black tracking-widest text-brand-red hover:bg-brand-red hover:text-white transition-all border border-transparent hover:border-black w-full"
        >
          <LogOut size={16} />
          <span>Exit Studio</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
