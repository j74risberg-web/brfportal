'use client';

import { useState, useEffect } from 'react';
import { useUser, UserButton } from "@clerk/nextjs";
import { Loader2, Trash2, Home } from "lucide-react";

export default function BookingPage() {
  const { user, isLoaded } = useUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 1. Hämta bokningar från databasen
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

  // 2. Funktion för att boka
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

  // 3. Funktion för att avboka (bara ens egna tider)
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
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
        <p className="text-gray-500">Öppnar tvättstugan...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tvättstuga</h1>
            <p className="text-gray-500 text-sm">Slalomvägen 2</p>
          </div>
          <div className="flex items-center space-x-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        {/* Bokningslista */}
        <div className="grid gap-4">
          {['07:00 - 11:00', '11:00 - 15:00', '15:00 - 19:00', '19:00 - 22:00'].map((slot) => {
            const booking = bookings.find(b => b.slot === slot);
            const isMyBooking = booking?.userId === user?.id;

            return (
              <div key={slot} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-xl shadow-sm">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">{slot}</span>
                  {booking && (
                    <span className="text-xs text-blue-600 font-medium">
                      {isMyBooking ? "Din tid" : `Bokad av ${booking.user}`}
                    </span>
                  )}
                </div>

                {booking ? (
                  isMyBooking ? (
                    <button 
                      onClick={() => handleCancel(slot)}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 flex items-center space-x-2 text-sm font-bold"
                    >
                      {actionLoading === slot ? <Loader2 className="animate-spin w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                      <span>Avboka</span>
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm bg-gray-50 px-4 py-2 rounded-lg">Upptaget</span>
                  )
                ) : (
                  <button 
                    onClick={() => handleBooking(slot)}
                    disabled={!!actionLoading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-bold transition-all disabled:opacity-50"
                  >
                    {actionLoading === slot ? <Loader2 className="animate-spin w-4 h-4" /> : "Boka"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* "Väg ut" - länk till startsidan */}
        <div className="mt-12 text-center">
          <a href="/" className="text-gray-400 hover:text-gray-600 flex items-center justify-center space-x-2 text-sm transition-colors">
            <Home className="w-4 h-4" />
            <span>Tillbaka till portalen</span>
          </a>
        </div>
      </div>
    </main>
  );
}
