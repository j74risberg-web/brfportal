import Redis from 'ioredis';
import { NextResponse } from 'next/server';

const redis = new Redis(process.env.REDIS_URL || "");

export async function GET() {
  try {
    const data = await redis.get('site_content');
    const fallback = {
      heroTitle: "BRF SLALOMSVÄNGEN 2",
      heroImage: "",
      topMenu: [{ name: "Nyheter", href: "#" }, { name: "Boka", href: "/tvattstuga" }],
      news: [{ title: "Välkommen", date: "14 FEB", text: "Portalen är nu live för alla boende." }]
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
