import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminPassword = req.headers.get("x-admin-password");
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const deal = await prisma.deal.update({
    where: { id },
    data: {
      ...(body.isVerified !== undefined && { isVerified: body.isVerified }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
      ...(body.isHot !== undefined && { isHot: body.isHot }),
    },
    include: { program: { select: { code: true, name: true, badgeBg: true, badgeText: true } } },
  });

  return NextResponse.json(deal);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminPassword = req.headers.get("x-admin-password");
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.deal.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
