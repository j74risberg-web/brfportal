'use client';

import { useState, useEffect } from 'react';
import { UserButton, useUser } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight, Calendar, Home, Waves, Loader2, X, Maximize2, ChevronDown } from "lucide-react";
import Link from "next/link";

// Tvingar Next.js att hämta ny data vid varje laddning istället för att visa gammal cache
export const dynamic = 'force-dynamic';

export default function Dashboard() {
  const { user } = useUser();
  const [content, setContent] = useState<any>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedNews, setSelectedNews] = useState<any>(null); 
  const [activeMenu, setActiveMenu] = useState<string | null>(null); 
  
  const ADMIN_EMAIL = "j74risberg@gmail.com"; 

  // Menystruktur
  const menuData = [
    { title: 'Om', links: ['Föreningen', 'Fastigheten', 'Stadgar & Regler'] },
    { title: 'Ekonomi', links: ['Årsredovisningar', 'Mäklarinfo', 'Avgifter'] },
    { title: 'Info', links: ['Nyinflyttad', 'Renovering', 'Parkering', 'Avfall'] },
    { title: 'Styrelse', links: ['Kontakt', 'Mötesprotokoll', 'Valberedning'], desktopOnly: true },
  ];

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        // FIX: Vi har tagit bort .filter((n) => n.expiryDate...) 
        // Nu visas alla nyheter som finns i databasen oavsett datum.
        const allNews = data.news || [];
        setContent({ ...data, news: allNews });
      });
  }, []);

  useEffect(() => {
    if (content?.news?.length > 1) {
      const timer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % content.news.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [content?.news?.length]);

  if (!content) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-zinc-200 w-12 h-12" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 pb-20 md:pb-12">
      {/* HEADER */}
      <header className="max-w-7xl mx-auto px-6 py-4 flex justify-end items-center">
        <div className="flex items-center gap-6">
          {user?.emailAddresses[0].emailAddress === ADMIN_EMAIL && (
            <Link href="/admin" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors">
              System Admin
            </Link>
          )}
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="relative h-[25vh] md:h-[55vh] w-full bg-zinc-900 overflow-hidden shadow-2xl rounded-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent flex items-start justify-start p-10 md:p-24 z-10">
            <h2 
              style={{ fontSize: content.heroTitleSize || 'inherit' }}
              className={`text-white font-black uppercase italic leading-none tracking-tighter border-l-4 md:border-l-8 border-white pl-4 md:pl-6 text-left ${!content.heroTitleSize ? 'text-3xl md:text-7xl' : ''}`}
            >
              {/* Om du vill ha BRF på en rad och resten på nästa, kan du skriva in det med en radbrytning i admin */}
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

      {/* PREMIUM TOP MENU */}
      <nav className="max-w-7xl mx-auto px-4 md:px-6 mt-4 md:-mt-6 relative z-50">
        <div className="bg-black/90 backdrop-blur-md text-white flex items-center justify-center md:justify-start gap-1 md:gap-4 px-2 md:px-8 py-2 md:py-3 rounded-sm md:rounded-xl shadow-2xl border border-white/5">
          {menuData.map((menu) => (
            <div 
              key={menu.title} 
              className={`relative ${menu.desktopOnly ? 'hidden md:block' : ''}`}
              onMouseEnter={() => setActiveMenu(menu.title)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="group px-3 md:px-5 py-3 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all">
                <span className="relative">
                  {menu.title}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full hidden md:block" />
                </span>
                <ChevronDown size={10} className={`transition-transform duration-300 ${activeMenu === menu.title ? 'rotate-180' : ''}`} />
              </button>
              
              {activeMenu === menu.title && (
                <div className="absolute top-full left-0 w-48 md:w-64 bg-black/95 backdrop-blur-xl shadow-2xl py-4 animate-in fade-in slide-in-from-top-2 duration-200 border border-white/10 rounded-b-lg">
                  {menu.links.map((link) => (
                    <Link 
                      key={link} 
                      href={`/${link.toLowerCase().replace(/ /g, '-')}`}
                      className="block px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                      {link}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* NYHETSKARUSELL */}
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
                <button onClick={() => setSelectedNews(content.news[activeSlide])} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-900 hover:text-blue-600 transition-colors">
                  <Maximize2 size={12}/> Läs hela nyheten
                </button>
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

      {/* SERVICE GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 md:mt-12 mb-20">
        <Link href="/tvattstuga" className="group p-6 bg-blue-600/90 backdrop-blur-md text-white flex items-center gap-5 hover:bg-blue-600 transition-all shadow-lg rounded-sm border border-white/10">
          <div className="bg-white/10 p-3 rounded-sm group-hover:rotate-12 transition-transform duration-500">
            <Calendar size={28} />
          </div>
          <div>
            {/* Ändrat till Boka Tvättid enligt önskemål */}
            <h4 className="text-lg font-black uppercase italic tracking-tighter">Boka Tvättid</h4>
            <p className="text-blue-100/70 text-[9px] font-black uppercase tracking-widest">Digitalt System</p>
          </div>
        </Link>

        <Link href="/bastu" className="group p-6 bg-emerald-600/90 backdrop-blur-md text-white flex items-center gap-5 hover:bg-emerald-600 transition-all shadow-lg rounded-sm border border-white/10">
          <div className="bg-white/10 p-3 rounded-sm group-hover:scale-110 transition-transform duration-500">
            <Waves size={28} />
          </div>
          <div>
            <h4 className="text-lg font-black uppercase italic tracking-tighter">Boka Bastu</h4>
            <p className="text-emerald-100/70 text-[9px] font-black uppercase tracking-widest">Tidspass</p>
          </div>
        </Link>

        <Link href="/gastrum" className="group p-6 bg-zinc-900/90 backdrop-blur-md text-white flex items-center gap-5 hover:bg-black transition-all shadow-lg rounded-sm border border-white/10">
          <div className="bg-white/10 p-3 rounded-sm group-hover:-translate-y-1 transition-transform duration-500">
            <Home size={28} />
          </div>
          <div>
            <h4 className="text-lg font-black uppercase italic tracking-tighter">Gästrum</h4>
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">Hela Dygn</p>
          </div>
        </Link>
      </section>

      {/* MODAL FÖR NYHETER */}
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
                <div className="prose prose-sm max-w-none text-zinc-500 leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedNews.text}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 px-8 py-4 flex justify-between items-center z-50 shadow-2xl">
        <Link href="/" className="text-black"><Home size={22} /></Link>
        <Link href="/tvattstuga" className="text-zinc-400"><Calendar size={22} /></Link>
        <Link href="/bastu" className="text-zinc-400"><Waves size={22} /></Link>
      </nav>
    </div>
  );
}
