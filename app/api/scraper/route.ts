import { NextRequest, NextResponse } from "next/server";
import { runScraper } from "@/lib/scraper";

export async function POST(req: NextRequest) {
  const adminPassword = req.headers.get("x-admin-password");
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const skipPlaywright = body.skipPlaywright ?? false;

  const result = await runScraper({ skipPlaywright });
  return NextResponse.json({ success: true, ...result });
}
