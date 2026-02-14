import Redis from 'ioredis';
import { NextResponse } from 'next/server';

const redis = new Redis(process.env.REDIS_URL || "");

export async function GET() {
  try {
    const data = await redis.get('site_content');
    if (!data) {
      return NextResponse.json({ heroTitle: "BRF SLALOMSVÄNGEN 2", news: [] });
    }
    
    // Vi tvingar fram en JSON-tolkning
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Redis GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Vi sparar det som en ren sträng för att Redis ska förstå
    await redis.set('site_content', JSON.stringify(body));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Redis POST Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
