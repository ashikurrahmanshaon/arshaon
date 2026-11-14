import { NextResponse } from 'next/server';
import { deletePrivateInboxItem, readPrivateInbox } from '@/lib/privateInbox';

const INBOX_PASS = process.env.INBOX_PASSWORD || 'arshaon2026';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const pass = String(body?.password || '').trim();
    if (pass !== INBOX_PASS) {
      return NextResponse.json({ ok: false, error: 'wrong password' }, { status: 401 });
    }
    const action = String(body?.action || 'list');
    if (action === 'delete' && body?.id) {
      const notes = deletePrivateInboxItem(String(body.id));
      return NextResponse.json({ ok: true, notes });
    }
    const notes = readPrivateInbox();
    return NextResponse.json({ ok: true, notes });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}

