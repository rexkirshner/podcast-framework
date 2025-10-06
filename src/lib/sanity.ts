import { createClient } from "@sanity/client";

// Create Sanity client
export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
  useCdn: true, // Use CDN for faster response times
  apiVersion: "2024-01-01", // Use current date for latest API features
});

// Validation - ensure env vars are set
if (!import.meta.env.PUBLIC_SANITY_PROJECT_ID) {
  throw new Error(
    "Missing PUBLIC_SANITY_PROJECT_ID environment variable. Copy .env.example to .env and add your Sanity project ID."
  );
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
  guests?: Guest[];
  spotifyEpisodeId?: string;
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
  spotifyShowId?: string;
  appleUrl?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
}

// Helper function to fetch all episodes
export async function getAllEpisodes(): Promise<Episode[]> {
  const query = `*[_type == "episode"] | order(episodeNumber desc) {
    _id,
    title,
    slug,
    episodeNumber,
    publishDate,
    duration,
    description,
    spotifyEpisodeId,
    "coverImage": coverImage.asset->{url},
    featured,
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

  return await sanityClient.fetch(query);
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
    "coverImage": coverImage.asset->{url},
    featured,
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

  return await sanityClient.fetch(query, { slug });
}

// Helper function to fetch featured episodes
export async function getFeaturedEpisodes(): Promise<Episode[]> {
  const query = `*[_type == "episode" && featured == true] | order(publishDate desc) {
    _id,
    title,
    slug,
    episodeNumber,
    publishDate,
    duration,
    description,
    spotifyEpisodeId,
    "coverImage": coverImage.asset->{url},
    featured,
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

  return await sanityClient.fetch(query);
}

// Helper function to fetch podcast metadata
export async function getPodcastInfo(): Promise<Podcast | null> {
  const query = `*[_type == "podcast"][0] {
    _id,
    name,
    tagline,
    description,
    isActive,
    "logo": logo.asset->{url},
    spotifyShowId,
    appleUrl,
    youtubeUrl,
    spotifyUrl
  }`;

  return await sanityClient.fetch(query);
}

// Helper function to get all guests
export async function getAllGuests(): Promise<Guest[]> {
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

  return await sanityClient.fetch(query);
}
