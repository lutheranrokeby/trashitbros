import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/cms/db';
import { getSessionUser } from '@/lib/cms/auth';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { pageSlug, revisionId } = await request.json();
    const slug = pageSlug || 'home';

    const db = readDatabase();
    const page = db.pages[slug];
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    if (revisionId) {
      const revision = db.revisions.find((r) => r.id === revisionId && r.pageSlug === slug);
      if (!revision) {
        return NextResponse.json({ error: 'Revision not found' }, { status: 404 });
      }
      page.draftContent = { ...revision.content };
    } else {
      // Discard current draft back to published
      page.draftContent = { ...page.publishedContent };
    }

    page.updatedAt = new Date().toISOString();
    writeDatabase(db);

    return NextResponse.json({
      success: true,
      draftContent: page.draftContent,
    });
  } catch (error) {
    console.error('Revert error:', error);
    return NextResponse.json({ error: 'Failed to revert changes' }, { status: 500 });
  }
}
