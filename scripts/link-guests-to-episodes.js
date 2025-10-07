/**
 * Link Guests to Episodes
 *
 * Automatically matches guests to episodes based on episode titles and descriptions
 *
 * Usage: node --loader dotenv/config scripts/link-guests-to-episodes.js
 * or: npm run link:guests
 */

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

if (!process.env.SANITY_PROJECT_ID) {
  throw new Error('Missing SANITY_PROJECT_ID environment variable');
}

/**
 * Fetch all episodes from Sanity
 * @returns {Promise<Array<Object>>} Array of episode objects with ID, number, title, description, currentGuests
 * @description Retrieves all episodes sorted by episode number for guest matching
 */
async function getAllEpisodes() {
  const query = `*[_type == "episode"] | order(episodeNumber asc) {
    _id,
    episodeNumber,
    title,
    description,
    "currentGuests": guests[]->_id
  }`;

  return await client.fetch(query);
}

/**
 * Fetch all guests from Sanity
 * @returns {Promise<Array<Object>>} Array of guest objects with ID, name, slug, twitter
 * @description Retrieves all guests for name matching against episode metadata
 */
async function getAllGuests() {
  const query = `*[_type == "guest"] {
    _id,
    name,
    slug,
    twitter
  }`;

  return await client.fetch(query);
}

/**
 * Normalize name for matching
 * @param {string} name - Guest or episode name to normalize
 * @returns {string} Normalized name (lowercase, no special chars, trimmed)
 * @description Removes special characters, 0x prefix, normalizes whitespace for fuzzy matching
 * @example
 * normalizeName("0xJohn Doe!") // Returns "john doe"
 */
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/^0x/, '') // Remove 0x prefix
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Generate possible name variations for matching
 * @param {string} guestName - Guest name to generate variations for
 * @returns {Set<string>} Set of name variations (original, lowercase, normalized, twitter handle, etc.)
 * @description Creates multiple name formats to increase matching accuracy against episode metadata
 * @example
 * getNameVariations("@JohnDoe") // Returns Set: ["@JohnDoe", "johndoe", "john doe", ...]
 */
function getNameVariations(guestName) {
  const variations = new Set();

  // Original name
  variations.add(guestName);

  // Lowercase
  variations.add(guestName.toLowerCase());

  // Normalized
  variations.add(normalizeName(guestName));

  // Without 0x prefix
  if (guestName.startsWith('0x')) {
    const without0x = guestName.substring(2);
    variations.add(without0x);
    variations.add(without0x.toLowerCase());
  }

  // First name only (for "First Last" names)
  const parts = guestName.split(' ');
  if (parts.length > 1) {
    variations.add(parts[0]); // First name
    variations.add(parts[parts.length - 1]); // Last name
    variations.add(parts[0].toLowerCase());
    variations.add(parts[parts.length - 1].toLowerCase());
  }

  // Handle special cases
  if (guestName === 'OneTrueKirk') {
    variations.add('Kirk');
    variations.add('kirk');
  }

  if (guestName === 'Jasper the Friendly Ghost') {
    variations.add('Jasper');
    variations.add('jasper');
  }

  return Array.from(variations);
}

/**
 * Find guests mentioned in episode title or description
 */
function findGuestsInEpisode(episode, guests) {
  const title = episode.title.toLowerCase();
  const description = episode.description.toLowerCase();
  const searchText = `${title} ${description}`;
  const matchedGuests = [];
  const matchedIds = new Set(); // Track IDs to avoid duplicates

  for (const guest of guests) {
    // Skip the host (LogarithmicRex)
    if (guest.name === 'LogarithmicRex') {
      continue;
    }

    // Skip if already matched (avoid duplicates)
    if (matchedIds.has(guest._id)) {
      continue;
    }

    const variations = getNameVariations(guest.name);

    // Special handling for common false positives
    // Will Griffiths and Will Patterson should only match if their full name appears in title with "w/"
    if (guest.name === 'Will Griffiths' || guest.name === 'Will Patterson') {
      const lastName = guest.name.split(' ')[1].toLowerCase();
      const titlePattern = new RegExp(`w/.*\\b${lastName}\\b`, 'i');
      if (titlePattern.test(title)) {
        matchedGuests.push({
          _id: guest._id,
          name: guest.name,
          matchedOn: 'title (w/ pattern)',
        });
        matchedIds.add(guest._id);
      }
      continue; // Don't do standard matching for these two
    }

    // Check if any variation appears in the episode text
    for (const variation of variations) {
      // Use word boundaries to avoid partial matches
      // e.g., don't match "Wong" in "wrong"
      const pattern = new RegExp(`\\b${variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');

      if (pattern.test(searchText)) {
        matchedGuests.push({
          _id: guest._id,
          name: guest.name,
          matchedOn: variation,
        });
        matchedIds.add(guest._id);
        break; // Found a match, no need to check other variations
      }
    }
  }

  return matchedGuests;
}

/**
 * Update episode with guest references
 */
async function updateEpisodeGuests(episodeId, guestIds) {
  await client
    .patch(episodeId)
    .set({
      guests: guestIds.map(id => ({
        _type: 'reference',
        _ref: id,
      })),
    })
    .commit();
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🚀 Starting Guest-to-Episode Linking\n');

    // Check for API token
    if (!process.env.SANITY_API_TOKEN) {
      throw new Error(
        'Missing SANITY_API_TOKEN environment variable.\n' +
        'Create a token at https://sanity.io/manage and add to .env file'
      );
    }

    // Fetch data
    console.log('📡 Fetching episodes and guests from Sanity...');
    const [episodes, guests] = await Promise.all([
      getAllEpisodes(),
      getAllGuests(),
    ]);

    console.log(`✅ Found ${episodes.length} episodes and ${guests.length} guests\n`);

    // Process each episode
    console.log('🔍 Matching guests to episodes...\n');

    let updatedCount = 0;
    let skippedCount = 0;
    let ambiguousCount = 0;
    const ambiguousCases = [];

    for (const episode of episodes) {
      const matchedGuests = findGuestsInEpisode(episode, guests);

      // Check if episode already has guests assigned
      const currentGuestIds = episode.currentGuests || [];
      const newGuestIds = matchedGuests.map(g => g._id);

      // Only update if guests have changed
      const hasChanged =
        currentGuestIds.length !== newGuestIds.length ||
        !currentGuestIds.every(id => newGuestIds.includes(id));

      if (matchedGuests.length === 0) {
        console.log(`⚠️  Episode ${episode.episodeNumber}: No guests found`);
        console.log(`    Title: ${episode.title}`);
        ambiguousCases.push({
          episode: episode.episodeNumber,
          title: episode.title,
          reason: 'No guests matched',
        });
        ambiguousCount++;
      } else if (matchedGuests.length > 3) {
        console.log(`⚠️  Episode ${episode.episodeNumber}: Too many matches (${matchedGuests.length})`);
        console.log(`    Title: ${episode.title}`);
        console.log(`    Matched: ${matchedGuests.map(g => g.name).join(', ')}`);
        ambiguousCases.push({
          episode: episode.episodeNumber,
          title: episode.title,
          matched: matchedGuests.map(g => g.name),
          reason: 'Too many matches - may include false positives',
        });
        ambiguousCount++;
      } else if (hasChanged) {
        console.log(`✅ Episode ${episode.episodeNumber}: ${matchedGuests.map(g => g.name).join(', ')}`);
        await updateEpisodeGuests(episode._id, newGuestIds);
        updatedCount++;
      } else {
        console.log(`⏭️  Episode ${episode.episodeNumber}: Already linked (${matchedGuests.map(g => g.name).join(', ')})`);
        skippedCount++;
      }
    }

    console.log(`\n📊 Linking Summary:`);
    console.log(`   ✅ Updated: ${updatedCount}`);
    console.log(`   ⏭️  Skipped (already linked): ${skippedCount}`);
    console.log(`   ⚠️  Ambiguous/needs review: ${ambiguousCount}`);
    console.log(`   📝 Total episodes: ${episodes.length}`);

    if (ambiguousCases.length > 0) {
      console.log('\n⚠️  Episodes needing manual review:');
      for (const case_ of ambiguousCases) {
        console.log(`\n   Episode ${case_.episode}: ${case_.title}`);
        console.log(`   Reason: ${case_.reason}`);
        if (case_.matched) {
          console.log(`   Matched: ${case_.matched.join(', ')}`);
        }
      }
    }

    console.log('\n✅ Linking complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Review ambiguous cases above and manually link guests in Sanity Studio');
    console.log('   2. Verify guest assignments in Sanity Studio');
    console.log('   3. Check website to ensure guest info displays correctly');

  } catch (error) {
    console.error('❌ Linking failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run linking
main();
