'use client';

import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { Save, Plus, Trash2, Loader2, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const ADMIN_EMAIL = "j74risberg@gmail.com"; //

  useEffect(() => {
    if (isLoaded) {
      fetch('/api/content').then(res => res.json()).then(data => {
        setContent(data);
        setLoading(false);
      });
    }
  }, [isLoaded]);

  const saveContent = async () => {
    setSaving(true);
    await fetch('/api/content', { method: 'POST', body: JSON.stringify(content) });
    setSaving(false);
    alert("Sparat!");
  };

  if (!isLoaded || loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;
  if (user?.emailAddresses[0].emailAddress !== ADMIN_EMAIL) return <div className="p-10">Nekat tillträde.</div>;

  return (
    <main className="p-8 max-w-5xl mx-auto bg-white min-h-screen shadow-2xl border-x">
      <div className="flex justify-between items-center mb-10 border-b pb-6">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Portal Admin</h1>
        <button onClick={saveContent} disabled={saving} className="bg-black text-white px-8 py-3 font-bold uppercase tracking-widest text-xs flex items-center space-x-2">
          {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={18} />}
          <span>Spara Portal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* VÄNSTER KOLUMN: DESIGN & MENY */}
        <div className="space-y-10">
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest mb-4 bg-zinc-100 p-2 italic">1. Hero & Design</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-400">Huvudrubrik</label>
                <input value={content.heroTitle} onChange={e => setContent({...content, heroTitle: e.target.value})} className="w-full p-3 bg-zinc-50 border-b-2 border-black outline-none font-black text-xl" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1"><ImageIcon size={10}/> Bild-URL (Hero)</label>
                <input value={content.heroImage} onChange={e => setContent({...content, heroImage: e.target.value})} placeholder="https://..." className="w-full p-3 bg-zinc-50 border text-xs font-mono outline-none" />
              </div>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4 bg-zinc-100 p-2 italic">
              <h2 className="text-sm font-black uppercase tracking-widest">2. Toppmeny</h2>
              <button onClick={() => setContent({...content, topMenu: [...(content.topMenu || []), {name: "Ny länk", href: "/"}]})} className="text-[10px] font-bold bg-black text-white px-2 py-1 uppercase tracking-tighter">+ Lägg till</button>
            </div>
            <div className="space-y-2">
              {content.topMenu?.map((m: any, i: number) => (
                <div key={i} className="flex items-center gap-2 bg-zinc-50 p-2 border">
                  <input value={m.name} onChange={e => { const u = [...content.topMenu]; u[i].name = e.target.value; setContent({...content, topMenu: u}); }} className="flex-1 bg-transparent font-bold text-xs uppercase outline-none" />
                  <input value={m.href} onChange={e => { const u = [...content.topMenu]; u[i].href = e.target.value; setContent({...content, topMenu: u}); }} className="flex-1 bg-transparent text-[10px] text-zinc-400 outline-none" />
                  <button onClick={() => { const u = content.topMenu.filter((_:any, idx:number) => idx !== i); setContent({...content, topMenu: u}); }} className="text-red-400 p-1"><Trash2 size={14}/></button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* HÖGER KOLUMN: NYHETER */}
        <div>
          <section>
            <div className="flex justify-between items-center mb-4 bg-zinc-100 p-2 italic">
              <h2 className="text-sm font-black uppercase tracking-widest">3. Nyhetsflöde</h2>
              <button onClick={() => setContent({...content, news: [{title: "Nyhet", date: "IDAG", text: "Text..."}, ...(content.news || [])]})} className="text-[10px] font-bold bg-black text-white px-2 py-1 uppercase tracking-tighter">+ Nyhet</button>
            </div>
            <div className="space-y-4">
              {content.news?.map((n: any, i: number) => (
                <div key={i} className="p-4 border bg-zinc-50 relative group">
                  <button onClick={() => { const u = content.news.filter((_:any, idx:number) => idx !== i); setContent({...content, news: u}); }} className="absolute top-2 right-2 text-zinc-300 hover:text-red-600"><Trash2 size={16}/></button>
                  <input value={n.date} onChange={e => { const u = [...content.news]; u[i].date = e.target.value; setContent({...content, news: u}); }} className="text-[10px] font-bold text-blue-600 outline-none mb-1 block w-full bg-transparent" />
                  <input value={n.title} onChange={e => { const u = [...content.news]; u[i].title = e.target.value; setContent({...content, news: u}); }} className="font-black text-sm block w-full bg-transparent outline-none" />
                  <textarea value={n.text} onChange={e => { const u = [...content.news]; u[i].text = e.target.value; setContent({...content, news: u}); }} className="text-[10px] text-zinc-500 w-full mt-2 bg-transparent border-t pt-2 outline-none h-16 resize-none" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
