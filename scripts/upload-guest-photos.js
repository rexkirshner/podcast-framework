/**
 * Upload Guest Photos to Sanity
 *
 * Uploads guest profile pictures and links them to guest records
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

if (!process.env.SANITY_PROJECT_ID) {
  throw new Error('Missing SANITY_PROJECT_ID environment variable');
}

// Path to guest photos
const PHOTOS_DIR = '/Users/rexkirshner/Desktop/vibe-coding-assets/strange water/guest pics';

/**
 * Normalize name for matching
 * Converts "Chris Chauvin" -> "chris-chauvin"
 */
function normalizeName(name) {
  return name.toLowerCase()
    .replace(/[()]/g, '') // Remove parentheses
    .replace(/\s+/g, '-')  // Spaces to hyphens
    .replace(/[^a-z0-9-]/g, ''); // Remove special chars
}

/**
 * Parse filename to extract guest name
 * "1-chris-chauvin.png" -> "chris-chauvin"
 */
function parseFilename(filename) {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.(png|jpg|jpeg)$/i, '');
  // Remove episode number prefix (e.g., "1-")
  const nameOnly = nameWithoutExt.replace(/^\d+-/, '');
  return nameOnly;
}

async function uploadGuestPhotos() {
  console.log('🚀 Starting Guest Photo Upload\n');

  // Check for API token
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error(
      'Missing SANITY_API_TOKEN environment variable.\n' +
      'Create a token at https://sanity.io/manage and add to .env file'
    );
  }

  // Get all guests from Sanity
  console.log('📡 Fetching guests from Sanity...');
  const guests = await client.fetch(`*[_type == "guest"] { _id, name }`);
  console.log(`✅ Found ${guests.length} guests in Sanity\n`);

  // Create a map of normalized names to guest IDs
  const guestMap = {};
  for (const guest of guests) {
    const normalized = normalizeName(guest.name);
    guestMap[normalized] = guest;
  }

  // Read all photo files
  const files = fs.readdirSync(PHOTOS_DIR)
    .filter(f => /\.(png|jpg|jpeg)$/i.test(f));

  console.log(`📸 Found ${files.length} photo files\n`);

  let uploadedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const filename of files) {
    const guestNameFromFile = parseFilename(filename);
    const normalizedName = normalizeName(guestNameFromFile);

    // Find matching guest
    const guest = guestMap[normalizedName];

    if (!guest) {
      console.log(`⚠️  Skipped: ${filename} (no matching guest for "${guestNameFromFile}")`);
      skippedCount++;
      continue;
    }

    try {
      // Read file
      const filePath = path.join(PHOTOS_DIR, filename);
      const imageBuffer = fs.readFileSync(filePath);

      // Upload to Sanity
      console.log(`⬆️  Uploading: ${filename} → ${guest.name}...`);

      const asset = await client.assets.upload('image', imageBuffer, {
        filename: filename,
      });

      // Update guest with photo reference
      await client
        .patch(guest._id)
        .set({
          photo: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          },
        })
        .commit();

      console.log(`✅ Uploaded: ${guest.name}`);
      uploadedCount++;

    } catch (error) {
      console.error(`❌ Failed to upload ${filename}: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Upload Summary:`);
  console.log(`   ✅ Uploaded: ${uploadedCount}`);
  console.log(`   ⚠️  Skipped: ${skippedCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📝 Total: ${files.length}`);
}

async function main() {
  try {
    await uploadGuestPhotos();
    console.log('\n✅ Upload complete!');
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    process.exit(1);
  }
}

main();
