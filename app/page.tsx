'use client';

import { useState, useEffect } from 'react';
import { UserButton, useUser } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight, Calendar, Home, Loader2, Waves } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useUser();
  const [content, setContent] = useState<any>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const today = new Date().toISOString().split('T')[0];
  const ADMIN_EMAIL = "j74risberg@gmail.com";

  useEffect(() => {
    fetch('/api/content').then(res => res.json()).then(data => {
      const visibleNews = data.news?.filter((n: any) => !n.expiryDate || n.expiryDate >= today) || [];
      setContent({ ...data, news: visibleNews });
    });
  }, []);

  if (!content) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-20">
      <header className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic">BRF Slalomsvängen 2</h1>
        <div className="flex items-center gap-6">
          {user?.emailAddresses[0].emailAddress === ADMIN_EMAIL && (
            <Link href="/admin" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors">
              System Admin
            </Link>
          )}
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* HERO & KARUSELL (Samma som innan) */}
      {/* ... (Håll kvar din befintliga Hero och Nyhetskarusell här) ... */}

      {/* SERVICE GRID - Nu med 3 bokningsbara tjänster */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Link href="/tvattstuga" className="group p-10 bg-blue-600 text-white flex flex-col gap-6 hover:bg-blue-700 transition-all shadow-xl">
          <Calendar size={48} className="group-hover:rotate-12 transition-transform" />
          <div>
            <h4 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Boka Tvätt</h4>
            <p className="text-blue-200 text-[10px] font-black uppercase mt-1 tracking-widest">Digitalt system</p>
          </div>
        </Link>

        <Link href="/bastu" className="group p-10 bg-emerald-600 text-white flex flex-col gap-6 hover:bg-emerald-700 transition-all shadow-xl">
          <Waves size={48} className="group-hover:scale-110 transition-transform" />
          <div>
            <h4 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Boka Bastu</h4>
            <p className="text-emerald-200 text-[10px] font-black uppercase mt-1 tracking-widest">Tidspass</p>
          </div>
        </Link>

        <Link href="/gastrum" className="group p-10 bg-zinc-900 text-white flex flex-col gap-6 hover:bg-black transition-all shadow-xl">
          <Home size={48} className="group-hover:-translate-y-2 transition-transform" />
          <div>
            <h4 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Gästrum</h4>
            <p className="text-zinc-500 text-[10px] font-black uppercase mt-1 tracking-widest">Hela dygn</p>
          </div>
        </Link>
      </section>
    </div>
  );
}
