import type { APIRoute } from 'astro';
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS } from '../../config/constants';
import { ContributionService } from '../../server/services/contribution-service';
import { getServiceConfig, getClientIP, logError } from '../../lib/hosting-adapter';

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
export const POST: APIRoute = async (context) => {
  const { request } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": import.meta.env.ALLOWED_ORIGIN || "https://strangewater.xyz",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  try {
    // Rate limiting (using platform-agnostic IP detection)
    const clientIP = getClientIP(context);
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

    // Get service configuration using hosting adapter
    const config = getServiceConfig(context);

    // Initialize contribution service (lazy initialization to avoid module-level errors)
    const contributionService = new ContributionService({
      sanityProjectId: config.sanity.projectId || "",
      sanityDataset: config.sanity.dataset || "production",
      sanityApiToken: config.sanity.apiToken || "",
      sanityApiVersion: config.sanity.apiVersion,
      resendApiKey: config.email.resendApiKey || "",
      resendFromEmail: config.email.fromEmail,
      notificationEmail: config.email.notificationEmail,
      studioUrl: import.meta.env.STUDIO_URL || import.meta.env.URL || "https://strangewater.xyz",
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
      // Log service errors
      if (result.error) {
        logError(new Error(result.error), {
          function: 'contribute',
          operation: 'submit',
          contributionType: data.contributionType,
          message: result.message,
        }, context);
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
    logError(error, {
      function: 'contribute',
      ip: getClientIP(context),
    }, context);

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
