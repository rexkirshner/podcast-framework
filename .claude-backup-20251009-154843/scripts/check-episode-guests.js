/**
 * Check guests for a specific episode
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

async function checkEpisodeGuests(episodeNumber) {
  console.log(`📡 Fetching Episode ${episodeNumber}...\n`);

  const episode = await client.fetch(
    `*[_type == "episode" && episodeNumber == $episodeNumber][0] {
      _id,
      episodeNumber,
      title,
      "hosts": hosts[]->{ _id, name },
      "guests": guests[]->{ _id, name }
    }`,
    { episodeNumber }
  );

  if (!episode) {
    console.log(`❌ Episode ${episodeNumber} not found`);
    return;
  }

  console.log(`📺 Episode ${episode.episodeNumber}: "${episode.title}"`);
  console.log(`   ID: ${episode._id}\n`);

  console.log(`👤 Hosts (${episode.hosts?.length || 0}):`);
  if (episode.hosts && episode.hosts.length > 0) {
    episode.hosts.forEach((host) => {
      console.log(`   - ${host.name} (${host._id})`);
    });
  } else {
    console.log(`   (none)`);
  }

  console.log(`\n🎤 Guests (${episode.guests?.length || 0}):`);
  if (episode.guests && episode.guests.length > 0) {
    episode.guests.forEach((guest) => {
      console.log(`   - ${guest.name} (${guest._id})`);
    });
  } else {
    console.log(`   (none)`);
  }
}

async function main() {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error('Missing SANITY_API_TOKEN environment variable');
  }

  const episodeNumber = process.argv[2] ? parseInt(process.argv[2]) : 68;
  await checkEpisodeGuests(episodeNumber);
}

main();
