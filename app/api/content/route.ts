import Redis from 'ioredis';
import { NextResponse } from 'next/server';

const redis = new Redis(process.env.REDIS_URL || "");

export async function GET() {
  try {
    const data = await redis.get('site_content');
    const fallback = {
      heroTitle: "BRF SLALOMSVÄNGEN 2",
      heroImage: "/hero-building.jpg",
      topMenu: [{ name: "Nyheter", href: "#" }, { name: "Boka", href: "/tvattstuga" }],
      news: [
        { title: "Vårstädning 2026", date: "15 MAJ", text: "Vi ses på gården för gemensam städning och grillning.", image: "https://images.unsplash.com/photo-1558905619-171426efb452", expiryDate: "2026-05-16" },
        { title: "Ny belysning installerad", date: "22 FEB", text: "Nu har vi bytt till miljövänlig LED-belysning i alla trapphus.", image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2", expiryDate: "2026-12-31" },
        { title: "OVK-besiktning", date: "10 MARS", text: "Besiktning av ventilation sker i alla lägenheter. Se schema i porten.", image: "https://images.unsplash.com/photo-1581094288338-2314dddb790a", expiryDate: "2026-03-11" },
        { title: "Container på gården", date: "1 APRIL", text: "Under helgen finns container för grovsopor (ej elavfall).", image: "https://images.unsplash.com/photo-1595273670150-db0a3d39d082", expiryDate: "2026-04-05" },
        { title: "Årsstämma 2026", date: "25 MAJ", text: "Välkomna till föreningsstämman i kvarterslokalen kl 19:00.", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952", expiryDate: "2026-05-26" }
      ]
    };
    return NextResponse.json(data ? JSON.parse(data) : fallback);
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await redis.set('site_content', JSON.stringify(body));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
