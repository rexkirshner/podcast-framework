import 'dotenv/config';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

async function updateThemeColors() {
  console.log("🎨 Refining theme colors to match branding...\n");

  const theme = await client.fetch(`*[_type == "theme" && isActive == true][0]`);

  if (!theme) {
    console.error("❌ No active theme found.");
    process.exit(1);
  }

  // Better colors matching the logo's aesthetic
  await client
    .patch(theme._id)
    .set({
      'colors.primary': '#007a87',      // Teal (from waveform)
      'colors.secondary': '#00a3b5',    // Brighter teal (from waveform highlights)
      'colors.background': '#000000',   // Pure black (from logo)
      'colors.surface': '#1a1a1a',      // Dark gray (subtle, not muddy)
      'colors.text': '#ffffff',         // Pure white (from logo text)
      'colors.textMuted': '#a0a0a0',    // Lighter muted gray (better contrast)
    })
    .commit();

  console.log("✅ Theme colors refined!\n");
  console.log("Matching the logo aesthetic:");
  console.log("  Primary:         #007a87 (Teal - waveform)");
  console.log("  Secondary:       #00a3b5 (Bright Teal - highlights)");
  console.log("  Background:      #000000 (Pure Black - logo bg)");
  console.log("  Surface:         #1a1a1a (Subtle Dark Gray)");
  console.log("  Text:            #ffffff (Pure White - logo text)");
  console.log("  Muted Text:      #a0a0a0 (Light Gray - better contrast)");
  console.log("\n🔄 Refresh http://localhost:4321/ to see the changes!");
}

updateThemeColors().catch(console.error);
