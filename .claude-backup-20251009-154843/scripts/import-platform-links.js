/**
 * Import Platform Links from CSV
 *
 * Imports Spotify, YouTube, and Apple Podcast links from CSV export
 * Matches episodes by title
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

const CSV_PATH = '/Users/rexkirshner/Desktop/vibe-coding-assets/strange water/platform-links/Strange Water Export.csv';

/**
 * Parse CSV manually (simple implementation)
 */
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',');

  const data = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    // Parse CSV line respecting commas inside quoted fields
    const values = [];
    let currentValue = '';
    let inQuotes = false;

    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue); // Add last value

    if (values.length >= 4) {
      data.push({
        number: values[0],
        title: values[1],
        localUrl: values[2],
        spotifyLink: values[3],
        youtubeLink: values[4],
        applePodcastLink: values[5],
      });
    }
  }

  return data;
}

async function importPlatformLinks() {
  console.log('🚀 Starting Platform Links Import\n');

  // Check for API token
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error('Missing SANITY_API_TOKEN environment variable');
  }

  // Read CSV
  console.log(`📂 Reading CSV from ${CSV_PATH}...`);
  const csvText = fs.readFileSync(CSV_PATH, 'utf-8');
  const csvData = parseCSV(csvText);
  console.log(`✅ Found ${csvData.length} rows in CSV\n`);

  // Fetch all episodes from Sanity
  console.log('📡 Fetching episodes from Sanity...');
  const episodes = await client.fetch(`*[_type == "episode"] { _id, title, episodeNumber }`);
  console.log(`✅ Found ${episodes.length} episodes in Sanity\n`);

  // Create title map for matching
  const episodeMap = {};
  for (const episode of episodes) {
    episodeMap[episode.title] = episode;
  }

  let updatedCount = 0;
  let notFoundCount = 0;
  let skippedCount = 0;

  for (const row of csvData) {
    // Skip empty title rows
    if (!row.title || row.title === 'TBD') {
      skippedCount++;
      continue;
    }

    // Find episode by exact title match
    const episode = episodeMap[row.title];

    if (!episode) {
      console.log(`⚠️  Episode not found: "${row.title}"`);
      notFoundCount++;
      continue;
    }

    // Update episode with platform links
    await client
      .patch(episode._id)
      .set({
        spotifyLink: row.spotifyLink || null,
        youtubeLink: row.youtubeLink || null,
        applePodcastLink: row.applePodcastLink || null,
      })
      .commit();

    console.log(`✅ Updated Episode ${episode.episodeNumber}: "${episode.title}"`);
    updatedCount++;
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Updated: ${updatedCount}`);
  console.log(`   ⚠️  Not found: ${notFoundCount}`);
  console.log(`   ⏭️  Skipped: ${skippedCount}`);
  console.log(`   📝 Total in CSV: ${csvData.length}`);
}

async function main() {
  try {
    await importPlatformLinks();
    console.log('\n✅ Platform links import complete!');
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

main();
