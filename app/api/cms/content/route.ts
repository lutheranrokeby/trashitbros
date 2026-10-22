import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/cms/db';
import { getSessionUser } from '@/lib/cms/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('page') || 'home';
  const requestedMode = searchParams.get('mode') || 'published';

  const db = readDatabase();
  const page = db.pages[slug];

  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  const user = await getSessionUser();
  const isAuthorized = user && (user.role === 'admin' || user.role === 'editor');

  // Anonymous visitors always get publishedContent
  const content = isAuthorized && requestedMode === 'draft'
    ? page.draftContent
    : page.publishedContent;

  return NextResponse.json({
    slug: page.slug,
    title: page.title,
    seo: page.seo,
    content,
    updatedAt: page.updatedAt,
    publishedAt: page.publishedAt,
    isDraft: isAuthorized && requestedMode === 'draft',
    hasUnpublishedChanges: JSON.stringify(page.draftContent) !== JSON.stringify(page.publishedContent),
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { slug, key, value, updates } = await request.json();
    const pageSlug = slug || 'home';

    const db = readDatabase();
    if (!db.pages[pageSlug]) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    if (updates && typeof updates === 'object') {
      db.pages[pageSlug].draftContent = {
        ...db.pages[pageSlug].draftContent,
        ...updates,
      };
    } else if (key && value !== undefined) {
      db.pages[pageSlug].draftContent[key] = value;
    }

    db.pages[pageSlug].updatedAt = new Date().toISOString();
    writeDatabase(db);

    return NextResponse.json({
      success: true,
      draftContent: db.pages[pageSlug].draftContent,
      updatedAt: db.pages[pageSlug].updatedAt,
    });
  } catch (error) {
    console.error('Save content error:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
