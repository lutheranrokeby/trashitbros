import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/cms/db';
import { getSessionUser } from '@/lib/cms/auth';

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');
  const db = readDatabase();

  if (format === 'csv') {
    const headers = 'Reference,Date,Name,Email,Phone,NoPhotos,Status,PhotosCount\n';
    const rows = db.enquiries
      .map((e) =>
        `"${e.reference}","${e.createdAt}","${e.fullName}","${e.email || ''}","${e.phone || ''}","${e.noPhotos ? 'Yes' : 'No'}","${e.status}",${e.photos ? e.photos.length : 0}`
      )
      .join('\n');
    return new Response(headers + rows, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="trash_it_bros_enquiries_${Date.now()}.csv"`,
      },
    });
  }

  return NextResponse.json(db.enquiries);
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id, status, internalNotes } = await request.json();
  const db = readDatabase();
  const index = db.enquiries.findIndex((e) => e.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
  }

  if (status) db.enquiries[index].status = status;
  if (internalNotes !== undefined) db.enquiries[index].internalNotes = internalNotes;
  db.enquiries[index].updatedAt = new Date().toISOString();

  writeDatabase(db);
  return NextResponse.json(db.enquiries[index]);
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can delete enquiries' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const db = readDatabase();
  db.enquiries = db.enquiries.filter((e) => e.id !== id);
  writeDatabase(db);
  return NextResponse.json({ success: true });
}
