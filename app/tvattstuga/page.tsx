'use client';

import { useState, useEffect } from 'react';
import { useUser, UserButton } from "@clerk/nextjs";
import { Loader2, Trash2, Home, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";

export default function TvattCalendarPage() {
  const { user, isLoaded } = useUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false); // FIX: Förhindrar krasch
  const [selectedDate, setSelectedDate] = useState(""); // FIX: Startar tom
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const timeSlots = ['07:00 - 11:00', '11:00 - 15:00', '15:00 - 19:00', '19:00 - 22:00'];

  useEffect(() => {
    setMounted(true);
    // Sätt datumet först när sidan laddats i webbläsaren
    setSelectedDate(new Date().toISOString().split('T')[0]);
    
    if (isLoaded) {
      fetch('/api/bookings?type=tvatt')
        .then(res => res.json())
        .then(data => {
          setBookings(data || []);
          setLoading(false);
        });
    }
  }, [isLoaded]);

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const handleBooking = async (slot: string) => {
    const userName = user?.firstName || user?.username || "Granne";
    const newBooking = { id: Date.now(), date: selectedDate, slot, user: userName, userId: user?.id };
    const updated = [...bookings, newBooking];
    setBookings(updated);
    await fetch('/api/bookings?type=tvatt', { method: 'POST', body: JSON.stringify(updated) });
  };

  const handleCancel = async (slot: string) => {
    const updated = bookings.filter(b => !(b.date === selectedDate && b.slot === slot));
    setBookings(updated);
    await fetch('/api/bookings?type=tvatt', { method: 'POST', body: JSON.stringify(updated) });
  };

  // Om sidan inte landat i webbläsaren än, visa bara en laddningsikon
  if (!mounted || !isLoaded || loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-12 h-12" /></div>;

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  return (
    <main className="min-h-screen bg-white p-4 md:p-12 font-sans text-zinc-900">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b pb-6">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
            <Home size={14} /> Tillbaka
          </Link>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Boka Tvättstuga</h1>
          <UserButton afterSignOutUrl="/" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black uppercase text-sm tracking-widest">
                {currentMonth.toLocaleString('sv-SE', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <button onClick={() => changeMonth(-1)} className="p-2 border hover:bg-zinc-100"><ChevronLeft size={18}/></button>
                <button onClick={() => changeMonth(1)} className="p-2 border hover:bg-zinc-100"><ChevronRight size={18}/></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-zinc-400 mb-2 uppercase">
              {['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startingDay }).map((_, i) => <div key={i} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasBookings = bookings.some(b => b.date === dateStr);
                const isSelected = selectedDate === dateStr;
                return (
                  <button key={day} onClick={() => setSelectedDate(dateStr)} className={`aspect-square flex flex-col items-center justify-center border text-sm transition-all relative ${isSelected ? 'bg-black text-white border-black z-10 scale-105 shadow-lg' : 'hover:border-blue-600'} ${hasBookings && !isSelected ? 'bg-blue-50' : ''}`}>
                    <span className="font-bold">{day}</span>
                    {hasBookings && <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-blue-600'}`} />}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="bg-zinc-50 p-8 border border-zinc-100">
            <h2 className="font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-2 text-blue-600">
              <CalendarIcon size={14} /> Pass för {selectedDate}
            </h2>
            <div className="space-y-3">
              {timeSlots.map(slot => {
                const booking = bookings.find(b => b.date === selectedDate && b.slot === slot);
                const isMine = booking?.userId === user?.id;
                return (
                  <div key={slot} className="flex items-center justify-between p-4 bg-white border shadow-sm group">
                    <div>
                      <span className="font-bold text-sm">{slot}</span>
                      {booking && <p className="text-[10px] font-black uppercase text-blue-600 mt-1 italic">{isMine ? "Ditt pass" : `Bokat av ${booking.user}`}</p>}
                    </div>
                    {booking ? isMine && <button onClick={() => handleCancel(slot)} className="text-red-500 p-2 hover:bg-red-50 transition-colors"><Trash2 size={18} /></button> : <button onClick={() => handleBooking(slot)} className="bg-blue-600 text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Boka</button>}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
