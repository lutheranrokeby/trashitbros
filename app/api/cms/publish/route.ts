import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/cms/db';
import { getSessionUser } from '@/lib/cms/auth';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized. Only editors and admins can publish.' }, { status: 403 });
  }

  try {
    const { pageSlug } = await request.json();
    const slug = pageSlug || 'home';

    const db = readDatabase();
    const page = db.pages[slug];
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Save previous published version to revisions
    db.revisions.unshift({
      id: `rev-${Date.now()}`,
      pageSlug: slug,
      content: { ...page.publishedContent },
      timestamp: new Date().toISOString(),
      author: user.name || user.username,
    });

    // Limit revisions to last 20
    if (db.revisions.length > 20) {
      db.revisions = db.revisions.slice(0, 20);
    }

    // Copy draft to published
    page.publishedContent = { ...page.draftContent };
    page.publishedAt = new Date().toISOString();
    page.updatedAt = new Date().toISOString();

    writeDatabase(db);

    return NextResponse.json({
      success: true,
      publishedAt: page.publishedAt,
      content: page.publishedContent,
    });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json({ error: 'Failed to publish changes' }, { status: 500 });
  }
}
