import fs from 'fs';
import path from 'path';

export interface PrivateInboxItem {
  id: string;
  kind: 'note' | 'mail';
  email: string;
  subject?: string;
  text: string;
  time: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const INBOX_FILE = path.join(DATA_DIR, 'private-inbox.json');

export function readPrivateInbox(): PrivateInboxItem[] {
  try {
    if (!fs.existsSync(INBOX_FILE)) return [];
    const raw = fs.readFileSync(INBOX_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addPrivateInboxItem(
  item: Omit<PrivateInboxItem, 'id' | 'time'>
): PrivateInboxItem {
  const list = readPrivateInbox();
  const entry: PrivateInboxItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    time: Math.floor(Date.now() / 1000),
    ...item,
  };
  list.push(entry);
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(INBOX_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('Could not write private-inbox.json:', err);
  }
  return entry;
}

export function deletePrivateInboxItem(id: string): PrivateInboxItem[] {
  const list = readPrivateInbox().filter((x) => x.id !== id);
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(INBOX_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('Could not update private-inbox.json:', err);
  }
  return list;
}

