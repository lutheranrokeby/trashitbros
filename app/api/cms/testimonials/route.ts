import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/cms/db';
import { getSessionUser } from '@/lib/cms/auth';

export async function GET() {
  const db = readDatabase();
  return NextResponse.json(db.testimonials);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await request.json();
  const db = readDatabase();
  const newTestimonial = {
    id: `t-${Date.now()}`,
    name: body.name,
    role: body.role || '',
    location: body.location || '',
    content: body.content,
    rating: body.rating || 5,
    featured: !!body.featured,
    published: body.published !== undefined ? body.published : true,
  };
  db.testimonials.push(newTestimonial);
  writeDatabase(db);
  return NextResponse.json(newTestimonial, { status: 201 });
}

export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await request.json();
  const db = readDatabase();
  const index = db.testimonials.findIndex((t) => t.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
  }
  db.testimonials[index] = { ...db.testimonials[index], ...body };
  writeDatabase(db);
  return NextResponse.json(db.testimonials[index]);
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can delete testimonials' }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const db = readDatabase();
  db.testimonials = db.testimonials.filter((t) => t.id !== id);
  writeDatabase(db);
  return NextResponse.json({ success: true });
}
