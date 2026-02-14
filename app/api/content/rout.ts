import Redis from 'ioredis';
import { NextResponse } from 'next/server';

// Skapa anslutningen med din specifika REDIS_URL från bilden
const redis = new Redis(process.env.REDIS_URL || "");

export async function GET() {
  try {
    const data = await redis.get('site_content');
    const fallback = {
      heroTitle: "BRF SLALOMSVÄNGEN 2",
      news: [{ title: "Välkommen", date: "IDAG", text: "Här skriver du din första nyhet." }]
    };
    return NextResponse.json(data ? JSON.parse(data) : fallback);
  } catch (error) {
    return NextResponse.json({ heroTitle: "FEL VID ANSLUTNING", news: [] });
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
