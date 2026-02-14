'use client';

import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const ADMIN_EMAIL = "j74risberg@gmail.com"; 

  useEffect(() => {
    if (isLoaded) {
      fetch('/api/content')
        .then(res => res.json())
        .then(data => {
          setContent(data);
          setLoading(false);
        });
    }
  }, [isLoaded]);

  const saveContent = async () => {
    setSaving(true);
    await fetch('/api/content', {
      method: 'POST',
      body: JSON.stringify(content),
    });
    setSaving(false);
    alert("Innehållet har sparats!");
  };

  if (!isLoaded || loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

  if (user?.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
    return <div className="p-10 text-red-600 text-center font-bold">Nekat tillträde. Logga in som administratör.</div>;
  }

  return (
    <main className="p-8 max-w-4xl mx-auto bg-white min-h-screen border-x shadow-xl">
      <div className="flex justify-between items-center mb-10 border-b pb-6">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Adminpanel</h1>
        <button 
          onClick={saveContent} 
          disabled={saving}
          className="bg-black text-white px-8 py-3 rounded-none flex items-center space-x-2 font-bold hover:bg-zinc-800 transition-all uppercase tracking-widest text-sm"
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
          <span>Spara ändringar</span>
        </button>
      </div>

      {/* HERO INSTÄLLNINGAR */}
      <section className="mb-12">
        <h2 className="text-sm font-black uppercase tracking-widest mb-4 bg-zinc-100 p-2 italic">1. Hero Sektion</h2>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-400">Huvudrubrik (Versaler)</label>
            <input 
              value={content?.heroTitle || ""} 
              onChange={e => setContent({...content, heroTitle: e.target.value})}
              className="w-full p-4 bg-zinc-50 border-none text-2xl font-black uppercase tracking-tighter outline-none focus:ring-2 ring-black"
            />
          </div>
        </div>
      </section>

      {/* NYHETER */}
      <section>
        <div className="flex justify-between items-center mb-4 bg-zinc-100 p-2 italic">
          <h2 className="text-sm font-black uppercase tracking-widest">2. Nyhetsflöde</h2>
          <button 
            onClick={() => setContent({...content, news: [{title: "Nyhet", date: "IDAG", text: "Beskrivning..."}, ...(content?.news || [])]})} 
            className="text-[10px] uppercase font-bold flex items-center bg-black text-white px-2 py-1"
          >
            <Plus size={12}/> Lägg till
          </button>
        </div>
        
        <div className="space-y-4">
          {content?.news?.map((n: any, i: number) => (
            <div key={i} className="p-6 border bg-white shadow-sm relative group">
              <button 
                onClick={() => {
                  const updated = content.news.filter((_: any, index: number) => index !== i);
                  setContent({...content, news: updated});
                }} 
                className="absolute top-4 right-4 text-zinc-300 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16}/>
              </button>
              <input 
                value={n.date} 
                onChange={e => {
                  const updated = [...content.news]; updated[i].date = e.target.value; setContent({...content, news: updated});
                }} 
                className="text-[10px] font-bold text-blue-600 mb-2 uppercase tracking-widest block w-full outline-none" 
              />
              <input 
                value={n.title} 
                onChange={e => {
                  const updated = [...content.news]; updated[i].title = e.target.value; setContent({...content, news: updated});
                }} 
                className="text-lg font-black block w-full mb-2 outline-none" 
              />
              <textarea 
                value={n.text} 
                onChange={e => {
                  const updated = [...content.news]; updated[i].text = e.target.value; setContent({...content, news: updated});
                }} 
                className="text-xs text-zinc-500 w-full bg-transparent outline-none h-20 resize-none border-t pt-2" 
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
