import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/cms/db';
import { getSessionUser } from '@/lib/cms/auth';

export async function GET() {
  const db = readDatabase();
  return NextResponse.json(db.projects);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await request.json();
  const db = readDatabase();
  const newProject = {
    id: `proj-${Date.now()}`,
    title: body.title,
    category: body.category || 'Construction',
    location: body.location || 'Sunshine Coast',
    beforeImage: body.beforeImage || '/images/project-before.jpg',
    afterImage: body.afterImage || '/images/project-after.jpg',
    description: body.description || '',
    wasteType: body.wasteType || '',
    featured: !!body.featured,
    published: body.published !== undefined ? body.published : true,
    order: db.projects.length + 1,
  };
  db.projects.push(newProject);
  writeDatabase(db);
  return NextResponse.json(newProject, { status: 201 });
}

export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await request.json();
  const db = readDatabase();
  const index = db.projects.findIndex((p) => p.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  db.projects[index] = { ...db.projects[index], ...body };
  writeDatabase(db);
  return NextResponse.json(db.projects[index]);
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can delete projects' }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const db = readDatabase();
  db.projects = db.projects.filter((p) => p.id !== id);
  writeDatabase(db);
  return NextResponse.json({ success: true });
}
