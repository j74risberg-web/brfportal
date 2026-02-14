'use client';

import { UserButton } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight, CalendarDays, Home, Info, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [currentNews, setCurrentNews] = useState(0);

  const news = [
    { title: "Vårstädning 2026", date: "15 maj", text: "Dags att snygga till innergården!" },
    { title: "Ny belysning", date: "22 feb", text: "Vi byter till LED i alla trapphus." },
  ];

  const topMenu = [
    { name: "Nyheter", href: "#" },
    { name: "Om Slalomsvängen 2", href: "#" },
    { name: "Övrigt", href: "#" },
    { name: "Gästrummet", href: "/gastrum" },
    { name: "SPA", href: "/spa" },
    { name: "Mäklarinfo", href: "#" },
    { name: "Styrelsen", href: "#" },
  ];

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900">
      {/* 1. TOP TITLE & LOGIN */}
      <div className="max-w-6xl mx-auto p-6 flex justify-between items-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter">BRF Slalomsvängen 2</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* 2. HERO SECTION */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative h-[300px] w-full bg-blue-900 overflow-hidden group">
          {/* Här kan du lägga din bild i public-mappen och referera till den */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-start p-12 z-10">
            <h2 className="text-white text-5xl font-bold uppercase tracking-widest border-b-4 border-white pb-2">
              BRF SLALOMSVÄNGEN 2
            </h2>
          </div>
          <img 
            src="/hero-building.jpg" 
            alt="Fasaden" 
            className="w-full h-full object-cover opacity-80"
          />
        </div>
      </div>

      {/* 3. BLACK MENU BAR (TOP MENU) */}
      <nav className="bg-black mt-1">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap gap-6 py-3 text-white text-sm font-medium">
          {topMenu.map(item => (
            <Link key={item.name} href={item.href} className="hover:text-blue-400 transition-colors">
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* 4. NYHETSKARUSELL */}
      <section className="max-w-6xl mx-auto p-6 mt-8">
        <div className="bg-gray-100 p-8 rounded-sm relative flex items-center justify-between">
          <button onClick={() => setCurrentNews(0)} className="p-2 hover:bg-gray-200 rounded-full">
            <ChevronLeft />
          </button>
          <div className="text-center px-10">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">{news[currentNews].date}</span>
            <h3 className="text-2xl font-bold mt-1">{news[currentNews].title}</h3>
            <p className="text-gray-600 mt-2">{news[currentNews].text}</p>
          </div>
          <button onClick={() => setCurrentNews(1)} className="p-2 hover:bg-gray-200 rounded-full">
            <ChevronRight />
          </button>
        </div>
      </section>

      {/* 5. BOKNINGS-KNAPPAR (SERVICES) */}
      <section className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <Link href="/tvattstuga" className="flex items-center space-x-6 p-10 bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg">
          <CalendarDays size={48} />
          <div>
            <h3 className="text-2xl font-bold">Boka Tvättstuga</h3>
            <p className="opacity-80">Se lediga tider och boka ditt pass</p>
          </div>
        </Link>
        <Link href="/gastrum" className="flex items-center space-x-6 p-10 bg-zinc-800 text-white hover:bg-zinc-900 transition-all shadow-lg">
          <Home size={48} />
          <div>
            <h3 className="text-2xl font-bold">Gästrum & SPA</h3>
            <p className="opacity-80">Boka övernattning eller relaxavdelning</p>
          </div>
        </Link>
      </section>

      {/* 6. BOTTOM MENU (FOOTER) */}
      <footer className="bg-zinc-100 border-t py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-sm text-gray-500">
          <div>
            <h4 className="font-bold text-black mb-4 uppercase">Adress</h4>
            <p>Slalomvägen 2</p>
            <p>129 49 Hägersten</p>
          </div>
          <div>
            <h4 className="font-bold text-black mb-4 uppercase">Snabblänkar</h4>
            <ul className="space-y-2">
              <li><Link href="/info">Felanmälan</Link></li>
              <li><Link href="/info">Stadgar & trivselregler</Link></li>
            </ul>
          </div>
          <div className="text-right">
            <p>© 2026 BRF Slalomsvängen 2</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
