'use client';

import { useState, useEffect } from 'react';
import { UserButton } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight, Calendar, Home, Info, Bell, Loader2 } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    fetch('/api/content').then(res => res.json()).then(data => {
      setContent(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-zinc-200 w-12 h-12" /></div>;

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % content.news.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + content.news.length) % content.news.length);

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-20 md:pb-0">
      {/* HEADER */}
      <header className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic">BRF Slalomsvängen 2</h1>
        <UserButton afterSignOutUrl="/" />
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="relative h-[40vh] md:h-[50vh] w-full bg-zinc-900 overflow-hidden shadow-2xl rounded-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-8 md:p-16 z-10">
            <h2 className="text-white text-4xl md:text-7xl font-black uppercase italic leading-none tracking-tighter border-l-8 border-white pl-6">
              {content.heroTitle}
            </h2>
          </div>
          <img src={content.heroImage || "/hero.jpg"} className="w-full h-full object-cover grayscale-[20%]" alt="Fasad" />
        </div>
      </section>

      {/* DESKTOP MENU */}
      <nav className="hidden md:block bg-black mt-2 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex gap-8 py-4 text-white text-[10px] font-black uppercase tracking-[0.3em]">
          {content.topMenu?.map((m: any) => (
            <Link key={m.name} href={m.href} className="hover:text-blue-500 transition-colors">{m.name}</Link>
          ))}
        </div>
      </nav>

      {/* ADVANCED NEWS CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-12">
        <div className="bg-zinc-50 border border-zinc-100 p-8 md:p-16 relative overflow-hidden group">
          <div className="absolute top-4 left-8 text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
            <Bell size={12}/> Senaste Nytt
          </div>
          
          <div className="flex items-center justify-between min-h-[200px]">
            <button onClick={prevSlide} className="p-4 hover:bg-white rounded-full transition-all border border-transparent hover:border-zinc-200">
              <ChevronLeft size={32} />
            </button>

            <div className="text-center px-6 max-w-3xl animate-in fade-in duration-700">
              <span className="text-[11px] font-bold text-zinc-400 block mb-2">{content.news[activeSlide]?.date}</span>
              <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">{content.news[activeSlide]?.title}</h3>
              <p className="text-zinc-500 leading-relaxed text-sm md:text-base">{content.news[activeSlide]?.text}</p>
            </div>

            <button onClick={nextSlide} className="p-4 hover:bg-white rounded-full transition-all border border-transparent hover:border-zinc-200">
              <ChevronRight size={32} />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {content.news.map((_: any, i: number) => (
              <div key={i} className={`h-1 transition-all duration-500 ${activeSlide === i ? 'w-12 bg-black' : 'w-4 bg-zinc-200'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 mb-20">
        <Link href="/tvattstuga" className="group p-12 bg-blue-600 text-white flex items-center gap-8 hover:bg-blue-700 transition-all shadow-xl">
          <Calendar size={64} className="group-hover:scale-110 transition-transform" />
          <div>
            <h4 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Tvättstuga</h4>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-2">Boka ditt pass här</p>
          </div>
        </Link>
        <Link href="/gastrum" className="group p-12 bg-zinc-900 text-white flex items-center gap-8 hover:bg-black transition-all shadow-xl">
          <Home size={64} className="group-hover:scale-110 transition-transform" />
          <div>
            <h4 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Gästrum</h4>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Boka övernattning</p>
          </div>
        </Link>
      </section>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-8 py-4 flex justify-between z-[100]">
        <Link href="/" className="flex flex-col items-center gap-1 text-zinc-400 focus:text-black">
          <Home size={20} /> <span className="text-[8px] font-black uppercase">Hem</span>
        </Link>
        <Link href="/tvattstuga" className="flex flex-col items-center gap-1 text-zinc-400">
          <Calendar size={20} /> <span className="text-[8px] font-black uppercase">Boka</span>
        </Link>
        <Link href="/admin" className="flex flex-col items-center gap-1 text-zinc-400">
          <Info size={20} /> <span className="text-[8px] font-black uppercase">Admin</span>
        </Link>
      </nav>
    </div>
  );
}
