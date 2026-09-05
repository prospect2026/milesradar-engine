import { NextRequest, NextResponse } from "next/server";
import { generatePlan } from "@/lib/goal-engine";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { targetProgramCode, targetMiles, deadlineMonths, budgetMonthly } = body;

  if (!targetProgramCode || !targetMiles || !deadlineMonths || !budgetMonthly) {
    return NextResponse.json(
      { error: "Champs requis : targetProgramCode, targetMiles, deadlineMonths, budgetMonthly" },
      { status: 400 }
    );
  }

  const plan = await generatePlan({
    email: body.email || undefined,
    targetProgramCode,
    targetMiles,
    deadlineMonths,
    budgetMonthly,
    monthlySpendEur: body.monthlySpendEur,
    flightsPerYear: body.flightsPerYear,
    hasAmexGold: body.hasAmexGold,
    hasAmexPlatine: body.hasAmexPlatine,
    hasVisaInfinite: body.hasVisaInfinite,
    hasMarriottCard: body.hasMarriottCard,
    hasHiltonCard: body.hasHiltonCard,
    country: body.country,
  });

  return NextResponse.json(plan);
}
