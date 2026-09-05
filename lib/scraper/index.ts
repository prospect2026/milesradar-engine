import { prisma } from "@/lib/prisma";
import { scrapeRSSFeeds } from "./rss-parser";
import { scrapePlaywrightSources } from "./playwright-scraper";
import { RawDeal } from "./base-scraper";

async function storeDeal(deal: RawDeal): Promise<boolean> {
  const program = await prisma.program.findUnique({
    where: { code: deal.programCode },
  });
  if (!program) {
    console.log(`[Store] Programme ${deal.programCode} introuvable — skip`);
    return false;
  }

  const existing = await prisma.deal.findFirst({
    where: {
      sourceUrl: deal.sourceUrl,
      title: deal.title,
      isActive: true,
    },
  });

  if (existing) {
    console.log(`[Store] Deal déjà en DB : "${deal.title}" — skip`);
    return false;
  }

  await prisma.deal.create({
    data: {
      programId: program.id,
      title: deal.title,
      description: deal.description,
      type: deal.type,
      milesMax: deal.milesMax,
      bonusPercent: deal.bonusPercent,
      sourceUrl: deal.sourceUrl,
      expiresAt: deal.expiresAt,
      isVerified: false,
      isHot: (deal.bonusPercent ?? 0) >= 50,
      isActive: true,
    },
  });

  console.log(`[Store] Deal enregistré : "${deal.title}"`);
  return true;
}

export async function runScraper(options?: { skipPlaywright?: boolean }): Promise<{
  rssDeals: number;
  playwrightDeals: number;
  newDeals: number;
  totalDeals: number;
  errors: string[];
}> {
  console.log("[Scraper] Démarrage...");
  const errors: string[] = [];
  let newDeals = 0;

  // SOURCE 1 — RSS Feeds
  let rssDeals: RawDeal[] = [];
  try {
    rssDeals = await scrapeRSSFeeds();
    console.log(`[Scraper] RSS → ${rssDeals.length} deals potentiels`);
  } catch (err) {
    errors.push(`RSS: ${err}`);
  }

  // SOURCE 2 — Playwright (can be skipped)
  let playwrightDeals: RawDeal[] = [];
  if (!options?.skipPlaywright) {
    try {
      playwrightDeals = await scrapePlaywrightSources();
      console.log(`[Scraper] Playwright → ${playwrightDeals.length} deals potentiels`);
    } catch (err) {
      errors.push(`Playwright: ${err}`);
    }
  }

  const allDeals = [...rssDeals, ...playwrightDeals];
  for (const deal of allDeals) {
    const stored = await storeDeal(deal);
    if (stored) newDeals++;
  }

  const totalDeals = await prisma.deal.count({ where: { isActive: true } });

  console.log(`[Scraper] Terminé — ${newDeals} nouveaux deals | ${totalDeals} total en DB`);

  return {
    rssDeals: rssDeals.length,
    playwrightDeals: playwrightDeals.length,
    newDeals,
    totalDeals,
    errors,
  };
}
