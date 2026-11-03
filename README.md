# Aurix Travels

A Next.js App Router website for travel enquiries. TypeScript, Tailwind CSS 4, Motion, Lucide, React Hook Form and Zod. No booking engine, database, payments, analytics or Amadeus integration.

## Develop

Use Node 22 or 24 (validated with Node 24.22.1) and npm.

```sh
npm ci
npm run dev
```

Use the existing checkout in cloud tasks; each task is already isolated. Do not create a worktree unless requested. Current dependencies are pinned in `package-lock.json`.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

Production build uses webpack. Browser tests require a running server and Chromium:

```sh
npx playwright install chromium
npm run test:browser
# Or use an existing system browser:
CHROMIUM_PATH=/usr/bin/chromium npm run test:browser
```

`BASE_URL` overrides the default local test server address. Browser checks cover all seven routes, WCAG A/AA axe scans, validation, destination preselection, missing-number email fallback, contact preparation, mobile navigation, image loads and overflow at 360, 390, 768, 900, 1024 and 1440 px. Screenshots are written to `/tmp/aurix-<width>.png`. Automated scans complement manual keyboard and real-device testing; they do not certify accessibility.

## Business configuration

Edit `src/config/business.ts` for navigation, destinations, enabled services and verified public contact details. Only flight assistance is enabled by default. Brand styling uses CSS variables in `src/app/globals.css`. No legal registration, accreditation, address, commercial policies or reviews are invented.

Copy `.env.example` to `.env.local` and set **NEXT_PUBLIC_WHATSAPP_NUMBER** only after receiving the verified business number. Use international digits only, without `+`, spaces or punctuation. It is public configuration, not a secret. Next.js inlines it at build time: rebuild after changing it. Empty or malformed configuration deliberately offers email and a readable message draft. No real business number has been supplied or tested.

Flight enquiries use a local searchable airport dataset, local-calendar date checks, return-date ordering, adult/infant rules and a nine-traveller maximum. The customer must actually send the message in WhatsApp. Opening it does not confirm a booking or a delivered enquiry. Contact forms prepare email drafts; the site does not send email itself. Form data is not persistently stored. The travel team handles subsequent messages separately.

## Daily hero backgrounds

The homepage rotates through four curated local images: Santorini, Maldives, the Swiss Alps and Thailand. Every visitor sees the same selection for the **Asia/Kolkata (India)** calendar day, regardless of their own timezone. The sequence starts with Santorini on 3 November 2026 and repeats every four days; it does not generate or download a new image each day.

Edit `src/config/hero.ts` to add/reorder images, tune each crop, change the starting date, or disable rotation. Keep bright scenery and enough space for the headline; one shared light overlay preserves the navy/blue theme and readable text. Images must have appropriate usage rights. Current images are the original generated illustrations described below.

The static HTML starts with Santorini as an accessible fallback. After hydration the day's image loads above it with a gentle fade; if that image fails, the fallback and its correct location label remain visible. Motion is disabled for reduced-motion preferences. An open page updates at India midnight, and background tabs catch up on focus/visibility. This uses a browser timer, not a backend, paid API, cron job or daily rebuild. Deploy once after changing the image collection. Social preview imagery remains stable.

The tests cover India midnight/year rollover, deterministic rotation, local asset presence and browser-level day changes across multiple timezones.

## Visual assets and outstanding design work

The approved light-theme reference was supplied during implementation. The page follows its white navigation, light Santorini hero, floating enquiry card and destination-card direction. It is responsive original code, not a pixel-for-pixel reconstruction of the generated mockup.

Destination images are original AI-generated, photorealistic illustrations created for this project, inspired by the supplied direction. They are not documentary photographs or representations of a specific available package. They are served locally with Next.js Image optimization. See `public/images/ASSETS.md` for provenance. Confirm final imagery with the owner before launch; replace it with properly licensed photography if authentic destination photos are preferred. The earlier Unsplash download attempt was blocked; the implementation no longer needs external photo access.

Self-hosted Plus Jakarta Sans and Inter were obtained from the Google Fonts repository. Their SIL Open Font License files are retained alongside the fonts. The typographic/plane brand mark is a temporary original presentation, not a supplied official logo.

## SEO and policies

Canonical URLs target https://aurixtravelslimited.in. Unique page titles/descriptions, social preview image, sitemap, robots and icon are included. Structured data is intentionally limited to the supplied brand name, website and email. Legal pages are visibly marked draft and excluded from indexing until reviewed. Update their metadata and sitemap after approval. Confirm email delivery before launch; the supplied mailbox address has not been independently verified.

## Deploy to Vercel

1. Review business identity, enabled services, logo, images, privacy text, terms and the final customer contact flow.
2. Push the project to the selected GitHub repository. Keep the production branch up to date with reviewed changes.
3. Import the repository into Vercel with a plan allowing commercial use. Select the Next.js preset, Node 24, `npm ci`, and `npm run build`. Let Vercel manage the output directory.
4. Set `NEXT_PUBLIC_WHATSAPP_NUMBER` in the appropriate Vercel environments and rebuild. Do not put private API keys in `NEXT_PUBLIC_*` variables.
5. Deploy and test the preview: all routes, form errors, real configured WhatsApp recipient/message on Android and iOS, email drafts, keyboard navigation, responsive layout and social metadata.
6. Add `aurixtravelslimited.in` and the desired `www` hostname in Vercel. Follow the **current project-specific DNS instructions displayed by Vercel**; do not assume a fixed A/CNAME target. Pick one canonical hostname and redirect the other.
7. Before editing GoDaddy DNS, export or record the existing zone. Change only the exact web records needed. Preserve all MX, email-related CNAME and TXT records, including SPF, DKIM and DMARC. Do not switch nameservers or replace the zone as part of website setup. Resolve any conflicting web records individually.
8. Wait for domain verification and TLS issuance. Verify HTTPS and redirects, then check inbound and outbound email with an external mailbox. SPF/DKIM warnings from earlier planning remain unresolved; consult the mailbox provider for exact records rather than inventing values.

No public deployment or DNS changes have been performed. Physical mobile devices, actual message delivery, legal review, verified business details and production DNS/email health remain launch checks.
