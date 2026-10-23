import { NextResponse } from 'next/server';
import { readDatabaseAsync, writeDatabaseAsync } from '@/lib/cms/db';
import { getSessionUser } from '@/lib/cms/auth';
import { FormEmbedItem } from '@/lib/cms/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const formId = searchParams.get('id');
  const db = await readDatabaseAsync();
  const forms = db.forms || [];

  if (formId) {
    const found = forms.find((f) => f.id === formId);
    if (!found) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }
    return NextResponse.json(found);
  }

  return NextResponse.json(forms);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized. Only editors and admins can save forms.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const db = await readDatabaseAsync();
    if (!db.forms) db.forms = [];

    if (Array.isArray(body)) {
      db.forms = body;
    } else if (body.forms && Array.isArray(body.forms)) {
      db.forms = body.forms;
    } else if (body.id) {
      const index = db.forms.findIndex((f) => f.id === body.id);
      const updatedForm: FormEmbedItem = {
        id: body.id,
        name: body.name || (index !== -1 ? db.forms[index].name : 'Form'),
        description: body.description ?? (index !== -1 ? db.forms[index].description : ''),
        pageUrl: body.pageUrl ?? (index !== -1 ? db.forms[index].pageUrl : ''),
        embedCode: typeof body.embedCode === 'string' ? body.embedCode : '',
        updatedAt: new Date().toISOString(),
      };

      if (index !== -1) {
        db.forms[index] = updatedForm;
      } else {
        db.forms.push(updatedForm);
      }
    }

    // Persist draft to Supabase JSON and local file (no Netlify build trigger until user clicks Publish)
    const saved = await writeDatabaseAsync(db);

    return NextResponse.json({ success: true, forms: db.forms, savedToSupabase: saved });
  } catch (error) {
    console.error('Save forms draft error:', error);
    return NextResponse.json({ error: 'Failed to save forms draft' }, { status: 500 });
  }
}
