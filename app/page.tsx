'use client';

import { useState, useEffect } from 'react';
import { UserButton, useUser } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight, Calendar, Home, Waves, Loader2, X, Maximize2 } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useUser();
  const [content, setContent] = useState<any>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedNews, setSelectedNews] = useState<any>(null); 
  const today = new Date().toISOString().split('T')[0];
  const ADMIN_EMAIL = "j74risberg@gmail.com"; 

  // Hämta innehåll
  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        const visibleNews = data.news?.filter((n: any) => !n.expiryDate || n.expiryDate >= today) || [];
        setContent({ ...data, news: visibleNews });
      });
  }, []);

  // TIMER FÖR KARUSELLEN (5 sekunder)
  useEffect(() => {
    if (content?.news?.length > 1) {
      const timer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % content.news.length);
      }, 5000);
      return () => clearInterval(timer); // Rensar timern om man lämnar sidan
    }
  }, [content?.news?.length]);

  if (!content) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-zinc-200 w-12 h-12" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 pb-20 md:pb-12">
      {/* HEADER - Nu utan titel, men behåller navigering */}
<header className="max-w-7xl mx-auto px-6 py-8 flex justify-end items-center">
  <div className="flex items-center gap-6">
    {user?.emailAddresses[0].emailAddress === ADMIN_EMAIL && (
      <Link href="/admin" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors">
        System Admin
      </Link>
    )}
    <UserButton afterSignOutUrl="/" />
  </div>
</header>

      {/* HERO SECTION - Optimerad mobilhöjd */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="relative h-[25vh] md:h-[55vh] w-full bg-zinc-900 overflow-hidden shadow-2xl rounded-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent flex items-center p-6 md:p-16 z-10">
            <h2 className="text-white text-3xl md:text-7xl font-black uppercase italic leading-none tracking-tighter border-l-4 md:border-l-8 border-white pl-4 md:pl-6">
              {content.heroTitle}
            </h2>
          </div>
          <img 
            src={content.heroImage || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"} 
            className="w-full h-full object-cover grayscale-[20%]" 
            alt="Byggnad" 
          />
        </div>
      </section>

      {/* NYHETSKARUSELL MED TIMER & MÄTARE - */}
      {content.news && content.news.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mt-8 md:mt-12">
          <div className="bg-zinc-50 border flex flex-col md:flex-row h-auto md:h-64 shadow-sm overflow-hidden group">
            <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden">
              <img 
                key={activeSlide}
                src={content.news[activeSlide].image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa"} 
                className="w-full h-full object-cover animate-in fade-in duration-700"
                alt="Nyhet"
              />
            </div>
            <div className="w-full md:w-2/3 p-6 md:p-10 flex flex-col justify-center bg-white relative border-l">
              <span className="text-blue-600 font-black text-[9px] uppercase tracking-[0.3em] mb-2">
                {content.news[activeSlide].date}
              </span>
              <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter mb-2">
                {content.news[activeSlide].title}
              </h3>
              
              <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 mb-4">
                {content.news[activeSlide].text}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <button 
                  onClick={() => setSelectedNews(content.news[activeSlide])}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-900 hover:text-blue-600 transition-colors"
                >
                  <Maximize2 size={12}/> Läs hela nyheten
                </button>
                
                {/* NAVIGERING & MÄTARE - */}
                <div className="flex items-center gap-4">
                  <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
                    {activeSlide + 1} / {content.news.length}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setActiveSlide((prev) => (prev - 1 + content.news.length) % content.news.length)} className="p-2 border border-zinc-200 hover:bg-black hover:text-white transition-all">
                      <ChevronLeft size={16} />
                    </button>
                    <button onClick={() => setActiveSlide((prev) => (prev + 1) % content.news.length)} className="p-2 border border-zinc-200 hover:bg-black hover:text-white transition-all">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SERVICE GRID - */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 md:mt-12 mb-20">
        <Link href="/tvattstuga" className="group p-10 bg-blue-600 text-white flex flex-col gap-6 hover:bg-blue-700 transition-all shadow-xl">
          <Calendar size={48} className="group-hover:rotate-12 transition-transform duration-500" />
          <div>
            <h4 className="text-2xl font-black uppercase italic tracking-tighter">Boka Tvätt</h4>
            <p className="text-blue-200 text-[10px] font-black uppercase mt-1 tracking-widest">Digitalt System</p>
          </div>
        </Link>

        <Link href="/bastu" className="group p-10 bg-emerald-600 text-white flex flex-col gap-6 hover:bg-emerald-700 transition-all shadow-xl">
          <Waves size={48} className="group-hover:scale-110 transition-transform duration-500" />
          <div>
            <h4 className="text-2xl font-black uppercase italic tracking-tighter">Boka Bastu</h4>
            <p className="text-emerald-200 text-[10px] font-black uppercase mt-1 tracking-widest">Tidspass</p>
          </div>
        </Link>

        <Link href="/gastrum" className="group p-10 bg-zinc-900 text-white flex flex-col gap-6 hover:bg-black transition-all shadow-xl">
          <Home size={48} className="group-hover:-translate-y-2 transition-transform duration-500" />
          <div>
            <h4 className="text-2xl font-black uppercase italic tracking-tighter">Gästrum</h4>
            <p className="text-zinc-500 text-[10px] font-black uppercase mt-1 tracking-widest">Hela Dygn</p>
          </div>
        </Link>
      </section>

      {/* MODAL FÖR HELA NYHETEN - */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedNews(null)} />
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-in zoom-in-95 duration-300 rounded-sm">
            <button onClick={() => setSelectedNews(null)} className="absolute top-6 right-6 p-2 bg-black text-white hover:bg-zinc-800 transition-colors z-20">
              <X size={24}/>
            </button>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 h-64 md:h-auto">
                <img src={selectedNews.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa"} className="w-full h-full object-cover" alt="Full" />
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-16">
                <span className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-4 block">{selectedNews.date}</span>
                <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-8 leading-none text-zinc-900">{selectedNews.title}</h3>
                <div className="prose prose-sm max-w-none text-zinc-500 leading-relaxed whitespace-pre-wrap font-medium text-zinc-600">
                  {selectedNews.text}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE NAV - */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 px-8 py-4 flex justify-between items-center z-50 shadow-2xl">
        <Link href="/" className="text-black"><Home size={22} /></Link>
        <Link href="/tvattstuga" className="text-zinc-400"><Calendar size={22} /></Link>
        <Link href="/bastu" className="text-zinc-400"><Waves size={22} /></Link>
      </nav>
    </div>
  );
}
