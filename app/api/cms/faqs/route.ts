import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/cms/db';
import { getSessionUser } from '@/lib/cms/auth';

export async function GET() {
  const db = readDatabase();
  return NextResponse.json(db.faqs);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await request.json();
  const db = readDatabase();
  const newFaq = {
    id: `faq-${Date.now()}`,
    question: body.question,
    answer: body.answer,
    category: body.category || 'General',
    order: db.faqs.length + 1,
    published: body.published !== undefined ? body.published : true,
  };
  db.faqs.push(newFaq);
  writeDatabase(db);
  return NextResponse.json(newFaq, { status: 201 });
}

export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await request.json();
  const db = readDatabase();
  const index = db.faqs.findIndex((f) => f.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
  }
  db.faqs[index] = { ...db.faqs[index], ...body };
  writeDatabase(db);
  return NextResponse.json(db.faqs[index]);
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can delete FAQs' }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const db = readDatabase();
  db.faqs = db.faqs.filter((f) => f.id !== id);
  writeDatabase(db);
  return NextResponse.json({ success: true });
}
