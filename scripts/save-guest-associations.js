/**
 * Save episode-to-guest associations before re-import
 * Maps by episode title (not number, since numbering is changing)
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';
import fs from 'fs';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

async function saveGuestAssociations() {
  console.log('📥 Fetching all episodes with guest associations...\n');

  const episodes = await client.fetch(`
    *[_type == "episode"] {
      episodeNumber,
      title,
      guests[]-> {
        _id,
        name
      }
    }
  `);

  // Create mapping: episode title → guest IDs
  const associations = {};
  let totalAssociations = 0;

  for (const episode of episodes) {
    if (episode.guests && episode.guests.length > 0) {
      associations[episode.title] = episode.guests.map(g => ({
        _id: g._id,
        name: g.name
      }));
      totalAssociations += episode.guests.length;
      console.log(`✅ Episode ${episode.episodeNumber}: "${episode.title}"`);
      console.log(`   Guests: ${episode.guests.map(g => g.name).join(', ')}`);
    }
  }

  // Save to file
  const outputPath = 'data/guest-associations-backup.json';
  fs.mkdirSync('data', { recursive: true });
  fs.writeFileSync(
    outputPath,
    JSON.stringify(associations, null, 2)
  );

  console.log(`\n📊 Summary:`);
  console.log(`   Episodes with guests: ${Object.keys(associations).length}`);
  console.log(`   Total guest associations: ${totalAssociations}`);
  console.log(`   Saved to: ${outputPath}`);
  console.log(`\n✅ Backup complete! Safe to delete and re-import episodes.`);
}

saveGuestAssociations().catch(console.error);
