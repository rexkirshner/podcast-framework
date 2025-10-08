// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://strangewater.xyz',
  integrations: [sitemap()],
  image: {
    // Enable image optimization with Sharp (already installed)
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false, // Allow large images from Sanity
      }
    },
    // Generate modern image formats
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      }
    ],
  },
  vite: {
    plugins: [tailwindcss()]
  }
});