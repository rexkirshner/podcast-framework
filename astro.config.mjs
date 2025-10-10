// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://strangewater.xyz',
  output: 'server', // Server mode with prerendering for static pages
  adapter: cloudflare({ imageService: 'compile' }),
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
