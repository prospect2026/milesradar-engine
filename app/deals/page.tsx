"use client";

import { useState, useEffect, useCallback } from "react";

interface Program {
  code: string;
  name: string;
  parentName: string;
  badgeBg: string;
  badgeText: string;
}

interface Deal {
  id: string;
  title: string;
  description: string;
  type: string;
  bonusPercent: number | null;
  milesMax: number | null;
  sourceUrl: string;
  isHot: boolean;
  expiresAt: string | null;
  detectedAt: string;
  program: Program;
}

const TYPE_FILTERS = [
  { value: "", label: "Tous" },
  { value: "transfer_bonus", label: "Bonus transfert" },
  { value: "shopping", label: "Shopping" },
  { value: "credit_card", label: "Cartes" },
  { value: "hotel", label: "Hotels" },
  { value: "flight_bonus", label: "Bonus vol" },
  { value: "dining", label: "Dining" },
  { value: "referral", label: "Parrainage" },
];

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDeals = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (typeFilter) params.set("type", typeFilter);
    if (programFilter) params.set("program", programFilter);
    const res = await fetch(`/api/deals?${params.toString()}`);
    if (res.ok) setDeals(await res.json());
    setLoading(false);
  }, [typeFilter, programFilter]);

  useEffect(() => {
    fetch("/api/programs").then((r) => r.json()).then(setPrograms);
  }, []);

  useEffect(() => {
    loadDeals();
  }, [loadDeals]);

  const typeLabel = (type: string) => TYPE_FILTERS.find((t) => t.value === type)?.label ?? type;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Deals & Promotions</h1>
        <p className="text-gray-500 mb-6">
          Offres vérifiées pour maximiser tes miles — bonus transfert, shopping, cartes et plus
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1">
            {TYPE_FILTERS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTypeFilter(t.value)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  typeFilter === t.value
                    ? "bg-teal-600 text-white font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 bg-white"
          >
            <option value="">Tous les programmes</option>
            {programs.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-600 border-t-transparent" />
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Aucun deal pour ces filtres</p>
            <p className="text-gray-400 text-sm mt-1">Essaie avec d&apos;autres criteres</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {deals.map((deal) => (
              <a
                key={deal.id}
                href={deal.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all block"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {deal.isHot && (
                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded">
                          HOT
                        </span>
                      )}
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded"
                        style={{ backgroundColor: deal.program.badgeBg, color: deal.program.badgeText }}
                      >
                        {deal.program.code}
                      </span>
                      <span className="text-xs text-gray-400">{deal.program.name}</span>
                      <span className="text-xs text-gray-300">|</span>
                      <span className="text-xs text-gray-400">{typeLabel(deal.type)}</span>
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 mb-1">{deal.title}</h3>
                    {deal.description && <p className="text-sm text-gray-500 mb-2 line-clamp-2">{deal.description}</p>}

                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>Detecte le {formatDate(deal.detectedAt)}</span>
                      {deal.expiresAt && (
                        <span className="text-orange-500 font-medium">
                          Expire le {formatDate(deal.expiresAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {deal.bonusPercent && (
                      <span className="text-2xl font-bold text-orange-600">{deal.bonusPercent}%</span>
                    )}
                    {deal.milesMax && (
                      <span className="text-sm font-semibold text-teal-600">
                        {deal.milesMax.toLocaleString("fr-FR")} mi max
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          {deals.length} deal{deals.length !== 1 ? "s" : ""} affiche{deals.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
