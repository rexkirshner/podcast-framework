import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { createClient } from "@sanity/client";
import { Resend } from "resend";
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS, MAX_FIELD_LENGTHS } from "../../src/config/constants";
import { initSentry, captureException } from "../../src/lib/sentry";

/**
 * Simple HTML entity encoding for serverless environment
 * Prevents XSS in email content without requiring DOM libraries
 */
function escapeHTML(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br/>');
}

// Initialize Sentry for error monitoring
initSentry();

// Initialize Sanity client
// Note: Use SANITY_* (not PUBLIC_*) for server-side/Netlify Functions
// PUBLIC_* prefix is only for Astro client-side code
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "",
  dataset: process.env.SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN, // Write token (not public)
  apiVersion: "2024-01-01",
  useCdn: false,
});

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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

// Check rate limit
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

// Validate field length
function validateFieldLength(value: string | undefined, fieldName: string, maxLength: number): string | null {
  if (!value) return null;

  if (value.length > maxLength) {
    return `${fieldName} must be under ${maxLength} characters (currently ${value.length})`;
  }

  return null;
}

// Validate email format (basic)
function validateEmail(email: string | undefined): boolean {
  if (!email) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "https://strangewater.xyz",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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
    // Parse request body
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
        body: JSON.stringify({ message: "Too many submissions. Please try again later." }),
      };
    }

    // Validate required fields
    if (!data.contributionType) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Please select a contribution type to continue." }),
      };
    }

    // Validate type-specific fields
    if (data.contributionType === "episode-idea") {
      if (!data.episodeTopic) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ message: "Please provide an episode topic for your idea." }),
        };
      }
    } else if (data.contributionType === "guest-recommendation") {
      if (!data.guestName) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ message: "Please provide the guest's name." }),
        };
      }
    } else if (data.contributionType === "question") {
      if (!data.question) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ message: "Please enter your question." }),
        };
      }
    } else if (data.contributionType === "feedback") {
      if (!data.feedbackType || !data.feedbackContent) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ message: "Please select a feedback type and share your thoughts." }),
        };
      }
    }

    // Validate email format
    if (!validateEmail(data.submitterEmail)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Please provide a valid email address." }),
      };
    }

    // Validate field lengths
    const lengthValidations = [
      validateFieldLength(data.episodeTopic, "Episode topic", MAX_FIELD_LENGTHS.episodeTopic),
      validateFieldLength(data.episodeDescription, "Episode description", MAX_FIELD_LENGTHS.episodeDescription),
      validateFieldLength(data.episodeRationale, "Episode rationale", MAX_FIELD_LENGTHS.episodeRationale),
      validateFieldLength(data.guestName, "Guest name", MAX_FIELD_LENGTHS.guestName),
      validateFieldLength(data.guestBackground, "Guest background", MAX_FIELD_LENGTHS.guestBackground),
      validateFieldLength(data.guestRationale, "Guest rationale", MAX_FIELD_LENGTHS.guestRationale),
      validateFieldLength(data.guestContact, "Guest contact", MAX_FIELD_LENGTHS.guestContact),
      validateFieldLength(data.question, "Question", MAX_FIELD_LENGTHS.question),
      validateFieldLength(data.questionContext, "Question context", MAX_FIELD_LENGTHS.questionContext),
      validateFieldLength(data.feedbackContent, "Feedback content", MAX_FIELD_LENGTHS.feedbackContent),
      validateFieldLength(data.submitterName, "Name", MAX_FIELD_LENGTHS.submitterName),
      validateFieldLength(data.submitterEmail, "Email", MAX_FIELD_LENGTHS.submitterEmail),
    ];

    const validationError = lengthValidations.find(error => error !== null);
    if (validationError) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: validationError }),
      };
    }

    // Create document in Sanity
    const contribution = {
      _type: "contribution",
      contributionType: data.contributionType,
      submitterName: data.submitterName || null,
      submitterEmail: data.submitterEmail || null,
      status: "new",
      submittedAt: new Date().toISOString(),

      // Episode idea fields
      ...(data.contributionType === "episode-idea" && {
        episodeTopic: data.episodeTopic,
        episodeDescription: data.episodeDescription,
        episodeRationale: data.episodeRationale || null,
      }),

      // Guest recommendation fields
      ...(data.contributionType === "guest-recommendation" && {
        guestName: data.guestName,
        guestBackground: data.guestBackground,
        guestRationale: data.guestRationale,
        guestContact: data.guestContact || null,
      }),

      // Question fields
      ...(data.contributionType === "question" && {
        question: data.question,
        questionContext: data.questionContext || null,
      }),

      // Feedback fields
      ...(data.contributionType === "feedback" && {
        feedbackType: data.feedbackType,
        feedbackContent: data.feedbackContent,
      }),
    };

    // Save to Sanity
    const savedContribution = await sanityClient.create(contribution);

    // Send email notification via Resend
    try {
      // TODO: Replace console.log with structured logging when adding Sentry
      // Example: logger.info('email.attempt', { contributionType: data.contributionType, ip: clientIP });
      console.log("Attempting to send email...");
      console.log("RESEND_API_KEY present:", !!process.env.RESEND_API_KEY);
      console.log("From:", process.env.RESEND_FROM_EMAIL);
      console.log("To:", process.env.NOTIFICATION_EMAIL);

      const emailContent = generateEmailContent(data);

      const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "contribution@noreply.strangewater.xyz",
        to: process.env.NOTIFICATION_EMAIL || "swrequests@rexkirshner.com",
        subject: `[${getTypeLabel(data.contributionType)}] New Contribution`,
        html: emailContent,
      });

      // TODO: Replace with structured success logging
      // Example: logger.info('email.sent', { contributionId: savedContribution._id, messageId: result.id });
      console.log("Email sent successfully:", result);
    } catch (emailError) {
      captureException(emailError, {
        tags: { function: 'contribute', operation: 'send-email' },
        extra: {
          contributionId: savedContribution._id,
          contributionType: data.contributionType,
          hasResendKey: !!process.env.RESEND_API_KEY,
        },
        level: 'error',
      });
      console.error("Email sending failed:", emailError);
      // Don't fail the request if email fails - contribution is still saved
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Contribution submitted successfully",
        id: savedContribution._id,
      }),
    };
  } catch (error) {
    const clientIP = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "unknown";
    const data = JSON.parse(event.body || "{}");

    captureException(error, {
      level: 'error',
      tags: { function: 'contribute' },
      extra: {
        contributionType: data?.contributionType,
        ip: clientIP,
        hasSubmitterEmail: !!data?.submitterEmail,
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

// Helper: Generate email content
function generateEmailContent(data: any): string {
  // Escape all user inputs to prevent XSS in email
  const fromName = escapeHTML(data.submitterName || "Anonymous");
  const fromEmail = escapeHTML(data.submitterEmail || "No email provided");
  const typeLabel = getTypeLabel(data.contributionType);

  let content = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #00a3b5;">New Contribution: ${typeLabel}</h2>
      <p><strong>From:</strong> ${fromName} (${fromEmail})</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      <hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
  `;

  if (data.contributionType === "episode-idea") {
    content += `
      <h3 style="color: #374151;">Episode Idea</h3>
      <p><strong>Topic:</strong> ${escapeHTML(data.episodeTopic)}</p>
      <p><strong>Description:</strong><br/>${escapeHTML(data.episodeDescription || "")}</p>
      ${data.episodeRationale ? `<p><strong>Why This Would Resonate:</strong><br/>${escapeHTML(data.episodeRationale)}</p>` : ""}
    `;
  } else if (data.contributionType === "guest-recommendation") {
    content += `
      <h3 style="color: #374151;">Guest Recommendation</h3>
      <p><strong>Name:</strong> ${escapeHTML(data.guestName)}</p>
      <p><strong>Background:</strong><br/>${escapeHTML(data.guestBackground || "")}</p>
      <p><strong>Why This Guest:</strong><br/>${escapeHTML(data.guestRationale || "")}</p>
      ${data.guestContact ? `<p><strong>Contact Info:</strong> ${escapeHTML(data.guestContact)}</p>` : ""}
    `;
  } else if (data.contributionType === "question") {
    content += `
      <h3 style="color: #374151;">Question</h3>
      <p><strong>Question:</strong><br/>${escapeHTML(data.question)}</p>
      ${data.questionContext ? `<p><strong>Context:</strong><br/>${escapeHTML(data.questionContext)}</p>` : ""}
    `;
  } else if (data.contributionType === "feedback") {
    content += `
      <h3 style="color: #374151;">Feedback</h3>
      <p><strong>Type:</strong> ${getFeedbackTypeLabel(data.feedbackType)}</p>
      <p><strong>Content:</strong><br/>${escapeHTML(data.feedbackContent)}</p>
    `;
  }

  const studioUrl = process.env.STUDIO_URL || process.env.URL || "https://strangewater.xyz";
  content += `
      <hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="color: #6b7280; font-size: 14px;">
        <a href="${studioUrl}/studio/structure/contribution" style="color: #00a3b5; text-decoration: none;">
          View in Sanity Studio →
        </a>
      </p>
    </div>
  `;

  return content;
}

// Helper: Get type label
function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    "episode-idea": "Episode Idea",
    "guest-recommendation": "Guest Recommendation",
    "question": "Question",
    "feedback": "Feedback",
  };
  return labels[type] || type;
}

// Helper: Get feedback type label
function getFeedbackTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    feedback: "Feedback",
    suggestion: "Suggestion",
    bug: "Issue/Bug Report",
  };
  return labels[type] || type;
}
