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
  console.log("🎨 Brightening theme for better contrast...\n");

  const theme = await client.fetch(`*[_type == "theme" && isActive == true][0]`);

  if (!theme) {
    console.error("❌ No active theme found.");
    process.exit(1);
  }

  // Brighter, more contrasting colors
  await client
    .patch(theme._id)
    .set({
      'colors.primary': '#00a3b5',      // Brighter teal (more vibrant)
      'colors.secondary': '#67cccc',    // Light teal (from logo highlights)
      'colors.background': '#0a0a0a',   // Very dark gray (not pure black)
      'colors.surface': '#1e1e1e',      // Medium dark gray (better separation)
      'colors.text': '#ffffff',         // Pure white
      'colors.textMuted': '#b0b0b0',    // Bright gray (better readability)
    })
    .commit();

  console.log("✅ Theme brightened for better contrast!\n");
  console.log("New color scheme:");
  console.log("  Primary:         #00a3b5 (Bright Teal)");
  console.log("  Secondary:       #67cccc (Light Teal)");
  console.log("  Background:      #0a0a0a (Very Dark Gray)");
  console.log("  Surface:         #1e1e1e (Medium Dark Gray)");
  console.log("  Text:            #ffffff (Pure White)");
  console.log("  Muted Text:      #b0b0b0 (Bright Gray)");
  console.log("\n🔄 Refresh http://localhost:4321/ to see the changes!");
}

updateThemeColors().catch(console.error);
