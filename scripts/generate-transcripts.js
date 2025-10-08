/**
 * Generate Episode Transcripts using Whisper API
 *
 * Transcribes podcast episodes using OpenAI Whisper API
 * Stores transcripts in Sanity CMS
 *
 * Cost: $0.006/minute of audio (~$0.36 per 60-min episode)
 *
 * Usage:
 *   node scripts/generate-transcripts.js --all              # Transcribe all episodes
 *   node scripts/generate-transcripts.js --episode 42       # Transcribe specific episode
 *   node scripts/generate-transcripts.js --missing          # Only transcribe episodes without transcripts
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';
import OpenAI from 'openai';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sanity client
const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Validate environment variables
if (!process.env.SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
  console.error('❌ Missing Sanity credentials in .env');
  process.exit(1);
}

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ Missing OPENAI_API_KEY in .env');
  console.error('   Get your API key from: https://platform.openai.com/api-keys');
  process.exit(1);
}

/**
 * Get audio URL for episode
 * Priority: Direct MP3 link > Spotify episode > Spotify show
 */
async function getAudioURL(episode) {
  // Check if episode has direct MP3 link (RSS feed audio)
  if (episode.audioUrl) {
    return episode.audioUrl;
  }

  // For Spotify episodes, we need the actual MP3 file
  // Note: Spotify doesn't provide direct MP3 access via API for transcription
  // You'll need to either:
  // 1. Get MP3 URLs from your podcast host (RSS.com, Anchor, etc.)
  // 2. Download episodes manually and host them temporarily
  // 3. Use Spotify's API to get preview URLs (30s clips only)

  throw new Error(
    `No audio URL found for episode ${episode.episodeNumber}. ` +
    `Add an 'audioUrl' field to the episode in Sanity with the direct MP3 link.`
  );
}

/**
 * Download audio file to temp directory
 */
async function downloadAudio(url, episodeNumber) {
  const tempDir = path.join(__dirname, '../temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const tempPath = path.join(tempDir, `episode-${episodeNumber}.mp3`);

  console.log(`  📥 Downloading audio...`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download audio: ${response.statusText}`);
  }

  const buffer = await response.buffer();
  fs.writeFileSync(tempPath, buffer);

  console.log(`  ✅ Downloaded to ${tempPath}`);
  return tempPath;
}

/**
 * Transcribe audio file using Whisper API
 */
async function transcribeAudio(audioPath, episodeNumber) {
  console.log(`  🎙️  Transcribing with Whisper API...`);

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: 'whisper-1',
      response_format: 'verbose_json', // Get timestamps
      language: 'en', // Specify language for better accuracy
    });

    console.log(`  ✅ Transcription complete`);

    return {
      text: transcription.text,
      duration: transcription.duration,
      segments: transcription.segments || [], // Timestamped segments
    };
  } catch (error) {
    console.error(`  ❌ Transcription failed:`, error.message);
    throw error;
  }
}

/**
 * Save transcript to Sanity
 */
async function saveTranscript(episodeId, transcript) {
  console.log(`  💾 Saving transcript to Sanity...`);

  await sanity
    .patch(episodeId)
    .set({
      transcript: transcript.text,
      transcriptSegments: transcript.segments,
      transcriptDuration: transcript.duration,
      transcriptGeneratedAt: new Date().toISOString(),
    })
    .commit();

  console.log(`  ✅ Transcript saved`);
}

/**
 * Clean up temp files
 */
function cleanup(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`  🧹 Cleaned up temp file`);
  }
}

/**
 * Get episodes to transcribe based on CLI args
 */
async function getEpisodesToTranscribe() {
  const args = process.argv.slice(2);

  if (args.includes('--all')) {
    const query = `*[_type == "episode"] | order(episodeNumber asc) { _id, episodeNumber, title, audioUrl, transcript }`;
    return await sanity.fetch(query);
  }

  if (args.includes('--missing')) {
    const query = `*[_type == "episode" && !defined(transcript)] | order(episodeNumber asc) { _id, episodeNumber, title, audioUrl, transcript }`;
    return await sanity.fetch(query);
  }

  const episodeArg = args.find((arg) => arg.startsWith('--episode='));
  if (episodeArg) {
    const episodeNumber = parseInt(episodeArg.split('=')[1], 10);
    const query = `*[_type == "episode" && episodeNumber == $episodeNumber][0] { _id, episodeNumber, title, audioUrl, transcript }`;
    const episode = await sanity.fetch(query, { episodeNumber });
    return episode ? [episode] : [];
  }

  console.error('❌ Invalid arguments. Usage:');
  console.error('   --all              Transcribe all episodes');
  console.error('   --missing          Only transcribe episodes without transcripts');
  console.error('   --episode=42       Transcribe specific episode');
  process.exit(1);
}

/**
 * Estimate cost for transcription
 */
function estimateCost(episodes, avgDurationMinutes = 60) {
  const COST_PER_MINUTE = 0.006; // $0.006/minute
  const episodesToTranscribe = episodes.filter((ep) => !ep.transcript);
  const totalMinutes = episodesToTranscribe.length * avgDurationMinutes;
  const totalCost = totalMinutes * COST_PER_MINUTE;

  return {
    episodeCount: episodesToTranscribe.length,
    estimatedMinutes: totalMinutes,
    estimatedCost: totalCost,
  };
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🎙️  Episode Transcript Generator\n');

    // Get episodes
    const episodes = await getEpisodesToTranscribe();

    if (episodes.length === 0) {
      console.log('✅ No episodes found to transcribe');
      process.exit(0);
    }

    // Show cost estimate
    const cost = estimateCost(episodes);
    console.log(`📊 Transcription Plan:`);
    console.log(`   Episodes to process: ${episodes.length}`);
    console.log(`   Already have transcripts: ${episodes.filter((e) => e.transcript).length}`);
    console.log(`   Need transcripts: ${cost.episodeCount}`);
    console.log(`   Estimated minutes: ${cost.estimatedMinutes}`);
    console.log(`   Estimated cost: $${cost.estimatedCost.toFixed(2)}\n`);

    // Confirm before proceeding
    if (cost.estimatedCost > 10) {
      console.log(`⚠️  This will cost approximately $${cost.estimatedCost.toFixed(2)}`);
      console.log(`   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    // Process episodes
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const episode of episodes) {
      console.log(`\n📝 Episode ${episode.episodeNumber}: ${episode.title}`);

      // Skip if already has transcript
      if (episode.transcript) {
        console.log(`  ⏭️  Already has transcript, skipping`);
        skipCount++;
        continue;
      }

      let audioPath = null;

      try {
        // Get audio URL
        const audioUrl = await getAudioURL(episode);

        // Download audio
        audioPath = await downloadAudio(audioUrl, episode.episodeNumber);

        // Transcribe
        const transcript = await transcribeAudio(audioPath, episode.episodeNumber);

        // Save to Sanity
        await saveTranscript(episode._id, transcript);

        console.log(`  ✅ Episode ${episode.episodeNumber} complete`);
        successCount++;
      } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
        errors.push({ episode: episode.episodeNumber, error: error.message });
        errorCount++;
      } finally {
        // Clean up temp file
        if (audioPath) {
          cleanup(audioPath);
        }
      }
    }

    console.log(`\n\n📊 Transcription Summary:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ⏭️  Skipped: ${skipCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);

    if (errors.length > 0) {
      console.log(`\n⚠️  Errors:`);
      errors.forEach(({ episode, error }) => {
        console.log(`   Episode ${episode}: ${error}`);
      });
    }

    console.log(`\n✅ Transcription complete!`);

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run script
main();
