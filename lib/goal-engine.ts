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

export interface ActionEligibility {
  eligible: boolean;
  reason: string;
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
  eligibility: ActionEligibility;
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
  ineligibleActions: PlanAction[];
  timeline: TimelinePoint[];
  breakdown: BreakdownItem[];
  warnings: string[];
  valueSummary: { totalEuros: number; perMonthEuros: number; centsPerMile: number };
}

interface ProfileData {
  monthlySpendEur: number;
  spendTravel: number;
  spendDining: number;
  spendGroceries: number;
  spendOnline: number;
  spendOther: number;
  annualIncomeRange: string | null;
  newCardsLast24Months: number;
  hasExistingAmex: boolean;
  hasAmexGold: boolean;
  hasAmexPlatine: boolean;
  hasVisaInfinite: boolean;
  hasMarriottCard: boolean;
  hasHiltonCard: boolean;
  hasAirlineCard: boolean;
  hasChaseCard: boolean;
  hasCitiCard: boolean;
  country: string;
  region: string;
  flyingBlueBalance: number;
  aviosBalance: number;
  amexMRBalance: number;
  flyingBlueStatus: string | null;
  nextTripDestination: string | null;
  nextTripDate: Date | null;
  nextTripCabin: string | null;
  flightsPerYear: number;
}

// RULE 1: Card eligibility with strict income/history checks
function isEligibleForCard(
  cardTitle: string,
  profile: ProfileData,
): ActionEligibility {
  const titleLower = cardTitle.toLowerCase();

  if (titleLower.includes("platine") || titleLower.includes("platinum")) {
    const incomeOk = ["50k_100k", "50-60k", "60-100k", "plus_100k", ">100k"].includes(
      profile.annualIncomeRange ?? "",
    );
    if (!incomeOk) {
      return {
        eligible: false,
        reason: "Revenus insuffisants — Amex Platine exige >50k€/an",
      };
    }
    if (profile.hasExistingAmex && profile.newCardsLast24Months > 0) {
      return {
        eligible: false,
        reason: "Amex déjà active depuis <24 mois — attends avant de demander la Platine",
      };
    }
    if (profile.newCardsLast24Months >= 4) {
      return {
        eligible: false,
        reason: `${profile.newCardsLast24Months} cartes en 24 mois — limite de 4 atteinte pour Amex Platine`,
      };
    }
    if (profile.hasAmexPlatine) {
      return { eligible: false, reason: "Tu as déjà l'Amex Platine" };
    }
    return { eligible: true, reason: "" };
  }

  if (titleLower.includes("amex gold") || titleLower.includes("amex flying blue")) {
    if (profile.hasAmexGold) {
      return { eligible: false, reason: "Tu as déjà l'Amex Gold" };
    }
    if (profile.hasAmexPlatine) {
      return {
        eligible: false,
        reason: "Tu as déjà la Platine — la Gold n'apporterait rien de plus",
      };
    }
    if (profile.newCardsLast24Months >= 5) {
      return {
        eligible: false,
        reason: `${profile.newCardsLast24Months} cartes en 24 mois — limite de 5 atteinte`,
      };
    }
    return { eligible: true, reason: "" };
  }

  if (titleLower.includes("visa infinite")) {
    if (profile.hasVisaInfinite) {
      return { eligible: false, reason: "Tu as déjà une Visa Infinite" };
    }
    return { eligible: true, reason: "" };
  }

  if (titleLower.includes("marriott") && profile.hasMarriottCard) {
    return { eligible: false, reason: "Tu as déjà la carte Marriott" };
  }

  if (titleLower.includes("hilton") && profile.hasHiltonCard) {
    return { eligible: false, reason: "Tu as déjà la carte Hilton" };
  }

  if (titleLower.includes("chase") && profile.hasChaseCard) {
    return { eligible: false, reason: "Tu as déjà une Chase Sapphire" };
  }

  if (titleLower.includes("citi") && profile.hasCitiCard) {
    return { eligible: false, reason: "Tu as déjà une Citi Premier" };
  }

  return { eligible: true, reason: "" };
}

// RULE 2: Category-based portal miles calculation
function calculatePortalMiles(profile: ProfileData, monthsActive: number): number {
  const online = profile.spendOnline * 4;
  const travel = profile.spendTravel * 3;
  const dining = profile.spendDining * 2;
  const groceries = profile.spendGroceries * 1;
  const other = profile.spendOther * 1;
  const perMonth = online + travel + dining + groceries + other;
  if (perMonth === 0) {
    return Math.round(profile.monthlySpendEur * 0.5 * 4 * monthsActive);
  }
  return perMonth * monthsActive;
}

// RULE 5: Real balance from profile fields
function getRealBalance(profile: ProfileData, targetProgramCode: string): number {
  switch (targetProgramCode) {
    case "FB":
      return profile.flyingBlueBalance;
    case "AV":
      return profile.aviosBalance;
    case "AMEX_MR":
      return profile.amexMRBalance;
    default:
      return 0;
  }
}

function incomeToNumber(range: string | null): number {
  const map: Record<string, number> = {
    "<25k": 20000,
    "moins_30k": 25000,
    "25-40k": 32000,
    "30k_50k": 40000,
    "40-60k": 50000,
    "50k_100k": 75000,
    "60-100k": 80000,
    "plus_100k": 120000,
    ">100k": 120000,
  };
  return map[range ?? ""] ?? 0;
}

export async function generatePlan(input: GoalInput): Promise<PlanResult> {
  // STEP 1: Load profile
  let dbProfile: Awaited<ReturnType<typeof prisma.clientProfile.findUnique>> & {
    balances?: Array<{ balance: number; program: { code: string } }>;
  } | null = null;

  if (input.email) {
    dbProfile = await prisma.clientProfile.findUnique({
      where: { email: input.email },
      include: { balances: { include: { program: true } } },
    });
  }

  const country = dbProfile?.country ?? input.country ?? "FR";
  const region = ["FR", "BE", "CH", "LU", "DE", "ES", "IT", "PT", "NL", "UK"].includes(country)
    ? "EU"
    : country === "US"
      ? "US"
      : "WORLDWIDE";

  const profile: ProfileData = {
    monthlySpendEur: dbProfile?.monthlySpendEur ?? input.monthlySpendEur ?? 1000,
    spendTravel: dbProfile?.spendTravel ?? 0,
    spendDining: dbProfile?.spendDining ?? 0,
    spendGroceries: dbProfile?.spendGroceries ?? 0,
    spendOnline: dbProfile?.spendOnline ?? 0,
    spendOther: dbProfile?.spendOther ?? 0,
    annualIncomeRange: dbProfile?.annualIncomeRange ?? null,
    newCardsLast24Months: dbProfile?.newCardsLast24Months ?? 0,
    hasExistingAmex: dbProfile?.hasExistingAmex ?? false,
    hasAmexGold: dbProfile?.hasAmexGold ?? input.hasAmexGold ?? false,
    hasAmexPlatine: dbProfile?.hasAmexPlatine ?? input.hasAmexPlatine ?? false,
    hasVisaInfinite: dbProfile?.hasVisaInfinite ?? input.hasVisaInfinite ?? false,
    hasMarriottCard: dbProfile?.hasMarriottCard ?? input.hasMarriottCard ?? false,
    hasHiltonCard: dbProfile?.hasHiltonCard ?? input.hasHiltonCard ?? false,
    hasAirlineCard: dbProfile?.hasAirlineCard ?? false,
    hasChaseCard: dbProfile?.hasChaseCard ?? false,
    hasCitiCard: dbProfile?.hasCitiCard ?? false,
    country,
    region,
    flyingBlueBalance: dbProfile?.flyingBlueBalance ?? 0,
    aviosBalance: dbProfile?.aviosBalance ?? 0,
    amexMRBalance: dbProfile?.amexMRBalance ?? 0,
    flyingBlueStatus: dbProfile?.flyingBlueStatus ?? null,
    nextTripDestination: dbProfile?.nextTripDestination ?? null,
    nextTripDate: dbProfile?.nextTripDate ?? null,
    nextTripCabin: dbProfile?.nextTripCabin ?? null,
    flightsPerYear: dbProfile?.flightsPerYear ?? input.flightsPerYear ?? 4,
  };

  // RULE 5: Real balance from profile
  const balanceFromPortfolio =
    dbProfile?.balances?.find((b) => b.program.code === input.targetProgramCode)?.balance ?? 0;
  const balanceFromProfile = getRealBalance(profile, input.targetProgramCode);
  const currentBalance = Math.max(balanceFromPortfolio, balanceFromProfile);
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
      ineligibleActions: [],
      timeline: [],
      breakdown: [],
      warnings: [],
      valueSummary: { totalEuros: 0, perMonthEuros: 0, centsPerMile: 0 },
    };
  }

  // STEP 2: Load target program
  const targetProgram = await prisma.program.findUnique({
    where: { code: input.targetProgramCode },
    include: { statusTiers: { orderBy: { rank: "asc" } } },
  });
  if (!targetProgram) throw new Error("Programme non trouvé: " + input.targetProgramCode);

  // STEP 3: Check user status + RULE 3: Status run from actual XP
  let currentTier: { code: string; name: string; rank: number; earningMultiplier: number } | null =
    null;
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

      const nextTier = targetProgram.statusTiers.find((t) => t.rank === currentTier!.rank + 1);
      if (nextTier) {
        const gapMiles = nextTier.requiredMiles
          ? Math.max(0, nextTier.requiredMiles - userStatus.currentQualifyingMiles)
          : null;
        const gapSegments = nextTier.requiredSegments
          ? Math.max(0, nextTier.requiredSegments - userStatus.currentQualifyingSegments)
          : null;

        const monthsToEarn = gapMiles
          ? Math.ceil(gapMiles / Math.max(1, profile.flightsPerYear * 500))
          : null;
        const achievable =
          monthsToEarn !== null ? monthsToEarn <= 3 : gapSegments ? gapSegments < 10 : false;
        const bonusMiles = Math.round(
          milesNeeded * (nextTier.earningMultiplier - earningMultiplier),
        );

        if (achievable && bonusMiles > 5000) {
          statusRunRec = {
            recommended: true,
            currentTier: currentTier.name,
            nextTier: nextTier.name,
            gapMiles: gapMiles ?? undefined,
            gapSegments: gapSegments ?? undefined,
            bonusMilesIfUpgraded: bonusMiles,
            explanation: `En passant ${nextTier.name}, tu gagneras ${nextTier.earningMultiplier}x au lieu de ${earningMultiplier}x — soit +${bonusMiles.toLocaleString("fr-FR")} miles supplémentaires.`,
          };
          earningMultiplier = nextTier.earningMultiplier;
        }
      }
    }
  }

  // STEP 4: Load earning opportunities
  const allOpportunities = await prisma.earningOpportunity.findMany({
    where: {
      programId: targetProgram.id,
      isActive: true,
      monthStart: { lte: input.deadlineMonths },
    },
    include: { program: true },
  });

  const filteredOpps = allOpportunities.filter((opp) => {
    if (!opp.requiredStatusCode) return true;
    if (currentTier && opp.requiredStatusCode === currentTier.code) return true;
    if (statusRunRec && opp.requiredStatusCode === statusRunRec.nextTier.toLowerCase())
      return true;
    return false;
  });

  // STEP 5: Build actions with eligibility checks
  const eligibleActions: PlanAction[] = [];
  const ineligibleActions: PlanAction[] = [];

  for (const opp of filteredOpps) {
    if (opp.region.length > 0 && !opp.region.includes("WORLDWIDE") && !opp.region.includes(region)) {
      continue;
    }

    let milesCalc = opp.milesEstimate;
    let eligibility: ActionEligibility = { eligible: true, reason: "" };

    // RULE 1: Card eligibility
    if (opp.type === "credit_card") {
      eligibility = isEligibleForCard(opp.title, profile);
    }

    // Adjust recurring by duration
    if (opp.milesPerMonth) {
      const activeMonths = Math.max(1, input.deadlineMonths - opp.monthStart + 1);
      milesCalc = opp.milesPerMonth * activeMonths;
    }

    // Status run: multiply by earningMultiplier
    if (opp.type === "status_run") {
      milesCalc = Math.round(milesCalc * earningMultiplier);
    }

    // RULE 2: Portal with category-based spend
    if (opp.type === "portal") {
      const monthsActive = Math.max(1, input.deadlineMonths - opp.monthStart + 1);
      milesCalc = calculatePortalMiles(profile, monthsActive);
    }

    const action: PlanAction = {
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
      eligibility,
    };

    if (eligibility.eligible) {
      eligibleActions.push(action);
    } else {
      ineligibleActions.push(action);
    }
  }

  // STEP 5b: Active verified deals
  const activeDeals = await prisma.deal.findMany({
    where: {
      programId: targetProgram.id,
      isVerified: true,
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: { detectedAt: "desc" },
  });

  for (const deal of activeDeals) {
    const alreadyCovered = eligibleActions.some(
      (a) => a.type === deal.type && Math.abs(a.milesEstimate - (deal.milesMax ?? 0)) < 5000,
    );
    if (alreadyCovered) continue;

    let milesCalc = deal.milesMax ?? 0;
    if (deal.bonusPercent && deal.type === "transfer_bonus") {
      milesCalc = Math.round(input.budgetMonthly * 2 * (deal.bonusPercent / 100));
      milesCalc = Math.max(milesCalc, deal.milesMax ?? 0);
    }
    if (milesCalc === 0) continue;

    eligibleActions.push({
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
      eligibility: { eligible: true, reason: "" },
    });
  }

  // STEP 6: Sort — RULE 4: Trip urgency prioritization
  const hasUpcomingTrip = profile.nextTripDate !== null;
  const tripMonthsAway = hasUpcomingTrip
    ? Math.max(
        1,
        Math.ceil(
          (profile.nextTripDate!.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30),
        ),
      )
    : Infinity;

  eligibleActions.sort((a, b) => {
    // Trip-relevant actions first if trip is within deadline
    if (hasUpcomingTrip && tripMonthsAway <= input.deadlineMonths) {
      const aUrgent = a.monthStart <= tripMonthsAway;
      const bUrgent = b.monthStart <= tripMonthsAway;
      if (aUrgent && !bUrgent) return -1;
      if (!aUrgent && bUrgent) return 1;
    }
    if (a.isPriority && !b.isPriority) return -1;
    if (!a.isPriority && b.isPriority) return 1;
    return b.milesEstimate - a.milesEstimate;
  });

  eligibleActions.forEach((a, i) => {
    a.rank = i + 1;
  });
  ineligibleActions.forEach((a, i) => {
    a.rank = i + 1;
  });

  // STEP 7: Totals
  const totalMiles = eligibleActions.reduce((sum, a) => sum + a.milesEstimate, 0);
  const coveragePct = milesNeeded > 0 ? totalMiles / milesNeeded : 1;

  // STEP 8: Monthly timeline with per-action distribution
  const timeline: TimelinePoint[] = [];
  let cumulative = currentBalance;
  const monthlyGain = Math.round(totalMiles / Math.max(1, input.deadlineMonths));

  for (let month = 1; month <= input.deadlineMonths; month++) {
    cumulative += monthlyGain;
    const isMilestone = month % 3 === 0 || month === 1 || month === input.deadlineMonths;
    if (isMilestone) {
      timeline.push({
        month,
        label:
          month === 1
            ? "Début du plan"
            : month === input.deadlineMonths
              ? "Objectif !"
              : `Mois ${month}`,
        cumulative: Math.min(cumulative, input.targetMiles),
        pct: Math.min(100, Math.round((cumulative / input.targetMiles) * 100)),
      });
    }
  }

  // STEP 9: Breakdown
  const breakdown: BreakdownItem[] = [
    {
      label: "Cartes bancaires",
      miles: eligibleActions
        .filter((a) => a.type === "credit_card")
        .reduce((s, a) => s + a.milesEstimate, 0),
      color: "#185FA5",
    },
    {
      label: "Portail shopping",
      miles: eligibleActions
        .filter((a) => a.type === "portal")
        .reduce((s, a) => s + a.milesEstimate, 0),
      color: "#1D9E75",
    },
    {
      label: "Bonus transfert",
      miles: eligibleActions
        .filter((a) => a.type === "transfer" || a.type === "transfer_bonus")
        .reduce((s, a) => s + a.milesEstimate, 0),
      color: "#EF9F27",
    },
    {
      label: "Hôtels",
      miles: eligibleActions
        .filter((a) => a.type === "hotel")
        .reduce((s, a) => s + a.milesEstimate, 0),
      color: "#534AB7",
    },
    {
      label: "Dining",
      miles: eligibleActions
        .filter((a) => a.type === "dining")
        .reduce((s, a) => s + a.milesEstimate, 0),
      color: "#D85A30",
    },
    {
      label: "Parrainage",
      miles: eligibleActions
        .filter((a) => a.type === "referral")
        .reduce((s, a) => s + a.milesEstimate, 0),
      color: "#9FE1CB",
    },
    {
      label: "Status Run",
      miles: eligibleActions
        .filter((a) => a.type === "status_run")
        .reduce((s, a) => s + a.milesEstimate, 0),
      color: "#E5604D",
    },
  ].filter((b) => b.miles > 0);

  // STEP 10: Personalized warnings
  const warnings: string[] = [];
  if (coveragePct < 0.8) {
    warnings.push(
      `Avec ton profil actuel, le plan couvre ${Math.round(coveragePct * 100)}% de ton objectif. Augmente ton budget ou rallonge le délai.`,
    );
  }
  if (profile.newCardsLast24Months >= 4) {
    warnings.push(
      `Tu as ouvert ${profile.newCardsLast24Months} cartes en 24 mois. Les émetteurs vont probablement refuser de nouvelles demandes.`,
    );
  }
  if (hasUpcomingTrip && tripMonthsAway <= 2 && totalMiles < input.targetMiles) {
    warnings.push(
      `Ton voyage à ${profile.nextTripDestination} est dans ${tripMonthsAway} mois — certaines actions ne seront pas créditées à temps.`,
    );
  }
  if (incomeToNumber(profile.annualIncomeRange) < 30000 && eligibleActions.some((a) => a.type === "credit_card")) {
    warnings.push(
      "Avec des revenus <30k€, les cartes premium ont un taux d'acceptation plus faible. Prévois un plan B.",
    );
  }

  // STEP 11: Value summary (1 mile ≈ 0.01-0.02€ depending on cabin)
  const centsPerMile = profile.nextTripCabin === "first" ? 2.5 : profile.nextTripCabin === "business" ? 1.8 : 1.0;
  const totalEuros = Math.round((totalMiles * centsPerMile) / 100);
  const perMonthEuros = Math.round(totalEuros / Math.max(1, input.deadlineMonths));

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
    actions: eligibleActions,
    ineligibleActions,
    timeline,
    breakdown,
    warnings,
    valueSummary: { totalEuros, perMonthEuros, centsPerMile },
  };
}
