/**
 * Generate Episode Transcripts using AssemblyAI
 *
 * Transcribes podcast episodes using AssemblyAI with speaker diarization
 * Stores transcripts in Sanity CMS with speaker labels
 *
 * Cost: ~$0.25/hour of audio (~$0.25 per 60-min episode)
 * Features: Speaker identification, timestamps, high accuracy
 *
 * Usage:
 *   node scripts/generate-transcripts-assemblyai.js --all              # Transcribe all episodes
 *   node scripts/generate-transcripts-assemblyai.js --episode 42       # Transcribe specific episode
 *   node scripts/generate-transcripts-assemblyai.js --missing          # Only transcribe episodes without transcripts
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';
import { AssemblyAI } from 'assemblyai';

// Sanity client
const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

// AssemblyAI client
const assemblyai = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

// Validate environment variables
if (!process.env.SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
  console.error('❌ Missing Sanity credentials in .env');
  process.exit(1);
}

if (!process.env.ASSEMBLYAI_API_KEY) {
  console.error('❌ Missing ASSEMBLYAI_API_KEY in .env');
  console.error('   Get your API key from: https://www.assemblyai.com/');
  process.exit(1);
}

/**
 * Get audio URL for episode
 */
function getAudioURL(episode) {
  if (episode.audioUrl) {
    return episode.audioUrl;
  }

  throw new Error(
    `No audio URL found for episode ${episode.episodeNumber}. ` +
    `Add an 'audioUrl' field to the episode in Sanity with the direct MP3 link.`
  );
}

/**
 * Transcribe audio using AssemblyAI with speaker diarization
 */
async function transcribeAudio(audioUrl, episodeNumber, episodeTitle) {
  console.log(`  🎙️  Transcribing with AssemblyAI (speaker diarization enabled)...`);

  try {
    // Submit transcription request
    const transcript = await assemblyai.transcripts.transcribe({
      audio_url: audioUrl,
      speaker_labels: true, // Enable speaker diarization
      language_code: 'en',
    });

    if (transcript.status === 'error') {
      throw new Error(transcript.error);
    }

    console.log(`  ✅ Transcription complete`);
    console.log(`  📊 Detected ${transcript.speakers || 1} speaker(s)`);

    // Format transcript with speaker labels
    const formattedTranscript = formatTranscriptWithSpeakers(transcript);

    return {
      text: formattedTranscript,
      rawText: transcript.text,
      duration: transcript.audio_duration,
      utterances: transcript.utterances || [],
      speakers: transcript.speakers || 1,
    };
  } catch (error) {
    console.error(`  ❌ Transcription failed:`, error.message);
    throw error;
  }
}

/**
 * Format transcript with speaker labels
 */
function formatTranscriptWithSpeakers(transcript) {
  if (!transcript.utterances || transcript.utterances.length === 0) {
    return transcript.text;
  }

  let formatted = '';
  let currentSpeaker = null;

  for (const utterance of transcript.utterances) {
    const speaker = utterance.speaker || 'Unknown';

    // Add speaker label when speaker changes
    if (speaker !== currentSpeaker) {
      formatted += `\n\n**Speaker ${speaker}:**\n`;
      currentSpeaker = speaker;
    }

    formatted += utterance.text + ' ';
  }

  return formatted.trim();
}

/**
 * Save transcript to Sanity
 */
async function saveTranscript(episodeId, transcript) {
  console.log(`  💾 Saving transcript to Sanity...`);

  // Convert utterances to a simpler format for Sanity
  const segments = transcript.utterances.map((utt) => ({
    speaker: `Speaker ${utt.speaker}`,
    start: utt.start / 1000, // Convert ms to seconds
    end: utt.end / 1000,
    text: utt.text,
  }));

  await sanity
    .patch(episodeId)
    .set({
      transcript: transcript.text,
      transcriptRaw: transcript.rawText, // Store raw text without speaker labels
      transcriptSegments: segments,
      transcriptDuration: transcript.duration,
      transcriptSpeakers: transcript.speakers,
      transcriptGeneratedAt: new Date().toISOString(),
    })
    .commit();

  console.log(`  ✅ Transcript saved`);
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
  const COST_PER_HOUR = 0.25; // $0.25/hour
  const episodesToTranscribe = episodes.filter((ep) => !ep.transcript);
  const totalHours = (episodesToTranscribe.length * avgDurationMinutes) / 60;
  const totalCost = totalHours * COST_PER_HOUR;

  return {
    episodeCount: episodesToTranscribe.length,
    estimatedHours: totalHours,
    estimatedCost: totalCost,
  };
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🎙️  Episode Transcript Generator (AssemblyAI)\n');

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
    console.log(`   Estimated hours: ${cost.estimatedHours.toFixed(1)}`);
    console.log(`   Estimated cost: $${cost.estimatedCost.toFixed(2)}\n`);

    // Confirm before proceeding
    if (cost.estimatedCost > 5) {
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

      try {
        // Get audio URL
        const audioUrl = getAudioURL(episode);
        console.log(`  🔗 Audio URL: ${audioUrl}`);

        // Transcribe with speaker diarization
        const transcript = await transcribeAudio(audioUrl, episode.episodeNumber, episode.title);

        // Save to Sanity
        await saveTranscript(episode._id, transcript);

        console.log(`  ✅ Episode ${episode.episodeNumber} complete (${transcript.speakers} speakers detected)`);
        successCount++;
      } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
        errors.push({ episode: episode.episodeNumber, error: error.message });
        errorCount++;
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
