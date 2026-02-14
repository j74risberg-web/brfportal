'use client';

import { UserButton, useUser } from "@clerk/nextjs";
import { CalendarDays, Info, MessageSquare, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const { user } = useUser();

  const services = [
    { title: "Boka Tvättstuga", icon: <CalendarDays />, href: "/tvattstuga", desc: "Slalomvägen 2", color: "bg-blue-600" },
    { title: "Gästlägenhet", icon: <CalendarDays />, href: "/gastlagenhet", desc: "Boka för dina gäster", color: "bg-purple-600" },
    { title: "Information", icon: <Info />, href: "/info", desc: "Regler & stadgar", color: "bg-amber-500" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">BRF Portalen</h1>
            <p className="text-gray-500 font-medium">Välkommen hem, {user?.firstName || "Granne"}</p>
          </div>
          <div className="bg-white p-1 rounded-full shadow-sm border">
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((item) => (
            <Link key={item.title} href={item.href} className="group">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center space-x-6 h-full">
                <div className={`${item.color} text-white p-5 rounded-2xl shadow-lg`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
