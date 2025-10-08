/**
 * Import Audio URLs from RSS Feed
 *
 * Extracts direct MP3 URLs from RSS feed and adds them to Sanity episodes
 * Required for transcript generation with Whisper API
 *
 * Usage: node scripts/import-audio-urls.js
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';
import xml2js from 'xml2js';

const RSS_FEED_URL = 'https://anchor.fm/s/dcf17d04/podcast/rss';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

if (!process.env.SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
  console.error('❌ Missing Sanity credentials in .env');
  process.exit(1);
}

/**
 * Fetch and parse RSS feed
 */
async function fetchRSSFeed() {
  console.log(`📡 Fetching RSS feed from ${RSS_FEED_URL}...`);

  const response = await fetch(RSS_FEED_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
  }

  const xmlData = await response.text();
  const parser = new xml2js.Parser({ explicitArray: true });
  const result = await parser.parseStringPromise(xmlData);

  return result.rss.channel[0].item || [];
}

/**
 * Extract episode number from title
 */
function extractEpisodeNumber(item, index, totalEpisodes) {
  const title = item.title[0];

  // Check if trailer
  if (title.toLowerCase().includes('trailer')) {
    return 0;
  }

  // Try iTunes episode tag
  if (item['itunes:episode'] && item['itunes:episode'][0]) {
    return parseInt(item['itunes:episode'][0], 10);
  }

  // Try parsing from title
  const match = title.match(/episode\s+(\d+)/i);
  if (match) {
    return parseInt(match[1], 10);
  }

  // Fallback: reverse chronological
  return totalEpisodes - 1 - index;
}

/**
 * Extract audio URL from enclosure tag
 */
function extractAudioURL(item) {
  if (!item.enclosure || !item.enclosure[0] || !item.enclosure[0].$) {
    return null;
  }

  return item.enclosure[0].$.url;
}

/**
 * Find episode by episode number
 */
async function findEpisodeByNumber(episodeNumber) {
  const query = `*[_type == "episode" && episodeNumber == $episodeNumber][0]`;
  return await client.fetch(query, { episodeNumber: parseInt(episodeNumber, 10) });
}

/**
 * Update episode with audio URL
 */
async function updateEpisodeAudioURL(episodeId, audioUrl) {
  await client
    .patch(episodeId)
    .set({ audioUrl })
    .commit();
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🚀 Importing Audio URLs from RSS Feed\n');

    // Fetch RSS feed
    const items = await fetchRSSFeed();
    console.log(`✅ Found ${items.length} episodes in RSS feed\n`);

    console.log('📊 Processing episodes...\n');

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const episodeNumber = extractEpisodeNumber(item, i, items.length);
      const title = item.title[0];
      const audioUrl = extractAudioURL(item);

      if (!audioUrl) {
        console.log(`⚠️  Episode ${episodeNumber}: No audio URL in RSS feed`);
        errors.push({ episode: episodeNumber, error: 'No audio URL' });
        errorCount++;
        continue;
      }

      // Find episode in Sanity
      const episode = await findEpisodeByNumber(episodeNumber);

      if (!episode) {
        console.log(`⚠️  Episode ${episodeNumber}: Not found in Sanity`);
        errors.push({ episode: episodeNumber, error: 'Episode not found' });
        errorCount++;
        continue;
      }

      // Skip if already has audio URL
      if (episode.audioUrl) {
        console.log(`⏭️  Episode ${episodeNumber}: Already has audio URL, skipping`);
        skippedCount++;
        continue;
      }

      // Update episode
      try {
        await updateEpisodeAudioURL(episode._id, audioUrl);
        console.log(`✅ Episode ${episodeNumber}: ${title.substring(0, 50)}...`);
        updatedCount++;
      } catch (error) {
        console.error(`❌ Episode ${episodeNumber}: Update failed - ${error.message}`);
        errors.push({ episode: episodeNumber, error: error.message });
        errorCount++;
      }
    }

    console.log(`\n📊 Import Summary:`);
    console.log(`   ✅ Updated: ${updatedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📝 Total: ${items.length}`);

    if (errors.length > 0) {
      console.log('\n⚠️  Errors:');
      errors.forEach(({ episode, error }) => {
        console.log(`   Episode ${episode}: ${error}`);
      });
    }

    console.log('\n✅ Audio URLs imported!');
    console.log('\n📝 Next steps:');
    console.log('   1. Verify audio URLs in Sanity Studio');
    console.log('   2. Get OpenAI API key from https://platform.openai.com/api-keys');
    console.log('   3. Add to .env: OPENAI_API_KEY=sk-...');
    console.log('   4. Run: node scripts/generate-transcripts.js --all');

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
