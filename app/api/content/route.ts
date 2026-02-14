import Redis from 'ioredis';
import { NextResponse } from 'next/server';

const redis = new Redis(process.env.REDIS_URL || "");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'tvatt'; // Default till tvätt
  
  const data = await redis.get(`bookings_${type}`);
  return NextResponse.json(data ? JSON.parse(data) : []);
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'tvatt';
  
  const body = await request.json();
  await redis.set(`bookings_${type}`, JSON.stringify(body));
  return NextResponse.json({ success: true });
}
