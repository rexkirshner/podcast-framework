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
  console.log("🎨 Updating theme to match old site (light, clean aesthetic)...\n");

  const theme = await client.fetch(`*[_type == "theme" && isActive == true][0]`);

  if (!theme) {
    console.error("❌ No active theme found.");
    process.exit(1);
  }

  // Light theme matching the old strangewater.xyz
  await client
    .patch(theme._id)
    .set({
      'colors.primary': '#00a3b5',      // Teal (brand color)
      'colors.secondary': '#67cccc',    // Light teal
      'colors.background': '#ffffff',   // Pure white
      'colors.surface': '#ffffff',      // White cards
      'colors.text': '#1a1a1a',         // Dark gray (not pure black)
      'colors.textMuted': '#666666',    // Medium gray
      'colors.headerBackground': '#000000', // Black header
      'colors.footerBackground': '#000000', // Black footer
    })
    .commit();

  console.log("✅ Theme updated to light, clean aesthetic!\n");
  console.log("Color scheme (matching old site):");
  console.log("  Primary:           #00a3b5 (Teal)");
  console.log("  Secondary:         #67cccc (Light Teal)");
  console.log("  Background:        #ffffff (White)");
  console.log("  Surface:           #ffffff (White cards)");
  console.log("  Text:              #1a1a1a (Dark gray)");
  console.log("  Muted Text:        #666666 (Medium gray)");
  console.log("  Header Background: #000000 (Black)");
  console.log("  Footer Background: #000000 (Black)");
  console.log("\n🔄 Refresh http://localhost:4321/ to see the changes!");
}

updateThemeColors().catch(console.error);
