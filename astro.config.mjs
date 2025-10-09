// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
// import cloudflare from '@astrojs/cloudflare'; // Not needed for pure SSG deployment

// https://astro.build/config
export default defineConfig({
  site: 'https://strangewater.xyz',
  output: 'static', // Pure SSG mode - no adapter needed for Cloudflare Pages
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
