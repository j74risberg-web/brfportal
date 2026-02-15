import { SignUp } from "@clerk/nextjs";
import { Waves } from "lucide-react";

export default function SignUpPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      <div className="flex flex-col items-center justify-center p-8 md:p-12 relative">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-black p-2 text-white"><Waves size={20} /></div>
            <h1 className="text-lg font-black uppercase italic tracking-tighter">BRF Slalomsvängen 2</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-2">Skapa konto</h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
              Registrera dig med koden du fått i din inbjudan.
            </p>
          </div>

          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: "bg-black hover:bg-zinc-800 text-[10px] uppercase tracking-[0.2em] font-black py-4 rounded-none transition-all",
                card: "shadow-none p-0 w-full border-none bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border border-zinc-200 rounded-none py-3 hover:bg-zinc-50",
                socialButtonsBlockButtonText: "font-black uppercase tracking-widest text-[9px]",
                formFieldInput: "bg-zinc-50 border-zinc-200 rounded-none p-4",
              }
            }}
          />
        </div>
      </div>

      <div className="hidden lg:block relative bg-zinc-900">
        <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00" className="absolute inset-0 w-full h-full object-cover opacity-80 grayscale-[20%]" alt="Fasad" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
    </main>
  );
}
