import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const programs = await prisma.program.findMany({
    where: { isActive: true },
    select: { id: true, code: true, name: true, parentName: true, type: true, priority: true },
    orderBy: { priority: "desc" },
  });
  return NextResponse.json(programs);
}
