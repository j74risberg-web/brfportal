import Redis from 'ioredis';
import { NextResponse } from 'next/server';

const redis = new Redis(process.env.REDIS_URL || ""); //

export async function GET() {
  try {
    const data = await redis.get('site_content');
    const fallback = {
      heroTitle: "BRF SLALOMSVÄNGEN 2",
      heroImage: "/hero-building.jpg",
      topMenu: [
        { name: "Nyheter", href: "#" },
        { name: "Om oss", href: "#" },
        { name: "Tvättstuga", href: "/tvattstuga" }
      ],
      news: [{ title: "Välkommen", date: "IDAG", text: "Portalen är nu live!" }]
    };
    return NextResponse.json(data ? JSON.parse(data) : fallback);
  } catch (error) {
    return NextResponse.json({ heroTitle: "BRF SLALOMSVÄNGEN 2", topMenu: [], news: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await redis.set('site_content', JSON.stringify(body));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
