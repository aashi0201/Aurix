import { configured, createLeadHandler, leadSettings } from "@/lib/lead-server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;
const handle = createLeadHandler();
export async function GET() {
  const settings = leadSettings();
  const available = configured(settings);
  return Response.json(
    { available, siteKey: available ? settings.siteKey : "" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export const POST = handle;
