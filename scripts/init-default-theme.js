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

// Create default theme for Strange Water
async function initDefaultTheme() {
  console.log("🎨 Initializing default theme and homepage configuration...\n");

  // Check if theme already exists
  const existingTheme = await client.fetch(`*[_type == "theme"][0]`);

  if (existingTheme) {
    console.log("⚠️  Theme already exists. Updating existing theme...");

    // Update existing theme
    await client
      .patch(existingTheme._id)
      .set({
        name: 'Strange Water Default',
        isActive: true,
        colors: {
          primary: '#3B82F6',  // Blue
          secondary: '#8B5CF6', // Purple
          background: '#F9FAFB', // Light gray
          surface: '#FFFFFF',   // White
          text: '#111827',      // Dark gray
          textMuted: '#6B7280', // Medium gray
        },
        typography: {
          headingFont: 'Inter, system-ui, sans-serif',
          bodyFont: 'Inter, system-ui, sans-serif',
          googleFonts: ['Inter:400,500,600,700'],
        },
        layout: {
          maxWidth: 'max-w-7xl',
          borderRadius: 'rounded-lg',
        },
      })
      .commit();

    console.log("✅ Theme updated successfully!");
  } else {
    // Create new theme
    const theme = await client.create({
      _type: 'theme',
      name: 'Strange Water Default',
      isActive: true,
      colors: {
        primary: '#3B82F6',  // Blue
        secondary: '#8B5CF6', // Purple
        background: '#F9FAFB', // Light gray
        surface: '#FFFFFF',   // White
        text: '#111827',      // Dark gray
        textMuted: '#6B7280', // Medium gray
      },
      typography: {
        headingFont: 'Inter, system-ui, sans-serif',
        bodyFont: 'Inter, system-ui, sans-serif',
        googleFonts: ['Inter:400,500,600,700'],
      },
      layout: {
        maxWidth: 'max-w-7xl',
        borderRadius: 'rounded-lg',
      },
    });

    console.log("✅ Theme created successfully!");
    console.log(`   ID: ${theme._id}`);
  }

  // Check if homepage config already exists
  const existingConfig = await client.fetch(`*[_type == "homepageConfig"][0]`);

  if (existingConfig) {
    console.log("\n⚠️  Homepage configuration already exists. Updating...");

    // Update existing config
    await client
      .patch(existingConfig._id)
      .set({
        title: 'Default Homepage Configuration',
        isActive: true,
        hero: {
          enabled: true,
          style: 'full-image',
        },
        featuredEpisodes: {
          enabled: true,
          title: 'Featured Episodes',
          autoplay: true,
          interval: 6,
        },
        recentEpisodes: {
          enabled: true,
          title: 'Latest Episode',
          count: 1,
          layout: 'grid',
        },
        featuredGuests: {
          enabled: false,
          title: 'Featured Guests',
          count: 6,
        },
        subscribe: {
          enabled: false,
          title: 'Subscribe & Listen',
          style: 'buttons',
        },
        about: {
          enabled: true,
          title: 'About the Show',
        },
        newsletter: {
          enabled: false,
          title: 'Stay Updated',
        },
      })
      .commit();

    console.log("✅ Homepage configuration updated successfully!");
  } else {
    // Create new config
    const config = await client.create({
      _type: 'homepageConfig',
      title: 'Default Homepage Configuration',
      isActive: true,
      hero: {
        enabled: true,
        style: 'full-image',
      },
      featuredEpisodes: {
        enabled: true,
        title: 'Featured Episodes',
        autoplay: true,
        interval: 6,
      },
      recentEpisodes: {
        enabled: true,
        title: 'Latest Episode',
        count: 1,
        layout: 'grid',
      },
      featuredGuests: {
        enabled: false,
        title: 'Featured Guests',
        count: 6,
      },
      subscribe: {
        enabled: false,
        title: 'Subscribe & Listen',
        style: 'buttons',
      },
      about: {
        enabled: true,
        title: 'About the Show',
      },
      newsletter: {
        enabled: false,
        title: 'Stay Updated',
      },
    });

    console.log("\n✅ Homepage configuration created successfully!");
    console.log(`   ID: ${config._id}`);
  }

  console.log("\n🎉 Default theme and homepage configuration are ready!");
  console.log("   You can now customize colors and layout in Sanity Studio.");
  console.log("   Run 'npm run sanity' to open the studio.");
}

initDefaultTheme().catch(console.error);
