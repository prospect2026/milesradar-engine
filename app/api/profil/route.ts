import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email requis" }, { status: 400 });
  }

  const profile = await prisma.clientProfile.findUnique({
    where: { email },
    include: {
      balances: {
        include: { program: true },
      },
    },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 });
  }

  return NextResponse.json(profile);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    email,
    firstName,
    lastName,
    country,
    region,
    hasAmexGold,
    hasAmexPlatine,
    hasVisaInfinite,
    hasMarriottCard,
    hasHiltonCard,
    hasAirlineCard,
    hasChaseCard,
    hasCitiCard,
    monthlySpendEur,
    flightsPerYear,
    preferredCabin,
    mainBank,
    annualIncomeRange,
    hasExistingAmex,
    isHomeowner,
    mainAirline,
    travelType,
    departureCity,
    flyingBlueStatus,
    aviosStatus,
    marriottStatus,
    hiltonStatus,
    balances,
  } = body;

  if (!email) {
    return NextResponse.json({ error: "Email requis" }, { status: 400 });
  }

  const profileData = {
    firstName,
    lastName,
    country,
    region,
    hasAmexGold,
    hasAmexPlatine,
    hasVisaInfinite,
    hasMarriottCard,
    hasHiltonCard,
    hasAirlineCard,
    hasChaseCard,
    hasCitiCard,
    monthlySpendEur,
    flightsPerYear,
    preferredCabin,
    mainBank,
    annualIncomeRange,
    hasExistingAmex,
    isHomeowner,
    mainAirline,
    travelType,
    departureCity,
    flyingBlueStatus,
    aviosStatus,
    marriottStatus,
    hiltonStatus,
  };

  const profile = await prisma.clientProfile.upsert({
    where: { email },
    update: profileData,
    create: { email, ...profileData },
  });

  if (balances && Array.isArray(balances)) {
    for (const b of balances) {
      if (!b.programId || b.balance === undefined) continue;
      await prisma.portfolioBalance.upsert({
        where: {
          email_programId: { email, programId: b.programId },
        },
        update: { balance: b.balance },
        create: {
          email,
          programId: b.programId,
          balance: b.balance,
        },
      });
    }
  }

  return NextResponse.json(profile);
}
