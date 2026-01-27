import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Shared validation regexes
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Must be either: email@example.com or Name <email@example.com>
const FROM_EMAIL_REGEX =
  /^(?:[^<]+<)?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?:>)?$/;

// Rate limiting: Simple in-memory store
// In production, consider using Redis or Upstash for distributed rate limiting
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configuration
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (works with Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || realIp || "unknown";
  return ip;
}

function checkRateLimit(identifier: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, resetTime: entry.resetTime };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(identifier, entry);
  return { allowed: true };
}

// Clean up old entries on each request (more reliable in serverless environments)
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

function getFromEmail(): string | null {
  let fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!fromEmail) {
    // Default format: simple email address
    fromEmail = process.env.RESEND_DOMAIN
      ? `noreply@${process.env.RESEND_DOMAIN}`
      : "onboarding@resend.dev"; // Resend's test domain
  }

  // Normalize and validate format
  if (!FROM_EMAIL_REGEX.test(fromEmail)) {
    console.error("Invalid RESEND_FROM_EMAIL format:", fromEmail);
    return null;
  }

  // Extra safety: avoid accidentally using unverified *.resend.app domains
  const lower = fromEmail.toLowerCase();
  const match = lower.match(/<\s*([^>]+)\s*>/);
  const emailOnly = match ? match[1] : lower;
  const domain = emailOnly.split("@")[1] ?? "";

  if (domain.endsWith(".resend.app") && emailOnly !== "onboarding@resend.dev") {
    console.warn(
      "RESEND_FROM_EMAIL appears to use an unverified .resend.app domain. Falling back to onboarding@resend.dev."
    );
    return "onboarding@resend.dev";
  }

  return fromEmail;
}

function getRecipientEmail(): string | null {
  const recipientEmail = process.env.CONTACT_EMAIL || "nacka@moderaterna.se";

  if (!EMAIL_REGEX.test(recipientEmail)) {
    console.error("Invalid CONTACT_EMAIL:", recipientEmail);
    return null;
  }

  return recipientEmail;
}

export async function POST(request: NextRequest) {
  try {
    // Clean up expired rate limit entries
    cleanupExpiredEntries();

    // Rate limiting check
    const identifier = getClientIdentifier(request);
    const rateLimit = checkRateLimit(identifier);

    if (!rateLimit.allowed) {
      const resetTime = rateLimit.resetTime
        ? new Date(rateLimit.resetTime).toISOString()
        : undefined;
      return NextResponse.json(
        {
          error: "För många förfrågningar. Försök igen senare.",
          resetTime,
        },
        {
          status: 429,
          headers: {
            "Retry-After": "900", // 15 minutes in seconds
            "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const { name, email, phone, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Alla fält är obligatoriska" },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        { error: "Namnet måste vara minst 2 tecken" },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Meddelandet måste vara minst 10 tecken" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Ogiltig e-postadress" },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "E-posttjänsten är inte konfigurerad" },
        { status: 500 }
      );
    }

    const fromEmail = getFromEmail();
    if (!fromEmail) {
      return NextResponse.json(
        {
          error:
            "E-postkonfigurationen är ogiltig. Kontakta administratören.",
        },
        { status: 500 }
      );
    }

    const recipientEmail = getRecipientEmail();
    if (!recipientEmail) {
      return NextResponse.json(
        {
          error:
            "Mottagarens e-postadress är ogiltig. Kontakta administratören.",
        },
        { status: 500 }
      );
    }

    // Send email
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      replyTo: email,
      subject: `Nytt meddelande från ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            Nytt meddelande från kontaktformuläret
          </h2>
          <div style="margin: 20px 0;">
            <p><strong>Från:</strong> ${name}</p>
            <p><strong>E-post:</strong> ${email}</p>
            <p><strong>Telefon:</strong> ${phone}</p>
          </div>
          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #0066cc;">
            <p><strong>Meddelande:</strong></p>
            <p style="white-space: pre-wrap;">${message.replace(/\n/g, "<br>")}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Detta meddelande skickades via kontaktformuläret på nackamoderaterna.se
          </p>
        </div>
      `,
      text: `
Nytt meddelande från kontaktformuläret

Från: ${name}
E-post: ${email}
Telefon: ${phone}
Meddelande:
${message}

---
Detta meddelande skickades via kontaktformuläret på nackamoderaterna.se
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Kunde inte skicka e-post. Försök igen senare." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Meddelandet har skickats!",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Ett fel uppstod. Försök igen senare." },
      { status: 500 }
    );
  }
}
