'use client';

import { UserButton, useUser } from "@clerk/nextjs";
import { CalendarDays, Info, MessageSquare, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useUser();

  const menuItems = [
    { title: "Boka Tvättstuga", icon: <CalendarDays />, href: "/tvattstuga", color: "bg-blue-600" },
    { title: "Information & Regler", icon: <Info />, href: "#", color: "bg-amber-500" },
    { title: "Felanmälan", icon: <MessageSquare />, href: "#", color: "bg-emerald-600" },
    { title: "Styrelsen", icon: <ShieldCheck />, href: "#", color: "bg-purple-600" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Välkommen hem, {user?.firstName || "Granne"}!</h1>
            <p className="text-gray-500">Brf Slalomsvängen 2</p>
          </div>
          <UserButton afterSignOutUrl="/" />
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <Link key={item.title} href={item.item.href} className="group">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center space-x-6">
                <div className={`${item.color} text-white p-4 rounded-2xl`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm">Klicka för att öppna</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
