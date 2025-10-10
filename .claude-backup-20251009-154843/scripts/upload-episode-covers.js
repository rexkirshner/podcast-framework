/**
 * Upload Episode Cover Images to Sanity
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';
import { readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

// Path to episode covers
const COVERS_DIR = '/Users/rexkirshner/Desktop/vibe-coding-assets/strange water/episode covers';

async function uploadEpisodeCovers() {
  console.log('📁 Reading episode cover files...\n');

  // Read all files in the covers directory
  const files = await readdir(COVERS_DIR);
  const coverFiles = files
    .filter((f) => f.startsWith('episode cover ') && f.endsWith('.png'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0]);
      const numB = parseInt(b.match(/\d+/)[0]);
      return numA - numB;
    });

  console.log(`✅ Found ${coverFiles.length} episode cover files\n`);

  // Fetch all episodes from Sanity
  console.log('📡 Fetching episodes from Sanity...\n');
  const episodes = await client.fetch(`*[_type == "episode"] | order(episodeNumber asc) {
    _id,
    episodeNumber,
    title,
    "hasCover": defined(coverImage)
  }`);

  console.log(`✅ Found ${episodes.length} episodes in Sanity\n`);

  let uploadedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const file of coverFiles) {
    // Extract episode number from filename (e.g., "episode cover 42.png" -> 42)
    const episodeNumber = parseInt(file.match(/\d+/)[0]);
    const filePath = path.join(COVERS_DIR, file);

    // Find corresponding episode
    const episode = episodes.find((ep) => ep.episodeNumber === episodeNumber);

    if (!episode) {
      console.log(`⚠️  Episode ${episodeNumber}: Not found in Sanity, skipping`);
      skippedCount++;
      continue;
    }

    if (episode.hasCover) {
      console.log(`⏭️  Episode ${episodeNumber}: Already has cover, skipping`);
      skippedCount++;
      continue;
    }

    try {
      console.log(`📤 Episode ${episodeNumber}: Uploading "${file}"...`);

      // Upload image to Sanity
      const imageAsset = await client.assets.upload('image', createReadStream(filePath), {
        filename: `episode-${episodeNumber}-cover.png`,
      });

      // Update episode with cover image reference
      await client
        .patch(episode._id)
        .set({
          coverImage: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imageAsset._id,
            },
          },
        })
        .commit();

      console.log(`✅ Episode ${episodeNumber}: "${episode.title}" - Cover uploaded successfully`);
      uploadedCount++;
    } catch (error) {
      console.error(`❌ Episode ${episodeNumber}: Failed to upload - ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Upload Summary:`);
  console.log(`   ✅ Uploaded: ${uploadedCount}`);
  console.log(`   ⏭️  Skipped: ${skippedCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📝 Total files: ${coverFiles.length}`);
}

async function main() {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error('Missing SANITY_API_TOKEN environment variable');
  }

  await uploadEpisodeCovers();
  console.log('\n✅ Episode cover upload complete!');
}

main();
