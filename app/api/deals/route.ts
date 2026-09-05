import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");
  const programCode = req.nextUrl.searchParams.get("program");

  const where: Record<string, unknown> = { isActive: true, isVerified: true };
  if (type) where.type = type;
  if (programCode) {
    const program = await prisma.program.findUnique({ where: { code: programCode } });
    if (program) where.programId = program.id;
  }

  const deals = await prisma.deal.findMany({
    where,
    include: { program: { select: { code: true, name: true, parentName: true, badgeBg: true, badgeText: true } } },
    orderBy: [{ isHot: "desc" }, { detectedAt: "desc" }],
  });

  return NextResponse.json(deals);
}
