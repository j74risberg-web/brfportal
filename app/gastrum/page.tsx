'use client';

import { useState, useEffect } from 'react';
import { useUser, UserButton } from "@clerk/nextjs";
import { Loader2, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function GastrumPage() {
  const { user, isLoaded } = useUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Skapa lista på de kommande 14 dagarna
  const days = Array.from({length: 14}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  useEffect(() => {
    if (isLoaded) {
      fetch('/api/bookings?type=gastrum').then(res => res.json()).then(data => {
        setBookings(data);
        setLoading(false);
      });
    }
  }, [isLoaded]);

  const toggleBooking = async (date: string) => {
    const existing = bookings.find(b => b.date === date);
    let updated;

    if (existing) {
      if (existing.userId !== user?.id) return; // Kan inte avboka andras
      updated = bookings.filter(b => b.date !== date);
    } else {
      updated = [...bookings, { date, user: user?.firstName, userId: user?.id }];
    }

    setBookings(updated);
    await fetch('/api/bookings?type=gastrum', {
      method: 'POST',
      body: JSON.stringify(updated)
    });
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <Link href="/" className="flex items-center gap-2 text-xs font-black uppercase"><ArrowLeft size={16}/> Tillbaka</Link>
          <UserButton />
        </header>

        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-8">Boka Gästrum</h1>
        
        <div className="grid gap-3">
          {days.map(date => {
            const booking = bookings.find(b => b.date === date);
            const isMine = booking?.userId === user?.id;

            return (
              <button 
                key={date}
                onClick={() => toggleBooking(date)}
                className={`p-6 flex justify-between items-center border shadow-sm transition-all ${booking ? (isMine ? 'bg-black text-white' : 'bg-zinc-200 opacity-50 cursor-not-allowed') : 'bg-white hover:border-black'}`}
              >
                <span className="font-bold">{date}</span>
                {booking ? (
                  <span className="text-[10px] uppercase font-black">{isMine ? 'Din bokning (Avboka)' : `Bokad av ${booking.user}`}</span>
                ) : (
                  <span className="text-[10px] uppercase font-black text-emerald-600">Ledig - Boka</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
