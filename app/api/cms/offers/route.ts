import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/cms/db';
import { getSessionUser } from '@/lib/cms/auth';
import { OfferItem } from '@/lib/cms/types';

export async function GET() {
  const db = readDatabase();
  return NextResponse.json(db.offers || []);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const db = readDatabase();

  // If body is an array, replace db.offers
  if (Array.isArray(body)) {
    db.offers = body;
  } else if (body.id) {
    // Single offer upsert
    if (!db.offers) db.offers = [];
    const index = db.offers.findIndex((o) => o.id === body.id || o.slug === body.slug);
    if (index !== -1) {
      db.offers[index] = { ...db.offers[index], ...body };
    } else {
      db.offers.push(body as OfferItem);
    }
  } else if (body.offers) {
    db.offers = body.offers;
  }

  writeDatabase(db);
  return NextResponse.json(db.offers || []);
}
