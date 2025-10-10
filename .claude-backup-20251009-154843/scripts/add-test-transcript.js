/**
 * Add Test Transcript
 *
 * Adds a sample transcript to Episode 1 for testing the transcript viewer UI
 *
 * Usage: node scripts/add-test-transcript.js
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

const sampleTranscript = `Welcome to Strange Water, a podcast exploring Ethereum and Web3. I'm Rex Kirshner, and today we're diving deep into what makes Ethereum special and why it matters.

In this episode, we discuss the foundational principles of Ethereum - from smart contracts and decentralized applications, to the broader vision of Web3. We'll explore how Ethereum is different from Bitcoin, what makes it programmable money, and why developers around the world are building on this platform.

Our guest today shares their insights on the evolution of the Ethereum ecosystem, the challenges facing blockchain adoption, and where they see the technology heading in the next few years. Whether you're new to crypto or a seasoned blockchain enthusiast, this conversation offers valuable perspectives on one of the most transformative technologies of our time.

We also touch on topics like decentralized finance, NFTs, DAOs, and the broader implications of building censorship-resistant applications. The conversation explores both the technical innovations and the social impact of this emerging technology.

Thank you for listening to Strange Water. If you enjoyed this episode, please subscribe and share it with others who might find it interesting.`;

async function main() {
  try {
    console.log('🧪 Adding test transcript to Episode 1...\n');

    // Find Episode 1
    const episode = await client.fetch(`*[_type == "episode" && episodeNumber == 1][0]`);

    if (!episode) {
      console.error('❌ Episode 1 not found');
      process.exit(1);
    }

    console.log(`Found: ${episode.title}`);

    // Add transcript
    await client
      .patch(episode._id)
      .set({
        transcript: sampleTranscript,
        transcriptGeneratedAt: new Date().toISOString(),
      })
      .commit();

    console.log('✅ Test transcript added successfully');
    console.log('\n📝 Next steps:');
    console.log('   1. Visit http://localhost:4321/episodes/sw1');
    console.log('   2. Verify the transcript viewer appears');
    console.log('   3. Test the "Show Transcript" toggle');
    console.log('   4. Test the search functionality');
    console.log('   5. Test the copy button');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
