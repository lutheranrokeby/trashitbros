import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/cms/db';
import { getSessionUser } from '@/lib/cms/auth';

export async function GET() {
  const db = readDatabase();
  return NextResponse.json(db.settings);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await request.json();
  const db = readDatabase();
  db.settings = { ...db.settings, ...body };
  writeDatabase(db);
  return NextResponse.json(db.settings);
}
