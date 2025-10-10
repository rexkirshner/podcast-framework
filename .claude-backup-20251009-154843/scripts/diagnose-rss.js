/**
 * Diagnose RSS feed episode ordering
 */

import xml2js from 'xml2js';

const RSS_FEED_URL = 'https://anchor.fm/s/dcf17d04/podcast/rss';

async function diagnoseRSS() {
  const response = await fetch(RSS_FEED_URL);
  const xmlData = await response.text();
  const parser = new xml2js.Parser({ explicitArray: true });
  const result = await parser.parseStringPromise(xmlData);
  const items = result.rss.channel[0].item || [];

  console.log(`Total items in RSS feed: ${items.length}\n`);

  // Find trailer
  const trailerIndex = items.findIndex(item =>
    item.title[0].toLowerCase().includes('trailer')
  );
  console.log(`Trailer found at index: ${trailerIndex}`);
  if (trailerIndex >= 0) {
    console.log(`  Title: ${items[trailerIndex].title[0]}`);
    console.log(`  PubDate: ${items[trailerIndex].pubDate[0]}\n`);
  }

  // Find EOF episode
  const eofIndex = items.findIndex(item =>
    item.title[0].includes('EOF') || item.title[0].includes('Danno')
  );
  console.log(`EOF episode found at index: ${eofIndex}`);
  if (eofIndex >= 0) {
    console.log(`  Title: ${items[eofIndex].title[0]}`);
    console.log(`  PubDate: ${items[eofIndex].pubDate[0]}\n`);
  }

  // Show first 3 and last 3 episodes
  console.log('First 3 episodes (newest):');
  items.slice(0, 3).forEach((item, i) => {
    console.log(`  [${i}] ${item.title[0]}`);
  });

  console.log('\nLast 3 episodes (oldest):');
  items.slice(-3).forEach((item, i) => {
    const actualIndex = items.length - 3 + i;
    console.log(`  [${actualIndex}] ${item.title[0]}`);
  });

  // Show episodes around EOF
  if (eofIndex >= 0) {
    console.log(`\nEpisodes around EOF (index ${eofIndex}):`);
    for (let i = Math.max(0, eofIndex - 2); i <= Math.min(items.length - 1, eofIndex + 2); i++) {
      const marker = i === eofIndex ? ' ← EOF' : '';
      console.log(`  [${i}] ${items[i].title[0]}${marker}`);
    }
  }
}

diagnoseRSS().catch(console.error);
