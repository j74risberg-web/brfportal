'use client';

import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { Save, Plus, Trash2, Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const ADMIN_EMAIL = "j74risberg@gmail.com";

  useEffect(() => {
    if (isLoaded) {
      fetch('/api/content').then(res => res.json()).then(data => {
        setContent(data);
        setLoading(false);
      });
    }
  }, [isLoaded]);

  const save = async () => {
    setSaving(true);
    await fetch('/api/content', { method: 'POST', body: JSON.stringify(content) });
    setSaving(false);
    alert("System uppdaterat.");
  };

  if (!isLoaded || loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (user?.emailAddresses[0].emailAddress !== ADMIN_EMAIL) return <div className="p-20 text-center font-black uppercase">Nekat tillträde.</div>;

  return (
    <main className="min-h-screen bg-zinc-50 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-zinc-200 rounded-full transition-colors"><ArrowLeft size={20}/></Link>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">Portal Control</h1>
          </div>
          <button onClick={save} disabled={saving} className="bg-black text-white px-10 py-4 font-black uppercase text-xs tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl flex items-center gap-2">
            {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />} Spara Ändringar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* DESIGN SETTINGS */}
          <div className="lg:col-span-1 space-y-8">
            <section className="bg-white p-8 border border-zinc-200 shadow-sm">
              <h2 className="text-xs font-black uppercase tracking-widest mb-6 border-b pb-2 italic">Design & Identitet</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-400 block mb-1">Hero Rubrik</label>
                  <input value={content.heroTitle} onChange={e => setContent({...content, heroTitle: e.target.value})} className="w-full bg-zinc-50 p-4 border-none text-xl font-black uppercase tracking-tighter outline-none focus:ring-2 ring-black" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-400 block mb-1">Hero Bild (URL)</label>
                  <div className="flex gap-2">
                    <div className="bg-zinc-100 p-4"><ImageIcon size={16}/></div>
                    <input value={content.heroImage} onChange={e => setContent({...content, heroImage: e.target.value})} className="w-full bg-zinc-50 p-4 border-none text-xs outline-none" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* NEWS SETTINGS */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 border border-zinc-200 shadow-sm">
              <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-xs font-black uppercase tracking-widest italic">Nyhetskarusell</h2>
                <button onClick={() => setContent({...content, news: [{title: "Nyhet", date: "IDAG", text: "Text..."}, ...(content.news || [])]})} className="text-[10px] font-black uppercase text-blue-600">+ Lägg till nyhet</button>
              </div>
              <div className="space-y-6">
                {content.news.map((n: any, i: number) => (
                  <div key={i} className="p-6 bg-zinc-50 border-l-4 border-black relative group transition-all hover:bg-zinc-100">
                    <button onClick={() => { const u = content.news.filter((_:any, idx:number) => idx !== i); setContent({...content, news: u}); }} className="absolute top-4 right-4 text-zinc-300 hover:text-red-600"><Trash2 size={16}/></button>
                    <div className="grid grid-cols-4 gap-4">
                      <input value={n.date} onChange={e => { const u = [...content.news]; u[i].date = e.target.value; setContent({...content, news: u}); }} className="col-span-1 bg-transparent text-[10px] font-black uppercase tracking-widest text-blue-600 outline-none" />
                      <input value={n.title} onChange={e => { const u = [...content.news]; u[i].title = e.target.value; setContent({...content, news: u}); }} className="col-span-3 bg-transparent text-lg font-black uppercase italic tracking-tighter outline-none" />
                    </div>
                    <textarea value={n.text} onChange={e => { const u = [...content.news]; u[i].text = e.target.value; setContent({...content, news: u}); }} className="w-full bg-transparent mt-4 text-sm text-zinc-500 border-t pt-4 outline-none h-24 resize-none" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
