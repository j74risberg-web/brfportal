'use client';

import { useState, useEffect } from 'react';
import { useUser, UserButton } from "@clerk/nextjs";
import { Loader2, Trash2, Home, Calendar } from "lucide-react";
import Link from "next/link";

export default function TvattPage() {
  const { user, isLoaded } = useUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      // VIKTIGT: Lagt till ?type=tvatt
      const res = await fetch('/api/bookings?type=tvatt');
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
      // VIKTIGT: Lagt till ?type=tvatt
      await fetch('/api/bookings?type=tvatt', {
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
      // VIKTIGT: Lagt till ?type=tvatt
      await fetch('/api/bookings?type=tvatt', {
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
      <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border-l-8 border-blue-600">
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-600" />
            <h1 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900">Tvättstuga</h1>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>

        <div className="grid gap-4">
          {['07:00 - 11:00', '11:00 - 15:00', '15:00 - 19:00', '19:00 - 22:00'].map((slot) => {
            const booking = bookings.find(b => b.slot === slot);
            const isMyBooking = booking?.userId === user?.id;

            return (
              <div key={slot} className="flex items-center justify-between p-6 bg-white border rounded-xl shadow-sm transition-all hover:border-blue-600">
                <div>
                  <span className="font-bold text-lg">{slot}</span>
                  {booking && <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{isMyBooking ? "Din bokning" : `Bokad av ${booking.user}`}</p>}
                </div>
                {booking ? (
                  isMyBooking && (
                    <button onClick={() => handleCancel(slot)} className="text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={20} /></button>
                  )
                ) : (
                  <button onClick={() => handleBooking(slot)} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-black uppercase text-xs tracking-widest shadow-md hover:bg-blue-700">Boka</button>
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
