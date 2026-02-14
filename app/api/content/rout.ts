import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Vi försöker hämta, men har en backup-plan om det är tomt
    const content = await kv.get('site_content');
    const fallback = {
      heroTitle: "BRF SLALOMSVÄNGEN 2",
      news: [{ title: "Välkommen", date: "IDAG", text: "Portalen är live!" }]
    };
    return NextResponse.json(content || fallback);
  } catch (error) {
    console.error("KV Error:", error);
    // Om databasen inte svarar alls, skicka ändå tillbaka något så sidan inte hänger sig
    return NextResponse.json({
      heroTitle: "BRF SLALOMSVÄNGEN 2 (Backup)",
      news: []
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await kv.set('site_content', body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
