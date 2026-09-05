import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

  const alert = await prisma.userAlert.findFirst({
    where: { email, isActive: true },
    include: { logs: { select: { dealId: true, sentAt: true }, orderBy: { sentAt: "desc" }, take: 10 } },
  });

  return NextResponse.json(alert ?? { subscribed: false });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, firstName, programIds, threshold } = body;

  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

  const existing = await prisma.userAlert.findFirst({ where: { email, isActive: true } });

  if (existing) {
    const updated = await prisma.userAlert.update({
      where: { id: existing.id },
      data: {
        firstName: firstName ?? existing.firstName,
        programIds: programIds ?? existing.programIds,
        threshold: threshold ?? existing.threshold,
      },
    });
    return NextResponse.json(updated);
  }

  const alert = await prisma.userAlert.create({
    data: {
      email,
      firstName: firstName ?? null,
      programIds: programIds ?? [],
      threshold: threshold ?? 30,
    },
  });

  return NextResponse.json(alert);
}

export async function DELETE(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

  await prisma.userAlert.updateMany({
    where: { email, isActive: true },
    data: { isActive: false },
  });

  return NextResponse.json({ success: true });
}
