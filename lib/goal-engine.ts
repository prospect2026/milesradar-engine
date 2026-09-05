import { prisma } from "@/lib/prisma";

export interface GoalInput {
  email?: string;
  targetProgramCode: string;
  targetMiles: number;
  deadlineMonths: number;
  budgetMonthly: number;
  monthlySpendEur?: number;
  flightsPerYear?: number;
  hasAmexGold?: boolean;
  hasAmexPlatine?: boolean;
  hasVisaInfinite?: boolean;
  hasMarriottCard?: boolean;
  hasHiltonCard?: boolean;
  country?: string;
}

export interface PlanAction {
  rank: number;
  title: string;
  description: string;
  milesEstimate: number;
  monthStart: number;
  type: string;
  isPriority: boolean;
  isLocked: boolean;
  confidenceScore: number;
  notes?: string;
}

export interface StatusRunRecommendation {
  recommended: boolean;
  currentTier: string;
  nextTier: string;
  gapMiles?: number;
  gapSegments?: number;
  bonusMilesIfUpgraded: number;
  explanation: string;
}

export interface TimelinePoint {
  month: number;
  label: string;
  cumulative: number;
  pct: number;
}

export interface BreakdownItem {
  label: string;
  miles: number;
  color: string;
}

export interface PlanResult {
  targetProgram: { code: string; name: string };
  targetMiles: number;
  currentBalance: number;
  milesNeeded: number;
  totalMilesEstimate: number;
  coveragePct: number;
  deadlineMonths: number;
  currentTier: string;
  earningMultiplier: number;
  statusRunRecommendation: StatusRunRecommendation | null;
  actions: PlanAction[];
  timeline: TimelinePoint[];
  breakdown: BreakdownItem[];
  warning: string | null;
}

export async function generatePlan(input: GoalInput): Promise<PlanResult> {
  // STEP 1: Load profile if email provided
  let profile: Awaited<ReturnType<typeof prisma.clientProfile.findUnique>> & {
    balances?: Array<{ balance: number; program: { code: string } }>;
  } | null = null;

  if (input.email) {
    profile = await prisma.clientProfile.findUnique({
      where: { email: input.email },
      include: { balances: { include: { program: true } } },
    });
  }

  const monthlySpend = profile?.monthlySpendEur ?? input.monthlySpendEur ?? 1000;
  const country = profile?.country ?? input.country ?? "FR";
  const region = country === "FR" || country === "BE" || country === "CH" ? "EU" : country === "US" ? "US" : "WORLDWIDE";

  const hasAmexGold = profile?.hasAmexGold ?? input.hasAmexGold ?? false;
  const hasAmexPlatine = profile?.hasAmexPlatine ?? input.hasAmexPlatine ?? false;
  const hasVisaInfinite = profile?.hasVisaInfinite ?? input.hasVisaInfinite ?? false;
  const hasMarriottCard = profile?.hasMarriottCard ?? input.hasMarriottCard ?? false;
  const hasHiltonCard = profile?.hasHiltonCard ?? input.hasHiltonCard ?? false;

  // Current balance in target program
  const currentBalance =
    profile?.balances?.find((b) => b.program.code === input.targetProgramCode)?.balance ?? 0;
  const milesNeeded = Math.max(0, input.targetMiles - currentBalance);

  if (milesNeeded === 0) {
    return {
      targetProgram: { code: input.targetProgramCode, name: input.targetProgramCode },
      targetMiles: input.targetMiles,
      currentBalance,
      milesNeeded: 0,
      totalMilesEstimate: 0,
      coveragePct: 1,
      deadlineMonths: input.deadlineMonths,
      currentTier: "Membre",
      earningMultiplier: 1.0,
      statusRunRecommendation: null,
      actions: [],
      timeline: [],
      breakdown: [],
      warning: null,
    };
  }

  // STEP 2: Load target program + status tiers
  const targetProgram = await prisma.program.findUnique({
    where: { code: input.targetProgramCode },
    include: { statusTiers: { orderBy: { rank: "asc" } } },
  });

  if (!targetProgram) throw new Error("Programme non trouvé: " + input.targetProgramCode);

  // Current user status in this program
  let currentTier: { code: string; name: string; rank: number; earningMultiplier: number } | null = null;
  let earningMultiplier = 1.0;
  let statusRunRec: StatusRunRecommendation | null = null;

  if (input.email) {
    const userStatus = await prisma.userProgramStatus.findUnique({
      where: {
        email_programId: { email: input.email, programId: targetProgram.id },
      },
      include: { currentTier: true },
    });

    if (userStatus?.currentTier) {
      currentTier = userStatus.currentTier;
      earningMultiplier = currentTier.earningMultiplier;

      // STEP 3: Check if status run is recommended
      const nextTier = targetProgram.statusTiers.find((t) => t.rank === currentTier!.rank + 1);

      if (nextTier) {
        const gapMiles = nextTier.requiredMiles
          ? Math.max(0, nextTier.requiredMiles - userStatus.currentQualifyingMiles)
          : null;
        const gapSegments = nextTier.requiredSegments
          ? Math.max(0, nextTier.requiredSegments - userStatus.currentQualifyingSegments)
          : null;

        const achievableInThreeMonths = gapMiles
          ? gapMiles < 15000
          : gapSegments
            ? gapSegments < 10
            : false;
        const bonusMiles = Math.round(milesNeeded * (nextTier.earningMultiplier - earningMultiplier));

        if (achievableInThreeMonths && bonusMiles > 5000) {
          statusRunRec = {
            recommended: true,
            currentTier: currentTier.name,
            nextTier: nextTier.name,
            gapMiles: gapMiles ?? undefined,
            gapSegments: gapSegments ?? undefined,
            bonusMilesIfUpgraded: bonusMiles,
            explanation: `En passant ${nextTier.name}, tu gagneras ${nextTier.earningMultiplier}x au lieu de ${earningMultiplier}x sur tous tes miles — soit +${bonusMiles.toLocaleString("fr-FR")} miles supplémentaires sur la durée de ton plan.`,
          };
          earningMultiplier = nextTier.earningMultiplier;
        }
      }
    }
  }

  // STEP 4: Load filtered EarningOpportunities
  const whereConditions: Parameters<typeof prisma.earningOpportunity.findMany>[0] = {
    where: {
      programId: targetProgram.id,
      isActive: true,
      monthStart: { lte: input.deadlineMonths },
    },
  };

  const allOpportunities = await prisma.earningOpportunity.findMany({
    ...whereConditions,
    include: { program: true },
  });

  // Filter by status requirement
  const filteredOpps = allOpportunities.filter((opp) => {
    if (!opp.requiredStatusCode) return true;
    if (currentTier && opp.requiredStatusCode === currentTier.code) return true;
    if (statusRunRec && opp.requiredStatusCode === statusRunRec.nextTier.toLowerCase()) return true;
    return false;
  });

  // STEP 5: Calculate real miles per opportunity
  const actions: PlanAction[] = [];

  for (const opp of filteredOpps) {
    // Exclude cards already owned
    if (opp.type === "credit_card") {
      const titleLower = opp.title.toLowerCase();
      if (titleLower.includes("platine") && hasAmexPlatine) continue;
      if ((titleLower.includes("amex gold") || titleLower.includes("amex flying blue")) && hasAmexGold) continue;
      if (titleLower.includes("visa infinite") && hasVisaInfinite) continue;
      if (titleLower.includes("marriott") && hasMarriottCard) continue;
      if (titleLower.includes("hilton") && hasHiltonCard) continue;
    }

    // Exclude opportunities outside region
    if (opp.region.length > 0 && !opp.region.includes("WORLDWIDE") && !opp.region.includes(region)) {
      continue;
    }

    let milesCalc = opp.milesEstimate;

    // Adjust recurring opportunities by duration
    if (opp.milesPerMonth) {
      const activeMonths = Math.max(1, input.deadlineMonths - opp.monthStart + 1);
      milesCalc = opp.milesPerMonth * activeMonths;
    }

    // Adjust flight miles by status multiplier
    if (opp.type === "status_run") {
      milesCalc = Math.round(milesCalc * earningMultiplier);
    }

    // Adjust portal shopping by real monthly spend
    if (opp.type === "portal") {
      const monthsActive = Math.max(1, input.deadlineMonths - opp.monthStart + 1);
      milesCalc = Math.round(monthlySpend * 0.5 * 4 * monthsActive);
    }

    actions.push({
      rank: 0,
      title: opp.title,
      description: opp.notes ?? "",
      milesEstimate: milesCalc,
      monthStart: opp.monthStart,
      type: opp.type,
      isPriority: opp.isPriority,
      isLocked: opp.isLocked,
      confidenceScore: opp.confidenceScore,
      notes: opp.notes ?? undefined,
    });
  }

  // STEP 5b: Load active verified deals for target program
  const activeDeals = await prisma.deal.findMany({
    where: {
      programId: targetProgram.id,
      isVerified: true,
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
    orderBy: { detectedAt: "desc" },
  });

  for (const deal of activeDeals) {
    const alreadyCovered = actions.some(
      (a) => a.type === deal.type && Math.abs(a.milesEstimate - (deal.milesMax ?? 0)) < 5000
    );
    if (alreadyCovered) continue;

    let milesCalc = deal.milesMax ?? 0;
    if (deal.bonusPercent && deal.type === "transfer_bonus") {
      milesCalc = Math.round(input.budgetMonthly * 2 * (deal.bonusPercent / 100));
      milesCalc = Math.max(milesCalc, deal.milesMax ?? 0);
    }

    if (milesCalc === 0) continue;

    actions.push({
      rank: 0,
      title: deal.title,
      description: deal.description + " — Deal vérifié en direct",
      milesEstimate: milesCalc,
      monthStart: 1,
      type: deal.type,
      isPriority: deal.isHot,
      isLocked: false,
      confidenceScore: 95,
      notes: `Deal actif détecté le ${deal.detectedAt.toLocaleDateString("fr-FR")}. Source : ${deal.sourceUrl}`,
    });
  }

  // STEP 6: Sort and rank
  actions.sort((a, b) => {
    if (a.isPriority && !b.isPriority) return -1;
    if (!a.isPriority && b.isPriority) return 1;
    return b.milesEstimate - a.milesEstimate;
  });
  actions.forEach((a, i) => {
    a.rank = i + 1;
  });

  // STEP 7: Calculate total and coverage
  const totalMiles = actions.reduce((sum, a) => sum + a.milesEstimate, 0);
  const coveragePct = milesNeeded > 0 ? totalMiles / milesNeeded : 1;

  // STEP 8: Monthly timeline
  const timeline: TimelinePoint[] = [];
  let cumulative = currentBalance;
  const monthlyGain = Math.round(totalMiles / Math.max(1, input.deadlineMonths));

  for (let month = 1; month <= input.deadlineMonths; month++) {
    cumulative += monthlyGain;
    const isMilestone = month % 3 === 0 || month === 1 || month === input.deadlineMonths;
    if (isMilestone) {
      timeline.push({
        month,
        label: month === 1 ? "Début du plan" : month === input.deadlineMonths ? "Objectif !" : `Mois ${month}`,
        cumulative: Math.min(cumulative, input.targetMiles),
        pct: Math.min(100, Math.round((cumulative / input.targetMiles) * 100)),
      });
    }
  }

  // STEP 9: Breakdown by source
  const breakdown: BreakdownItem[] = [
    { label: "Cartes bancaires", miles: actions.filter((a) => a.type === "credit_card").reduce((s, a) => s + a.milesEstimate, 0), color: "#185FA5" },
    { label: "Portail shopping", miles: actions.filter((a) => a.type === "portal").reduce((s, a) => s + a.milesEstimate, 0), color: "#1D9E75" },
    { label: "Bonus transfert", miles: actions.filter((a) => a.type === "transfer" || a.type === "transfer_bonus").reduce((s, a) => s + a.milesEstimate, 0), color: "#EF9F27" },
    { label: "Hôtels", miles: actions.filter((a) => a.type === "hotel").reduce((s, a) => s + a.milesEstimate, 0), color: "#534AB7" },
    { label: "Dining", miles: actions.filter((a) => a.type === "dining").reduce((s, a) => s + a.milesEstimate, 0), color: "#D85A30" },
    { label: "Parrainage", miles: actions.filter((a) => a.type === "referral").reduce((s, a) => s + a.milesEstimate, 0), color: "#9FE1CB" },
    { label: "Status Run", miles: actions.filter((a) => a.type === "status_run").reduce((s, a) => s + a.milesEstimate, 0), color: "#E5604D" },
  ].filter((b) => b.miles > 0);

  return {
    targetProgram: { code: targetProgram.code, name: targetProgram.name },
    targetMiles: input.targetMiles,
    currentBalance,
    milesNeeded,
    totalMilesEstimate: totalMiles,
    coveragePct,
    deadlineMonths: input.deadlineMonths,
    currentTier: currentTier?.name ?? "Membre",
    earningMultiplier,
    statusRunRecommendation: statusRunRec,
    actions,
    timeline,
    breakdown,
    warning:
      coveragePct < 0.8
        ? `Avec ton budget actuel, le plan couvre ${Math.round(coveragePct * 100)}% de ton objectif. Augmente ton budget ou rallonge le délai.`
        : null,
  };
}
