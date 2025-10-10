/**
 * Script to list all podcasts in Sanity CMS
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

async function listPodcasts() {
  try {
    const query = `*[_type == "podcast"]{_id, name, isActive}`;
    const podcasts = await client.fetch(query);

    console.log(`📻 Found ${podcasts.length} podcast(s):\n`);

    podcasts.forEach((podcast) => {
      const status = podcast.isActive ? '🟢 Active' : '🔴 Inactive';
      console.log(`   ${status} ${podcast.name}`);
      console.log(`      ID: ${podcast._id}`);
      console.log();
    });

  } catch (error) {
    console.error('❌ Error fetching podcasts:', error.message);
    process.exit(1);
  }
}

listPodcasts();
