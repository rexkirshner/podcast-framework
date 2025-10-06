/**
 * Restore episode-to-guest associations after re-import
 * Matches episodes by title and restores guest references
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';
import fs from 'fs';
import { randomKey } from '@sanity/util/content';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

async function restoreGuestAssociations() {
  console.log('📥 Loading guest associations backup...\n');

  // Load backup
  const backupPath = 'data/guest-associations-backup.json';
  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup file not found: ${backupPath}`);
  }

  const associations = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
  console.log(`✅ Loaded ${Object.keys(associations).length} episode associations\n`);

  // Fetch all episodes from Sanity
  console.log('📡 Fetching episodes from Sanity...');
  const episodes = await client.fetch(`*[_type == "episode"] { _id, title }`);
  console.log(`✅ Found ${episodes.length} episodes\n`);

  let restoredCount = 0;
  let notFoundCount = 0;

  for (const [title, guests] of Object.entries(associations)) {
    // Find episode by title
    const episode = episodes.find(e => e.title === title);

    if (!episode) {
      console.log(`⚠️  Episode not found: "${title}"`);
      notFoundCount++;
      continue;
    }

    // Create guest references with _key
    const guestRefs = guests.map(g => ({
      _type: 'reference',
      _ref: g._id,
      _key: randomKey(12),
    }));

    // Update episode
    await client
      .patch(episode._id)
      .set({ guests: guestRefs })
      .commit();

    console.log(`✅ Restored: "${title}"`);
    console.log(`   Guests: ${guests.map(g => g.name).join(', ')}`);
    restoredCount++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Restored: ${restoredCount}`);
  console.log(`   ⚠️  Not found: ${notFoundCount}`);
  console.log(`   📝 Total in backup: ${Object.keys(associations).length}`);
  console.log(`\n✅ Guest associations restored!`);
}

restoreGuestAssociations().catch(console.error);
