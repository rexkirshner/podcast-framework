import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS } from "../../src/config/constants";
import { initSentry, captureException } from "../../src/lib/sentry";
import { NewsletterService } from "../../src/server/services/newsletter-service";

// Initialize Sentry for error monitoring
initSentry();

/**
 * Rate limiting: In-memory store
 * Same limitations as contribute function (acceptable for MVP)
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

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

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "https://strangewater.xyz",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Initialize newsletter service
const newsletterService = new NewsletterService({
  sanityProjectId: process.env.SANITY_PROJECT_ID || "",
  sanityDataset: process.env.SANITY_DATASET || "production",
  sanityApiVersion: "2024-01-01",
});

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

    // Rate limiting
    const clientIP = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "unknown";
    if (!checkRateLimit(clientIP)) {
      return {
        statusCode: 429,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Too many requests. Please try again later." }),
      };
    }

    // Call newsletter service
    const result = await newsletterService.subscribe({
      email: data.email,
      website: data.website,
    });

    // Handle service result
    if (!result.success) {
      // Determine HTTP status code based on error type
      let statusCode = 400; // Default to bad request

      if (result.message.includes("configuration error") ||
          result.message.includes("not currently available")) {
        statusCode = 500;
      }

      // Capture errors to Sentry (except validation errors)
      if (statusCode === 500 && result.error) {
        captureException(new Error(result.error), {
          tags: { function: 'newsletter-subscribe', service: 'convertkit' },
          extra: {
            message: result.message,
            email: data.email,
          },
          level: 'error',
        });
      }

      return {
        statusCode,
        headers: corsHeaders,
        body: JSON.stringify({ message: result.message }),
      };
    }

    // Success
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: result.message }),
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
