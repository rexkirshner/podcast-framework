import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { createClient } from "@sanity/client";
import { Resend } from "resend";

// Initialize Sanity client
const sanityClient = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN, // Write token (not public)
  apiVersion: "2024-01-01",
  useCdn: false,
});

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting: In-memory store (resets on cold start - good enough for MVP)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // 5 submissions per hour per IP
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

// Check rate limit
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetAt) {
    // No record or expired - create new
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false; // Rate limit exceeded
  }

  // Increment count
  record.count++;
  return true;
}

// Main handler
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
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
        body: JSON.stringify({ message: "Success" }),
      };
    }

    // Rate limiting
    const clientIP = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "unknown";
    if (!checkRateLimit(clientIP)) {
      return {
        statusCode: 429,
        body: JSON.stringify({ message: "Too many submissions. Please try again later." }),
      };
    }

    // Validate required fields
    if (!data.contributionType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Contribution type is required" }),
      };
    }

    // Validate type-specific fields
    if (data.contributionType === "episode-idea") {
      if (!data.episodeTopic) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Episode topic is required" }),
        };
      }
    } else if (data.contributionType === "guest-recommendation") {
      if (!data.guestName) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Guest name is required" }),
        };
      }
    } else if (data.contributionType === "question") {
      if (!data.question) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Question is required" }),
        };
      }
    } else if (data.contributionType === "feedback") {
      if (!data.feedbackType || !data.feedbackContent) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Feedback type and content are required" }),
        };
      }
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
      const emailContent = generateEmailContent(data);

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "notifications@strangewater.xyz",
        to: process.env.NOTIFICATION_EMAIL || "rkirshner@gmail.com",
        subject: `[${getTypeLabel(data.contributionType)}] New Contribution`,
        html: emailContent,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the request if email fails - contribution is still saved
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Contribution submitted successfully",
        id: savedContribution._id,
      }),
    };
  } catch (error) {
    console.error("Contribution submission error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

// Helper: Generate email content
function generateEmailContent(data: any): string {
  const fromName = data.submitterName || "Anonymous";
  const fromEmail = data.submitterEmail || "No email provided";
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
      <p><strong>Topic:</strong> ${data.episodeTopic}</p>
      <p><strong>Description:</strong><br/>${data.episodeDescription}</p>
      ${data.episodeRationale ? `<p><strong>Why This Would Resonate:</strong><br/>${data.episodeRationale}</p>` : ""}
    `;
  } else if (data.contributionType === "guest-recommendation") {
    content += `
      <h3 style="color: #374151;">Guest Recommendation</h3>
      <p><strong>Name:</strong> ${data.guestName}</p>
      <p><strong>Background:</strong><br/>${data.guestBackground}</p>
      <p><strong>Why This Guest:</strong><br/>${data.guestRationale}</p>
      ${data.guestContact ? `<p><strong>Contact Info:</strong> ${data.guestContact}</p>` : ""}
    `;
  } else if (data.contributionType === "question") {
    content += `
      <h3 style="color: #374151;">Question</h3>
      <p><strong>Question:</strong><br/>${data.question}</p>
      ${data.questionContext ? `<p><strong>Context:</strong><br/>${data.questionContext}</p>` : ""}
    `;
  } else if (data.contributionType === "feedback") {
    content += `
      <h3 style="color: #374151;">Feedback</h3>
      <p><strong>Type:</strong> ${getFeedbackTypeLabel(data.feedbackType)}</p>
      <p><strong>Content:</strong><br/>${data.feedbackContent}</p>
    `;
  }

  content += `
      <hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="color: #6b7280; font-size: 14px;">
        <a href="https://strangewater.xyz/studio/structure/contribution" style="color: #00a3b5; text-decoration: none;">
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
    "episode-idea": "💡 Episode Idea",
    "guest-recommendation": "🎙️ Guest Recommendation",
    "question": "❓ Question",
    "feedback": "💬 Feedback",
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
