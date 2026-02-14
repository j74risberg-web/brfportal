'use client';

import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { Save, Plus, Trash2, Loader2, ArrowLeft, Image as ImageIcon, Calendar as CalIcon } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [content, setContent] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const ADMIN_EMAIL = "j74risberg@gmail.com";

  useEffect(() => {
    if (isLoaded) fetch('/api/content').then(res => res.json()).then(data => setContent(data));
  }, [isLoaded]);

  const onSave = async () => {
    setSaving(true);
    await fetch('/api/content', { method: 'POST', body: JSON.stringify(content) });
    setSaving(false);
    alert("Portalen har uppdaterats.");
  };

  if (!isLoaded || !content) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (user?.emailAddresses[0].emailAddress !== ADMIN_EMAIL) return <div className="p-20 text-center font-black uppercase">Obehörig åtkomst.</div>;

  return (
    <main className="min-h-screen bg-zinc-50 p-6 md:p-12 font-sans pb-32">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-16 border-b-2 border-zinc-200 pb-8">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Portal Control</h1>
          <button onClick={onSave} disabled={saving} className="bg-black text-white px-12 py-5 font-black uppercase text-xs tracking-[0.3em] shadow-2xl flex items-center gap-3">
            {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={18} />} Spara systemet
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <section className="bg-white p-8 border border-zinc-200 shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-zinc-400 border-b pb-4 italic">Design</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-[8px] font-black uppercase mb-1 block">Hero Rubrik</label>
                  <input value={content.heroTitle} onChange={e => setContent({...content, heroTitle: e.target.value})} className="w-full bg-zinc-50 p-3 font-black uppercase outline-none" />
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase mb-1 block">Hero Bild-URL</label>
                  <input value={content.heroImage} onChange={e => setContent({...content, heroImage: e.target.value})} className="w-full bg-zinc-50 p-3 text-[10px] font-mono outline-none" />
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-2">
            <section className="bg-white p-8 border border-zinc-200 shadow-sm">
              <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">Nyhetsflöde</h2>
                <button onClick={() => setContent({...content, news: [{title: "Nyhet", date: "DATUM", text: "...", image: "", expiryDate: ""}, ...content.news]})} className="bg-zinc-100 px-4 py-2 text-[10px] font-black uppercase">+ Nyhet</button>
              </div>
              <div className="space-y-8">
                {content.news?.map((n: any, i: number) => (
                  <div key={i} className="p-6 bg-zinc-50 border-l-[10px] border-black relative">
                    <button onClick={() => { const u = content.news.filter((_:any, idx:number) => idx !== i); setContent({...content, news: u}); }} className="absolute top-4 right-4 text-zinc-200 hover:text-red-600 transition-colors"><Trash2 size={20}/></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input placeholder="Rubrik" value={n.title} onChange={e => { const u = [...content.news]; u[i].title = e.target.value; setContent({...content, news: u}); }} className="w-full bg-white p-2 font-black uppercase text-xs outline-none" />
                      <input placeholder="Visningsdatum (t.ex. 15 MAJ)" value={n.date} onChange={e => { const u = [...content.news]; u[i].date = e.target.value; setContent({...content, news: u}); }} className="w-full bg-white p-2 font-black text-blue-600 text-xs outline-none" />
                      <input placeholder="Bild-URL" value={n.image} onChange={e => { const u = [...content.news]; u[i].image = e.target.value; setContent({...content, news: u}); }} className="w-full bg-white p-2 text-[9px] font-mono outline-none" />
                      <input type="date" value={n.expiryDate} onChange={e => { const u = [...content.news]; u[i].expiryDate = e.target.value; setContent({...content, news: u}); }} className="w-full bg-white p-2 text-[10px] font-bold outline-none" />
                    </div>
                    <textarea placeholder="Text..." value={n.text} onChange={e => { const u = [...content.news]; u[i].text = e.target.value; setContent({...content, news: u}); }} className="w-full bg-white p-3 text-xs text-zinc-500 h-20 resize-none outline-none border-none" />
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
