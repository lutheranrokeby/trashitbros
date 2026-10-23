import { NextResponse } from 'next/server';
import { readDatabaseAsync, writeDatabaseAsync } from '@/lib/cms/db';
import { getSessionUser } from '@/lib/cms/auth';
import { triggerNetlifyBuild } from '@/lib/cms/supabase';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized. Only editors and admins can publish.' }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { pageSlug, publishAll, type } = body;
    const db = await readDatabaseAsync();

    if (publishAll || type === 'forms' || type === 'all') {
      // Save all latest content and trigger Netlify static site rebuild
      await writeDatabaseAsync(db);
      const hookTriggered = await triggerNetlifyBuild();

      return NextResponse.json({
        success: true,
        publishedAt: new Date().toISOString(),
        netlifyBuildTriggered: hookTriggered,
        message: hookTriggered
          ? 'Netlify build triggered successfully. Static pages are being rebuilt and deployed!'
          : 'Changes saved to Supabase! Netlify build hook not configured or triggered.',
      });
    }

    const slug = pageSlug || 'home';
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

    // Persist to local & Supabase
    await writeDatabaseAsync(db);

    // Trigger Netlify build webhook to deploy updated static pages
    const hookTriggered = await triggerNetlifyBuild();

    return NextResponse.json({
      success: true,
      publishedAt: page.publishedAt,
      content: page.publishedContent,
      netlifyBuildTriggered: hookTriggered,
    });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json({ error: 'Failed to publish changes' }, { status: 500 });
  }
}
