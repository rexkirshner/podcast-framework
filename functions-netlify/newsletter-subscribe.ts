/**
 * Cloudflare Workers function: Newsletter Subscribe
 *
 * This is the Cloudflare Workers version of the newsletter subscription handler.
 * Uses the same business logic from NewsletterService, just with Cloudflare-specific HTTP handling.
 */

import { CloudflareAdapter, type CloudflareEnv } from '../src/server/adapters/cloudflare-adapter';
import { NewsletterService } from '../src/server/services/newsletter-service';
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
        JSON.stringify({ message: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize newsletter service
    const newsletterService = new NewsletterService({
      sanityProjectId: env.SANITY_PROJECT_ID,
      sanityDataset: env.SANITY_DATASET,
      sanityApiVersion: '2024-01-01',
    });

    // Call service
    const result = await newsletterService.subscribe({
      email: data.email,
      website: data.website,
    });

    // Handle result
    if (!result.success) {
      let statusCode = 400;

      if (result.message.includes('configuration error') ||
          result.message.includes('not currently available')) {
        statusCode = 500;
      }

      // Capture errors to Sentry (except validation errors)
      if (statusCode === 500 && result.error) {
        captureException(new Error(result.error), {
          tags: { function: 'newsletter-subscribe', service: 'convertkit', platform: 'cloudflare' },
          extra: {
            message: result.message,
            email: data.email,
          },
          level: 'error',
        });
      }

      return new Response(
        JSON.stringify({ message: result.message }),
        {
          status: statusCode,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Success
    return new Response(
      JSON.stringify({ message: result.message }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    captureException(error, {
      level: 'error',
      tags: { function: 'newsletter-subscribe', platform: 'cloudflare' },
      extra: {
        hasBody: !!request.body,
      },
    });

    console.error('Newsletter subscription error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};
