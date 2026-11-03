import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createLeadHandler,
  createLeadLimiter,
  leadEmails,
  type LeadSettings,
} from "./lead-server";
import { leadSchema, leadConsent } from "./lead-validation";
const settings: LeadSettings = {
  enabled: true,
  apiKey: "test-only-key",
  from: "enquiries@example.com",
  inbox: "owner@example.com",
  siteKey: "configured-public-site-key",
  challengeSecret: "test-only-secret",
  origin: "https://example.com",
};
const lead = {
  name: "Test Traveller",
  email: "traveller@example.com",
  phone: "",
  preference: "Email" as const,
  destination: "Dubai",
  consent: true,
  website: "",
};
const payload = {
  ...lead,
  requestId: "a90aa0b0-f645-4218-9c75-01a157125971",
  token: "synthetic-token",
};
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
const request = (body: unknown = payload, origin = settings.origin) =>
  new Request("https://example.com/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin },
    body: JSON.stringify(body),
  });
function fakeSend(
  overrides: {
    verification?: unknown;
    mail?: unknown;
    mailStatus?: number;
    throws?: boolean;
  } = {},
) {
  const calls: { url: string; body: unknown; headers: Headers }[] = [];
  const fetcher = (async (input: URL | RequestInfo, init?: RequestInit) => {
    calls.push({
      url: String(input),
      body: JSON.parse(String(init?.body)),
      headers: new Headers(init?.headers),
    });
    if (overrides.throws) throw new Error("private provider error");
    return String(input).includes("siteverify")
      ? json(
          overrides.verification || {
            success: true,
            hostname: "example.com",
            action: "travel-enquiry",
          },
        )
      : json(
          overrides.mail || {
            data: [{ id: "owner-email-id" }, { id: "visitor-email-id" }],
          },
          overrides.mailStatus || 200,
        );
  }) as typeof fetch;
  return { calls, fetcher };
}
test("lead consent, destination limits and preferred contact are validated", () => {
  assert.ok(leadSchema.safeParse(lead).success);
  for (const update of [
    { consent: false },
    { email: "bad" },
    { phone: "bad" },
    { preference: "WhatsApp", phone: "" },
    { destination: "x".repeat(121) },
    { website: "bot-input" },
  ])
    assert.equal(leadSchema.safeParse({ ...lead, ...update }).success, false);
});
test("both recipient messages are distinct and customer acknowledgement does not reflect free text", () => {
  const mails = leadEmails(
    { ...lead, name: "Malicious name", destination: "Untrusted destination" },
    settings,
    payload.requestId,
  );
  assert.deepEqual(mails[0].to, ["owner@example.com"]);
  assert.equal(mails[0].reply_to, lead.email);
  assert.deepEqual(mails[1].to, [lead.email]);
  assert.equal(mails[1].reply_to, settings.inbox);
  assert.ok(mails[0].text.includes(leadConsent));
  assert.ok(!mails[1].text.includes("Untrusted destination"));
  assert.ok(!mails[1].text.includes("Malicious name"));
  assert.ok(mails[1].text.includes("not a booking confirmation"));
});
test("unconfigured, cross-origin and malformed requests cannot send email", async () => {
  const { calls, fetcher } = fakeSend();
  assert.equal(
    (
      await createLeadHandler({
        settings: () => ({ ...settings, enabled: false }),
        fetcher,
      })(request())
    ).status,
    503,
  );
  const handle = createLeadHandler({ settings: () => settings, fetcher });
  assert.equal(
    (await handle(request(payload, "https://attacker.example"))).status,
    403,
  );
  assert.equal(
    (await handle(request({ ...payload, consent: false }))).status,
    400,
  );
  assert.equal(
    (await handle(request({ ...payload, website: "bot" }))).status,
    400,
  );
  assert.equal(
    (await handle(request({ ...payload, destination: "x".repeat(9000) })))
      .status,
    400,
  );
  assert.equal(calls.length, 0);
});
test("server checks Turnstile token, action and hostname before sending", async () => {
  for (const verification of [
    { success: false },
    { success: true, hostname: "wrong.example", action: "travel-enquiry" },
    { success: true, hostname: "example.com", action: "wrong-action" },
  ]) {
    const fake = fakeSend({ verification });
    const result = await createLeadHandler({
      settings: () => settings,
      fetcher: fake.fetcher,
    })(request());
    assert.equal(result.status, 400);
    assert.equal(fake.calls.length, 1);
  }
});
test("success queues exactly two emails with strict validation and a stable idempotency key", async () => {
  const fake = fakeSend();
  const result = await createLeadHandler({
    settings: () => settings,
    fetcher: fake.fetcher,
  })(request());
  assert.equal(result.status, 202);
  assert.equal((await result.json()).reference, payload.requestId);
  assert.equal(fake.calls.length, 2);
  assert.equal(fake.calls[1].url, "https://api.resend.com/emails/batch");
  assert.equal(fake.calls[1].headers.get("x-batch-validation"), "strict");
  assert.equal(
    fake.calls[1].headers.get("Idempotency-Key"),
    `aurix-enquiry/${payload.requestId}`,
  );
  assert.equal((fake.calls[1].body as unknown[]).length, 2);
});
test("provider failures, uncertain receipts and partial batches never report success or expose errors", async () => {
  for (const options of [
    { mailStatus: 403 },
    { mail: { data: [{ id: "one-only" }] } },
    {
      mail: {
        data: [{ id: "one" }, { id: "two" }],
        errors: [{ message: "private error" }],
      },
    },
    { throws: true },
  ]) {
    const fake = fakeSend(options);
    const result = await createLeadHandler({
      settings: () => settings,
      fetcher: fake.fetcher,
    })(request());
    assert.ok(result.status >= 500);
    assert.ok(!(await result.text()).includes("private"));
  }
});
test("bounded per-instance rate limits reject bursts and expire", () => {
  const limit = createLeadLimiter();
  assert.equal(limit("same", 2, 1000, 0), true);
  assert.equal(limit("same", 2, 1000, 100), true);
  assert.equal(limit("same", 2, 1000, 200), false);
  assert.equal(limit("same", 2, 1000, 1000), true);
});
