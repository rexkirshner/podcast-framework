import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'static', // SSG mode
  adapter: cloudflare({
    mode: 'directory', // Deploy to Cloudflare Pages
    functionPerRoute: false, // Use single _worker.js file
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://strangewater.xyz',
});
