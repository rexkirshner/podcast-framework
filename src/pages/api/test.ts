import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  // Access environment variables from Cloudflare runtime
  const env = (locals as any).runtime?.env || import.meta.env;

  return new Response(
    JSON.stringify({
      message: "Test endpoint working",
      env: {
        hasSanityToken: !!env.SANITY_API_TOKEN,
        hasResendKey: !!env.RESEND_API_KEY,
        hasSanityProjectId: !!env.SANITY_PROJECT_ID,
        sanityProjectIdValue: env.SANITY_PROJECT_ID || "NOT_FOUND",
      }
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    return new Response(
      JSON.stringify({
        message: "Test POST working",
        received: data,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
