import Redis from 'ioredis';
import { NextResponse } from 'next/server';

const redis = new Redis(process.env.REDIS_URL || "");

export async function GET() {
  try {
    const data = await redis.get('site_content');
    if (data) return NextResponse.json(JSON.parse(data));

    // Startdata om databasen är tom
    const startData = {
      heroTitle: "BRF SLALOMSVÄNGEN 2",
      heroImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000",
      topMenu: [{ name: "Nyheter", href: "#" }, { name: "Boka", href: "/tvattstuga" }],
      news: [
        { title: "Välkommen", date: "IDAG", text: "Här skriver du din första nyhet.", image: "", expiryDate: "2026-02-28" }
      ]
    };
    return NextResponse.json(startData);
  } catch (e) {
    return NextResponse.json({ error: "DB Error" }, { status: 500 });
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
