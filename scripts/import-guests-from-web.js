/**
 * Guest Data Scraper for Strange Water
 *
 * Scrapes guest information from strangewater.xyz and imports to Sanity CMS
 *
 * Usage: node --loader dotenv/config scripts/import-guests-from-web.js
 * or: npm run import:guests
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';
import * as cheerio from 'cheerio';

// Sanity client configuration
const client = createClient({
  projectId: 'ej6443ov',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

// Base URL for scraping
const BASE_URL = 'https://strangewater.xyz';
const GUESTS_PAGE = `${BASE_URL}/guests`;

/**
 * Fetch and parse HTML from URL
 */
async function fetchHTML(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  const html = await response.text();
  return cheerio.load(html);
}

/**
 * Get all guest page URLs from the main guests page
 */
async function getGuestURLs() {
  console.log(`📡 Fetching guest list from ${GUESTS_PAGE}...`);

  const $ = await fetchHTML(GUESTS_PAGE);
  const guestUrls = new Set();

  // Find all links to /person/[slug]
  $('a[href^="/person/"]').each((i, elem) => {
    const href = $(elem).attr('href');
    if (href) {
      const fullUrl = `${BASE_URL}${href}`;
      guestUrls.add(fullUrl);
    }
  });

  const urlArray = Array.from(guestUrls);
  console.log(`✅ Found ${urlArray.length} guests\n`);
  return urlArray;
}

/**
 * Extract episode number from episode title
 * Expected format: "Episode Title w/ Guest Name" or contains "SW##"
 */
function extractEpisodeNumber(episodeText) {
  // Try to match SW## pattern
  const swMatch = episodeText.match(/SW(\d+)/i);
  if (swMatch) {
    return parseInt(swMatch[1], 10);
  }

  // Try to match "Episode ##" pattern
  const epMatch = episodeText.match(/Episode\s+(\d+)/i);
  if (epMatch) {
    return parseInt(epMatch[1], 10);
  }

  return null;
}

/**
 * Generate slug from name
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/^0x/, '') // Remove leading 0x
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Scrape individual guest page for details
 */
async function scrapeGuestPage(url) {
  const $ = await fetchHTML(url);

  // Extract name (h1 or h2)
  const name = $('h1').first().text().trim() || $('h2').first().text().trim();

  // Extract title/company (usually in a subtitle or paragraph near the name)
  let title = null;
  const subtitleSelectors = [
    'h1 + p',
    'h2 + p',
    '.subtitle',
    '.title',
    'p.text-muted',
  ];
  for (const selector of subtitleSelectors) {
    const text = $(selector).first().text().trim();
    if (text && text !== name) {
      title = text;
      break;
    }
  }

  // Extract profile image
  let profileImage = null;
  const imgSelectors = [
    'img.profile-image',
    'img.participant-image',
    '.participant-card img',
    'img[alt*="profile"]',
    'img[alt*="photo"]',
  ];
  for (const selector of imgSelectors) {
    const imgSrc = $(selector).first().attr('src');
    if (imgSrc) {
      profileImage = imgSrc.startsWith('http') ? imgSrc : `${BASE_URL}${imgSrc}`;
      break;
    }
  }

  // If no profile image found, try any image on the page (first one is usually the profile)
  if (!profileImage) {
    const firstImg = $('img').first().attr('src');
    if (firstImg) {
      profileImage = firstImg.startsWith('http') ? firstImg : `${BASE_URL}${firstImg}`;
    }
  }

  // Extract social links
  const socialLinks = {
    twitter: null,
    linkedin: null,
    website: null,
  };

  $('a[href*="twitter.com"], a[href*="x.com"]').each((i, elem) => {
    const href = $(elem).attr('href');
    if (href && !socialLinks.twitter) {
      socialLinks.twitter = href;
    }
  });

  $('a[href*="linkedin.com"]').each((i, elem) => {
    const href = $(elem).attr('href');
    if (href && !socialLinks.linkedin) {
      socialLinks.linkedin = href;
    }
  });

  // Find website (exclude social media and podcast page domains)
  $('a[href^="http"]').each((i, elem) => {
    const href = $(elem).attr('href');
    if (href &&
        !href.includes('twitter.com') &&
        !href.includes('x.com') &&
        !href.includes('linkedin.com') &&
        !href.includes('facebook.com') &&
        !href.includes('instagram.com') &&
        !href.includes('podcastpage.io') &&
        !socialLinks.website) {
      socialLinks.website = href;
    }
  });

  // Extract episodes
  const episodes = [];

  // Look for episode links or episode information
  $('.episode-card, .episode, [class*="episode"]').each((i, elem) => {
    const episodeTitle = $(elem).find('h3, h4, .episode-title').first().text().trim();
    const episodeNumber = extractEpisodeNumber(episodeTitle);

    if (episodeNumber) {
      episodes.push({
        episodeNumber,
        title: episodeTitle,
      });
    }
  });

  // If no episodes found with the above method, look for any text containing episode numbers
  if (episodes.length === 0) {
    $('*').each((i, elem) => {
      const text = $(elem).text();
      if (text.match(/SW\d+/i) || text.match(/Episode\s+\d+/i)) {
        const episodeNumber = extractEpisodeNumber(text);
        if (episodeNumber && !episodes.find(e => e.episodeNumber === episodeNumber)) {
          episodes.push({
            episodeNumber,
            title: text.trim(),
          });
        }
      }
    });
  }

  return {
    name,
    title,
    profileImage,
    socialLinks,
    episodes,
  };
}

/**
 * Extract Twitter handle from URL
 */
function extractTwitterHandle(twitterUrl) {
  if (!twitterUrl) return null;

  // Extract handle from URLs like https://twitter.com/username or https://x.com/username
  const match = twitterUrl.match(/(?:twitter\.com|x\.com)\/([^/?]+)/);
  return match ? match[1] : null;
}

/**
 * Transform scraped data to Sanity guest document
 */
function transformToGuest(guestData) {
  const slug = generateSlug(guestData.name);
  const twitterHandle = extractTwitterHandle(guestData.socialLinks.twitter);

  return {
    _type: 'guest',
    _id: `guest-${slug}`,
    name: guestData.name,
    slug: {
      _type: 'slug',
      current: slug,
    },
    bio: null, // Not available from scraping, can be added manually
    twitter: twitterHandle,
    website: guestData.socialLinks.website,
    linkedin: guestData.socialLinks.linkedin,
    // Store temporary fields for manual processing
    _profileImageUrl: guestData.profileImage,
    _jobTitle: guestData.title,
    _episodeNumbers: guestData.episodes.map(e => e.episodeNumber),
  };
}

/**
 * Import guests to Sanity
 */
async function importGuests(guests) {
  console.log(`\n📥 Importing ${guests.length} guests to Sanity...\n`);

  let successCount = 0;
  let errorCount = 0;
  let updatedCount = 0;

  for (const guest of guests) {
    try {
      const result = await client.createOrReplace(guest);
      const action = result._rev === 'initial' ? '➕' : '🔄';
      if (result._rev !== 'initial') updatedCount++;
      console.log(`${action} ${guest.name}${guest.title ? ` (${guest.title})` : ''}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to import ${guest.name}: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   🔄 Updated: ${updatedCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📝 Total: ${guests.length}`);

  return { successCount, errorCount };
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🚀 Starting Guest Data Scraper\n');

    // Check for API token
    if (!process.env.SANITY_API_TOKEN) {
      throw new Error(
        'Missing SANITY_API_TOKEN environment variable.\n' +
        'Create a token at https://sanity.io/manage and add to .env file'
      );
    }

    // Get all guest URLs
    const guestUrls = await getGuestURLs();

    // Scrape each guest page
    console.log('🔍 Scraping guest pages...\n');
    const guestsData = [];

    for (const url of guestUrls) {
      try {
        console.log(`   Scraping ${url}...`);
        const guestData = await scrapeGuestPage(url);
        guestsData.push(guestData);

        // Be nice to the server - add small delay
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`   ❌ Failed to scrape ${url}: ${error.message}`);
      }
    }

    console.log(`\n✅ Scraped ${guestsData.length} guest profiles\n`);

    // Transform to Sanity documents
    const guests = guestsData.map(transformToGuest);

    // Display preview
    console.log('📋 Preview of first guest:');
    console.log(JSON.stringify(guests[0], null, 2));
    console.log('');

    // Import to Sanity
    await importGuests(guests);

    console.log('\n✅ Import complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Check Sanity Studio to verify guests');
    console.log('   2. Upload profile images (URLs noted in _profileImageUrl field)');
    console.log('   3. Add bio text manually (can copy from old site if needed)');
    console.log('   4. Link guests to episodes (episode numbers in _episodeNumbers field)');
    console.log('   5. Add job titles to bio if needed (saved in _jobTitle field)');
    console.log('   6. Clean up temporary fields (_profileImageUrl, _episodeNumbers, _jobTitle)');

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Run import
main();
