import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/cms/db';
import { getSessionUser } from '@/lib/cms/auth';
import { FormEmbedItem } from '@/lib/cms/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const formId = searchParams.get('id');
  const db = readDatabase();
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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const db = readDatabase();
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

  writeDatabase(db);
  return NextResponse.json({ success: true, forms: db.forms });
}
