/**
 * Create Rex Kirshner as Host
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

async function createRexHost() {
  console.log('📝 Creating Rex Kirshner as host...\n');

  const rexHost = {
    _type: 'host',
    _id: 'host-rex-kirshner',
    name: 'Rex Kirshner',
    slug: {
      _type: 'slug',
      current: 'rex-kirshner',
    },
    bio: 'Host of Strange Water Podcast',
    twitter: 'RexKirshner',
    // Add more fields as needed (website, linkedin, photo, etc.)
  };

  try {
    const result = await client.createOrReplace(rexHost);
    console.log('✅ Created host record:', result.name);
    console.log(`   ID: ${result._id}`);
    console.log(`   Slug: ${result.slug.current}\n`);
  } catch (error) {
    console.error('❌ Failed to create host:', error.message);
    process.exit(1);
  }
}

async function main() {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error('Missing SANITY_API_TOKEN environment variable');
  }

  await createRexHost();
  console.log('✅ Host creation complete!');
}

main();
