/**
 * Script to mark a podcast as active in Sanity CMS
 * Usage: node scripts/activate-podcast.js "Strange Water"
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';

// Load environment variables
config();

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function activatePodcast(podcastName) {
  try {
    // Find the podcast by name
    const query = `*[_type == "podcast" && name == $name][0]`;
    const params = { name: podcastName };

    const podcast = await client.fetch(query, params);

    if (!podcast) {
      console.error(`❌ Podcast "${podcastName}" not found`);
      process.exit(1);
    }

    console.log(`📻 Found podcast: ${podcast.name}`);
    console.log(`   Current status: ${podcast.isActive ? '🟢 Active' : '🔴 Inactive'}`);

    if (podcast.isActive) {
      console.log(`✅ Podcast is already active - no changes needed`);
      return;
    }

    // Update the podcast to be active
    await client
      .patch(podcast._id)
      .set({ isActive: true })
      .commit();

    console.log(`✅ Successfully activated podcast: ${podcast.name}`);
    console.log(`   New status: 🟢 Active`);
    console.log(`\n📝 Note: Contribute buttons will now appear on the website`);

  } catch (error) {
    console.error('❌ Error activating podcast:', error.message);
    process.exit(1);
  }
}

// Get podcast name from command line argument or default to "Strange Water"
const podcastName = process.argv[2] || 'Strange Water';

console.log(`🚀 Activating podcast: "${podcastName}"\n`);
activatePodcast(podcastName);
