'use client';

import { useState, useEffect } from 'react';
import { useUser, UserButton } from "@clerk/nextjs";
import { Loader2, Trash2, Home, Waves } from "lucide-react";
import Link from "next/link";

export default function BastuPage() {
  const { user, isLoaded } = useUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      // VIKTIGT: Lagt till ?type=bastu
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

  const handleBooking = async (slot: string) => {
    setActionLoading(slot);
    const userName = user?.firstName || user?.username || "Granne";
    const newBooking = { id: Date.now(), slot, user: userName, userId: user?.id };
    const updated = [...bookings, newBooking];
    
    try {
      // VIKTIGT: Lagt till ?type=bastu
      await fetch('/api/bookings?type=bastu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setBookings(updated);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (slot: string) => {
    setActionLoading(slot);
    const updated = bookings.filter(b => b.slot !== slot);
    
    try {
      // VIKTIGT: Lagt till ?type=bastu
      await fetch('/api/bookings?type=bastu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setBookings(updated);
    } finally {
      setActionLoading(null);
    }
  };

  if (!isLoaded || loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-emerald-600 w-10 h-10" />
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border-l-8 border-emerald-600">
          <div className="flex items-center gap-3">
            <Waves className="text-emerald-600" />
            <h1 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900">Bastu</h1>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>

        <div className="grid gap-4">
          {['09:00 - 12:00', '12:00 - 15:00', '15:00 - 18:00', '18:00 - 21:00'].map((slot) => {
            const booking = bookings.find(b => b.slot === slot);
            const isMyBooking = booking?.userId === user?.id;

            return (
              <div key={slot} className="flex items-center justify-between p-6 bg-white border rounded-xl shadow-sm transition-all hover:border-emerald-600">
                <div>
                  <span className="font-bold text-lg">{slot}</span>
                  {booking && <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{isMyBooking ? "Din bokning" : `Bokad av ${booking.user}`}</p>}
                </div>
                {booking ? (
                  isMyBooking && (
                    <button onClick={() => handleCancel(slot)} className="text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={20} /></button>
                  )
                ) : (
                  <button onClick={() => handleBooking(slot)} className="bg-emerald-600 text-white px-8 py-2 rounded-lg font-black uppercase text-xs tracking-widest shadow-md hover:bg-emerald-700">Boka</button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-zinc-400 hover:text-black flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest transition-colors">
            <Home size={14} />
            <span>Tillbaka till portalen</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
