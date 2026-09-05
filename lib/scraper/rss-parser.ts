import { RawDeal } from "./base-scraper";

const RSS_SOURCES = [
  { url: "https://fr.thepointsguy.com/feed/", programCode: "FB" },
  { url: "https://viewfromthewing.com/feed/", programCode: "FB" },
  { url: "https://www.doctorofcredit.com/feed/", programCode: "AMEX_MR" },
  { url: "https://liveandletsfly.com/feed/", programCode: "FB" },
];

const MILES_KEYWORDS = [
  "bonus", "miles", "points", "transfer", "transfert", "avios",
  "flying blue", "miles & more", "aeroplan", "mileageplus",
  "skymiles", "credit card", "carte bancaire", "welcome offer",
  "sign-up bonus", "earning", "promotion", "offre",
];

function detectDealType(title: string, description: string): RawDeal["type"] {
  const text = (title + " " + description).toLowerCase();
  if (text.includes("transfer") || text.includes("transfert")) return "transfer_bonus";
  if (text.includes("shopping") || text.includes("portal") || text.includes("portail")) return "shopping";
  if (text.includes("credit card") || text.includes("carte") || text.includes("card")) return "credit_card";
  if (text.includes("hotel") || text.includes("hôtel") || text.includes("bonvoy") || text.includes("hilton")) return "hotel";
  if (text.includes("dining") || text.includes("restaurant")) return "dining";
  if (text.includes("refer") || text.includes("parrain")) return "referral";
  return "flight_bonus";
}

function extractBonusPercent(text: string): number | undefined {
  const match = text.match(/(\d+)\s*%/);
  if (match) return parseInt(match[1]);
  return undefined;
}

function extractMiles(text: string): number | undefined {
  const match = text.match(/(\d[\d,\s]*)\s*(miles|points|avios)/i);
  if (match) return parseInt(match[1].replace(/[,\s]/g, ""));
  return undefined;
}

function isMilesRelated(title: string, description: string): boolean {
  const text = (title + " " + description).toLowerCase();
  return MILES_KEYWORDS.some((kw) => text.includes(kw));
}

export async function scrapeRSSFeeds(): Promise<RawDeal[]> {
  const deals: RawDeal[] = [];

  for (const source of RSS_SOURCES) {
    try {
      console.log(`[RSS] Scraping ${source.url}...`);
      const res = await fetch(source.url, {
        headers: { "User-Agent": "MilesRadarBot/1.0 (contact@milesradar.com)" },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) {
        console.log(`[RSS] ${source.url} retourné ${res.status}`);
        continue;
      }

      const xml = await res.text();

      const items = xml.split("<item>").slice(1);
      for (const item of items.slice(0, 20)) {
        const title = item.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/s)?.[1]?.trim() ?? "";
        const description =
          item
            .match(/<description[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/s)?.[1]
            ?.replace(/<[^>]+>/g, "")
            .trim() ?? "";
        const link = item.match(/<link[^>]*>(.*?)<\/link>/s)?.[1]?.trim() ?? "";
        const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim();

        if (!isMilesRelated(title, description)) continue;

        if (pubDate) {
          const articleDate = new Date(pubDate);
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          if (articleDate < thirtyDaysAgo) continue;
        }

        deals.push({
          programCode: source.programCode,
          title: title.slice(0, 200),
          description: description.slice(0, 500),
          type: detectDealType(title, description),
          bonusPercent: extractBonusPercent(title + " " + description),
          milesMax: extractMiles(title + " " + description),
          sourceUrl: link,
        });
      }

      console.log(`[RSS] ${source.url} → ${deals.length} deals cumulés`);
    } catch (err) {
      console.error(`[RSS] Erreur sur ${source.url}:`, err);
    }
  }

  return deals;
}
