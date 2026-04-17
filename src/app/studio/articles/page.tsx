"use client";

import { MOCK_ARTICLES } from "@/lib/data";
import { Plus, Search, Filter, MoreVertical } from "lucide-react";

export default function StudioArticlesPage() {
  return (
    <div className="p-12">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-serif font-black uppercase italic leading-none">
            Content <span className="text-brand-red">Library</span>
          </h1>
          <p className="text-xs font-black uppercase tracking-widest text-black/40 mt-4">
            Manage your chronicles and stories
          </p>
        </div>
        <button className="bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-brand-red transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center space-x-2">
          <Plus size={16} />
          <span>Create New</span>
        </button>
      </header>

      {/* Filters/Search Bar */}
      <div className="flex space-x-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
          <input 
            type="text" 
            placeholder="SEARCH ARTICLES..." 
            className="w-full neo-border-sm pl-12 pr-4 py-3 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand-red"
          />
        </div>
        <button className="neo-border-sm px-6 py-3 flex items-center space-x-2 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
          <Filter size={16} />
          <span>Filters</span>
        </button>
      </div>

      {/* Articles Table */}
      <div className="neo-border bg-white overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-black bg-black/5">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Title</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Category</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Author</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Status</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ARTICLES.map((article) => (
              <tr key={article.id} className="border-b border-black/10 hover:bg-black/[0.02] transition-colors group">
                <td className="p-6">
                  <span className="font-serif font-bold uppercase italic group-hover:text-brand-red transition-colors">
                    {article.title}
                  </span>
                  <div className="text-[10px] font-black text-black/30 tracking-widest mt-1 uppercase">
                    ID: {article.id} • {article.readTime}
                  </div>
                </td>
                <td className="p-6">
                  <span className="bg-black/5 text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest neo-border-sm">
                    {article.category}
                  </span>
                </td>
                <td className="p-6 text-xs font-black uppercase tracking-widest text-black/60">
                  {article.author}
                </td>
                <td className="p-6">
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-brand-green" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-green">Published</span>
                  </span>
                </td>
                <td className="p-6 text-right">
                  <button className="p-2 hover:bg-black hover:text-white transition-all neo-border-sm">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
