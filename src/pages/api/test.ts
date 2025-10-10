import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      message: "Test endpoint working",
      env: {
        hasSanityToken: !!import.meta.env.SANITY_API_TOKEN,
        hasResendKey: !!import.meta.env.RESEND_API_KEY,
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
