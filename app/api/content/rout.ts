import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  const content = await kv.get('site_content');
  return NextResponse.json(content || {
    heroTitle: "BRF SLALOMSVÄNGEN 2",
    news: [{ title: "Välkommen", date: "Idag", text: "Portalen är nu live!" }]
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  await kv.set('site_content', body);
  return NextResponse.json({ success: true });
}
