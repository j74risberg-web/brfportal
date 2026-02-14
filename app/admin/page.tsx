'use client';

import { useState, useEffect } from 'react';
import { UserButton } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight, Calendar, Home, Settings, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [content, setContent] = useState<any>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetch('/api/content').then(res => res.json()).then(data => {
      // Filtrera nyheter baserat på utgångsdatum
      const visibleNews = data.news?.filter((n: any) => !n.expiryDate || n.expiryDate >= today) || [];
      setContent({ ...data, news: visibleNews });
    });
  }, []);

  if (!content) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-zinc-300 w-12 h-12" /></div>;

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 pb-20 md:pb-12">
      <header className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic">BRF Slalomsvängen 2</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black hidden md:block">System Admin</Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="relative h-[40vh] md:h-[55vh] w-full bg-zinc-900 overflow-hidden shadow-2xl rounded-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent flex items-center p-8 md:p-16 z-10">
            <h2 className="text-white text-4xl md:text-7xl font-black uppercase italic leading-none tracking-tighter border-l-8 border-white pl-6">
              {content.heroTitle}
            </h2>
          </div>
          <img 
            src={content.heroImage || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"} 
            className="w-full h-full object-cover grayscale-[20%]" 
            alt="Hero" 
          />
        </div>
      </section>

      {/* NYHETSKARUSELL MED BILD-FIX */}
      {content.news && content.news.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mt-12">
          <div className="bg-zinc-50 border flex flex-col md:flex-row items-stretch min-h-[450px] shadow-sm overflow-hidden">
            <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-zinc-200">
              {/* Här hämtas din URL från adminpanelen */}
              <img 
                key={activeSlide}
                src={content.news[activeSlide].image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa"} 
                className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-1000"
                alt="Nyhetsbild"
                onError={(e: any) => { e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa" }}
              />
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative bg-white border-l">
              <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                {content.news[activeSlide].date}
              </span>
              <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-6 leading-none">
                {content.news[activeSlide].title}
              </h3>
              <p className="text-zinc-500 text-sm md:text-base leading-relaxed mb-10 max-w-md">
                {content.news[activeSlide].text}
              </p>
              <div className="flex items-center gap-6 mt-auto pt-8 border-t border-zinc-100">
                <div className="flex gap-2">
                  <button onClick={() => setActiveSlide((prev) => (prev - 1 + content.news.length) % content.news.length)} className="p-3 border border-zinc-200 hover:bg-black hover:text-white transition-all">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => setActiveSlide((prev) => (prev + 1) % content.news.length)} className="p-3 border border-zinc-200 hover:bg-black hover:text-white transition-all">
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
                  Inlägg {activeSlide + 1} / {content.news.length}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SERVICE GRID - Nu med tre val för full funktionalitet */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-32">
        <Link href="/tvattstuga" className="group p-10 bg-blue-600 text-white flex flex-col gap-6 hover:bg-blue-700 transition-all shadow-xl">
          <Calendar size={48} className="group-hover:rotate-12 transition-transform duration-500" />
          <div>
            <h4 className="text-2xl font-black uppercase italic tracking-tighter">Boka Tvätt</h4>
            <p className="text-blue-200 text-[10px] font-black uppercase mt-1">Digitalt system</p>
          </div>
        </Link>
        <Link href="/gastrum" className="group p-10 bg-zinc-900 text-white flex flex-col gap-6 hover:bg-black transition-all shadow-xl">
          <Home size={48} className="group-hover:scale-110 transition-transform duration-500" />
          <div>
            <h4 className="text-2xl font-black uppercase italic tracking-tighter">Gästrum & SPA</h4>
            <p className="text-zinc-500 text-[10px] font-black uppercase mt-1">Övernattning</p>
          </div>
        </Link>
        <Link href="/admin" className="group p-10 bg-zinc-100 text-black flex flex-col gap-6 hover:bg-zinc-200 transition-all border border-zinc-200">
          <Settings size={48} className="text-zinc-400 group-hover:rotate-90 transition-transform duration-500" />
          <div>
            <h4 className="text-2xl font-black uppercase italic tracking-tighter">Adminpanel</h4>
            <p className="text-zinc-400 text-[10px] font-black uppercase mt-1">Ändra innehåll</p>
          </div>
        </Link>
      </section>

      {/* MOBILE NAV - Enkel åtkomst på språng */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 px-8 py-4 flex justify-between items-center z-50 shadow-2xl">
        <Link href="/" className="text-black"><Home size={24} /></Link>
        <Link href="/tvattstuga" className="text-zinc-400"><Calendar size={24} /></Link>
        <Link href="/admin" className="text-zinc-400"><Settings size={24} /></Link>
      </nav>
    </div>
  );
}
