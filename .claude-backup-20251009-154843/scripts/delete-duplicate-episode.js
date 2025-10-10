/**
 * Delete Duplicate Episode 1
 *
 * Removes the manually-entered Episode 1 (with wrong date 2025)
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'ej6443ov',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

async function deleteDuplicate() {
  console.log('🔍 Finding duplicate Episode 1...\n');

  // Find all episodes with episodeNumber 1
  const query = `*[_type == "episode" && episodeNumber == 1] {
    _id,
    title,
    publishDate,
    duration,
    "hasImage": defined(coverImage)
  }`;

  const episodes = await client.fetch(query);

  console.log(`Found ${episodes.length} Episode 1 entries:\n`);
  episodes.forEach((ep, i) => {
    console.log(`${i + 1}. ID: ${ep._id}`);
    console.log(`   Title: ${ep.title}`);
    console.log(`   Date: ${ep.publishDate}`);
    console.log(`   Duration: ${ep.duration || 'none'}`);
    console.log(`   Has image: ${ep.hasImage}`);
    console.log('');
  });

  // Find the manually-entered one (date in 2025)
  const duplicateToDelete = episodes.find(ep => ep.publishDate && ep.publishDate.startsWith('2025'));

  if (!duplicateToDelete) {
    console.log('❌ Could not find the duplicate with 2025 date');
    process.exit(1);
  }

  console.log(`\n🎯 Will delete:`);
  console.log(`   ID: ${duplicateToDelete._id}`);
  console.log(`   Title: ${duplicateToDelete.title}`);
  console.log(`   Date: ${duplicateToDelete.publishDate} (wrong year!)`);

  // Delete it
  await client.delete(duplicateToDelete._id);

  console.log('\n✅ Deleted duplicate Episode 1');
  console.log('\n📝 Remaining Episode 1 entries:');

  const remaining = await client.fetch(query);
  remaining.forEach((ep, i) => {
    console.log(`${i + 1}. ${ep.title} (${ep.publishDate})`);
  });
}

deleteDuplicate().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
