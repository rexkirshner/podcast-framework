/**
 * Delete Draft Guest Documents
 *
 * Removes all draft guest documents from Sanity (IDs starting with "drafts.")
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

async function deleteDrafts() {
  // Find all draft guest documents
  const drafts = await client.fetch(`*[_type == "guest" && _id match "drafts.*"] { _id, name }`);

  console.log(`📊 Found ${drafts.length} draft guest documents\n`);

  if (drafts.length === 0) {
    console.log('✅ No drafts to delete!');
    return;
  }

  console.log('🗑️  Deleting drafts...\n');

  let deleteCount = 0;
  for (const draft of drafts) {
    try {
      await client.delete(draft._id);
      console.log(`✅ Deleted: ${draft.name} (${draft._id})`);
      deleteCount++;
    } catch (error) {
      console.error(`❌ Failed to delete ${draft._id}: ${error.message}`);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Deleted: ${deleteCount}`);
  console.log(`   ❌ Failed: ${drafts.length - deleteCount}`);
}

deleteDrafts().catch(console.error);
