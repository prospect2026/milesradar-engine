import { prisma } from "@/lib/prisma";

interface DealForEmail {
  id: string;
  title: string;
  description: string;
  type: string;
  bonusPercent: number | null;
  milesMax: number | null;
  sourceUrl: string;
  isHot: boolean;
  program: { code: string; name: string; badgeBg: string };
}

function buildEmailHTML(deals: DealForEmail[], firstName?: string): string {
  const greeting = firstName ? `Salut ${firstName}` : "Salut";
  const dealRows = deals
    .map(
      (d) => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #f0f0f0;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
          ${d.isHot ? '<span style="background:#FFF3E0;color:#E65100;font-size:11px;font-weight:700;padding:2px 6px;border-radius:4px;">HOT</span>' : ""}
          <span style="background:${d.program.badgeBg};color:white;font-size:11px;font-weight:600;padding:2px 6px;border-radius:4px;">${d.program.code}</span>
        </div>
        <a href="${d.sourceUrl}" style="color:#0D9488;font-weight:600;font-size:14px;text-decoration:none;">${d.title}</a>
        <p style="color:#6B7280;font-size:13px;margin:4px 0 0;">${d.description}</p>
        <div style="margin-top:6px;">
          ${d.bonusPercent ? `<span style="color:#E65100;font-weight:700;font-size:16px;">${d.bonusPercent}%</span>` : ""}
          ${d.milesMax ? `<span style="color:#0D9488;font-weight:600;font-size:13px;margin-left:8px;">${d.milesMax.toLocaleString("fr-FR")} mi max</span>` : ""}
        </div>
      </td>
    </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#F9FAFB;margin:0;padding:0;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="background:white;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <div style="background:#0D9488;padding:24px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:22px;">MilesRadar — Nouveaux Deals</h1>
      </div>
      <div style="padding:20px;">
        <p style="color:#374151;font-size:15px;">${greeting}, voici ${deals.length} nouveau${deals.length > 1 ? "x" : ""} deal${deals.length > 1 ? "s" : ""} pour tes programmes :</p>
        <table style="width:100%;border-collapse:collapse;">
          ${dealRows}
        </table>
        <div style="text-align:center;margin-top:20px;">
          <a href="${process.env.NEXT_PUBLIC_URL || "http://localhost:3001"}/deals" style="background:#0D9488;color:white;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Voir tous les deals</a>
        </div>
      </div>
      <div style="background:#F9FAFB;padding:16px;text-align:center;border-top:1px solid #F0F0F0;">
        <p style="color:#9CA3AF;font-size:12px;margin:0;">MilesRadar Engine — Tu recois cet email car tu t'es inscrit aux alertes.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function sendAlerts(): Promise<{ sent: number; errors: number; noKey: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: 0, errors: 0, noKey: true };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const alerts = await prisma.userAlert.findMany({
    where: { isActive: true },
    include: { logs: { select: { dealId: true } } },
  });

  if (alerts.length === 0) return { sent: 0, errors: 0, noKey: false };

  const verifiedDeals = await prisma.deal.findMany({
    where: { isVerified: true, isActive: true },
    include: { program: { select: { code: true, name: true, badgeBg: true } } },
    orderBy: [{ isHot: "desc" }, { detectedAt: "desc" }],
  });

  let sent = 0;
  let errors = 0;

  for (const alert of alerts) {
    const alreadySent = new Set(alert.logs.map((l) => l.dealId));

    let matchingDeals = verifiedDeals.filter((d) => !alreadySent.has(d.id));

    if (alert.programIds.length > 0) {
      const programIds = new Set(alert.programIds);
      matchingDeals = matchingDeals.filter((d) => programIds.has(d.programId));
    }

    if (alert.threshold > 0) {
      matchingDeals = matchingDeals.filter(
        (d) => (d.bonusPercent ?? 0) >= alert.threshold || d.isHot
      );
    }

    if (matchingDeals.length === 0) continue;

    try {
      await resend.emails.send({
        from: "MilesRadar <alerts@milesradar.com>",
        to: alert.email,
        subject: `${matchingDeals.length} nouveau${matchingDeals.length > 1 ? "x" : ""} deal${matchingDeals.length > 1 ? "s" : ""} miles detecte${matchingDeals.length > 1 ? "s" : ""}`,
        html: buildEmailHTML(matchingDeals, alert.firstName ?? undefined),
      });

      await prisma.alertLog.createMany({
        data: matchingDeals.map((d) => ({
          alertId: alert.id,
          dealId: d.id,
        })),
        skipDuplicates: true,
      });

      sent++;
    } catch (err) {
      console.error(`[Email] Erreur envoi à ${alert.email}:`, err);
      errors++;
    }
  }

  return { sent, errors, noKey: false };
}
