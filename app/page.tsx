'use client';

import { useState, useEffect } from 'react';
import { useUser, UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function BookingPage() {
  const { user } = useUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Hämta bokningar från databasen när sidan laddas
  useEffect(() => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => {
        setBookings(data || []);
        setLoading(false);
      });
  }, []);

  // 2. Funktion för att boka
  const handleBooking = async (slot: string) => {
    const newBooking = { id: Date.now(), slot, user: user?.firstName || user?.emailAddresses[0].emailAddress };
    const updated = [...bookings, newBooking];
    
    setBookings(updated);

    // Spara till databasen via vårt API
    await fetch('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(updated),
    });
  };

  if (loading) return <div className="p-10 text-center">Laddar bokningar...</div>;

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold">Tvättstuga - Slalomvägen</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      <div className="grid gap-4">
        {['07:00 - 11:00', '11:00 - 15:00', '15:00 - 19:00', '19:00 - 22:00'].map((slot) => {
          const isBooked = bookings.find(b => b.slot === slot);
          return (
            <div key={slot} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
              <span className="font-medium">{slot}</span>
              {isBooked ? (
                <span className="text-gray-500 italic">Bokad av {isBooked.user}</span>
              ) : (
                <button 
                  onClick={() => handleBooking(slot)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Boka
                </button>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
