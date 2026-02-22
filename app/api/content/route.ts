import Redis from 'ioredis';
import { NextResponse } from 'next/server';

// Denna rad ser till att Vercel inte visar gamla sparade nyheter
export const dynamic = 'force-dynamic';

const redis = new Redis(process.env.REDIS_URL || "");

export async function GET() {
  try {
    // Vi hämtar specifikt portalens innehåll (nyheter, rubriker, etc)
    const data = await redis.get('site_content');
    
    // Om det är första gången eller tomt, skicka tillbaka ett snyggt start-objekt
    return NextResponse.json(data ? JSON.parse(data) : { news: [], heroTitle: "BRF Slalomsvängen 2" });
  } catch (error) {
    return NextResponse.json({ news: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Vi sparar allt i den dedikerade lådan "site_content"
    await redis.set('site_content', JSON.stringify(body));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
