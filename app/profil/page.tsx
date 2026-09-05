"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const COUNTRIES = [
  { value: "FR", label: "France" },
  { value: "UK", label: "Royaume-Uni" },
  { value: "BE", label: "Belgique" },
  { value: "CH", label: "Suisse" },
  { value: "LU", label: "Luxembourg" },
  { value: "DE", label: "Allemagne" },
  { value: "ES", label: "Espagne" },
  { value: "IT", label: "Italie" },
  { value: "PT", label: "Portugal" },
  { value: "NL", label: "Pays-Bas" },
  { value: "CA", label: "Canada" },
  { value: "US", label: "États-Unis" },
  { value: "AE", label: "Émirats Arabes Unis" },
  { value: "SG", label: "Singapour" },
  { value: "AU", label: "Australie" },
  { value: "MA", label: "Maroc" },
  { value: "SN", label: "Sénégal" },
  { value: "OTHER", label: "Autre" },
];

const BANKS = [
  { value: "", label: "— Sélectionner —" },
  { value: "bnp", label: "BNP Paribas" },
  { value: "lcl", label: "LCL" },
  { value: "sg", label: "Société Générale" },
  { value: "credit_agricole", label: "Crédit Agricole" },
  { value: "boursorama", label: "Boursorama" },
  { value: "autre", label: "Autre" },
];

const INCOME_RANGES = [
  { value: "", label: "— Sélectionner —" },
  { value: "moins_30k", label: "Moins de 30k€" },
  { value: "30k_50k", label: "30-50k€" },
  { value: "50k_100k", label: "50-100k€" },
  { value: "plus_100k", label: "Plus de 100k€" },
];

const FLIGHTS_OPTIONS = ["0", "1-2", "3-5", "6-10", "10+"];
const CABIN_OPTIONS = ["economy", "business", "first"];

interface ProgramOption {
  id: string;
  code: string;
  name: string;
  parentName: string;
}

interface BalanceEntry {
  programId: string;
  programCode: string;
  programName: string;
  balance: number;
}

const TOP_PROGRAMS = ["FB", "AV", "MM", "SK", "AMEX_MR"];

export default function ProfilPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [country, setCountry] = useState("FR");
  const [hasAmexGold, setHasAmexGold] = useState(false);
  const [hasAmexPlatine, setHasAmexPlatine] = useState(false);
  const [hasVisaInfinite, setHasVisaInfinite] = useState(false);
  const [hasMarriottCard, setHasMarriottCard] = useState(false);
  const [hasHiltonCard, setHasHiltonCard] = useState(false);
  const [hasAirlineCard, setHasAirlineCard] = useState(false);
  const [hasChaseCard, setHasChaseCard] = useState(false);
  const [hasCitiCard, setHasCitiCard] = useState(false);
  const [monthlySpend, setMonthlySpend] = useState(1000);
  const [flightsPerYear, setFlightsPerYear] = useState("3-5");
  const [preferredCabin, setPreferredCabin] = useState("business");
  const [balances, setBalances] = useState<BalanceEntry[]>([]);
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [showAddProgram, setShowAddProgram] = useState(false);

  // New fields
  const [mainBank, setMainBank] = useState("");
  const [annualIncomeRange, setAnnualIncomeRange] = useState("");
  const [hasExistingAmex, setHasExistingAmex] = useState(false);
  const [isHomeowner, setIsHomeowner] = useState(false);
  const [mainAirline, setMainAirline] = useState("");
  const [travelType, setTravelType] = useState("");
  const [departureCity, setDepartureCity] = useState("");
  const [flyingBlueStatus, setFlyingBlueStatus] = useState("");
  const [aviosStatus, setAviosStatus] = useState("");
  const [marriottStatus, setMarriottStatus] = useState("");
  const [hiltonStatus, setHiltonStatus] = useState("");

  useEffect(() => {
    fetch("/api/programs")
      .then((r) => r.json())
      .then((data: ProgramOption[]) => {
        setPrograms(data);
        const topBalances = data
          .filter((p) => TOP_PROGRAMS.includes(p.code))
          .map((p) => ({ programId: p.id, programCode: p.code, programName: `${p.name} (${p.parentName})`, balance: 0 }));
        setBalances(topBalances);
      })
      .catch(() => {});
  }, []);

  const flightsToInt = (v: string) => {
    const map: Record<string, number> = { "0": 0, "1-2": 2, "3-5": 4, "6-10": 8, "10+": 12 };
    return map[v] ?? 4;
  };

  const regionFromCountry = (c: string) => {
    if (["FR", "BE", "CH", "UK", "LU", "DE", "ES", "IT", "PT", "NL"].includes(c)) return "EU";
    if (c === "US") return "US";
    if (c === "CA") return "CA";
    if (c === "AE") return "UAE";
    if (c === "SG") return "SG";
    if (c === "AU") return "AU";
    return "WORLDWIDE";
  };

  const handleSave = async () => {
    if (!email) return;
    setSaving(true);

    const body = {
      email,
      firstName: firstName || null,
      country,
      region: regionFromCountry(country),
      hasAmexGold,
      hasAmexPlatine,
      hasVisaInfinite,
      hasMarriottCard,
      hasHiltonCard,
      hasAirlineCard,
      hasChaseCard,
      hasCitiCard,
      monthlySpendEur: monthlySpend,
      flightsPerYear: flightsToInt(flightsPerYear),
      preferredCabin,
      mainBank: mainBank || null,
      annualIncomeRange: annualIncomeRange || null,
      hasExistingAmex,
      isHomeowner,
      mainAirline: mainAirline || null,
      travelType: travelType || null,
      departureCity: departureCity || null,
      flyingBlueStatus: flyingBlueStatus || null,
      aviosStatus: aviosStatus || null,
      marriottStatus: marriottStatus || null,
      hiltonStatus: hiltonStatus || null,
      balances: balances.filter((b) => b.balance > 0).map((b) => ({ programId: b.programId, balance: b.balance })),
    };

    await fetch("/api/profil", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);
    router.push("/goal");
  };

  const addProgram = (programId: string) => {
    const prog = programs.find((p) => p.id === programId);
    if (!prog || balances.some((b) => b.programId === programId)) return;
    setBalances([...balances, { programId: prog.id, programCode: prog.code, programName: `${prog.name} (${prog.parentName})`, balance: 0 }]);
    setShowAddProgram(false);
  };

  const selectClass = "w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon profil</h1>
        <p className="text-gray-500 mb-8">On personnalise ton plan d&apos;accumulation avec ces infos</p>

        {/* SECTION 1 — Identité */}
        <section className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Qui es-tu ?</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                placeholder="Ton prénom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                placeholder="ton@email.com"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={selectClass}
            >
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* SECTION 2 — Situation bancaire */}
        <section className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Ta situation bancaire</h2>
          <p className="text-sm text-gray-500 mb-4">Ces infos nous aident à vérifier ton éligibilité aux cartes</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banque principale</label>
              <select value={mainBank} onChange={(e) => setMainBank(e.target.value)} className={selectClass}>
                {BANKS.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Revenus annuels</label>
              <select value={annualIncomeRange} onChange={(e) => setAnnualIncomeRange(e.target.value)} className={selectClass}>
                {INCOME_RANGES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
              <input type="checkbox" checked={hasExistingAmex} onChange={(e) => setHasExistingAmex(e.target.checked)} className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
              As-tu une carte Amex active ?
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
              <input type="checkbox" checked={isHomeowner} onChange={(e) => setIsHomeowner(e.target.checked)} className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
              Propriétaire ?
            </label>
          </div>
        </section>

        {/* SECTION 3 — Cartes actuelles */}
        <section className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Tes cartes actuelles</h2>
          <p className="text-sm text-gray-500 mb-4">On ne recommandera jamais une carte que tu as déjà</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Amex Gold", value: hasAmexGold, set: setHasAmexGold },
              { label: "Amex Platine", value: hasAmexPlatine, set: setHasAmexPlatine },
              { label: "Visa Infinite (LCL, BNP, etc.)", value: hasVisaInfinite, set: setHasVisaInfinite },
              { label: "Carte co-branded Marriott", value: hasMarriottCard, set: setHasMarriottCard },
              { label: "Carte co-branded Hilton", value: hasHiltonCard, set: setHasHiltonCard },
              { label: "Carte co-branded compagnie aérienne", value: hasAirlineCard, set: setHasAirlineCard },
              { label: "Chase Sapphire (si USA)", value: hasChaseCard, set: setHasChaseCard },
              { label: "Citi Premier (si USA)", value: hasCitiCard, set: setHasCitiCard },
            ].map((card) => (
              <label key={card.label} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={card.value}
                  onChange={(e) => card.set(e.target.checked)}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                {card.label}
              </label>
            ))}
          </div>
        </section>

        {/* SECTION 4 — Profil voyageur */}
        <section className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ton profil voyageur</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compagnie principale</label>
              <select value={mainAirline} onChange={(e) => setMainAirline(e.target.value)} className={selectClass}>
                <option value="">— Sélectionner —</option>
                <option value="airfrance">Air France</option>
                <option value="easyjet">easyJet</option>
                <option value="ryanair">Ryanair</option>
                <option value="lufthansa">Lufthansa</option>
                <option value="british_airways">British Airways</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de voyage</label>
              <select value={travelType} onChange={(e) => setTravelType(e.target.value)} className={selectClass}>
                <option value="">— Sélectionner —</option>
                <option value="pro">Professionnel</option>
                <option value="perso">Personnel</option>
                <option value="mixte">Mixte</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville de départ</label>
            <input
              type="text"
              value={departureCity}
              onChange={(e) => setDepartureCity(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              placeholder="Paris, Lyon, Marseille..."
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dépenses mensuelles sur tes cartes
            </label>
            <input
              type="range"
              min={200}
              max={5000}
              step={100}
              value={monthlySpend}
              onChange={(e) => setMonthlySpend(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>200 &euro;</span>
              <span className="font-semibold text-teal-700">{monthlySpend.toLocaleString("fr-FR")} &euro;</span>
              <span>5 000 &euro;</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">On calcule tes miles portail avec ça</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Vols par an</label>
            <div className="flex gap-2">
              {FLIGHTS_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFlightsPerYear(opt)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    flightsPerYear === opt
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cabine préférée</label>
            <div className="flex gap-2">
              {CABIN_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setPreferredCabin(opt)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    preferredCabin === opt
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {opt === "economy" ? "Economy" : opt === "business" ? "Business" : "First"}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5 — Statuts programmes */}
        <section className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Tes statuts programmes</h2>
          <p className="text-sm text-gray-500 mb-4">Tes statuts actuels influencent les miles bonus et les opportunités</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Flying Blue</label>
              <select value={flyingBlueStatus} onChange={(e) => setFlyingBlueStatus(e.target.value)} className={selectClass}>
                <option value="">— Pas de statut —</option>
                <option value="membre">Membre</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
                <option value="ultimate">Ultimate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avios / British Airways</label>
              <select value={aviosStatus} onChange={(e) => setAviosStatus(e.target.value)} className={selectClass}>
                <option value="">— Pas de statut —</option>
                <option value="blue">Blue</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marriott Bonvoy</label>
              <select value={marriottStatus} onChange={(e) => setMarriottStatus(e.target.value)} className={selectClass}>
                <option value="">— Pas de statut —</option>
                <option value="member">Member</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
                <option value="titanium">Titanium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hilton Honors</label>
              <select value={hiltonStatus} onChange={(e) => setHiltonStatus(e.target.value)} className={selectClass}>
                <option value="">— Pas de statut —</option>
                <option value="member">Member</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="diamond">Diamond</option>
              </select>
            </div>
          </div>
        </section>

        {/* SECTION 6 — Soldes actuels */}
        <section className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Tes soldes actuels</h2>
          <p className="text-sm text-gray-500 mb-4">
            Ajoute tes miles actuels pour que le plan parte de ta vraie situation
          </p>

          <div className="space-y-3">
            {balances.map((b, i) => (
              <div key={b.programId} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-56 truncate">{b.programName}</span>
                <input
                  type="number"
                  min={0}
                  value={b.balance || ""}
                  onChange={(e) => {
                    const newBalances = [...balances];
                    newBalances[i] = { ...b, balance: Number(e.target.value) || 0 };
                    setBalances(newBalances);
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  placeholder="0"
                />
                <span className="text-sm text-gray-400">miles</span>
              </div>
            ))}
          </div>

          {!showAddProgram ? (
            <button
              onClick={() => setShowAddProgram(true)}
              className="mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              + Ajouter un programme
            </button>
          ) : (
            <select
              className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
              onChange={(e) => addProgram(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Choisir un programme...
              </option>
              {programs
                .filter((p) => !balances.some((b) => b.programId === p.id))
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.parentName})
                  </option>
                ))}
            </select>
          )}
        </section>

        {/* SAVE */}
        <button
          onClick={handleSave}
          disabled={!email || saving}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors text-lg"
        >
          {saving ? "Enregistrement..." : "Enregistrer mon profil"}
        </button>
      </div>
    </div>
  );
}
