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
  console.log("🎨 Adding header and footer text colors...\n");

  const theme = await client.fetch(`*[_type == "theme" && isActive == true][0]`);

  if (!theme) {
    console.error("❌ No active theme found.");
    process.exit(1);
  }

  // Add white text for header and footer
  await client
    .patch(theme._id)
    .set({
      'colors.headerText': '#ffffff',   // White text for black header
      'colors.footerText': '#ffffff',   // White text for black footer
    })
    .commit();

  console.log("✅ Header and footer text colors updated!\n");
  console.log("New colors:");
  console.log("  Header Text:  #ffffff (White)");
  console.log("  Footer Text:  #ffffff (White)");
  console.log("\n🔄 Refresh http://localhost:4321/ to see the changes!");
}

updateThemeColors().catch(console.error);
