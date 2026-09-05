"use client";

import { useState, useEffect, useCallback } from "react";

interface Program {
  code: string;
  name: string;
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
  isVerified: boolean;
  isHot: boolean;
  isActive: boolean;
  detectedAt: string;
  program: Program;
}

interface ProgramOption {
  id: string;
  code: string;
  name: string;
  parentName: string;
}

const DEAL_TYPES = [
  { value: "transfer_bonus", label: "Bonus transfert" },
  { value: "shopping", label: "Shopping" },
  { value: "credit_card", label: "Carte bancaire" },
  { value: "hotel", label: "Hôtel" },
  { value: "dining", label: "Dining" },
  { value: "referral", label: "Parrainage" },
  { value: "flight_bonus", label: "Bonus vol" },
];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [scraping, setScraping] = useState(false);
  const [scraperResult, setScraperResult] = useState<string | null>(null);
  const [sendingAlerts, setSendingAlerts] = useState(false);
  const [alertResult, setAlertResult] = useState<string | null>(null);

  // Manual deal form
  const [newDeal, setNewDeal] = useState({
    programCode: "FB",
    title: "",
    description: "",
    type: "transfer_bonus",
    bonusPercent: "",
    milesMax: "",
    sourceUrl: "",
    expiresAt: "",
  });

  const storedPw = typeof window !== "undefined" ? localStorage.getItem("admin_pw") : null;

  useEffect(() => {
    if (storedPw) {
      setPassword(storedPw);
      setAuthenticated(true);
    }
  }, [storedPw]);

  const login = () => {
    localStorage.setItem("admin_pw", password);
    setAuthenticated(true);
  };

  const loadDeals = useCallback(async () => {
    const res = await fetch("/api/admin/deals?verified=false", {
      headers: { "x-admin-password": password },
    });
    if (res.ok) setDeals(await res.json());
  }, [password]);

  const loadPrograms = useCallback(async () => {
    const res = await fetch("/api/programs");
    if (res.ok) setPrograms(await res.json());
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadDeals();
      loadPrograms();
    }
  }, [authenticated, loadDeals, loadPrograms]);

  const runScraper = async () => {
    setScraping(true);
    setScraperResult(null);
    const res = await fetch("/api/scraper", {
      method: "POST",
      headers: { "x-admin-password": password, "Content-Type": "application/json" },
      body: JSON.stringify({ skipPlaywright: true }),
    });
    const data = await res.json();
    if (res.ok) {
      setScraperResult(
        `RSS: ${data.rssDeals} détectés | Playwright: ${data.playwrightDeals} détectés | ${data.newDeals} nouveaux enregistrés | ${data.totalDeals} total en DB`
      );
      loadDeals();
    } else {
      setScraperResult(`Erreur: ${data.error}`);
    }
    setScraping(false);
  };

  const verifyDeal = async (id: string) => {
    await fetch(`/api/admin/deals/${id}`, {
      method: "PATCH",
      headers: { "x-admin-password": password, "Content-Type": "application/json" },
      body: JSON.stringify({ isVerified: true }),
    });
    loadDeals();
  };

  const rejectDeal = async (id: string) => {
    await fetch(`/api/admin/deals/${id}`, {
      method: "PATCH",
      headers: { "x-admin-password": password, "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false }),
    });
    loadDeals();
  };

  const addManualDeal = async () => {
    if (!newDeal.title || !newDeal.sourceUrl) return;
    const res = await fetch("/api/admin/deals", {
      method: "POST",
      headers: { "x-admin-password": password, "Content-Type": "application/json" },
      body: JSON.stringify(newDeal),
    });
    if (res.ok) {
      setNewDeal({ programCode: "FB", title: "", description: "", type: "transfer_bonus", bonusPercent: "", milesMax: "", sourceUrl: "", expiresAt: "" });
      loadDeals();
    }
  };

  const sendAlerts = async () => {
    setSendingAlerts(true);
    setAlertResult(null);
    const res = await fetch("/api/alerts/send", {
      method: "POST",
      headers: { "x-admin-password": password },
    });
    const data = await res.json();
    if (data.noKey) {
      setAlertResult("RESEND_API_KEY non configurée. Ajoute ta clé dans .env");
    } else {
      setAlertResult(`${data.sent} email(s) envoyé(s) | ${data.errors} erreur(s)`);
    }
    setSendingAlerts(false);
  };

  const typeLabel = (type: string) => DEAL_TYPES.find((t) => t.value === type)?.label ?? type;

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "il y a quelques minutes";
    if (hours < 24) return `il y a ${hours}h`;
    return `il y a ${Math.floor(hours / 24)}j`;
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 w-96">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Admin MilesRadar</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Mot de passe admin"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 mb-4 text-gray-900"
          />
          <button onClick={login} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg">
            Connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin — Deals</h1>
        <p className="text-gray-500 mb-8">Détecte, vérifie et gère les deals</p>

        {/* SECTION 1 — Scraper */}
        <section className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lancer le scraper</h2>
          <button
            onClick={runScraper}
            disabled={scraping}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            {scraping ? "Scraping en cours..." : "Lancer le scraper maintenant"}
          </button>
          {scraping && (
            <div className="mt-3 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-teal-600 border-t-transparent" />
              <span className="text-sm text-gray-500">Analyse des flux RSS et sources... (30-60s)</span>
            </div>
          )}
          {scraperResult && (
            <div className="mt-3 bg-teal-50 border border-teal-200 rounded-lg p-3 text-sm text-teal-800">
              {scraperResult}
            </div>
          )}
        </section>

        {/* SECTION — Alertes email */}
        <section className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Envoyer les alertes</h2>
          <button
            onClick={sendAlerts}
            disabled={sendingAlerts}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            {sendingAlerts ? "Envoi en cours..." : "Envoyer les alertes maintenant"}
          </button>
          {alertResult && (
            <div className="mt-3 bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-800">
              {alertResult}
            </div>
          )}
        </section>

        {/* SECTION 2 — Deals en attente */}
        <section className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Deals en attente de vérification
            <span className="ml-2 text-sm font-normal text-gray-400">({deals.length})</span>
          </h2>
          <p className="text-sm text-gray-500 mb-4">Vérifie chaque deal avant qu&apos;il soit visible publiquement</p>

          {deals.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucun deal en attente. Lance le scraper ou ajoute un deal manuellement.</p>
          ) : (
            <div className="space-y-3">
              {deals.map((deal) => (
                <div key={deal.id} className="border border-gray-100 rounded-lg p-4 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded"
                        style={{ backgroundColor: deal.program.badgeBg, color: deal.program.badgeText }}
                      >
                        {deal.program.code}
                      </span>
                      <span className="text-xs text-gray-400">{typeLabel(deal.type)}</span>
                      {deal.bonusPercent && <span className="text-xs font-semibold text-orange-600">{deal.bonusPercent}%</span>}
                      {deal.milesMax && <span className="text-xs font-semibold text-teal-600">{deal.milesMax.toLocaleString("fr-FR")} mi</span>}
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{deal.title}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{deal.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <a
                        href={deal.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline truncate max-w-64"
                      >
                        {deal.sourceUrl}
                      </a>
                      <span className="text-xs text-gray-400">{timeAgo(deal.detectedAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => verifyDeal(deal.id)}
                      className="bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Vérifier
                    </button>
                    <button
                      onClick={() => rejectDeal(deal.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Rejeter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 3 — Ajout manuel */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un deal manuellement</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Programme</label>
              <select
                value={newDeal.programCode}
                onChange={(e) => setNewDeal({ ...newDeal, programCode: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
              >
                {programs.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name} ({p.parentName})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newDeal.type}
                onChange={(e) => setNewDeal({ ...newDeal, type: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
              >
                {DEAL_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input
                type="text"
                value={newDeal.title}
                onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                placeholder="Bonus transfert Amex 100%"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newDeal.description}
                onChange={(e) => setNewDeal({ ...newDeal, description: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                rows={2}
                placeholder="Description de l'offre..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bonus %</label>
              <input
                type="number"
                value={newDeal.bonusPercent}
                onChange={(e) => setNewDeal({ ...newDeal, bonusPercent: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Miles max</label>
              <input
                type="number"
                value={newDeal.milesMax}
                onChange={(e) => setNewDeal({ ...newDeal, milesMax: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                placeholder="50000"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL source</label>
              <input
                type="url"
                value={newDeal.sourceUrl}
                onChange={(e) => setNewDeal({ ...newDeal, sourceUrl: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                placeholder="https://www.flyingblue.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date expiration</label>
              <input
                type="date"
                value={newDeal.expiresAt}
                onChange={(e) => setNewDeal({ ...newDeal, expiresAt: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
              />
            </div>
          </div>
          <button
            onClick={addManualDeal}
            disabled={!newDeal.title || !newDeal.sourceUrl}
            className="mt-4 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Ajouter et vérifier directement
          </button>
        </section>
      </div>
    </div>
  );
}
