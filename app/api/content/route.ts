import Redis from 'ioredis';
import { NextResponse } from 'next/server';

// Tvinga Next.js att alltid hämta live-data från Redis
export const dynamic = 'force-dynamic';

const redis = new Redis(process.env.REDIS_URL || "");

export async function GET() {
  try {
    // Vi hämtar portalens innehåll från en unik nyckel "site_content"
    const data = await redis.get('site_content');
    
    // Om det är tomt returnerar vi ett grundobjekt så admin-sidan inte kraschar
    return NextResponse.json(data ? JSON.parse(data) : { news: [], heroTitle: "BRF Slalomsvängen 2" });
  } catch (error) {
    return NextResponse.json({ news: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Vi sparar allt (nyheter + hero + bilder) i "site_content"
    await redis.set('site_content', JSON.stringify(body));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
