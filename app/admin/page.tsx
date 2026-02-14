'use client';

import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { Save, Plus, Trash2, ImageIcon, Calendar as CalendarIcon, Loader2 } from "lucide-react";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      fetch('/api/content').then(res => res.json()).then(data => {
        setContent(data);
        setLoading(false);
      });
    }
  }, [isLoaded]);

  const save = async () => {
    await fetch('/api/content', { method: 'POST', body: JSON.stringify(content) });
    alert("Sparat!");
  };

  if (!isLoaded || loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  return (
    <main className="p-6 md:p-12 max-w-6xl mx-auto bg-white min-h-screen border-x shadow-2xl">
      <div className="flex justify-between items-center mb-12 border-b pb-6">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Admin System</h1>
        <button onClick={save} className="bg-black text-white px-10 py-4 font-black uppercase text-xs tracking-widest hover:bg-zinc-800 transition-all">Spara Portalen</button>
      </div>

      <div className="space-y-12">
        <section className="bg-zinc-50 p-8 border">
           <h2 className="text-xs font-black uppercase tracking-widest mb-6 border-b pb-2 italic">Global Design</h2>
           <label className="text-[10px] font-black uppercase text-zinc-400 block mb-2 tracking-widest">Huvudrubrik</label>
           <input value={content.heroTitle} onChange={e => setContent({...content, heroTitle: e.target.value})} className="w-full bg-white p-4 font-black uppercase text-2xl outline-none mb-6 border-none focus:ring-2 ring-black" />
           
           <label className="text-[10px] font-black uppercase text-zinc-400 block mb-2 tracking-widest">Hero Bild-URL</label>
           <input value={content.heroImage} onChange={e => setContent({...content, heroImage: e.target.value})} className="w-full bg-white p-4 text-xs font-mono outline-none border-none focus:ring-2 ring-black" />
        </section>

        <section className="border p-8">
           <div className="flex justify-between items-center mb-8 border-b pb-2">
             <h2 className="text-xs font-black uppercase tracking-widest italic tracking-widest">Nyhetsflöde</h2>
             <button onClick={() => setContent({...content, news: [{title: "Ny Nyhet", date: "DATUM", text: "Text...", image: "", expiryDate: ""}, ...content.news]})} className="text-[10px] font-black uppercase bg-black text-white px-3 py-1">+ Lägg till</button>
           </div>
           
           <div className="space-y-8">
             {content.news.map((n: any, i: number) => (
               <div key={i} className="p-6 bg-zinc-50 border-l-8 border-black relative group shadow-sm">
                 <button onClick={() => { const u = content.news.filter((_:any, idx:number) => idx !== i); setContent({...content, news: u}); }} className="absolute top-4 right-4 text-zinc-300 hover:text-red-600"><Trash2 size={20}/></button>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                   <div>
                     <label className="text-[9px] font-black uppercase text-zinc-400">Rubrik</label>
                     <input value={n.title} onChange={e => { const u = [...content.news]; u[i].title = e.target.value; setContent({...content, news: u}); }} className="w-full bg-white p-3 font-black uppercase text-sm outline-none border-none" />
                   </div>
                   <div>
                     <label className="text-[9px] font-black uppercase text-zinc-400 italic">Visningsdatum (t.ex. 15 MAJ)</label>
                     <input value={n.date} onChange={e => { const u = [...content.news]; u[i].date = e.target.value; setContent({...content, news: u}); }} className="w-full bg-white p-3 font-bold text-blue-600 text-sm outline-none border-none" />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                   <div>
                     <label className="text-[9px] font-black uppercase text-zinc-400 flex items-center gap-1"><ImageIcon size={10}/> Bild-URL för inlägg</label>
                     <input value={n.image} onChange={e => { const u = [...content.news]; u[i].image = e.target.value; setContent({...content, news: u}); }} className="w-full bg-white p-3 text-[10px] font-mono outline-none border-none" />
                   </div>
                   <div>
                     <label className="text-[9px] font-black uppercase text-red-500 flex items-center gap-1"><CalendarIcon size={10}/> Sista visningsdatum (Döljs efter detta)</label>
                     <input type="date" value={n.expiryDate} onChange={e => { const u = [...content.news]; u[i].expiryDate = e.target.value; setContent({...content, news: u}); }} className="w-full bg-white p-3 text-xs outline-none border-none font-bold" />
                   </div>
                 </div>

                 <label className="text-[9px] font-black uppercase text-zinc-400">Beskrivning</label>
                 <textarea value={n.text} onChange={e => { const u = [...content.news]; u[i].text = e.target.value; setContent({...content, news: u}); }} className="w-full bg-white p-3 text-xs text-zinc-500 h-24 resize-none outline-none border-none" />
               </div>
             ))}
           </div>
        </section>
      </div>
    </main>
  );
}
