'use client';

import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { Save, Plus, Trash2, Loader2, ArrowLeft, Image as ImageIcon, Calendar, Waves, Home, Clock } from "lucide-react";

export default function SuperAdminPage() {
  const { user, isLoaded } = useUser();
  const [content, setContent] = useState<any>(null);
  const [bookings, setBookings] = useState<{tvatt: any[], bastu: any[], gastrum: any[]}>({
    tvatt: [], bastu: [], gastrum: []
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'bookings'>('content');

  const ADMIN_EMAIL = "j74risberg@gmail.com";

  useEffect(() => {
    if (isLoaded && user?.emailAddresses[0].emailAddress.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      // Hämta sidinnehåll
      fetch('/api/content').then(res => res.json()).then(data => setContent(data));
      
      // Hämta alla typer av bokningar
      Promise.all([
        fetch('/api/bookings?type=tvatt').then(res => res.json()),
        fetch('/api/bookings?type=bastu').then(res => res.json()),
        fetch('/api/bookings?type=gastrum').then(res => res.json())
      ]).then(([tvatt, bastu, gastrum]) => {
        setBookings({ tvatt, bastu, gastrum });
      });
    }
  }, [isLoaded]);

  const saveContent = async () => {
    setSaving(true);
    await fetch('/api/content', { method: 'POST', body: JSON.stringify(content) });
    setSaving(false);
    alert("Portalen har uppdaterats!");
  };

  const deleteBooking = async (type: string, date: string, slot: string) => {
    if(!confirm("Vill du verkligen radera denna bokning?")) return;
    const current = (bookings as any)[type];
    const updated = current.filter((b: any) => !(b.date === date && b.slot === slot));
    
    await fetch(`/api/bookings?type=${type}`, { method: 'POST', body: JSON.stringify(updated) });
    setBookings({ ...bookings, [type]: updated });
  };

  if (!isLoaded || !content) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (user?.emailAddresses[0].emailAddress.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) return <div className="p-20 text-center font-black">NEKAT TILLTRÄDE</div>;

  return (
    <main className="min-h-screen bg-zinc-50 font-sans pb-20">
      {/* HEADER */}
      <header className="bg-black text-white p-8 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">System Control</h1>
            <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 mt-2 uppercase">BRF Slalomsvängen 2</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('content')}
              className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'content' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
            >
              Redigera Innehåll
            </button>
            <button 
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'bookings' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
            >
              Visa Bokningar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 md:p-12">
        {activeTab === 'content' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Portalens utseende</h2>
              <button onClick={saveContent} disabled={saving} className="bg-blue-600 text-white px-10 py-4 font-black uppercase text-xs tracking-widest shadow-xl flex items-center gap-2 hover:bg-blue-700">
                {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />} Spara Ändringar
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* HERO EDITOR */}
              <section className="bg-white p-8 border border-zinc-200 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 text-zinc-400 border-b pb-2 italic">1. Hero Sektion</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-[8px] font-black uppercase mb-1 block">Rubrik</label>
                    <input value={content.heroTitle} onChange={e => setContent({...content, heroTitle: e.target.value})} className="w-full bg-zinc-50 p-4 font-black uppercase text-xl outline-none" />
                  </div>
                  <div>
                    <label className="text-[8px] font-black uppercase mb-1 block">Rubrik Storlek (t.ex. 80px eller 4.5rem)</label>
                    <input  value={content.heroTitleSize || ''} placeholder="Lämna tom för standard" onChange={e => setContent({...content, heroTitleSize: e.target.value})} 
                    className="w-full bg-zinc-50 p-4 font-bold text-xs outline-none focus:ring-2 ring-black" 
                    />    
                  </div>  
                  <div>
                    <label className="text-[8px] font-black uppercase mb-1 block">Bild-URL (Fasad)</label>
                    <input value={content.heroImage} onChange={e => setContent({...content, heroImage: e.target.value})} className="w-full bg-zinc-50 p-4 text-[10px] font-mono outline-none" />
                  </div>
                </div>
              </section>

              {/* NEWS EDITOR */}
              <section className="lg:col-span-2 bg-white p-8 border border-zinc-200 shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b pb-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">2. Nyhetskarusell</h3>
                  <button onClick={() => setContent({...content, news: [{title: "Nyhet", date: "IDAG", text: "...", image: "", expiryDate: ""}, ...(content.news || [])]})} className="text-[10px] font-black uppercase text-blue-600">+ Nytt inlägg</button>
                </div>
                <div className="space-y-6">
                  {content.news?.map((n: any, i: number) => (
                    <div key={i} className="p-6 bg-zinc-50 border-l-8 border-black relative group">
                      <button onClick={() => { const u = content.news.filter((_:any, idx:number) => idx !== i); setContent({...content, news: u}); }} className="absolute top-4 right-4 text-zinc-300 hover:text-red-600"><Trash2 size={18}/></button>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <input value={n.title} placeholder="Rubrik" onChange={e => { const u = [...content.news]; u[i].title = e.target.value; setContent({...content, news: u}); }} className="font-black uppercase text-sm bg-white p-2 outline-none" />
                        <input value={n.date} placeholder="Datum (t.ex. 12 MAJ)" onChange={e => { const u = [...content.news]; u[i].date = e.target.value; setContent({...content, news: u}); }} className="font-black text-blue-600 text-xs bg-white p-2 outline-none" />
                        <input value={n.image} placeholder="Bild-URL" onChange={e => { const u = [...content.news]; u[i].image = e.target.value; setContent({...content, news: u}); }} className="text-[10px] font-mono bg-white p-2 outline-none" />
                        <input type="date" value={n.expiryDate} onChange={e => { const u = [...content.news]; u[i].expiryDate = e.target.value; setContent({...content, news: u}); }} className="font-bold text-xs bg-white p-2 outline-none" />
                      </div>
                      <textarea value={n.text} onChange={e => { const u = [...content.news]; u[i].text = e.target.value; setContent({...content, news: u}); }} className="w-full bg-white p-3 text-xs text-zinc-500 h-20 resize-none outline-none" />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-10">Aktuella bokningar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* TVÄTTBOKNINGAR */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-black uppercase text-xs text-blue-600 border-b-2 border-blue-600 pb-2"><Calendar size={14}/> Tvättstuga</h3>
                {bookings.tvatt.length === 0 ? <p className="text-[10px] text-zinc-400 uppercase italic">Inga bokningar</p> : 
                  bookings.tvatt.sort((a,b) => a.date.localeCompare(b.date)).map((b, i) => (
                    <div key={i} className="bg-white p-4 border flex justify-between items-center group shadow-sm">
                      <div>
                        <p className="font-black text-xs">{b.date}</p>
                        <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">{b.slot} • {b.user}</p>
                      </div>
                      <button onClick={() => deleteBooking('tvatt', b.date, b.slot)} className="text-zinc-200 group-hover:text-red-600 transition-colors"><Trash2 size={14}/></button>
                    </div>
                  ))
                }
              </div>

              {/* BASTUBOKNINGAR */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-black uppercase text-xs text-emerald-600 border-b-2 border-emerald-600 pb-2"><Waves size={14}/> Bastu</h3>
                {bookings.bastu.length === 0 ? <p className="text-[10px] text-zinc-400 uppercase italic">Inga bokningar</p> : 
                  bookings.bastu.sort((a,b) => a.date.localeCompare(b.date)).map((b, i) => (
                    <div key={i} className="bg-white p-4 border flex justify-between items-center group shadow-sm">
                      <div>
                        <p className="font-black text-xs">{b.date}</p>
                        <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">{b.slot} • {b.user}</p>
                      </div>
                      <button onClick={() => deleteBooking('bastu', b.date, b.slot)} className="text-zinc-200 group-hover:text-red-600 transition-colors"><Trash2 size={14}/></button>
                    </div>
                  ))
                }
              </div>

              {/* GÄSTRUMSBOKNINGAR */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-black uppercase text-xs text-zinc-900 border-b-2 border-zinc-900 pb-2"><Home size={14}/> Gästrum</h3>
                {bookings.gastrum.length === 0 ? <p className="text-[10px] text-zinc-400 uppercase italic">Inga bokningar</p> : 
                  bookings.gastrum.sort((a,b) => a.date.localeCompare(b.date)).map((b, i) => (
                    <div key={i} className="bg-white p-4 border flex justify-between items-center group shadow-sm">
                      <div>
                        <p className="font-black text-xs">{b.date}</p>
                        <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">{b.user}</p>
                      </div>
                      <button onClick={() => deleteBooking('gastrum', b.date, b.slot)} className="text-zinc-200 group-hover:text-red-600 transition-colors"><Trash2 size={14}/></button>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE BACK BUTTON */}
      <a href="/" className="fixed bottom-8 right-8 bg-black text-white p-4 rounded-full shadow-2xl md:hidden z-50">
        <Home size={24} />
      </a>
    </main>
  );
}
