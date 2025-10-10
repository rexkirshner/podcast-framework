/**
 * Delete All Episodes
 *
 * Removes all episode documents from Sanity CMS
 * Use this to clean up duplicates before re-importing
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';
import * as readline from 'node:readline';

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

async function deleteAllEpisodes() {
  console.log('🔍 Finding all episodes...\n');

  // Find all episodes
  const query = `*[_type == "episode"] { _id, title, episodeNumber }`;
  const episodes = await client.fetch(query);

  console.log(`Found ${episodes.length} episodes\n`);

  if (episodes.length === 0) {
    console.log('✅ No episodes to delete');
    return;
  }

  // Show preview
  console.log('Preview of episodes to delete:');
  episodes.slice(0, 5).forEach(ep => {
    console.log(`  - Episode ${ep.episodeNumber}: ${ep.title}`);
  });
  if (episodes.length > 5) {
    console.log(`  ... and ${episodes.length - 5} more`);
  }
  console.log('');

  // Confirmation prompt
  console.log('⚠️  WARNING: This will permanently delete all episodes!');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answer = await new Promise((resolve) => {
    rl.question('Type "DELETE" to confirm: ', (answer) => {
      rl.close();
      resolve(answer);
    });
  });

  if (answer !== 'DELETE') {
    console.log('\n❌ Deletion cancelled');
    return;
  }

  // Delete all episodes
  console.log('\n🗑️  Deleting all episodes...\n');

  let deleteCount = 0;
  let errorCount = 0;

  for (const episode of episodes) {
    try {
      await client.delete(episode._id);
      console.log(`✅ Deleted: Episode ${episode.episodeNumber} - ${episode.title}`);
      deleteCount++;
    } catch (error) {
      console.error(`❌ Failed to delete ${episode._id}: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Deletion Summary:`);
  console.log(`   ✅ Deleted: ${deleteCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📝 Total: ${episodes.length}`);
}

async function main() {
  try {
    console.log('🚀 Starting Episode Deletion\n');

    // Check for API token
    if (!process.env.SANITY_API_TOKEN) {
      throw new Error(
        'Missing SANITY_API_TOKEN environment variable.\n' +
        'Create a token at https://sanity.io/manage and add to .env file'
      );
    }

    await deleteAllEpisodes();

    console.log('\n✅ Deletion complete!');
    console.log('\n📝 Next step: Run npm run import:rss to re-import episodes');

  } catch (error) {
    console.error('❌ Deletion failed:', error.message);
    process.exit(1);
  }
}

main();
