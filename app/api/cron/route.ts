import { NextRequest, NextResponse } from "next/server";
import { runScraper } from "@/lib/scraper";
import { sendAlerts } from "@/lib/email/send-alert";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET ?? "milesradar-cron-2026";

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const results: { scraper: unknown; alerts: unknown; timestamp: string } = {
    scraper: null,
    alerts: null,
    timestamp: new Date().toISOString(),
  };

  try {
    results.scraper = await runScraper({ skipPlaywright: true });
    console.log("[Cron] Scraper terminé:", results.scraper);
  } catch (err) {
    results.scraper = { error: String(err) };
  }

  try {
    results.alerts = await sendAlerts();
    console.log("[Cron] Alertes envoyées:", results.alerts);
  } catch (err) {
    results.alerts = { error: String(err) };
  }

  return NextResponse.json(results);
}
