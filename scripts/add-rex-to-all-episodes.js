/**
 * Add Rex Kirshner as host to all episodes
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

// Generate random key for Sanity array items
function randomKey(length = 12) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function addRexToAllEpisodes() {
  console.log('📡 Fetching all episodes...\n');

  const episodes = await client.fetch(`*[_type == "episode"] { _id, episodeNumber, title }`);
  console.log(`✅ Found ${episodes.length} episodes\n`);

  const REX_HOST_ID = 'host-rex-kirshner';

  console.log('➕ Adding Rex as host to all episodes...\n');

  let updatedCount = 0;

  for (const episode of episodes) {
    try {
      // Create host reference with _key
      const hostRef = {
        _type: 'reference',
        _ref: REX_HOST_ID,
        _key: randomKey(12),
      };

      await client.patch(episode._id).set({ hosts: [hostRef] }).commit();

      console.log(`✅ Updated Episode ${episode.episodeNumber}: "${episode.title}"`);
      updatedCount++;
    } catch (error) {
      console.error(`❌ Failed to update ${episode._id}: ${error.message}`);
    }
  }

  console.log(`\n📊 Update Summary:`);
  console.log(`   ✅ Updated: ${updatedCount}`);
  console.log(`   📝 Total: ${episodes.length}`);
}

async function main() {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error('Missing SANITY_API_TOKEN environment variable');
  }

  await addRexToAllEpisodes();
  console.log('\n✅ Host update complete!');
}

main();
