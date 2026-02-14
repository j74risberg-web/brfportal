'use client';

import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { Save, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ÄNDRA TILL DIN EMAIL HÄR!
  const ADMIN_EMAIL = "din-email@gmail.com"; 

  useEffect(() => {
    if (isLoaded) {
      // Vi sätter en säkerhetsspärr: om inget hänt på 5 sekunder, visa ett felmeddelande
      const timeout = setTimeout(() => { if (loading) setError(true); }, 5000);

      fetch('/api/content')
        .then(res => res.json())
        .then(data => {
          setContent(data);
          setLoading(false);
          clearTimeout(timeout);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    }
  }, [isLoaded]);

  if (error) return (
    <div className="p-10 text-center space-y-4">
      <AlertCircle className="mx-auto text-red-500 w-12 h-12" />
      <h1 className="text-xl font-bold">Kunde inte hämta data</h1>
      <p className="text-gray-500">Kontrollera att du har kopplat "Storage" i Vercel-panelen.</p>
      <button onClick={() => window.location.reload()} className="bg-black text-white px-4 py-2">Försök igen</button>
    </div>
  );

  if (!isLoaded || loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      <p className="text-gray-400 text-sm italic">Ansluter till databasen...</p>
    </div>
  );

  // Säkerhetskoll
  if (user?.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
    return <div className="p-10 text-center">Nekat tillträde. Loggad som: {user?.emailAddresses[0].emailAddress}</div>;
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase italic">Adminpanel</h1>
        <button onClick={async () => {
          await fetch('/api/content', { method: 'POST', body: JSON.stringify(content) });
          alert("Sparat!");
        }} className="bg-black text-white px-6 py-2 font-bold uppercase text-xs tracking-widest">Spara allt</button>
      </div>

      <div className="space-y-8">
        <div className="bg-zinc-50 p-6 border">
          <label className="text-[10px] font-bold uppercase text-zinc-400">Hero Titel</label>
          <input 
            className="w-full bg-transparent border-b border-zinc-300 py-2 text-2xl font-black outline-none"
            value={content?.heroTitle || ""} 
            onChange={e => setContent({...content, heroTitle: e.target.value})} 
          />
        </div>
        
        <div className="border p-6">
          <h2 className="font-bold mb-4 uppercase text-sm tracking-widest">Nyhetslista</h2>
          {content?.news?.map((n: any, i: number) => (
            <div key={i} className="mb-4 p-4 bg-white border-l-4 border-black">
              <input className="font-bold w-full outline-none" value={n.title} onChange={e => {
                const u = [...content.news]; u[i].title = e.target.value; setContent({...content, news: u});
              }} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
