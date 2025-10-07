import { createClient } from "@sanity/client";

// Validation - ensure env vars are set BEFORE creating client
if (!import.meta.env.PUBLIC_SANITY_PROJECT_ID) {
  throw new Error(
    "Missing PUBLIC_SANITY_PROJECT_ID environment variable. " +
    "Add PUBLIC_SANITY_PROJECT_ID to your environment variables (Netlify or .env file)."
  );
}

// Create Sanity client
export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
  useCdn: true, // Use CDN for faster response times
  apiVersion: "2024-01-01", // Use current date for latest API features
});

// ============================================================================
// Build-Time Cache
// ============================================================================
// During SSG builds, the same data is fetched hundreds of times across pages.
// This in-memory cache prevents redundant API calls during a single build.
// Cache is cleared between builds (serverless function instances).
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const buildCache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 60 * 1000; // 1 minute (enough for a build, not too stale)

/**
 * Cached fetch wrapper for build-time optimization
 * Only caches during SSG builds, not in dev or production runtime
 */
async function cachedFetch<T>(cacheKey: string, fetchFn: () => Promise<T>): Promise<T> {
  // Only use cache during builds (not dev server or client-side)
  const isBuild = import.meta.env.MODE === 'production';

  if (!isBuild) {
    return fetchFn();
  }

  const cached = buildCache.get(cacheKey);
  const now = Date.now();

  // Return cached data if fresh
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }

  // Fetch fresh data and cache it
  const data = await fetchFn();
  buildCache.set(cacheKey, { data, timestamp: now });

  return data;
}

// TypeScript types for our content
export interface Guest {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  bio?: string;
  photo?: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  twitter?: string;
  website?: string;
  linkedin?: string;
}

export interface Host {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  bio?: string;
  photo?: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  twitter?: string;
  website?: string;
  linkedin?: string;
}

export interface Episode {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  episodeNumber: number;
  publishDate: string;
  duration?: string;
  description: string;
  showNotes?: any[];
  hosts?: Host[];
  guests?: Guest[];
  spotifyEpisodeId?: string;
  spotifyLink?: string;
  youtubeLink?: string;
  applePodcastLink?: string;
  coverImage?: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  featured: boolean;
}

export interface Podcast {
  _id: string;
  name: string;
  tagline?: string;
  description?: string;
  isActive: boolean;
  logo?: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  favicon?: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  spotifyShowId?: string;
  appleUrl?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  rssUrl?: string;
  twitterUrl?: string;
  discordUrl?: string;
}

export interface HomepageConfig {
  _id: string;
  title: string;
  hero?: {
    enabled: boolean;
    style: string;
    customHeadline?: string;
    customDescription?: string;
  };
  featuredEpisodes?: {
    enabled: boolean;
    title: string;
    autoplay: boolean;
    interval: number;
  };
  recentEpisodes?: {
    enabled: boolean;
    title: string;
    count: number;
    layout: string;
  };
  featuredGuests?: {
    enabled: boolean;
    title: string;
    count: number;
  };
  subscribe?: {
    enabled: boolean;
    title: string;
    description?: string;
    style: string;
  };
  about?: {
    enabled: boolean;
    title: string;
    content?: string;
  };
  newsletter?: {
    enabled: boolean;
    title: string;
    description?: string;
    provider?: string;
    formUrl?: string;
  };
  customSections?: Array<{
    title: string;
    content: string;
    order: number;
  }>;
}

// Helper function to fetch all episodes
export async function getAllEpisodes(): Promise<Episode[]> {
  return cachedFetch('all-episodes', async () => {
    const query = `*[_type == "episode"] | order(episodeNumber desc) {
      _id,
      title,
      slug,
      episodeNumber,
      publishDate,
      duration,
      description,
      spotifyEpisodeId,
      spotifyLink,
      youtubeLink,
      applePodcastLink,
      "coverImage": coverImage.asset->{url},
      featured,
      "hosts": hosts[]->{
        _id,
        name,
        slug,
        bio,
        "photo": photo.asset->{url},
        twitter,
        website,
        linkedin
      },
      "guests": guests[]->{
        _id,
        name,
        slug,
        bio,
        "photo": photo.asset->{url},
        twitter,
        website,
        linkedin
      }
    }`;

    try {
      const episodes = await sanityClient.fetch(query);
      return episodes || [];
    } catch (error) {
      // TODO: Replace with Sentry.captureException(error, { extra: { context: 'episodes-fetch' } })
      console.error('Failed to fetch episodes from Sanity:', error);
      // Return empty array for graceful degradation
      return [];
    }
  });
}

// Helper function to fetch a single episode by slug
export async function getEpisodeBySlug(slug: string): Promise<Episode | null> {
  const query = `*[_type == "episode" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    episodeNumber,
    publishDate,
    duration,
    description,
    showNotes,
    spotifyEpisodeId,
    spotifyLink,
    youtubeLink,
    applePodcastLink,
    "coverImage": coverImage.asset->{url},
    featured,
    "hosts": hosts[]->{
      _id,
      name,
      slug,
      bio,
      "photo": photo.asset->{url},
      twitter,
      website,
      linkedin
    },
    "guests": guests[]->{
      _id,
      name,
      slug,
      bio,
      "photo": photo.asset->{url},
      twitter,
      website,
      linkedin
    }
  }`;

  try {
    const episode = await sanityClient.fetch(query, { slug });

    if (!episode) {
      console.warn(`Episode with slug "${slug}" not found in Sanity CMS.`);
      return null;
    }

    return episode;
  } catch (error) {
    // TODO: Replace with Sentry.captureException(error, { extra: { context: 'episode-fetch', slug } })
    console.error(`Failed to fetch episode with slug "${slug}" from Sanity:`, error);
    return null;
  }
}

// Helper function to fetch featured episodes
export async function getFeaturedEpisodes(): Promise<Episode[]> {
  return cachedFetch('featured-episodes', async () => {
    const query = `*[_type == "episode" && featured == true] | order(publishDate desc) {
      _id,
      title,
      slug,
      episodeNumber,
      publishDate,
      duration,
      description,
      spotifyEpisodeId,
      spotifyLink,
      youtubeLink,
      applePodcastLink,
      "coverImage": coverImage.asset->{url},
      featured,
      "hosts": hosts[]->{
        _id,
        name,
        slug,
        bio,
        "photo": photo.asset->{url},
        twitter,
        website,
        linkedin
      },
      "guests": guests[]->{
        _id,
        name,
        slug,
        bio,
        "photo": photo.asset->{url},
        twitter,
        website,
        linkedin
      }
    }`;

    try {
      const episodes = await sanityClient.fetch(query);
      return episodes || [];
    } catch (error) {
      // TODO: Replace with Sentry.captureException(error, { extra: { context: 'featured-episodes-fetch' } })
      console.error('Failed to fetch featured episodes from Sanity:', error);
      return [];
    }
  });
}

// Helper function to fetch podcast metadata
export async function getPodcastInfo(): Promise<Podcast | null> {
  return cachedFetch('podcast-info', async () => {
    const query = `*[_type == "podcast"][0] {
      _id,
      name,
      tagline,
      description,
      isActive,
      "logo": logo.asset->{url},
      "favicon": favicon.asset->{url},
      spotifyShowId,
      appleUrl,
      youtubeUrl,
      spotifyUrl,
      rssUrl,
      twitterUrl,
      discordUrl
    }`;

    try {
      const podcast = await sanityClient.fetch(query);

      if (!podcast) {
        console.warn('No podcast document found in Sanity CMS.');
        return null;
      }

      return podcast;
    } catch (error) {
      // TODO: Replace with Sentry.captureException(error, { extra: { context: 'podcast-info-fetch' } })
      console.error('Failed to fetch podcast info from Sanity:', error);
      return null;
    }
  });
}

// Helper function to get all guests
export async function getAllGuests(): Promise<Guest[]> {
  return cachedFetch('all-guests', async () => {
    const query = `*[_type == "guest"] | order(name asc) {
      _id,
      name,
      slug,
      bio,
      "photo": photo.asset->{url},
      twitter,
      website,
      linkedin
    }`;

    try {
      const guests = await sanityClient.fetch(query);
      return guests || [];
    } catch (error) {
      // TODO: Replace with Sentry.captureException(error, { extra: { context: 'guests-fetch' } })
      console.error('Failed to fetch guests from Sanity:', error);
      return [];
    }
  });
}

// Helper function to get homepage configuration
// Gets the active configuration, or falls back to the first one if none are active
export async function getHomepageConfig(): Promise<HomepageConfig | null> {
  const query = `*[_type == "homepageConfig" && isActive == true][0] {
    _id,
    title,
    hero,
    featuredEpisodes,
    recentEpisodes,
    featuredGuests,
    subscribe,
    about,
    newsletter,
    customSections
  }`;

  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Failed to fetch homepage config from Sanity:', error);
    return null;
  }
}
