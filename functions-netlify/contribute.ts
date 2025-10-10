/**
 * Cloudflare Workers function: Contribute
 *
 * This is the Cloudflare Workers version of the contribution handler.
 * Uses the same business logic from ContributionService, just with Cloudflare-specific HTTP handling.
 */

import { CloudflareAdapter, type CloudflareEnv } from '../src/server/adapters/cloudflare-adapter';
import { ContributionService } from '../src/server/services/contribution-service';
import { initSentry, captureException } from '../src/lib/sentry';

// Initialize Sentry
initSentry();

export const onRequest: PagesFunction<CloudflareEnv> = async (context) => {
  const { request, env } = context;

  // Initialize adapter
  const adapter = new CloudflareAdapter(
    env.ALLOWED_ORIGIN || 'https://strangewater.xyz',
    env.UPSTASH_REDIS_REST_URL,
    env.UPSTASH_REDIS_REST_TOKEN,
    5, // max requests
    60000 // 1 minute window
  );

  const corsHeaders = adapter.getCorsHeaders();

  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ message: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Parse request
    const universalReq = adapter.parseRequest(request);
    const body = await request.text();
    const data = JSON.parse(body || '{}');

    // Rate limiting
    const rateLimiter = adapter.getRateLimiter();
    const allowed = await rateLimiter.checkRateLimit(universalReq.clientIp);

    if (!allowed) {
      return new Response(
        JSON.stringify({ message: 'Too many submissions. Please try again later.' }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize contribution service
    const contributionService = new ContributionService({
      sanityProjectId: env.SANITY_PROJECT_ID,
      sanityDataset: env.SANITY_DATASET,
      sanityApiToken: env.SANITY_API_TOKEN,
      sanityApiVersion: '2024-01-01',
      resendApiKey: env.RESEND_API_KEY,
      resendFromEmail: env.RESEND_FROM_EMAIL,
      notificationEmail: env.NOTIFICATION_EMAIL,
      studioUrl: env.STUDIO_URL || 'https://strangewater.xyz',
    });

    // Call service
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

    // Handle result
    if (!result.success) {
      // Log service errors to Sentry
      if (result.error) {
        captureException(new Error(result.error), {
          tags: { function: 'contribute', operation: 'submit', platform: 'cloudflare' },
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
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    captureException(error, {
      level: 'error',
      tags: { function: 'contribute', platform: 'cloudflare' },
      extra: {
        hasBody: !!request.body,
      },
    });

    console.error('Contribution submission error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};
