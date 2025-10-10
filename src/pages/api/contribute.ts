import type { APIRoute } from 'astro';
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS } from '../../config/constants';
import { ContributionService } from '../../server/services/contribution-service';

// Note: Sentry disabled in Cloudflare Workers due to Node.js compatibility issues
// Errors will be logged to console and visible in Cloudflare Functions logs
function captureException(error: unknown, context?: any) {
  console.error('[API Error]', error, context);
}

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

// OPTIONS handler for CORS preflight
export const OPTIONS: APIRoute = async () => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": import.meta.env.ALLOWED_ORIGIN || "https://strangewater.xyz",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

// POST handler for contribution submissions
export const POST: APIRoute = async ({ request, clientAddress, locals }) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": import.meta.env.ALLOWED_ORIGIN || "https://strangewater.xyz",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  try {
    // Rate limiting
    const clientIP = clientAddress || "unknown";
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ message: "Too many submissions. Please try again later." }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await request.json();

    // Access environment variables from Cloudflare runtime
    // In Cloudflare Pages Functions, env vars are in locals.runtime.env
    const env = (locals as any).runtime?.env || import.meta.env;

    // Initialize contribution service (lazy initialization to avoid module-level errors)
    const contributionService = new ContributionService({
      sanityProjectId: env.SANITY_PROJECT_ID || "",
      sanityDataset: env.SANITY_DATASET || "production",
      sanityApiToken: env.SANITY_API_TOKEN || "",
      sanityApiVersion: "2024-01-01",
      resendApiKey: env.RESEND_API_KEY || "",
      resendFromEmail: env.RESEND_FROM_EMAIL || "contribution@noreply.strangewater.xyz",
      notificationEmail: env.NOTIFICATION_EMAIL || "swrequests@rexkirshner.com",
      studioUrl: env.STUDIO_URL || env.URL || "https://strangewater.xyz",
    });

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

      return new Response(
        JSON.stringify({ message: result.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Success
    return new Response(
      JSON.stringify({
        message: result.message,
        id: result.contributionId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const clientIP = clientAddress || "unknown";

    captureException(error, {
      level: 'error',
      tags: { function: 'contribute' },
      extra: {
        ip: clientIP,
      },
    });

    console.error("Contribution submission error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};
