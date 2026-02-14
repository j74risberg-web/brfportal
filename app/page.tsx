'use client';

import { useState, useEffect } from 'react';
import { UserButton } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight, Calendar, Loader2, Clock } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    fetch('/api/content').then(res => res.json()).then(data => {
      // Filtrera nyheter baserat på utgångsdatum
      const today = new Date().toISOString().split('T')[0];
      const visibleNews = data.news?.filter((n: any) => !n.expiryDate || n.expiryDate >= today) || [];
      setContent({ ...data, news: visibleNews });
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % content.news.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + content.news.length) % content.news.length);

  return (
    <main className="min-h-screen bg-white">
      <header className="max-w-7xl mx-auto p-6 flex justify-between items-center">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">BRF Slalomsvängen 2</h1>
        <UserButton afterSignOutUrl="/" />
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative h-[400px] bg-zinc-900 overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-black/40 z-10 flex items-center p-12">
            <h2 className="text-white text-6xl font-black uppercase italic border-l-8 pl-6 leading-none">{content.heroTitle}</h2>
          </div>
          <img src={content.heroImage} className="w-full h-full object-cover grayscale-[30%]" />
        </div>
      </section>

      {/* NYHETSKARUSELL MED BILDER */}
      <section className="max-w-7xl mx-auto p-6 mt-12">
        <div className="bg-zinc-50 border relative flex flex-col md:flex-row items-stretch min-h-[400px]">
          {/* Bilddel */}
          <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
            <img 
              src={content.news[activeSlide]?.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa"} 
              className="w-full h-full object-cover transition-all duration-700"
              alt="Nyhetsbild"
            />
          </div>

          {/* Textdel */}
          <div className="w-full md:w-1/2 p-12 flex flex-col justify-center relative">
            <div className="flex justify-between items-center mb-6">
               <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em]">{content.news[activeSlide]?.date}</span>
               <div className="flex gap-2">
                 <button onClick={prevSlide} className="p-2 border hover:bg-black hover:text-white transition-all"><ChevronLeft size={20}/></button>
                 <button onClick={nextSlide} className="p-2 border hover:bg-black hover:text-white transition-all"><ChevronRight size={20}/></button>
               </div>
            </div>
            <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-4 leading-none">{content.news[activeSlide]?.title}</h3>
            <p className="text-zinc-500 leading-relaxed mb-8">{content.news[activeSlide]?.text}</p>
            
            <div className="flex gap-2 mt-auto">
               {content.news.map((_: any, i: number) => (
                 <div key={i} className={`h-1 transition-all ${activeSlide === i ? 'w-12 bg-black' : 'w-4 bg-zinc-200'}`} />
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* SNABBLÄNKAR */}
      <section className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <Link href="/tvattstuga" className="bg-blue-600 p-12 text-white flex items-center gap-8 hover:bg-blue-700 transition-all shadow-xl">
          <Calendar size={48} />
          <div>
            <h4 className="text-2xl font-black uppercase italic tracking-tighter">Boka Tvättstuga</h4>
            <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">Slalomvägen 2</p>
          </div>
        </Link>
        <Link href="/admin" className="bg-zinc-900 p-12 text-white flex items-center gap-8 hover:bg-black transition-all shadow-xl">
          <Clock size={48} />
          <div>
            <h4 className="text-2xl font-black uppercase italic tracking-tighter">Hantera Portal</h4>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Gå till Admin</p>
          </div>
        </Link>
      </section>
    </main>
  );
}
