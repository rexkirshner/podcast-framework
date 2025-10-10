/**
 * Fix Missing _key in Guests Arrays
 *
 * Adds _key property to all guest references in episodes
 * Sanity requires _key for array items
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';
import { randomKey } from '@sanity/util/content';

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

async function fixGuestsKeys() {
  console.log('🔍 Finding episodes with guests...\n');

  // Find all episodes with guests
  const episodes = await client.fetch(`
    *[_type == "episode" && defined(guests) && count(guests) > 0] {
      _id,
      episodeNumber,
      title,
      guests
    }
  `);

  console.log(`📊 Found ${episodes.length} episodes with guests\n`);

  if (episodes.length === 0) {
    console.log('✅ No episodes need fixing!');
    return;
  }

  let fixedCount = 0;
  let alreadyOkCount = 0;

  for (const episode of episodes) {
    const needsFix = episode.guests.some(guest => !guest._key);

    if (!needsFix) {
      console.log(`✓ Episode ${episode.episodeNumber}: Already has keys`);
      alreadyOkCount++;
      continue;
    }

    // Add _key to each guest reference
    const fixedGuests = episode.guests.map(guest => {
      if (guest._key) {
        return guest; // Already has key
      }
      return {
        ...guest,
        _key: randomKey(12), // Generate unique key
      };
    });

    // Update episode
    await client
      .patch(episode._id)
      .set({ guests: fixedGuests })
      .commit();

    console.log(`✅ Fixed Episode ${episode.episodeNumber}: ${episode.title}`);
    fixedCount++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Fixed: ${fixedCount}`);
  console.log(`   ✓ Already OK: ${alreadyOkCount}`);
  console.log(`   📝 Total: ${episodes.length}`);
}

async function main() {
  try {
    console.log('🚀 Fixing Missing _key in Guests Arrays\n');

    // Check for API token
    if (!process.env.SANITY_API_TOKEN) {
      throw new Error(
        'Missing SANITY_API_TOKEN environment variable.\n' +
        'Create a token at https://sanity.io/manage and add to .env file'
      );
    }

    await fixGuestsKeys();

    console.log('\n✅ Fix complete!');

  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    process.exit(1);
  }
}

main();
