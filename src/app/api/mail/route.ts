import { NextResponse } from 'next/server';
import { addPrivateInboxItem } from '@/lib/privateInbox';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body?.website) {
      return NextResponse.json({ ok: true });
    }
    const message = String(body?.message || '').trim();
    const subject = String(body?.subject || '').trim();
    const email = String(body?.email || '').trim();
    if (!message) {
      return NextResponse.json({ ok: false, error: 'Please write a message.' }, { status: 400 });
    }
    const fullText = subject ? `${subject}\n\n${message}` : message;
    const saved = addPrivateInboxItem({
      kind: 'mail',
      email,
      subject,
      text: fullText,
    });
    return NextResponse.json({
      ok: true,
      id: saved.id,
      receivedAt: new Date(saved.time * 1000).toISOString(),
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}
