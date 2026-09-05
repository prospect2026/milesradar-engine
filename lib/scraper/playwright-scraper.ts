import { RawDeal, checkRobotsTxt } from "./base-scraper";

interface ScraperTarget {
  programCode: string;
  url: string;
  name: string;
}

const TARGETS: ScraperTarget[] = [
  {
    programCode: "FB",
    url: "https://www.flyingblue.com/en/earn-miles/partners/transfer-partners",
    name: "Flying Blue Transfer Partners",
  },
  {
    programCode: "AV",
    url: "https://www.britishairways.com/en-gb/executive-club/points/convert-points/transfer",
    name: "Avios Transfer Partners",
  },
  {
    programCode: "MM",
    url: "https://www.miles-and-more.com/de/en/earn/travel/bonus-miles.html",
    name: "Miles & More Bonus",
  },
];

async function scrapeTarget(target: ScraperTarget): Promise<RawDeal[]> {
  const deals: RawDeal[] = [];

  const allowed = await checkRobotsTxt(target.url);
  if (!allowed) {
    console.log(`[Playwright] ${target.name} interdit par robots.txt — skip`);
    return [];
  }

  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "MilesRadarBot/1.0 (contact@milesradar.com)",
    extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
  });

  try {
    const page = await context.newPage();
    await page.goto(target.url, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);

    const pageText = await page.evaluate(() => document.body.innerText);

    const bonusPatterns = [
      { regex: /(\d+)%\s*bonus/gi, type: "transfer_bonus" as const },
      { regex: /earn\s*(\d+)x\s*miles/gi, type: "shopping" as const },
      { regex: /transfer\s*bonus/gi, type: "transfer_bonus" as const },
      { regex: /limited\s*time\s*offer/gi, type: "flight_bonus" as const },
      { regex: /offre\s*limit[ée]e/gi, type: "flight_bonus" as const },
      { regex: /bonus\s*miles/gi, type: "flight_bonus" as const },
    ];

    let foundBonus = false;
    for (const pattern of bonusPatterns) {
      const matches = pageText.match(pattern.regex);
      if (matches && matches.length > 0) {
        foundBonus = true;
        const bonusText = matches[0];
        const bonusPercent = parseInt(bonusText.match(/\d+/)?.[0] ?? "0");

        deals.push({
          programCode: target.programCode,
          title: `${target.name} — ${bonusText}`,
          description: `Offre détectée sur ${target.name}. Vérifier la page source pour les conditions.`,
          type: pattern.type,
          bonusPercent: bonusPercent > 0 ? bonusPercent : undefined,
          sourceUrl: target.url,
        });
        break;
      }
    }

    if (!foundBonus && pageText.length > 500) {
      deals.push({
        programCode: target.programCode,
        title: `${target.name} — Offre potentielle`,
        description: `Page chargée. Vérification manuelle recommandée.`,
        type: "transfer_bonus",
        sourceUrl: target.url,
      });
    }
  } catch (err) {
    console.error(`[Playwright] Erreur sur ${target.name}:`, err);
  } finally {
    await browser.close();
  }

  return deals;
}

export async function scrapePlaywrightSources(): Promise<RawDeal[]> {
  const allDeals: RawDeal[] = [];
  let errors = 0;

  for (const target of TARGETS) {
    try {
      console.log(`[Playwright] Scraping ${target.name}...`);
      const deals = await scrapeTarget(target);
      allDeals.push(...deals);
      console.log(`[Playwright] ${target.name} → ${deals.length} deal(s)`);

      await new Promise((r) => setTimeout(r, 3000));
    } catch {
      errors++;
      console.error(`[Playwright] Erreur #${errors} sur ${target.name}`);
      if (errors >= 3) {
        console.error("[Playwright] Circuit breaker — 3 erreurs → arrêt");
        break;
      }
    }
  }

  return allDeals;
}
