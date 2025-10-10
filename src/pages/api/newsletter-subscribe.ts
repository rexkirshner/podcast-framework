import type { APIRoute } from 'astro';
import { getServiceConfig, getClientIP, logError } from '../../lib/hosting-adapter';
import { NewsletterService } from '../../server/services/newsletter-service';
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS } from '../../config/constants';

// Rate limiting store (resets on cold start - acceptable for MVP)
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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

export const POST: APIRoute = async (context) => {
  const { request } = context;

  try {
    // Platform-agnostic IP detection for rate limiting
    const clientIP = getClientIP(context);
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ message: "Too many submissions. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await request.json();

    // Get service configuration using hosting adapter
    const config = getServiceConfig(context);

    // Lazy initialization inside request handler (Cloudflare Workers compatible)
    const newsletterService = new NewsletterService({
      sanityProjectId: config.sanity.projectId || "",
      sanityDataset: config.sanity.dataset || "production",
      sanityApiToken: config.sanity.apiToken || "",
      sanityApiVersion: config.sanity.apiVersion,
    });

    const result = await newsletterService.subscribe({
      email: data.email,
      website: data.website, // honeypot field
    });

    if (!result.success) {
      logError(new Error(result.error), {
        function: 'newsletter-subscribe',
        email: data.email,
      }, context);

      return new Response(
        JSON.stringify({ message: result.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: result.message }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), {
      function: 'newsletter-subscribe',
    }, context);

    return new Response(
      JSON.stringify({ message: "An error occurred while processing your request." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};
