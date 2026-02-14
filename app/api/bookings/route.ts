import Redis from 'ioredis';
import { NextResponse } from 'next/server';

const redis = new Redis(process.env.REDIS_URL || "");

export async function GET() {
  const data = await redis.get('bookings');
  return NextResponse.json(data ? JSON.parse(data) : []);
}

export async function POST(request: Request) {
  const body = await request.json();
  await redis.set('bookings', JSON.stringify(body));
  return NextResponse.json({ success: true });
}
