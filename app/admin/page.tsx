'use client';

import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { Save, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // SÄKERHET: Här skriver du in din e-postadress
  const ADMIN_EMAIL = "din-email@gmail.com"; 

  useEffect(() => {
    fetch('/api/content').then(res => res.json()).then(data => {
      setContent(data);
      setLoading(false);
    });
  }, []);

  const saveContent = async () => {
    await fetch('/api/content', {
      method: 'POST',
      body: JSON.stringify(content),
    });
    alert("Innehållet har sparats!");
  };

  if (!isLoaded || loading) return <div className="p-10">Laddar...</div>;

  // Enkel spärr: bara du kommer in
  if (user?.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
    return <div className="p-10 text-red-600 font-bold text-center underline"><Link href="/">Nekat tillträde. Gå tillbaka.</Link></div>;
  }

  return (
    <main className="p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase italic">Adminpanel</h1>
        <button onClick={saveContent} className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 font-bold shadow-lg hover:bg-green-700">
          <Save size={18} /> <span>Spara allt</span>
        </button>
      </div>

      {/* REDIGERA HERO */}
      <section className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <h2 className="text-lg font-bold mb-4 uppercase border-b pb-2">Hero Sektion</h2>
        <label className="block text-sm text-gray-500 mb-1">Huvudrubrik (över bilden)</label>
        <input 
          value={content.heroTitle} 
          onChange={e => setContent({...content, heroTitle: e.target.value})}
          className="w-full p-3 border rounded-lg text-xl font-bold"
        />
      </section>

      {/* REDIGERA NYHETER */}
      <section className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-lg font-bold mb-4 uppercase border-b pb-2 flex justify-between">
          Nyhetskarusell
          <button onClick={() => setContent({...content, news: [{title: "Ny rubrik", date: "Datum", text: "Text här..."}, ...content.news]})} className="text-blue-600 flex items-center text-sm"><Plus size={16}/> Lägg till</button>
        </h2>
        
        <div className="space-y-6">
          {content.news.map((n: any, i: number) => (
            <div key={i} className="p-4 border-l-4 border-blue-600 bg-gray-50 relative">
              <button onClick={() => {
                const updated = content.news.filter((_: any, index: number) => index !== i);
                setContent({...content, news: updated});
              }} className="absolute top-2 right-2 text-red-500"><Trash2 size={16}/></button>
              <input value={n.date} onChange={e => {
                const updated = [...content.news]; updated[i].date = e.target.value; setContent({...content, news: updated});
              }} className="text-xs font-bold text-blue-600 mb-1 bg-transparent border-none w-full outline-none" />
              <input value={n.title} onChange={e => {
                const updated = [...content.news]; updated[i].title = e.target.value; setContent({...content, news: updated});
              }} className="text-lg font-bold block w-full bg-transparent border-none outline-none" />
              <textarea value={n.text} onChange={e => {
                const updated = [...content.news]; updated[i].text = e.target.value; setContent({...content, news: updated});
              }} className="text-sm text-gray-600 w-full mt-2 bg-transparent border-none outline-none" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
