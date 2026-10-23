// Pre-build script: Fetches latest content from Supabase and bakes it into data/cms.json before Next.js static build
import fs from 'fs';
import path from 'path';

function loadEnvFile(filename) {
  const filePath = path.join(process.cwd(), filename);
  if (fs.existsSync(filePath)) {
    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

// Load local env files if running outside Netlify CI
loadEnvFile('.env.local');
loadEnvFile('.env');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const CMS_ROW_ID = 'trashitbros_content';

async function syncContent() {
  console.log('⚡ [Build Step] Checking Supabase for Trash It Bros content...');

  const dataDir = path.join(process.cwd(), 'data');
  const cmsFilePath = path.join(dataDir, 'cms.json');

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_URL.startsWith('http')) {
    console.log('ℹ️ [Build Step] Supabase env variables not detected. Using local data/cms.json.');
    return;
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_content?id=eq.${CMS_ROW_ID}&select=data`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0 && rows[0].data) {
        console.log(`✅ [Build Step] Successfully fetched '${CMS_ROW_ID}' from Supabase!`);
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        const synced = rows[0].data;
        if (!synced.settings) synced.settings = {};
        if (!synced.settings.hiddenSections) {
          synced.settings.hiddenSections = {
            home_projects: true,
            nav_our_work: true,
          };
        }
        fs.writeFileSync(cmsFilePath, JSON.stringify(synced, null, 2), 'utf8');
        console.log('✅ [Build Step] Baked Supabase content into data/cms.json.');
        return;
      }
    }

    // If row doesn't exist yet, seed local cms.json to Supabase
    console.log(`ℹ️ [Build Step] Row '${CMS_ROW_ID}' not found in Supabase. Seeding from local data/cms.json...`);
    if (fs.existsSync(cmsFilePath)) {
      const localData = JSON.parse(fs.readFileSync(cmsFilePath, 'utf8'));
      const seedRes = await fetch(`${SUPABASE_URL}/rest/v1/site_content`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          id: CMS_ROW_ID,
          data: localData,
          updated_at: new Date().toISOString(),
        }),
      });

      if (seedRes.ok) {
        console.log(`🎉 [Build Step] Successfully seeded '${CMS_ROW_ID}' to Supabase!`);
      } else {
        console.warn('⚠️ [Build Step] Failed to seed to Supabase:', seedRes.status, await seedRes.text());
      }
    }
  } catch (err) {
    console.warn('⚠️ [Build Step] Error syncing with Supabase:', err);
    console.log('ℹ️ [Build Step] Continuing with local data/cms.json fallback.');
  }
}

syncContent();
