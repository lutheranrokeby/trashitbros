import { DatabaseSchema } from './types';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const NETLIFY_BUILD_HOOK_URL = process.env.NETLIFY_BUILD_HOOK_URL || '';
const CMS_ROW_ID = 'trashitbros_content';

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http'));
}

/**
 * Fetch database schema JSON from Supabase site_content table
 */
export async function fetchContentFromSupabase(): Promise<DatabaseSchema | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_content?id=eq.${CMS_ROW_ID}&select=data`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0 && rows[0].data) {
        return rows[0].data as DatabaseSchema;
      }
    } else {
      console.warn('⚠️ [Supabase] Fetch error:', res.status, await res.text());
    }
  } catch (err) {
    console.warn('⚠️ [Supabase] Network error fetching content:', err);
  }

  return null;
}

/**
 * Save / Upsert database schema JSON to Supabase site_content table
 */
export async function saveContentToSupabase(contentData: DatabaseSchema): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_content`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        id: CMS_ROW_ID,
        data: contentData,
        updated_at: new Date().toISOString(),
      }),
    });

    if (res.ok) {
      console.log(`✅ [Supabase] Successfully saved '${CMS_ROW_ID}' to site_content table`);
      return true;
    } else {
      const errText = await res.text();
      console.error('❌ [Supabase] Save error:', res.status, errText);
      return false;
    }
  } catch (err) {
    console.error('❌ [Supabase] Network error saving to Supabase:', err);
    return false;
  }
}

/**
 * Trigger Netlify Build Hook to re-generate static pages
 */
export async function triggerNetlifyBuild(): Promise<boolean> {
  if (!NETLIFY_BUILD_HOOK_URL || !NETLIFY_BUILD_HOOK_URL.startsWith('http')) {
    return false;
  }

  try {
    const res = await fetch(NETLIFY_BUILD_HOOK_URL, { method: 'POST' });
    if (res.ok) {
      console.log('🎉 [Netlify] Build hook triggered successfully!');
      return true;
    } else {
      console.warn('⚠️ [Netlify] Build hook returned status:', res.status);
      return false;
    }
  } catch (err) {
    console.warn('⚠️ [Netlify] Failed to trigger build hook:', err);
    return false;
  }
}

/**
 * Upload a media file or quote photo to Supabase Storage bucket 'uploads'
 */
export async function uploadToSupabaseStorage(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  folder: string = 'trashitbros'
): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${folder}/${Date.now()}_${cleanFilename}`;

    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/uploads/${storagePath}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': mimeType,
      },
      body: new Uint8Array(buffer),
    });

    if (res.ok) {
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/uploads/${storagePath}`;
      console.log(`✅ [Supabase Storage] File uploaded: ${publicUrl}`);
      return publicUrl;
    } else {
      console.warn('⚠️ [Supabase Storage] Upload failed:', res.status, await res.text());
      return null;
    }
  } catch (err) {
    console.warn('⚠️ [Supabase Storage] Error uploading file:', err);
    return null;
  }
}
