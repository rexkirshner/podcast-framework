/**
 * RSS Feed Importer for Podcast Episodes
 *
 * Fetches episode data from RSS feed and imports to Sanity CMS
 *
 * Usage: node --loader dotenv/config scripts/import-from-rss.js
 * or: npm run import:rss
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';
import xml2js from 'xml2js';

// Sanity client configuration
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false, // We need write access
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // Requires write token
});

// Validation
if (!process.env.SANITY_PROJECT_ID) {
  throw new Error('Missing SANITY_PROJECT_ID environment variable. Copy .env.example to .env and configure.');
}

// RSS feed URL
const RSS_FEED_URL = 'https://anchor.fm/s/dcf17d04/podcast/rss';

/**
 * Generate URL-safe slug from title
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Extract episode number from title or iTunes tag
 */
function extractEpisodeNumber(item, index, totalEpisodes) {
  const title = item.title[0];

  // Check if this is a trailer episode - assign episode 0
  if (title.toLowerCase().includes('trailer')) {
    return 0;
  }

  // Try iTunes episode tag first
  if (item['itunes:episode'] && item['itunes:episode'][0]) {
    return parseInt(item['itunes:episode'][0], 10);
  }

  // Try parsing from title (e.g., "Episode 44: Title")
  const match = title.match(/episode\s+(\d+)/i);
  if (match) {
    return parseInt(match[1], 10);
  }

  // Fallback: reverse chronological numbering
  // (newest episodes first in feed, so reverse the index)
  // Subtract 1 if there's a trailer (episode 0) to account for it
  return totalEpisodes - index;
}

/**
 * Convert iTunes duration to HH:MM:SS or MM:SS format
 * Handles both seconds (integer) and HH:MM:SS string formats
 */
function formatDuration(itunesDuration) {
  if (!itunesDuration || !itunesDuration[0]) return null;

  const durationStr = itunesDuration[0].trim();

  // Check if already in HH:MM:SS or MM:SS format
  if (durationStr.includes(':')) {
    // Already formatted, return as-is (may be HH:MM:SS or MM:SS)
    return durationStr;
  }

  // Otherwise, treat as seconds and convert
  const seconds = parseInt(durationStr, 10);
  if (isNaN(seconds)) return null;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

/**
 * Parse guest names from description
 * Looks for patterns like "w/ Name" or "with Name"
 */
function parseGuestFromDescription(description) {
  if (!description) return null;

  // Match patterns like "w/ Norton Wang" or "with Norton Wang"
  const patterns = [
    /w\/\s+([^(]+?)(?:\s*\(|$)/i,  // "w/ Name (Company)" or "w/ Name"
    /with\s+([^(]+?)(?:\s*\(|$)/i, // "with Name (Company)" or "with Name"
  ];

  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}

/**
 * Extract Spotify episode ID from link
 * Link format: https://podcasters.spotify.com/pod/show/strangeh2opod/episodes/The-Epilogue-e2kjbbk
 * Episode ID is the part after the last hyphen: e2kjbbk
 */
function extractSpotifyEpisodeId(link) {
  if (!link || !link[0]) return null;

  const url = link[0];

  // Match the episode ID pattern at the end of the URL
  // Format: /episodes/Title-eXXXXXX
  const match = url.match(/-([a-z0-9]+)$/i);

  if (match && match[1]) {
    return match[1];
  }

  return null;
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
 * Transform RSS item to Sanity episode document
 */
function transformToEpisode(item, index, totalEpisodes) {
  const title = item.title[0];
  const description = item.description ? item.description[0] : '';
  const pubDate = item.pubDate ? new Date(item.pubDate[0]).toISOString().split('T')[0] : null;
  const duration = formatDuration(item['itunes:duration']);
  const episodeNumber = extractEpisodeNumber(item, index, totalEpisodes);

  // Use sw[number] format for clean, short slugs
  const slug = `sw${episodeNumber}`;

  // Get cover image (use episode-specific or fallback to channel image)
  let coverImageUrl = null;
  if (item['itunes:image'] && item['itunes:image'][0] && item['itunes:image'][0].$) {
    coverImageUrl = item['itunes:image'][0].$.href;
  }

  // Parse potential guest name
  const guestName = parseGuestFromDescription(description);

  // Extract Spotify episode ID from link
  const spotifyEpisodeId = extractSpotifyEpisodeId(item.link);

  return {
    _type: 'episode',
    _id: `episode-sw${episodeNumber}`, // Deterministic ID based on episode number
    title,
    slug: {
      _type: 'slug',
      current: slug,
    },
    episodeNumber,
    publishDate: pubDate,
    duration,
    description,
    spotifyEpisodeId, // Extracted from RSS link!
    // coverImage: Would need to upload image file, not just store URL
    // For now, we'll add a note about the image URL
    _imageUrl: coverImageUrl, // Temporary field for reference
    _guestName: guestName, // Temporary field for reference
  };
}

/**
 * Import episodes to Sanity
 */
async function importEpisodes(episodes) {
  console.log(`\n📥 Importing ${episodes.length} episodes to Sanity...\n`);

  let successCount = 0;
  let errorCount = 0;
  let updatedCount = 0;

  for (const episode of episodes) {
    try {
      // Use createOrReplace to update existing episodes
      const result = await client.createOrReplace(episode);
      const action = result._rev === 'initial' ? '➕' : '🔄';
      if (result._rev !== 'initial') updatedCount++;
      console.log(`${action} Episode ${episode.episodeNumber}: ${episode.title}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to import episode ${episode.episodeNumber}: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   🔄 Updated: ${updatedCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📝 Total: ${episodes.length}`);

  return { successCount, errorCount };
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🚀 Starting RSS Feed Import\n');

    // Check for API token
    if (!process.env.SANITY_API_TOKEN) {
      throw new Error(
        'Missing SANITY_API_TOKEN environment variable.\n' +
        'Create a token at https://sanity.io/manage and add to .env file'
      );
    }

    // Fetch RSS feed
    const items = await fetchRSSFeed();
    console.log(`✅ Found ${items.length} episodes in RSS feed\n`);

    // Transform items to Sanity documents
    const episodes = items.map((item, index) =>
      transformToEpisode(item, index, items.length)
    );

    // Display preview
    console.log('📋 Preview of first episode:');
    console.log(JSON.stringify(episodes[0], null, 2));
    console.log('');

    // Import to Sanity
    const result = await importEpisodes(episodes);

    console.log('\n✅ Import complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Check Sanity Studio to verify episodes');
    console.log('   2. Add guest profiles manually (guest names noted in _guestName field)');
    console.log('   3. Upload cover images (URLs noted in _imageUrl field)');
    console.log('   4. Add Spotify episode IDs if needed');
    console.log('   5. Clean up temporary fields (_imageUrl, _guestName)');

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Run import
main();
