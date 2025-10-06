/**
 * Check for missing Danno Ferrin episode
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function checkMissingEpisode() {
  const episodes = await client.fetch(`*[_type == "episode"] | order(episodeNumber asc) { episodeNumber, title }`);

  console.log('Total episodes in Sanity:', episodes.length);
  console.log('\nEpisodes 45-50:');
  episodes.filter(e => e.episodeNumber >= 45 && e.episodeNumber <= 50).forEach(e => {
    console.log(`  ${e.episodeNumber}: ${e.title}`);
  });

  // Search for Danno episode
  const danno = episodes.find(e => e.title.includes('Danno') || e.title.includes('EOF'));
  if (danno) {
    console.log('\n✅ Found Danno/EOF episode:', danno.episodeNumber, '-', danno.title);
  } else {
    console.log('\n❌ Danno/EOF episode NOT found in Sanity');
    console.log('   Expected title: "The EVM and EVM Object Format (EOF) w/ Danno Ferrin"');
  }

  // Check for episode number gaps
  console.log('\nChecking for gaps in episode numbering...');
  for (let i = 0; i < episodes.length - 1; i++) {
    const current = episodes[i].episodeNumber;
    const next = episodes[i + 1].episodeNumber;
    if (next - current > 1) {
      console.log(`  ⚠️  Gap found: Episode ${current} → Episode ${next} (missing ${next - current - 1} episode(s))`);
    }
  }
}

checkMissingEpisode().catch(console.error);
