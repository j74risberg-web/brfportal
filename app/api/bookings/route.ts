import Redis from 'ioredis';
import { NextResponse } from 'next/server';

// Din anslutning till brf-kv databasen
const redis = new Redis(process.env.REDIS_URL || "");

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // Vi läser av om sidan vill ha 'tvatt', 'bastu' eller 'gastrum'
    const type = searchParams.get('type') || 'tvatt'; 
    
    // Vi hämtar data från en unik nyckel, t.ex. "bookings_bastu"
    const data = await redis.get(`bookings_${type}`);
    return NextResponse.json(data ? JSON.parse(data) : []);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'tvatt';
    
    const body = await request.json();
    
    // Vi sparar datan i den unika lådan för just denna typ
    await redis.set(`bookings_${type}`, JSON.stringify(body));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
