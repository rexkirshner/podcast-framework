import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { createClient } from "@sanity/client";
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS } from "../../src/config/constants";
import { initSentry, captureException } from "../../src/lib/sentry";

// Initialize Sentry for error monitoring
initSentry();

// Initialize Sanity client to fetch podcast config
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true, // Read-only, can use CDN
});

/**
 * Rate limiting: In-memory store
 * Same limitations as contribute function (acceptable for MVP)
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Runtime caching for podcast config
 * TTL: 5 minutes (prevents excessive Sanity API calls)
 */
interface CachedPodcastConfig {
  data: any;
  timestamp: number;
}

let cachedPodcastConfig: CachedPodcastConfig | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getPodcastConfig() {
  const now = Date.now();

  if (cachedPodcastConfig && (now - cachedPodcastConfig.timestamp) < CACHE_TTL) {
    return cachedPodcastConfig.data;
  }

  const podcast = await sanityClient.fetch(`*[_type == "podcast"][0]`);
  cachedPodcastConfig = {
    data: podcast,
    timestamp: now
  };

  return podcast;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "https://strangewater.xyz",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle OPTIONS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "",
    };
  }

  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    // Honeypot check (spam protection)
    if (data.website) {
      // Bot detected - return success to avoid revealing honeypot
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Success" }),
      };
    }

    // Rate limiting
    const clientIP = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "unknown";
    if (!checkRateLimit(clientIP)) {
      return {
        statusCode: 429,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Too many requests. Please try again later." }),
      };
    }

    // Validate email
    const { email } = data;
    if (!email || !validateEmail(email)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Please provide a valid email address." }),
      };
    }

    // Fetch podcast config from Sanity (cached)
    const podcast = await getPodcastConfig();

    if (!podcast) {
      console.error("No podcast configuration found");
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Newsletter configuration error." }),
      };
    }

    // Check if newsletter is enabled
    if (!podcast.newsletterEnabled) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Newsletter signup is not currently available." }),
      };
    }

    // Check if podcast is active
    if (!podcast.isActive) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Newsletter signup is not currently available." }),
      };
    }

    // Validate ConvertKit credentials
    const { convertKitApiKey, convertKitFormId } = podcast;
    if (!convertKitApiKey || !convertKitFormId) {
      console.error("ConvertKit credentials missing in Sanity");
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Newsletter configuration error." }),
      };
    }

    // Subscribe to ConvertKit
    const convertKitResponse = await fetch(
      `https://api.convertkit.com/v3/forms/${convertKitFormId}/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_secret: convertKitApiKey,
          email: email,
        }),
      }
    );

    if (!convertKitResponse.ok) {
      const errorText = await convertKitResponse.text();

      // Capture non-400 errors (400 is expected for invalid/duplicate emails)
      if (convertKitResponse.status !== 400) {
        captureException(new Error(`ConvertKit API error: ${convertKitResponse.status}`), {
          tags: { function: 'newsletter-subscribe', service: 'convertkit' },
          extra: {
            status: convertKitResponse.status,
            error: errorText,
            email: email,
            formId: podcast.convertKitFormId,
          },
          level: 'error',
        });
      }

      console.error("ConvertKit API error:", convertKitResponse.status, errorText);

      // Handle specific ConvertKit errors
      if (convertKitResponse.status === 400) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ message: "Invalid email address or already subscribed." }),
        };
      }

      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Unable to process subscription. Please try again later." }),
      };
    }

    const result = await convertKitResponse.json();
    console.log("ConvertKit subscription successful:", result);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Success! Check your email to confirm your subscription.",
      }),
    };
  } catch (error) {
    const clientIP = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "unknown";

    captureException(error, {
      level: 'error',
      tags: { function: 'newsletter-subscribe' },
      extra: {
        ip: clientIP,
        hasBody: !!event.body,
      },
    });

    console.error("Newsletter subscription error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
