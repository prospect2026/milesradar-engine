"use client";

import { useState, useEffect } from "react";

interface ProgramOption {
  id: string;
  code: string;
  name: string;
  parentName: string;
}

interface ActionEligibility {
  eligible: boolean;
  reason: string;
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
  eligibility: ActionEligibility;
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
  ineligibleActions: PlanAction[];
  timeline: TimelinePoint[];
  breakdown: BreakdownItem[];
  warnings: string[];
  valueSummary: { totalEuros: number; perMonthEuros: number; centsPerMile: number };
}

const fmt = (n: number) => n.toLocaleString("fr-FR");

function parseNotes(notes: string) {
  return {
    condition: notes.match(/Condition\s*:\s*([^.]+)/i)?.[1]?.trim(),
    delay: notes.match(/Délai\s*[^:]*:\s*([^.]+)/i)?.[1]?.trim(),
    eligibility: notes.match(/Éligibilité\s*:\s*([^.]+)/i)?.[1]?.trim(),
    steps: notes.match(/Étape\s*\d+\s*:\s*([^\n.]+)/gi)?.map((s) => s.trim()),
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
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showIneligible, setShowIneligible] = useState(false);

  useEffect(() => {
    fetch("/api/programs")
      .then((r) => r.json())
      .then(setPrograms)
      .catch(() => {});
    const savedEmail = typeof window !== "undefined" ? localStorage.getItem("mr_email") : null;
    if (savedEmail) setEmail(savedEmail);
  }, []);

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

  const coverageBg = (pct: number) => {
    if (pct >= 1) return "bg-green-500";
    if (pct >= 0.8) return "bg-orange-400";
    return "bg-red-400";
  };

  const confidenceBar = (score: number) => {
    const filled = Math.round(score / 10);
    const empty = 10 - filled;
    const color =
      score >= 90 ? "text-green-600" : score >= 70 ? "text-teal-600" : "text-yellow-600";
    return (
      <span className={`text-xs font-mono ${color}`}>
        [{"█".repeat(filled)}
        {"░".repeat(empty)}] {score}%
      </span>
    );
  };

  // Determine hero action
  const heroAction = result?.actions?.[0] ?? null;
  const thisWeekActions = result?.actions?.filter((a) => a.monthStart <= 1) ?? [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Inputs bar */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                placeholder="ton@email.com"
              />
            </div>
            <div className="min-w-[160px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">Programme</label>
              <select
                value={targetProgramCode}
                onChange={(e) => setTargetProgramCode(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              >
                {programs.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-32">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Cible ({fmt(targetMiles)})
              </label>
              <input
                type="range"
                min={50000}
                max={2000000}
                step={50000}
                value={targetMiles}
                onChange={(e) => setTargetMiles(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>
            <div className="w-28">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {deadlineMonths} mois
              </label>
              <input
                type="range"
                min={3}
                max={36}
                value={deadlineMonths}
                onChange={(e) => setDeadlineMonths(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>
            <div className="w-28">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {fmt(budgetMonthly)}&euro;/m
              </label>
              <input
                type="range"
                min={200}
                max={5000}
                step={100}
                value={budgetMonthly}
                onChange={(e) => setBudgetMonthly(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>
            <button
              onClick={generate}
              disabled={loading}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? "..." : "Générer"}
            </button>
          </div>
        </div>

        {/* Empty state */}
        {!result && !loading && !error && (
          <div className="bg-white rounded-xl p-16 shadow-sm border border-gray-100 text-center">
            <p className="text-gray-400 text-lg mb-2">Ton plan personnalisé t&apos;attend</p>
            <p className="text-gray-300 text-sm">Remplis tes paramètres et clique sur Générer</p>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-xl p-16 shadow-sm border border-gray-100 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent mb-4" />
            <p className="text-gray-500">Analyse de ton profil en cours...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">{error}</div>
        )}

        {result && (
          <div className="space-y-6">
            {/* SECTION 1 — Hero: Ce que tu fais cette semaine */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 text-white">
              <p className="text-sm font-medium text-teal-100 mb-1">Cette semaine, fais ça :</p>
              {heroAction ? (
                <>
                  <h2 className="text-2xl font-bold mb-2">{heroAction.title}</h2>
                  <p className="text-teal-100 text-sm mb-3">
                    {heroAction.description.split(".")[0]}.
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="bg-white/20 px-3 py-1 rounded-lg text-sm font-semibold">
                      +{fmt(heroAction.milesEstimate)} miles
                    </span>
                    {thisWeekActions.length > 1 && (
                      <span className="text-teal-200 text-sm">
                        + {thisWeekActions.length - 1} autres actions ce mois-ci
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-lg">Aucune action disponible pour ton profil</p>
              )}
            </div>

            {/* SECTION 2 — Value Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                <p className="text-2xl font-bold text-teal-600">{fmt(result.totalMilesEstimate)}</p>
                <p className="text-xs text-gray-500">Miles générés</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {fmt(result.valueSummary.totalEuros)} &euro;
                </p>
                <p className="text-xs text-gray-500">Valeur estimée</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(result.coveragePct * 100)}%
                </p>
                <p className="text-xs text-gray-500">Couverture objectif</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {fmt(result.valueSummary.perMonthEuros)} &euro;
                </p>
                <p className="text-xs text-gray-500">Par mois en valeur</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{fmt(result.currentBalance)} actuellement</span>
                <span>{fmt(result.targetMiles)} objectif</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${coverageBg(result.coveragePct)}`}
                  style={{
                    width: `${Math.min(100, Math.round(result.coveragePct * 100))}%`,
                  }}
                />
              </div>
            </div>

            {/* SECTION 3 — Personalized Warnings */}
            {result.warnings.length > 0 && (
              <div className="space-y-2">
                {result.warnings.map((w, i) => (
                  <div
                    key={i}
                    className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3"
                  >
                    <span className="text-amber-500 text-lg flex-shrink-0">!</span>
                    <p className="text-sm text-amber-800">{w}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Status run banner */}
            {result.statusRunRecommendation?.recommended && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                <p className="font-semibold text-orange-800 mb-1">
                  Status Run recommandé &middot; Tu es à{" "}
                  {result.statusRunRecommendation.gapMiles
                    ? `${fmt(result.statusRunRecommendation.gapMiles)} XP`
                    : `${result.statusRunRecommendation.gapSegments} segments`}{" "}
                  du {result.statusRunRecommendation.nextTier}
                </p>
                <p className="text-sm text-orange-700">
                  {result.statusRunRecommendation.explanation}
                </p>
              </div>
            )}

            {/* SECTION 4 — Monthly Calendar */}
            {result.timeline.length > 0 && (
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Calendrier mensuel</h3>
                <div className="space-y-3">
                  {result.timeline.map((t) => (
                    <div key={t.month} className="flex items-center gap-3">
                      <div className="w-16 text-xs font-medium text-gray-500">{t.label}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-4 relative">
                        <div
                          className="h-4 rounded-full bg-teal-500 transition-all"
                          style={{ width: `${Math.min(100, t.pct)}%` }}
                        />
                        <span className="absolute right-2 top-0.5 text-[10px] font-semibold text-gray-600">
                          {t.pct}%
                        </span>
                      </div>
                      <span className="w-24 text-right text-xs font-medium text-gray-600">
                        {fmt(t.cumulative)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Breakdown */}
            {result.breakdown.length > 0 && (
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Sources de miles</h3>
                <div className="flex rounded-full overflow-hidden h-4 mb-3">
                  {result.breakdown.map((b) => (
                    <div
                      key={b.label}
                      style={{
                        width: `${(b.miles / result.totalMilesEstimate) * 100}%`,
                        backgroundColor: b.color,
                      }}
                      title={`${b.label}: ${fmt(b.miles)}`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {result.breakdown.map((b) => (
                    <div key={b.label} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: b.color }}
                      />
                      {b.label}: {fmt(b.miles)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 5 — Eligible Actions */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Tes actions ({result.actions.length})
              </h3>
              <div className="space-y-4">
                {result.actions.map((a) => {
                  const parsed = a.notes ? parseNotes(a.notes) : null;
                  const typeInfo = TYPE_LABELS[a.type] || {
                    label: a.type,
                    bg: "bg-gray-100",
                    text: "text-gray-700",
                  };

                  return (
                    <div
                      key={a.rank}
                      className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">
                          {a.rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-900 text-sm">{a.title}</p>
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded font-medium ${typeInfo.bg} ${typeInfo.text}`}
                            >
                              {typeInfo.label}
                            </span>
                            {a.confidenceScore === 95 && (
                              <span className="text-xs bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded animate-pulse">
                                LIVE
                              </span>
                            )}
                            {a.isPriority && a.confidenceScore !== 95 && (
                              <span className="text-xs bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded">
                                Priorité
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                            {a.description.split(".").slice(0, 2).join(".")}.
                          </p>

                          {parsed &&
                            (parsed.condition ||
                              parsed.eligibility ||
                              parsed.delay ||
                              parsed.steps) && (
                              <div className="mt-2 space-y-1 text-xs">
                                {parsed.condition && (
                                  <p className="text-gray-700">
                                    <span className="font-semibold text-gray-900">Condition :</span>{" "}
                                    {parsed.condition}
                                  </p>
                                )}
                                {parsed.eligibility && (
                                  <p className="text-gray-700">
                                    <span className="font-semibold text-gray-900">
                                      Éligibilité :
                                    </span>{" "}
                                    {parsed.eligibility}
                                  </p>
                                )}
                                {parsed.delay && (
                                  <p className="text-gray-700">
                                    <span className="font-semibold text-gray-900">Délai :</span>{" "}
                                    {parsed.delay}
                                  </p>
                                )}
                              </div>
                            )}

                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-400">Mois {a.monthStart}</span>
                            {confidenceBar(a.confidenceScore)}
                          </div>
                        </div>

                        <p className="text-sm font-bold text-teal-600 whitespace-nowrap pl-2">
                          {fmt(a.milesEstimate)} mi
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 6 — Ineligible Actions Accordion */}
            {result.ineligibleActions.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setShowIneligible(!showIneligible)}
                  className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-lg">&#128274;</span>
                    <h3 className="text-sm font-semibold text-gray-500">
                      Actions non disponibles ({result.ineligibleActions.length})
                    </h3>
                  </div>
                  <span
                    className={`text-gray-400 transition-transform ${showIneligible ? "rotate-180" : ""}`}
                  >
                    &#9660;
                  </span>
                </button>

                {showIneligible && (
                  <div className="px-5 pb-5 space-y-3">
                    {result.ineligibleActions.map((a) => {
                      const typeInfo = TYPE_LABELS[a.type] || {
                        label: a.type,
                        bg: "bg-gray-100",
                        text: "text-gray-700",
                      };

                      return (
                        <div
                          key={`inel-${a.rank}`}
                          className="border border-gray-100 rounded-lg p-4 opacity-60"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-sm font-bold">
                              &#215;
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-gray-600 text-sm line-through">
                                  {a.title}
                                </p>
                                <span
                                  className={`text-xs px-1.5 py-0.5 rounded font-medium ${typeInfo.bg} ${typeInfo.text}`}
                                >
                                  {typeInfo.label}
                                </span>
                              </div>
                              <p className="text-xs text-red-500 font-medium mt-1">
                                {a.eligibility.reason}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {fmt(a.milesEstimate)} miles potentiels
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
