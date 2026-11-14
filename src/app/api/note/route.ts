import { NextResponse } from 'next/server';
import { addPrivateInboxItem } from '@/lib/privateInbox';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body?.website) {
      return NextResponse.json({ ok: true });
    }
    const note = String(body?.note || '').trim();
    const email = String(body?.email || '').trim();
    if (!note) {
      return NextResponse.json({ ok: false, error: 'Please write a note first.' }, { status: 400 });
    }
    const saved = addPrivateInboxItem({
      kind: 'note',
      email,
      text: note,
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
