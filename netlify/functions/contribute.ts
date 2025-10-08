import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS } from "../../src/config/constants";
import { initSentry, captureException } from "../../src/lib/sentry";
import { ContributionService } from "../../src/server/services/contribution-service";

// Initialize Sentry for error monitoring
initSentry();

/**
 * Rate limiting: In-memory store
 *
 * KNOWN LIMITATION (Acceptable for MVP):
 * - Resets on cold start (each new function instance = fresh rate limit)
 * - Not shared across function instances
 * - Ineffective during high traffic (multiple concurrent instances)
 *
 * FUTURE ENHANCEMENT:
 * - For production scale, consider:
 *   - Upstash Redis (serverless-friendly, free tier)
 *   - Netlify Blobs (simple key-value store)
 *   - DynamoDB (AWS) or Firestore (Google)
 *
 * CURRENT RATIONALE:
 * - MVP with low traffic expectations
 * - Honeypot provides primary spam protection
 * - Zero external dependencies/costs
 * - Good enough for launch
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetAt) {
    // No record or expired - create new
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // Rate limit exceeded
  }

  // Increment count
  record.count++;
  return true;
}

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "https://strangewater.xyz",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Initialize contribution service
const contributionService = new ContributionService({
  sanityProjectId: process.env.SANITY_PROJECT_ID || "",
  sanityDataset: process.env.SANITY_DATASET || "production",
  sanityApiToken: process.env.SANITY_API_TOKEN || "",
  sanityApiVersion: "2024-01-01",
  resendApiKey: process.env.RESEND_API_KEY || "",
  resendFromEmail: process.env.RESEND_FROM_EMAIL || "contribution@noreply.strangewater.xyz",
  notificationEmail: process.env.NOTIFICATION_EMAIL || "swrequests@rexkirshner.com",
  studioUrl: process.env.STUDIO_URL || process.env.URL || "https://strangewater.xyz",
});

// Main handler
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle OPTIONS preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "",
    };
  }

  // Only allow POST requests
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
        body: JSON.stringify({ message: "Too many submissions. Please try again later." }),
      };
    }

    // Call contribution service
    const result = await contributionService.submitContribution({
      contributionType: data.contributionType,
      submitterName: data.submitterName,
      submitterEmail: data.submitterEmail,
      website: data.website,
      episodeTopic: data.episodeTopic,
      episodeDescription: data.episodeDescription,
      episodeRationale: data.episodeRationale,
      guestName: data.guestName,
      guestBackground: data.guestBackground,
      guestRationale: data.guestRationale,
      guestContact: data.guestContact,
      question: data.question,
      questionContext: data.questionContext,
      feedbackType: data.feedbackType,
      feedbackContent: data.feedbackContent,
    });

    // Handle service result
    if (!result.success) {
      // Log service errors to Sentry
      if (result.error) {
        captureException(new Error(result.error), {
          tags: { function: 'contribute', operation: 'submit' },
          extra: {
            contributionType: data.contributionType,
            message: result.message,
          },
          level: 'error',
        });
      }

      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: result.message }),
      };
    }

    // Success
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: result.message,
        id: result.contributionId,
      }),
    };
  } catch (error) {
    const clientIP = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "unknown";

    captureException(error, {
      level: 'error',
      tags: { function: 'contribute' },
      extra: {
        ip: clientIP,
        hasBody: !!event.body,
      },
    });

    console.error("Contribution submission error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
