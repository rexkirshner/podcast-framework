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
  console.log("🎨 Updating theme colors...\n");

  // Find the active theme
  const theme = await client.fetch(`*[_type == "theme" && isActive == true][0]`);

  if (!theme) {
    console.error("❌ No active theme found. Run 'npm run init:theme' first.");
    process.exit(1);
  }

  console.log(`Found active theme: ${theme.name} (${theme._id})\n`);

  // Update colors
  await client
    .patch(theme._id)
    .set({
      'colors.primary': '#007a87',
      'colors.secondary': '#67cccc',
      'colors.background': '#000000',
      'colors.surface': '#5f5f5f',
      'colors.text': '#ffffff',
      'colors.textMuted': '#b8b8b8',
    })
    .commit();

  console.log("✅ Theme colors updated successfully!\n");
  console.log("New color scheme:");
  console.log("  Primary:         #007a87 (Teal)");
  console.log("  Secondary:       #67cccc (Light Teal)");
  console.log("  Background:      #000000 (Black)");
  console.log("  Surface:         #5f5f5f (Gray)");
  console.log("  Text:            #ffffff (White)");
  console.log("  Muted Text:      #b8b8b8 (Light Gray)");
  console.log("\n🔄 Refresh http://localhost:4321/ to see the changes!");
}

updateThemeColors().catch(console.error);
