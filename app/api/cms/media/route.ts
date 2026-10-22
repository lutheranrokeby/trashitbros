import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { readDatabase, writeDatabaseAsync } from '@/lib/cms/db';
import { getSessionUser } from '@/lib/cms/auth';
import { uploadToSupabaseStorage } from '@/lib/cms/supabase';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export async function GET() {
  const db = readDatabase();
  return NextResponse.json(db.media);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role === 'viewer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const alt = (formData.get('alt') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP, and SVG images are allowed' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || '.jpg';
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${cleanBase}_${Date.now()}${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    // Save locally if directory is writable
    try {
      ensureUploadDir();
      fs.writeFileSync(filePath, buffer);
    } catch (fsErr) {
      console.warn('Local fs write skipped:', fsErr);
    }

    // Upload to Supabase Storage if configured
    let mediaUrl = `/uploads/${filename}`;
    const supabaseUrl = await uploadToSupabaseStorage(buffer, filename, file.type, 'trashitbros/media');
    if (supabaseUrl) {
      mediaUrl = supabaseUrl;
    }

    let width: number | undefined;
    let height: number | undefined;

    try {
      const metadata = await sharp(buffer).metadata();
      width = metadata.width;
      height = metadata.height;
    } catch {
      // SVG or unparsable format
    }

    const mediaEntry = {
      id: `m-${Date.now()}`,
      filename,
      url: mediaUrl,
      alt: alt || cleanBase,
      size: file.size,
      width,
      height,
      uploadedAt: new Date().toISOString(),
    };

    const db = readDatabase();
    db.media.unshift(mediaEntry);
    await writeDatabaseAsync(db);

    return NextResponse.json(mediaEntry, { status: 201 });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can delete media' }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const db = readDatabase();
  const item = db.media.find((m) => m.id === id);
  if (item) {
    const filePath = path.join(process.cwd(), 'public', item.url);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn('Could not delete physical file:', err);
      }
    }
    db.media = db.media.filter((m) => m.id !== id);
    await writeDatabaseAsync(db);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Media not found' }, { status: 404 });
}
