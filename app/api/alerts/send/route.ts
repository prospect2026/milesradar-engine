import { NextRequest, NextResponse } from "next/server";
import { sendAlerts } from "@/lib/email/send-alert";

export async function POST(req: NextRequest) {
  const adminPassword = req.headers.get("x-admin-password");
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const result = await sendAlerts();

  if (result.noKey) {
    return NextResponse.json({
      success: false,
      message: "RESEND_API_KEY non configurée. Ajoute ta clé dans .env pour envoyer des emails.",
      ...result,
    });
  }

  return NextResponse.json({ success: true, ...result });
}
