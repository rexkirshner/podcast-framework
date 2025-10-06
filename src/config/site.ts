// Site-wide configuration - will be enhanced with config files in Phase 1b
// For now, centralizes all podcast links and metadata

export const SITE_CONFIG = {
  name: "Strange Water",
  tagline: "Exploring Ethereum and Web3",
  description: "Conversations with builders, researchers, and visionaries shaping the future of decentralized technology.",
  url: "https://staging.strangewater.xyz",

  // Podcast platform links
  links: {
    spotify: "https://open.spotify.com/show/4orCXVK4dY6SOhA25obyMW",
    apple: "https://podcasts.apple.com/us/podcast/strange-water-podcast/id1679623838",
    youtube: "https://www.youtube.com/@StrangeH2OPod",
    rss: "https://anchor.fm/s/db8e8e8c/podcast/rss", // Update with real RSS if different
    patreon: "https://patreon.com/strangewater", // Update with real Patreon if exists
  },

  // Spotify show ID (for embeds)
  spotifyShowId: "4orCXVK4dY6SOhA25obyMW",

  // Contact
  email: "hello@strangewater.xyz",

  // Social media (optional - add as needed)
  social: {
    twitter: "", // Add if exists
    discord: "", // Add if exists
  }
} as const;
