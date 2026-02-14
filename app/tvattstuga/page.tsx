'use client';

import { useState, useEffect } from 'react';
import { useUser, UserButton } from "@clerk/nextjs";
import { Loader2, Trash2, Home } from "lucide-react";
import Link from "next/link";

export default function BookingPage() {
  const { user, isLoaded } = useUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
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
      await fetch('/api/bookings', {
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
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setBookings(updated);
    } finally {
      setActionLoading(null);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm">
          <h1 className="text-2xl font-bold">Tvättstuga</h1>
          <UserButton afterSignOutUrl="/" />
        </div>

        <div className="grid gap-4">
          {['07:00 - 11:00', '11:00 - 15:00', '15:00 - 19:00', '19:00 - 22:00'].map((slot) => {
            const booking = bookings.find(b => b.slot === slot);
            const isMyBooking = booking?.userId === user?.id;

            return (
              <div key={slot} className="flex items-center justify-between p-5 bg-white border rounded-xl shadow-sm">
                <div>
                  <span className="font-semibold">{slot}</span>
                  {booking && <p className="text-xs text-blue-600">{isMyBooking ? "Din tid" : `Bokad av ${booking.user}`}</p>}
                </div>
                {booking ? (
                  isMyBooking && (
                    <button onClick={() => handleCancel(slot)} className="text-red-600 p-2"><Trash2 size={20} /></button>
                  )
                ) : (
                  <button onClick={() => handleBooking(slot)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Boka</button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-gray-400 hover:text-gray-600 flex items-center justify-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Tillbaka till portalen</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
