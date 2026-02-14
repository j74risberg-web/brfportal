'use client';

import { useState, useEffect } from 'react';
import { useUser, UserButton } from "@clerk/nextjs";
import { Loader2, Trash2, Home, ChevronLeft, ChevronRight, Waves } from "lucide-react";
import Link from "next/link";

export default function BastuCalendarPage() {
  const { user, isLoaded } = useUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Dina bastu-tider (3-timmarspass)
  const timeSlots = ['09:00 - 12:00', '12:00 - 15:00', '15:00 - 18:00', '18:00 - 21:00'];

  const fetchBookings = async () => {
    try {
      // VIKTIGT: Hatar från bastu-listan i Redis
      const res = await fetch('/api/bookings?type=bastu');
      const data = await res.json();
      setBookings(data || []);
    } catch (e) {
      console.error("Kunde inte hämta data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) fetchBookings();
  }, [isLoaded]);

  // Kalenderlogik
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const handleBooking = async (slot: string) => {
    const userName = user?.firstName || user?.username || "Granne";
    const newBooking = { id: Date.now(), date: selectedDate, slot, user: userName, userId: user?.id };
    const updated = [...bookings, newBooking];
    
    setBookings(updated);
    await fetch('/api/bookings?type=bastu', {
      method: 'POST',
      body: JSON.stringify(updated),
    });
  };

  const handleCancel = async (slot: string) => {
    const updated = bookings.filter(b => !(b.date === selectedDate && b.slot === slot));
    setBookings(updated);
    await fetch('/api/bookings?type=bastu', {
      method: 'POST',
      body: JSON.stringify(updated),
    });
  };

  if (!isLoaded || loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>;

  return (
    <main className="min-h-screen bg-white p-4 md:p-12 font-sans text-zinc-900">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-12 border-b pb-6 border-emerald-100">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
            <Home size={14} /> Tillbaka
          </Link>
          <div className="flex items-center gap-3 text-emerald-600">
            <Waves size={24} />
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-900">Boka Bastu</h1>
          </div>
          <UserButton afterSignOutUrl="/" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* KALENDER */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black uppercase text-sm tracking-widest">
                {currentMonth.toLocaleString('sv-SE', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-2 border hover:bg-emerald-50"><ChevronLeft size={18}/></button>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-2 border hover:bg-emerald-50"><ChevronRight size={18}/></button>
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
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`aspect-square flex flex-col items-center justify-center border text-sm transition-all relative
                      ${isSelected ? 'bg-emerald-600 text-white border-emerald-600 z-10 scale-105 shadow-lg' : 'hover:border-emerald-600'}
                      ${hasBookings && !isSelected ? 'bg-emerald-50' : ''}`}
                  >
                    <span className="font-bold">{day}</span>
                    {hasBookings && <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-emerald-600'}`} />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* TIDSPASS */}
          <section className="bg-emerald-50/30 p-8 border border-emerald-100 rounded-sm">
            <h2 className="font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-2 text-emerald-700">
              <Waves size={14} /> Pass för {selectedDate}
            </h2>
            
            <div className="space-y-3">
              {timeSlots.map(slot => {
                const booking = bookings.find(b => b.date === selectedDate && b.slot === slot);
                const isMine = booking?.userId === user?.id;

                return (
                  <div key={slot} className="flex items-center justify-between p-4 bg-white border shadow-sm group hover:border-emerald-600 transition-colors">
                    <div>
                      <span className="font-bold text-sm">{slot}</span>
                      {booking && (
                        <p className="text-[10px] font-black uppercase text-emerald-600 mt-1 italic">
                          {isMine ? "Din tid" : `Bokad av ${booking.user}`}
                        </p>
                      )}
                    </div>
                    
                    {booking ? (
                      isMine && (
                        <button onClick={() => handleCancel(slot)} className="text-red-500 p-2 hover:bg-red-50 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      )
                    ) : (
                      <button 
                        onClick={() => handleBooking(slot)}
                        className="bg-emerald-600 text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all"
                      >
                        Boka
                      </button>
                    )}
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
