import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readDatabase, writeDatabase } from '@/lib/cms/db';
import { sendQuoteNotifications } from '@/lib/cms/email';

const QUOTES_DIR = path.join(process.cwd(), 'public', 'uploads', 'quotes');
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILE_COUNT = 10;

function ensureQuotesDir() {
  if (!fs.existsSync(QUOTES_DIR)) {
    fs.mkdirSync(QUOTES_DIR, { recursive: true });
  }
}

function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  // Standard RFC-compliant practical regex
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(trimmed);
}

function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const trimmed = phone.trim();
  // Strip common punctuation: spaces, dashes, parentheses, dots
  const clean = trimmed.replace(/[\s\-\(\)\.]/g, '');
  // Must consist of optional leading + and digits only
  if (!/^\+?[0-9]{8,15}$/.test(clean)) return false;
  // Australian mobile: 04XXXXXXXX (10 digits) or +614XXXXXXXX (11 digits)
  // Australian landline: 02/03/07/08XXXXXXXX (10 digits) or +612/3/7/8XXXXXXXX
  // 1300/1800/13 numbers
  const digitsOnly = clean.replace(/^\+/, '');
  return digitsOnly.length >= 8 && digitsOnly.length <= 15;
}

export async function POST(request: Request) {
  try {
    ensureQuotesDir();
    const formData = await request.formData();

    // Anti-spam honeypot
    const honeypot = (formData.get('website') as string) || (formData.get('botField') as string) || '';
    if (honeypot.trim().length > 0) {
      return NextResponse.json({ error: 'Spam detected.' }, { status: 400 });
    }

    const fullName = ((formData.get('fullName') as string) || '').trim();
    const email = ((formData.get('email') as string) || '').trim();
    const phone = ((formData.get('phone') as string) || '').trim();
    const noPhotosRaw = formData.get('noPhotos');
    const noPhotos = noPhotosRaw === 'true' || noPhotosRaw === '1' || noPhotosRaw === true;

    // 1. Validate Full Name
    if (!fullName) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }

    // 2. Validate Contact Methods
    const hasEmail = email.length > 0;
    const hasPhone = phone.length > 0;

    if (!hasEmail && !hasPhone) {
      return NextResponse.json(
        { error: 'Please enter an email address or phone number so we can contact you.' },
        { status: 400 }
      );
    }

    // If an email was provided, it must be valid
    if (hasEmail && !isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // If a phone was provided, it must be valid
    if (hasPhone && !isValidPhone(phone)) {
      return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
    }

    // 3. Process Uploaded Photos
    const photos: string[] = [];
    const rawFiles = formData.getAll('photos') as File[];
    // Filter valid File instances
    const files = rawFiles.filter(
      (f) => f && typeof f.size === 'number' && f.size > 0 && typeof f.name === 'string' && f.name !== 'undefined'
    );

    if (files.length > MAX_FILE_COUNT) {
      return NextResponse.json(
        { error: `You can upload a maximum of ${MAX_FILE_COUNT} photos.` },
        { status: 400 }
      );
    }

    for (const file of files) {
      const ext = path.extname(file.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext) || (file.type && !ALLOWED_MIME_TYPES.includes(file.type.toLowerCase()))) {
        return NextResponse.json(
          { error: `Invalid file format for "${file.name}". Please upload JPG, PNG, or WebP images.` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the 10MB limit.` },
          { status: 400 }
        );
      }

      const safeFilename = `quote_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
      const filePath = path.join(QUOTES_DIR, safeFilename);
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      photos.push(`/uploads/quotes/${safeFilename}`);
    }

    // 4. Validate Photos vs No-Photos Checkbox
    if (photos.length === 0 && !noPhotos) {
      return NextResponse.json(
        { error: "Please upload at least one photo or tick the box if you don't have photos available." },
        { status: 400 }
      );
    }

    // Generate unique reference code e.g. TIB-20261022-7482
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    const reference = `TIB-${today}-${rand}`;

    // Optional legacy fields if passed, otherwise clean defaults
    const customerType = (formData.get('customerType') as string) || 'Residential';
    const service = (formData.get('service') as string) || 'Rubbish Removal';
    const siteAddress = (formData.get('siteAddress') as string) || '';
    const wasteType = (formData.get('wasteType') as string) || '';

    const newEnquiry = {
      id: `enq-${Date.now()}`,
      reference,
      fullName,
      email,
      phone,
      photos,
      noPhotos,
      customerType,
      service,
      siteAddress,
      wasteType,
      status: 'New' as const,
      internalNotes: '',
      notificationSent: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to CMS Database
    const db = readDatabase();
    db.enquiries.unshift(newEnquiry);
    writeDatabase(db);

    // Send email notifications asynchronously (retain saved enquiry even if dispatch has errors)
    try {
      const notifResult = await sendQuoteNotifications(newEnquiry);
      if (notifResult.businessNotified) {
        newEnquiry.notificationSent = true;
        // update in db
        const updatedDb = readDatabase();
        const idx = updatedDb.enquiries.findIndex((e) => e.id === newEnquiry.id);
        if (idx !== -1) {
          updatedDb.enquiries[idx].notificationSent = true;
          writeDatabase(updatedDb);
        }
      }
    } catch (notifErr) {
      console.error('Failed to complete notification dispatch:', notifErr);
    }

    return NextResponse.json({
      success: true,
      reference: newEnquiry.reference,
      message:
        "Your enquiry has been sent to Trash It Bros. We'll review your details and get in touch using the contact information you provided.",
    });
  } catch (error) {
    console.error('Quote submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request. Please try again.' },
      { status: 500 }
    );
  }
}
