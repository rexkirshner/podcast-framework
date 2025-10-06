/**
 * Check for episodes with missing platform links
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

async function checkMissingPlatformLinks() {
  const episodes = await client.fetch(`
    *[_type == "episode"] | order(episodeNumber asc) {
      episodeNumber,
      title,
      spotifyLink,
      youtubeLink,
      applePodcastLink
    }
  `);

  const missing = episodes.filter(ep => !ep.spotifyLink || !ep.youtubeLink || !ep.applePodcastLink);

  console.log(`\nEpisodes with missing platform links (${missing.length}):\n`);

  missing.forEach(ep => {
    const links = [];
    if (ep.spotifyLink) links.push('Spotify');
    if (ep.youtubeLink) links.push('YouTube');
    if (ep.applePodcastLink) links.push('Apple');
    const hasLinks = links.length > 0 ? `Has: ${links.join(', ')}` : 'No links';
    console.log(`Episode ${ep.episodeNumber}: ${ep.title}`);
    console.log(`  ${hasLinks}\n`);
  });
}

checkMissingPlatformLinks().catch(err => console.error('Error:', err.message));
