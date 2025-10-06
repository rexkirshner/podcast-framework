/**
 * Fix Draft References
 *
 * Updates episode references from draft guests to published guests
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'ej6443ov',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

async function fixDraftReferences() {
  // Find all episodes with draft guest references
  const episodes = await client.fetch(`
    *[_type == "episode" && defined(guests)] {
      _id,
      episodeNumber,
      "draftGuests": guests[@._ref match "drafts.*"]->_id
    }
  `);

  const episodesWithDrafts = episodes.filter(ep => ep.draftGuests && ep.draftGuests.length > 0);

  console.log(`📊 Found ${episodesWithDrafts.length} episodes with draft guest references\n`);

  if (episodesWithDrafts.length === 0) {
    console.log('✅ No draft references to fix!');
    return;
  }

  for (const episode of episodesWithDrafts) {
    console.log(`Fixing Episode ${episode.episodeNumber}...`);

    // Get current guests
    const fullEpisode = await client.getDocument(episode._id);
    const currentGuests = fullEpisode.guests || [];

    // Replace draft references with published ones
    const fixedGuests = currentGuests.map(guestRef => {
      if (guestRef._ref.startsWith('drafts.')) {
        const publishedId = guestRef._ref.replace('drafts.', '');
        console.log(`  Replacing ${guestRef._ref} → ${publishedId}`);
        return {
          ...guestRef,
          _ref: publishedId,
        };
      }
      return guestRef;
    });

    // Update episode
    await client
      .patch(episode._id)
      .set({ guests: fixedGuests })
      .commit();

    console.log(`  ✅ Fixed Episode ${episode.episodeNumber}\n`);
  }

  console.log('✅ All draft references fixed!');
}

fixDraftReferences().catch(console.error);
