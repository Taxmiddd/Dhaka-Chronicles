"use client";

import { useState } from "react";
import { Search, Filter, MoreVertical, Eye, Trash2, Power } from "lucide-react";
import { togglePostStatus, deletePost } from "@/lib/actions/posts";
import { format } from "date-fns";

interface ArticlesTableProps {
  initialPosts: any[];
}

export default function ArticlesTable({ initialPosts }: ArticlesTableProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState("");

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const result = await togglePostStatus(id, currentStatus);
    if (result.success) {
      setPosts(posts.map(p => p.id === id ? { ...p, is_published: !currentStatus } : p));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this chronicle? This cannot be undone.")) {
      const result = await deletePost(id);
      if (result.success) {
        setPosts(posts.filter(p => p.id !== id));
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH ARTICLES..." 
            className="w-full neo-border-sm pl-12 pr-4 py-3 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand-red"
          />
        </div>
      </div>

      <div className="neo-border bg-white overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-black bg-black/5">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Title & Analytics</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Editor</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Status</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id} className="border-b border-black/10 hover:bg-black/[0.02] transition-colors group">
                <td className="p-6">
                  <span className="font-serif font-bold uppercase italic group-hover:text-brand-red transition-colors block">
                    {post.title}
                  </span>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-[10px] font-black text-black/30 tracking-widest uppercase">
                       {format(new Date(post.created_at), 'MMM dd, yyyy')}
                    </span>
                    <span className="flex items-center space-x-1 text-[10px] font-black text-brand-green uppercase">
                      <Eye size={10} />
                      <span>{post.views} Views</span>
                    </span>
                  </div>
                </td>
                <td className="p-6 text-xs font-black uppercase tracking-widest text-black/60">
                   {post.profiles?.name || "Unknown"}
                </td>
                <td className="p-6">
                  <span className={`inline-flex items-center space-x-2 px-3 py-1 neo-border-sm text-[10px] font-black uppercase tracking-widest ${
                    post.is_published ? 'bg-brand-green/10 text-brand-green' : 'bg-black/5 text-black/40'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${post.is_published ? 'bg-brand-green' : 'bg-black/20'}`} />
                    <span>{post.is_published ? 'Published' : 'Draft'}</span>
                  </span>
                </td>
                <td className="p-6 text-right space-x-2">
                   <button 
                    onClick={() => handleToggle(post.id, post.is_published)}
                    title={post.is_published ? "Unpublish" : "Publish"}
                    className="p-2 hover:bg-black hover:text-white transition-all neo-border-sm"
                   >
                     <Power size={14} />
                   </button>
                   <button 
                    onClick={() => handleDelete(post.id)}
                    title="Delete"
                    className="p-2 hover:bg-brand-red hover:text-white transition-all neo-border-sm text-brand-red"
                   >
                     <Trash2 size={14} />
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
