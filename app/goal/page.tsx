"use client";

import { useState, useEffect } from "react";

interface ProgramOption {
  id: string;
  code: string;
  name: string;
  parentName: string;
}

interface PlanAction {
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

interface TimelinePoint {
  month: number;
  label: string;
  cumulative: number;
  pct: number;
}

interface BreakdownItem {
  label: string;
  miles: number;
  color: string;
}

interface StatusRunRec {
  recommended: boolean;
  currentTier: string;
  nextTier: string;
  gapMiles?: number;
  gapSegments?: number;
  bonusMilesIfUpgraded: number;
  explanation: string;
}

interface PlanResult {
  targetProgram: { code: string; name: string };
  targetMiles: number;
  currentBalance: number;
  milesNeeded: number;
  totalMilesEstimate: number;
  coveragePct: number;
  deadlineMonths: number;
  currentTier: string;
  earningMultiplier: number;
  statusRunRecommendation: StatusRunRec | null;
  actions: PlanAction[];
  timeline: TimelinePoint[];
  breakdown: BreakdownItem[];
  warning: string | null;
}

const fmt = (n: number) => n.toLocaleString("fr-FR");

function parseNotes(notes: string) {
  return {
    condition: notes.match(/Condition\s*:\s*([^.]+)/i)?.[1]?.trim(),
    delay: notes.match(/Délai\s*[^:]*:\s*([^.]+)/i)?.[1]?.trim(),
    eligibility: notes.match(/Éligibilité\s*:\s*([^.]+)/i)?.[1]?.trim(),
    steps: notes.match(/Étape\s*\d+\s*:\s*([^\n.]+)/gi)?.map(s => s.trim()),
  };
}

const TYPE_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  credit_card: { label: "Carte", bg: "bg-blue-100", text: "text-blue-700" },
  portal: { label: "Portail", bg: "bg-green-100", text: "text-green-700" },
  transfer: { label: "Transfert", bg: "bg-amber-100", text: "text-amber-700" },
  transfer_bonus: { label: "Bonus transfert", bg: "bg-amber-100", text: "text-amber-700" },
  hotel: { label: "Hôtel", bg: "bg-purple-100", text: "text-purple-700" },
  dining: { label: "Dining", bg: "bg-orange-100", text: "text-orange-700" },
  referral: { label: "Parrainage", bg: "bg-teal-100", text: "text-teal-700" },
  status_run: { label: "Status Run", bg: "bg-red-100", text: "text-red-700" },
  shopping: { label: "Shopping", bg: "bg-pink-100", text: "text-pink-700" },
};

export default function GoalPage() {
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [email, setEmail] = useState("");
  const [targetProgramCode, setTargetProgramCode] = useState("FB");
  const [targetMiles, setTargetMiles] = useState(500000);
  const [deadlineMonths, setDeadlineMonths] = useState(12);
  const [budgetMonthly, setBudgetMonthly] = useState(500);

  const [profileLoaded, setProfileLoaded] = useState(false);
  const [monthlySpendEur, setMonthlySpendEur] = useState(1000);
  const [hasAmexGold, setHasAmexGold] = useState(false);
  const [hasAmexPlatine, setHasAmexPlatine] = useState(false);
  const [hasVisaInfinite, setHasVisaInfinite] = useState(false);
  const [hasMarriottCard, setHasMarriottCard] = useState(false);
  const [hasHiltonCard, setHasHiltonCard] = useState(false);
  const [country, setCountry] = useState("FR");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/programs")
      .then((r) => r.json())
      .then(setPrograms)
      .catch(() => {});
  }, []);

  const loadProfile = async () => {
    if (!email) return;
    const res = await fetch(`/api/profil?email=${encodeURIComponent(email)}`);
    if (res.ok) {
      setProfileLoaded(true);
    } else {
      setProfileLoaded(false);
    }
  };

  const generate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const body: Record<string, unknown> = {
      targetProgramCode,
      targetMiles,
      deadlineMonths,
      budgetMonthly,
    };

    if (email) body.email = email;

    if (!profileLoaded) {
      body.monthlySpendEur = monthlySpendEur;
      body.hasAmexGold = hasAmexGold;
      body.hasAmexPlatine = hasAmexPlatine;
      body.hasVisaInfinite = hasVisaInfinite;
      body.hasMarriottCard = hasMarriottCard;
      body.hasHiltonCard = hasHiltonCard;
      body.country = country;
    }

    const res = await fetch("/api/goal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erreur lors de la génération");
      setLoading(false);
      return;
    }

    const plan = await res.json();
    setResult(plan);
    setLoading(false);
  };

  const coverageColor = (pct: number) => {
    if (pct >= 1) return "text-green-600";
    if (pct >= 0.8) return "text-orange-500";
    return "text-red-500";
  };

  const coverageBg = (pct: number) => {
    if (pct >= 1) return "bg-green-500";
    if (pct >= 0.8) return "bg-orange-400";
    return "bg-red-400";
  };

  const confidenceBar = (score: number) => {
    const filled = Math.round(score / 10);
    const empty = 10 - filled;
    const color = score >= 90 ? "text-green-600" : score >= 70 ? "text-teal-600" : "text-yellow-600";
    return (
      <span className={`text-xs font-mono ${color}`}>
        [{"█".repeat(filled)}{"░".repeat(empty)}] {score}%
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Goal Engine</h1>
        <p className="text-gray-500 mb-8">Ton plan d&apos;accumulation personnalisé</p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT: Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Email */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setProfileLoaded(false); }}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  placeholder="ton@email.com"
                />
                <button onClick={loadProfile} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-lg text-gray-700 transition-colors">
                  Charger
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {profileLoaded ? "Profil chargé" : "Entre ton email pour charger ton profil et personnaliser le plan"}
              </p>
            </div>

            {/* Program */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-1">Programme cible</label>
              <select
                value={targetProgramCode}
                onChange={(e) => setTargetProgramCode(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              >
                {programs.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name} ({p.parentName})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Miles */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cible de miles</label>
              <input
                type="range"
                min={50000}
                max={2000000}
                step={50000}
                value={targetMiles}
                onChange={(e) => setTargetMiles(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
              <p className="text-center font-semibold text-teal-700 mt-1">{fmt(targetMiles)} miles</p>
            </div>

            {/* Deadline */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-1">Délai</label>
              <input
                type="range"
                min={3}
                max={36}
                step={1}
                value={deadlineMonths}
                onChange={(e) => setDeadlineMonths(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
              <p className="text-center font-semibold text-teal-700 mt-1">{deadlineMonths} mois</p>
            </div>

            {/* Budget */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget mensuel</label>
              <input
                type="range"
                min={200}
                max={5000}
                step={100}
                value={budgetMonthly}
                onChange={(e) => setBudgetMonthly(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
              <p className="text-center font-semibold text-teal-700 mt-1">{fmt(budgetMonthly)} &euro; / mois</p>
            </div>

            {/* Inline profile (if not loaded) */}
            {!profileLoaded && (
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Situation actuelle</h3>
                <div className="space-y-2 mb-4">
                  {[
                    { label: "Amex Gold", val: hasAmexGold, set: setHasAmexGold },
                    { label: "Amex Platine", val: hasAmexPlatine, set: setHasAmexPlatine },
                    { label: "Visa Infinite", val: hasVisaInfinite, set: setHasVisaInfinite },
                    { label: "Carte Marriott", val: hasMarriottCard, set: setHasMarriottCard },
                    { label: "Carte Hilton", val: hasHiltonCard, set: setHasHiltonCard },
                  ].map((c) => (
                    <label key={c.label} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input type="checkbox" checked={c.val} onChange={(e) => c.set(e.target.checked)} className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                      {c.label}
                    </label>
                  ))}
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dépenses mensuelles</label>
                <input type="range" min={200} max={5000} step={100} value={monthlySpendEur} onChange={(e) => setMonthlySpendEur(Number(e.target.value))} className="w-full accent-teal-600" />
                <p className="text-center text-sm text-teal-700 font-semibold mt-1">{fmt(monthlySpendEur)} &euro;</p>
                <label className="block text-sm font-medium text-gray-700 mt-3 mb-1">Pays</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900">
                  <option value="FR">France</option>
                  <option value="UK">Royaume-Uni</option>
                  <option value="US">États-Unis</option>
                  <option value="CA">Canada</option>
                  <option value="DE">Allemagne</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generate}
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors text-lg"
            >
              {loading ? "Analyse en cours..." : "Générer mon plan"}
            </button>
          </div>

          {/* RIGHT: Result */}
          <div className="lg:col-span-3">
            {!result && !loading && !error && (
              <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
                <p className="text-gray-400 text-lg">Remplis tes paramètres pour générer ton plan personnalisé</p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent mb-4" />
                <p className="text-gray-500">Analyse en cours...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">{error}</div>
            )}

            {result && (
              <div className="space-y-6">
                {/* Status Run Banner */}
                {result.statusRunRecommendation?.recommended && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                    <p className="font-semibold text-orange-800 mb-1">
                      Status Run recommandé · Tu es à {result.statusRunRecommendation.gapMiles ? `${fmt(result.statusRunRecommendation.gapMiles)} QM` : `${result.statusRunRecommendation.gapSegments} segments`} du {result.statusRunRecommendation.nextTier}
                    </p>
                    <p className="text-sm text-orange-700">
                      Passe {result.statusRunRecommendation.nextTier} en 2-3 mois et gagne {fmt(result.statusRunRecommendation.bonusMilesIfUpgraded)} miles supplémentaires.
                    </p>
                    <p className="text-sm text-orange-600 mt-1">{result.statusRunRecommendation.explanation}</p>
                  </div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                    <p className="text-2xl font-bold text-teal-600">{fmt(result.totalMilesEstimate)}</p>
                    <p className="text-xs text-gray-500">Miles générés</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                    <p className={`text-2xl font-bold ${coverageColor(result.coveragePct)}`}>
                      {Math.round(result.coveragePct * 100)}%
                    </p>
                    <p className="text-xs text-gray-500">Couverture</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                    <p className="text-2xl font-bold text-gray-900">{result.actions.length}</p>
                    <p className="text-xs text-gray-500">Actions</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                    <p className="text-2xl font-bold text-gray-900">&times;{result.earningMultiplier}</p>
                    <p className="text-xs text-gray-500">{result.currentTier}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{fmt(result.currentBalance)} actuellement</span>
                    <span>{fmt(result.targetMiles)} objectif</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${coverageBg(result.coveragePct)}`}
                      style={{ width: `${Math.min(100, Math.round(result.coveragePct * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Breakdown */}
                {result.breakdown.length > 0 && (
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Sources de miles</h3>
                    <div className="flex rounded-full overflow-hidden h-4 mb-3">
                      {result.breakdown.map((b) => (
                        <div
                          key={b.label}
                          style={{ width: `${(b.miles / result.totalMilesEstimate) * 100}%`, backgroundColor: b.color }}
                          title={`${b.label}: ${fmt(b.miles)}`}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {result.breakdown.map((b) => (
                        <div key={b.label} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                          {b.label}: {fmt(b.miles)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions List — ENRICHED */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Actions du plan</h3>
                  <div className="space-y-5">
                    {result.actions.map((a) => {
                      const parsed = a.notes ? parseNotes(a.notes) : null;
                      const typeInfo = TYPE_LABELS[a.type] || { label: a.type, bg: "bg-gray-100", text: "text-gray-700" };

                      return (
                        <div key={a.rank} className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">
                              {a.rank}
                            </div>
                            <div className="flex-1 min-w-0">
                              {/* Title row */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-gray-900 text-sm">{a.title}</p>
                                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${typeInfo.bg} ${typeInfo.text}`}>{typeInfo.label}</span>
                                {a.confidenceScore === 95 && (
                                  <span className="text-xs bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded animate-pulse">LIVE</span>
                                )}
                                {a.isPriority && a.confidenceScore !== 95 && <span className="text-xs bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded">Priorité</span>}
                              </div>

                              {/* Full description */}
                              <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{a.description}</p>

                              {a.confidenceScore === 95 && (
                                <p className="text-xs text-red-600 font-medium mt-1">Deal vérifié aujourd&apos;hui — agir rapidement</p>
                              )}

                              {/* Parsed structured details */}
                              {parsed && (parsed.condition || parsed.eligibility || parsed.delay || parsed.steps) && (
                                <div className="mt-2 space-y-1 text-xs">
                                  {parsed.condition && (
                                    <p className="text-gray-700"><span className="font-semibold text-gray-900">Condition :</span> {parsed.condition}</p>
                                  )}
                                  {parsed.eligibility && (
                                    <p className="text-gray-700"><span className="font-semibold text-gray-900">Éligibilité :</span> {parsed.eligibility}</p>
                                  )}
                                  {parsed.delay && (
                                    <p className="text-gray-700"><span className="font-semibold text-gray-900">Délai :</span> {parsed.delay}</p>
                                  )}
                                  {parsed.steps && parsed.steps.length > 0 && (
                                    <div className="mt-1">
                                      {parsed.steps.map((step, i) => (
                                        <p key={i} className="text-gray-600 pl-2">{step}</p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Meta row */}
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-gray-400">Mois {a.monthStart}</span>
                                {confidenceBar(a.confidenceScore)}
                              </div>
                            </div>

                            {/* Miles estimate */}
                            <p className="text-sm font-bold text-teal-600 whitespace-nowrap pl-2">
                              {fmt(a.milesEstimate)} mi
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Warning */}
                {result.warning && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <p className="text-sm text-red-700 font-medium">{result.warning}</p>
                  </div>
                )}

                {/* Timeline */}
                {result.timeline.length > 0 && (
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Timeline</h3>
                    <div className="space-y-2">
                      {result.timeline.map((t) => (
                        <div key={t.month} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{t.label}</span>
                          <span className="text-gray-900 font-medium">{fmt(t.cumulative)} miles ({t.pct}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
