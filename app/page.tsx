'use client';

import { useState, useEffect } from 'react';
import { UserButton } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight, Calendar, Home, Settings, Loader2 } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [content, setContent] = useState<any>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetch('/api/content').then(res => res.json()).then(data => {
      // Filtrerar bort inlägg som har passerat utgångsdatumet
      const filteredNews = data.news?.filter((n: any) => !n.expiryDate || n.expiryDate >= today) || [];
      setContent({ ...data, news: filteredNews });
    });
  }, []);

  if (!content) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-zinc-300 w-12 h-12" /></div>;

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 pb-20 md:pb-0">
      <header className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic">BRF Slalomsvängen 2</h1>
        <UserButton afterSignOutUrl="/" />
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="relative h-[40vh] md:h-[55vh] w-full bg-zinc-900 overflow-hidden shadow-2xl rounded-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent flex items-center p-8 md:p-16 z-10">
            <h2 className="text-white text-4xl md:text-7xl font-black uppercase italic leading-none tracking-tighter border-l-8 border-white pl-6">
              {content.heroTitle}
            </h2>
          </div>
          <img src={content.heroImage} className="w-full h-full object-cover grayscale-[20%]" alt="Hero" />
        </div>
      </section>

      {/* NYHETSKARUSELL */}
      {content.news.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mt-12">
          <div className="bg-zinc-50 border flex flex-col md:flex-row items-stretch min-h-[450px] shadow-sm overflow-hidden">
            <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
              <img 
                key={activeSlide}
                src={content.news[activeSlide].image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa"} 
                className="w-full h-full object-cover"
                alt="News"
              />
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative bg-white">
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
                <div className="text-[10px] font-black text-zinc-300">
                  {activeSlide + 1} / {content.news.length}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SERVICE GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 mb-32">
        <Link href="/tvattstuga" className="group p-12 bg-blue-600 text-white flex items-center gap-8 hover:bg-blue-700 transition-all shadow-xl">
          <Calendar size={60} />
          <div>
            <h4 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Boka Tvätt</h4>
            <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mt-2">Digitalt bokningssystem</p>
          </div>
        </Link>
        <Link href="/admin" className="group p-12 bg-zinc-900 text-white flex items-center gap-8 hover:bg-black transition-all shadow-xl">
          <Settings size={60} />
          <div>
            <h4 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Adminpanel</h4>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-2">Hantera portalens innehåll</p>
          </div>
        </Link>
      </section>

      {/* MOBILE NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 px-10 py-5 flex justify-between items-center z-50">
        <Link href="/" className="text-zinc-900"><Home size={22} /></Link>
        <Link href="/tvattstuga" className="text-zinc-400"><Calendar size={22} /></Link>
        <Link href="/admin" className="text-zinc-400"><Settings size={22} /></Link>
      </nav>
    </div>
  );
}
