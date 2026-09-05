import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const verified = req.nextUrl.searchParams.get("verified");
  const where: Record<string, unknown> = { isActive: true };

  if (verified === "false") where.isVerified = false;
  else if (verified === "true") where.isVerified = true;

  const deals = await prisma.deal.findMany({
    where,
    include: { program: { select: { code: true, name: true, badgeBg: true, badgeText: true } } },
    orderBy: { detectedAt: "desc" },
  });

  return NextResponse.json(deals);
}

export async function POST(req: NextRequest) {
  const adminPassword = req.headers.get("x-admin-password");
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const { programCode, title, description, type, bonusPercent, milesMax, sourceUrl, expiresAt } = body;

  if (!programCode || !title || !type || !sourceUrl) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  const program = await prisma.program.findUnique({ where: { code: programCode } });
  if (!program) {
    return NextResponse.json({ error: "Programme non trouvé" }, { status: 404 });
  }

  const deal = await prisma.deal.create({
    data: {
      programId: program.id,
      title,
      description: description || "",
      type,
      bonusPercent: bonusPercent ? parseInt(bonusPercent) : null,
      milesMax: milesMax ? parseInt(milesMax) : null,
      sourceUrl,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isVerified: true,
      isHot: (bonusPercent ?? 0) >= 50,
      isActive: true,
    },
    include: { program: { select: { code: true, name: true, badgeBg: true, badgeText: true } } },
  });

  return NextResponse.json(deal);
}
