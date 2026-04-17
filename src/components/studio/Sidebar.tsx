"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, LogOut, BarChart3, Users, User as UserIcon } from "lucide-react";
import { logoutAdmin } from "@/lib/actions/auth";

interface SidebarProps {
  profile: any;
}

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();

  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'founder';

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/studio" },
    { name: "Articles", icon: FileText, href: "/studio/articles" },
    { name: "Analytics", icon: BarChart3, href: "/studio/analytics" },
    ...(isAdmin ? [{ name: "Team", icon: Users, href: "/studio/team" }] : []),
    { name: "Settings", icon: Settings, href: "/studio/settings" },
  ];

  return (
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

      {/* User Profile Summary */}
      <div className="mt-auto pt-6 border-t border-black/10 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 neo-border-sm bg-black/5 flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <Image src={profile.avatar_url} alt={profile.name} width={40} height={40} className="object-cover" />
            ) : (
              <UserIcon size={20} className="text-black/20" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest truncate">{profile?.name || 'Anonymous'}</p>
            <p className="text-[8px] font-black uppercase tracking-widest text-brand-red">{profile?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={() => logoutAdmin()}
        className="flex items-center space-x-3 px-4 py-3 text-xs uppercase font-black tracking-widest text-brand-red hover:bg-brand-red hover:text-white transition-all border border-transparent hover:border-black w-full"
      >
        <LogOut size={16} />
        <span>Exit Studio</span>
      </button>
    </aside>
  );
}
