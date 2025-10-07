import 'dotenv/config';
import { createClient } from '@sanity/client';

// Sanity client configuration
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

// Mark the first 5 episodes as featured for demo purposes
async function setFeaturedEpisodes() {
  console.log("Fetching episodes...");

  const episodes = await client.fetch(
    `*[_type == "episode"] | order(episodeNumber desc) [0...10] {
      _id,
      episodeNumber,
      title,
      featured
    }`
  );

  console.log(`Found ${episodes.length} episodes`);

  // Select episodes to feature (let's do 5 random ones from the first 10)
  const episodesToFeature = [
    episodes[0], // Latest
    episodes[2], // Third latest
    episodes[4], // Fifth latest
    episodes[6], // Seventh latest
    episodes[8], // Ninth latest
  ].filter(Boolean);

  console.log("\nSetting these episodes as featured:");
  episodesToFeature.forEach((ep) => {
    console.log(`  - Episode ${ep.episodeNumber}: ${ep.title}`);
  });

  // Update episodes
  for (const episode of episodesToFeature) {
    if (episode.featured) {
      console.log(`  ✓ Episode ${episode.episodeNumber} already featured, skipping`);
      continue;
    }

    await client
      .patch(episode._id)
      .set({ featured: true })
      .commit();

    console.log(`  ✓ Marked Episode ${episode.episodeNumber} as featured`);
  }

  console.log("\n✅ Done! Featured episodes are now set.");
  console.log("Rebuild your site to see the carousel on the homepage.");
}

setFeaturedEpisodes().catch(console.error);
