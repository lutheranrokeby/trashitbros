import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/cms/db';
import { getSessionUser } from '@/lib/cms/auth';

export async function GET() {
  const db = readDatabase();
  return NextResponse.json(db.services);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await request.json();
  const db = readDatabase();
  const newService = {
    id: `srv-${Date.now()}`,
    slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: body.name,
    shortDescription: body.shortDescription || '',
    fullDescription: body.fullDescription || '',
    heroImage: body.heroImage || '/images/hero-truck.jpg',
    cardImage: body.cardImage || '/images/service-construction.jpg',
    benefits: body.benefits || [],
    wasteExamples: body.wasteExamples || [],
    order: db.services.length + 1,
    published: body.published !== undefined ? body.published : true,
  };
  db.services.push(newService);
  writeDatabase(db);
  return NextResponse.json(newService, { status: 201 });
}

export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await request.json();
  const db = readDatabase();
  const index = db.services.findIndex((s) => s.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }
  db.services[index] = { ...db.services[index], ...body };
  writeDatabase(db);
  return NextResponse.json(db.services[index]);
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can delete services' }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const db = readDatabase();
  db.services = db.services.filter((s) => s.id !== id);
  writeDatabase(db);
  return NextResponse.json({ success: true });
}
