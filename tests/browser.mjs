import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    headless: true,
    args: ["--no-sandbox"],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    timezoneId: "Asia/Kolkata",
  });
  const page = await context.newPage();
  let errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of [
    "/",
    "/about",
    "/services",
    "/destinations",
    "/contact",
    "/privacy-policy",
    "/terms",
  ]) {
    const r = await page.goto(
      (process.env.BASE_URL || "http://127.0.0.1:3000") + route,
    );
    assert.equal(r.status(), 200);
    await page.locator("h1").waitFor();
    assert.equal(await page.locator("h1").count(), 1);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    console.log(
      route,
      "accessibility",
      JSON.stringify(
        result.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target),
        })),
      ),
    );
    assert.equal(result.violations.length, 0);
  }
  await page.goto(
    `${process.env.BASE_URL || "http://127.0.0.1:3000"}/?destination=DXB#flight-enquiry`,
  );
  await page.waitForFunction(() =>
    document.querySelector('[name="to"]').value.includes("DXB"),
  );
  await page
    .getByRole("button", { name: "Get Flight Quote on WhatsApp" })
    .click();
  await page.locator("#from-error").waitFor();
  await page
    .locator('[name="from"]')
    .fill("Delhi — Indira Gandhi International (DEL)");
  await page.locator('[name="departure"]').fill("2099-12-15");
  await page.getByLabel("Round Trip", { exact: true }).check();
  await page.locator('[name="returnDate"]').fill("2099-12-14");
  await page
    .getByRole("button", { name: "Get Flight Quote on WhatsApp" })
    .click();
  await page.locator("#returnDate-error").waitFor();
  await page.locator('[name="returnDate"]').fill("2099-12-22");
  await page
    .getByRole("button", { name: "Get Flight Quote on WhatsApp" })
    .click();
  await page.locator(".message-draft").waitFor();
  assert.ok(
    (await page.getByLabel("Your travel enquiry").inputValue()).includes(
      "22 December 2099",
    ),
  );
  assert.ok(
    (await page.locator(".message-draft a").getAttribute("href")).startsWith(
      "mailto:info@aurixtravelslimited.in",
    ),
  );
  for (const width of [360, 390, 768, 900, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(process.env.BASE_URL || "http://127.0.0.1:3000");
    await page.evaluate(() => document.fonts.ready);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      true,
    );
    for (const img of await page.locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate((image) => image.decode());
      assert.equal(
        await img.evaluate((i) => i.complete && i.naturalWidth > 0),
        true,
      );
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({ path: `/tmp/aurix-${width}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Home", exact: true })
    .focus();
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .getByRole("button", { name: "Open navigation" })
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "About Us" })
    .click();
  await page.waitForURL("**/about");
  assert.ok(page.url().endsWith("/about"));
  await page.goto(`${process.env.BASE_URL || "http://127.0.0.1:3000"}/contact`);
  await page.locator('[name="name"]').fill("Test Traveller");
  await page.locator('[name="email"]').fill("traveller@example.com");
  await page.locator('[name="subject"]').fill("Travel enquiry");
  await page
    .locator('[name="message"]')
    .fill("Please help plan a trip to Dubai.");
  await page.getByRole("button", { name: "Prepare email enquiry" }).click();
  assert.ok(
    await page
      .getByRole("link", { name: "Open email draft" })
      .getAttribute("href"),
  );
  // All visitors use the India calendar day, including tabs open across midnight.
  for (const timezoneId of ["America/Los_Angeles", "Asia/Tokyo"]) {
    const timedContext = await browser.newContext({ timezoneId });
    const timedPage = await timedContext.newPage();
    timedPage.on("pageerror", (e) => errors.push(e.message));
    await timedPage.clock.install({
      time: new Date("2026-11-03T18:29:00.000Z"),
    });
    await timedPage.clock.pauseAt(new Date("2026-11-03T18:29:59.000Z"));
    await timedPage.goto(process.env.BASE_URL || "http://127.0.0.1:3000");
    await timedPage.locator('.hero[data-hero="santorini"]').waitFor();
    await timedPage.locator('[name="departure"][min]:not([min=""])').waitFor();
    await timedPage.clock.runFor(1600);
    await timedPage.locator('.hero[data-hero="maldives"]').waitFor();
    assert.ok(
      (await timedPage.locator(".hero-location").innerText()).includes(
        "Maldives",
      ),
    );
    await timedPage.clock.setSystemTime(new Date("2026-11-05T12:00:00Z"));
    await timedPage.evaluate(() => window.dispatchEvent(new Event("focus")));
    await timedPage.locator('.hero[data-hero="switzerland"]').waitFor();
    // A failed image must keep a readable fallback and matching location label.
    await timedPage.route("**/_next/image*", (route) =>
      route.request().url().includes("thailand")
        ? route.abort()
        : route.continue(),
    );
    await timedPage.clock.setSystemTime(new Date("2026-11-06T12:00:00Z"));
    await timedPage.evaluate(() => window.dispatchEvent(new Event("focus")));
    await timedPage.locator('.hero[data-hero="santorini"]').waitFor();
    assert.ok(
      (await timedPage.locator(".hero-location").innerText()).includes(
        "Santorini",
      ),
    );
    await timedContext.close();
  }
  assert.deepEqual(errors, []);
  console.log(
    "PASS: all routes, axe accessibility, validation, destination preselection, email fallback, mobile menu, contact form, images, 6 responsive widths, and daily hero rollover in multiple timezones.",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
