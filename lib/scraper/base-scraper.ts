export interface RawDeal {
  programCode: string;
  title: string;
  description: string;
  type: "transfer_bonus" | "shopping" | "credit_card" | "hotel" | "dining" | "referral" | "flight_bonus";
  milesMax?: number;
  bonusPercent?: number;
  sourceUrl: string;
  expiresAt?: Date;
}

export async function checkRobotsTxt(baseUrl: string): Promise<boolean> {
  try {
    const robotsUrl = new URL("/robots.txt", baseUrl).toString();
    const res = await fetch(robotsUrl, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return true;
    const text = await res.text();
    const lines = text.split("\n");
    let userAgentAll = false;
    for (const line of lines) {
      if (line.toLowerCase().includes("user-agent: *")) userAgentAll = true;
      if (userAgentAll && line.toLowerCase().startsWith("disallow: /") && line.trim() === "Disallow: /") {
        return false;
      }
    }
    return true;
  } catch {
    return true;
  }
}
