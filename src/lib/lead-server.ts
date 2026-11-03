// Server-only integration. Never import this module from a client component.
import { createHash } from "node:crypto";
import { z } from "zod";
import { business } from "../config/business";
import { leadConsent, leadRequestSchema, type Lead } from "./lead-validation";
export type LeadSettings = {
  enabled: boolean;
  apiKey: string;
  from: string;
  inbox: string;
  siteKey: string;
  challengeSecret: string;
  origin: string;
};
export function leadSettings(): LeadSettings {
  return {
    enabled: process.env.LEAD_FORM_ENABLED === "true",
    apiKey: process.env.RESEND_API_KEY || "",
    from: process.env.LEAD_FROM_EMAIL || "",
    inbox: process.env.LEAD_NOTIFICATION_EMAIL || business.email,
    siteKey: process.env.TURNSTILE_SITE_KEY || "",
    challengeSecret: process.env.TURNSTILE_SECRET_KEY || "",
    origin: process.env.LEAD_SITE_ORIGIN || business.domain,
  };
}
export function configured(s: LeadSettings) {
  try {
    const origin = new URL(s.origin);
    return (
      s.enabled &&
      !!s.apiKey &&
      z.email().safeParse(s.from).success &&
      z.email().safeParse(s.inbox).success &&
      !!s.siteKey &&
      !!s.challengeSecret &&
      ["http:", "https:"].includes(origin.protocol) &&
      origin.origin === s.origin &&
      !(
        process.env.NODE_ENV === "production" && /^[123]x000000/.test(s.siteKey)
      )
    );
  } catch {
    return false;
  }
}
const headers = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json",
};
function response(status: number, message: string, extra: object = {}) {
  return Response.json({ message, ...extra }, { status, headers });
}
export function leadEmails(lead: Lead, s: LeadSettings, requestId: string) {
  return [
    {
      from: `${business.name} <${s.from}>`,
      to: [s.inbox],
      reply_to: lead.email,
      subject: "New Aurix travel enquiry",
      text: [
        `Travel enquiry ${requestId}`,
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        `Phone: ${lead.phone || "Not provided"}`,
        `Preferred contact: ${lead.preference}`,
        `Destination: ${lead.destination || "To be discussed"}`,
        "",
        `Consent (enquiry-v1): ${leadConsent}`,
        "Consent was actively checked. This is an enquiry, not a confirmed booking.",
      ].join("\n"),
    },
    {
      from: `${business.name} <${s.from}>`,
      to: [lead.email],
      reply_to: s.inbox,
      subject: "Your Aurix Travels enquiry",
      text: `Hello,\n\nThank you for contacting ${business.name}. Your travel enquiry has been received for follow-up. Our team will contact you using your selected method. You can reply to this email to reach us.\n\nThis is an enquiry acknowledgement, not a booking confirmation. We do not request passport or payment-card details through this form.\n\nReference: ${requestId}\n\nIf you did not request this message, no action is needed. You can contact ${s.inbox} to report it. You have not been added to a marketing list.\n\n${business.name}\n${business.domain}`,
    },
  ];
}
// Supplementary per-instance limits; Turnstile is mandatory. Configure hosting/provider
// quotas or a shared limiter for larger deployments. Raw IPs/emails are not retained.
export function createLeadLimiter() {
  const entries = new Map<string, { count: number; until: number }>();
  return (value: string, limit: number, window: number, now = Date.now()) => {
    const key = createHash("sha256").update(value).digest("hex");
    for (const [k, v] of entries) if (v.until <= now) entries.delete(k);
    const entry = entries.get(key);
    if (entry && entry.count >= limit) return false;
    if (entry) entry.count++;
    else {
      if (entries.size >= 10000) entries.delete(entries.keys().next().value!);
      entries.set(key, { count: 1, until: now + window });
    }
    return true;
  };
}
async function boundedJson(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new Error("type");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("json");
  let size = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 8192) {
      await reader.cancel();
      throw new Error("size");
    }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
export function createLeadHandler({
  settings = leadSettings,
  fetcher = fetch,
  limit = createLeadLimiter(),
}: {
  settings?: () => LeadSettings;
  fetcher?: typeof fetch;
  limit?: ReturnType<typeof createLeadLimiter>;
} = {}) {
  return async function handle(request: Request) {
    const s = settings();
    if (!configured(s))
      return response(
        503,
        "Online requests are unavailable right now. Please contact us by email.",
      );
    if (request.headers.get("origin") !== s.origin)
      return response(403, "Please submit this request from our website.");
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (!limit(`ip:${ip}`, 10, 60000))
      return response(
        429,
        "Please wait before trying again, or contact us by email.",
      );
    let raw: unknown;
    try {
      raw = await boundedJson(request);
    } catch {
      return response(400, "Please send a valid enquiry using the form.");
    }
    const parsed = leadRequestSchema.safeParse(raw);
    if (!parsed.success)
      return response(
        400,
        "Please check your details and consent before sending.",
      );
    const { requestId, token, ...lead } = parsed.data;
    try {
      const verification = await fetcher(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret: s.challengeSecret, response: token }),
          signal: AbortSignal.timeout(10000),
        },
      );
      if (!verification.ok)
        return response(
          503,
          "The security check is temporarily unavailable. Please retry or email us.",
        );
      const result = await verification.json();
      if (
        result.success !== true ||
        result.hostname !== new URL(s.origin).hostname ||
        result.action !== "travel-enquiry"
      )
        return response(400, "Please complete the security check again.");
      if (!limit(`email:${lead.email.toLowerCase()}`, 3, 3600000))
        return response(
          429,
          "Please wait before sending another request, or email our team.",
        );
      const sent = await fetcher("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${s.apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `aurix-enquiry/${requestId}`,
          "x-batch-validation": "strict",
        },
        body: JSON.stringify(leadEmails(lead, s, requestId)),
        signal: AbortSignal.timeout(10000),
      });
      if (!sent.ok)
        return response(
          502,
          "We could not confirm that your request was accepted. Please retry or email us.",
        );
      const receipt = await sent.json();
      if (
        !Array.isArray(receipt.data) ||
        receipt.data.length !== 2 ||
        !receipt.data.every(
          (item: { id?: unknown }) => typeof item?.id === "string" && item.id,
        ) ||
        receipt.errors?.length
      )
        return response(
          502,
          "We could not confirm both emails. Please contact our team by email.",
        );
      return response(
        202,
        "Your request is on its way to our team. Check your inbox for an acknowledgement. This is not a confirmed booking.",
        { reference: requestId },
      );
    } catch {
      return response(
        503,
        "We could not confirm that your request was accepted. Please retry or contact us by email.",
      );
    }
  };
}
