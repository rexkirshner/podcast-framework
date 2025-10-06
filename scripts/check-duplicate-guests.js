/**
 * Check for Duplicate Guests
 *
 * Finds and reports duplicate guest records in Sanity
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

if (!process.env.SANITY_PROJECT_ID) {
  throw new Error('Missing SANITY_PROJECT_ID environment variable');
}

async function checkDuplicates() {
  const guests = await client.fetch(`*[_type == "guest"] { _id, name, _createdAt } | order(name asc)`);

  console.log(`📊 Total guests: ${guests.length}\n`);

  // Group by name
  const byName = {};
  for (const guest of guests) {
    if (!byName[guest.name]) {
      byName[guest.name] = [];
    }
    byName[guest.name].push(guest);
  }

  // Find duplicates
  const duplicates = Object.entries(byName).filter(([name, guests]) => guests.length > 1);

  if (duplicates.length === 0) {
    console.log('✅ No duplicates found!');
    return;
  }

  console.log(`⚠️  Found ${duplicates.length} duplicate names:\n`);

  for (const [name, guests] of duplicates) {
    console.log(`${name}:`);
    for (const guest of guests) {
      console.log(`  - ID: ${guest._id} (created: ${guest._createdAt})`);
    }
    console.log('');
  }
}

checkDuplicates().catch(console.error);
