/**
 * Setup Sanity Webhook to Netlify
 *
 * Creates a webhook in Sanity that triggers Netlify builds when content changes
 */

import 'dotenv/config';

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.SANITY_DATASET || 'production';
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;
const NETLIFY_BUILD_HOOK = 'https://api.netlify.com/build_hooks/68e40d2c4787ab3637a6dafc';

if (!SANITY_PROJECT_ID) {
  throw new Error('Missing SANITY_PROJECT_ID environment variable');
}

async function createWebhook() {
  if (!SANITY_API_TOKEN) {
    throw new Error('SANITY_API_TOKEN not found in environment variables');
  }

  const webhook = {
    name: 'Netlify Deploy',
    url: NETLIFY_BUILD_HOOK,
    dataset: SANITY_DATASET,
  };

  console.log('🔗 Creating Sanity webhook...');
  console.log(`   Project: ${SANITY_PROJECT_ID}`);
  console.log(`   Dataset: ${SANITY_DATASET}`);
  console.log(`   Triggers: create, update, delete`);
  console.log(`   Target: Netlify build hook\n`);

  const response = await fetch(
    `https://api.sanity.io/v2021-06-07/hooks/projects/${SANITY_PROJECT_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SANITY_API_TOKEN}`,
      },
      body: JSON.stringify(webhook),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create webhook: ${response.status} - ${error}`);
  }

  const result = await response.json();

  console.log('✅ Webhook created successfully!');
  console.log(`   Webhook ID: ${result.id}`);
  console.log(`   Status: ${result.isDisabled ? 'Disabled' : 'Active'}\n`);
  console.log('🎉 All set! Your staging site will now auto-rebuild when you publish changes in Sanity Studio.');
  console.log('   Changes typically take 3-5 minutes to appear on staging.\n');

  return result;
}

createWebhook().catch((error) => {
  console.error('❌ Error creating webhook:', error.message);
  process.exit(1);
});
