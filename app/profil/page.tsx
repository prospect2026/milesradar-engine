"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AIRPORTS = [
  "CDG", "ORY", "LYS", "NCE", "BOD", "MRS", "TLS", "NTE",
  "LHR", "LGW", "AMS", "BRU", "GVA", "ZRH", "JFK", "LAX",
  "DXB", "SIN", "YUL", "Autre",
];

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

const INCOME_RANGES = [
  { value: "<25k", label: "Moins de 25k€" },
  { value: "25-40k", label: "25k – 40k€" },
  { value: "40-60k", label: "40k – 60k€" },
  { value: "60-100k", label: "60k – 100k€" },
  { value: ">100k", label: "Plus de 100k€" },
];

const CABIN_OPTIONS = [
  { value: "economy", label: "Economy" },
  { value: "premium_economy", label: "Premium Eco" },
  { value: "business", label: "Business" },
  { value: "first", label: "First" },
];

const STEPS = ["Qui es-tu ?", "Tes finances", "Programmes & cartes", "Ton voyage"];

export default function ProfilPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Step A — Identity
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("FR");
  const [homeAirport, setHomeAirport] = useState("CDG");

  // Step B — Finances
  const [annualIncomeRange, setAnnualIncomeRange] = useState("");
  const [newCardsLast24Months, setNewCardsLast24Months] = useState(0);
  const [spendTravel, setSpendTravel] = useState(0);
  const [spendDining, setSpendDining] = useState(0);
  const [spendGroceries, setSpendGroceries] = useState(0);
  const [spendOnline, setSpendOnline] = useState(0);
  const [spendOther, setSpendOther] = useState(0);
  const [hasExistingAmex, setHasExistingAmex] = useState(false);
  const [amexType, setAmexType] = useState("");

  // Step C — Programs & Cards
  const [hasAmexGold, setHasAmexGold] = useState(false);
  const [hasAmexPlatine, setHasAmexPlatine] = useState(false);
  const [hasVisaInfinite, setHasVisaInfinite] = useState(false);
  const [hasMarriottCard, setHasMarriottCard] = useState(false);
  const [hasHiltonCard, setHasHiltonCard] = useState(false);
  const [hasAirlineCard, setHasAirlineCard] = useState(false);
  const [hasChaseCard, setHasChaseCard] = useState(false);
  const [hasCitiCard, setHasCitiCard] = useState(false);
  const [flyingBlueStatus, setFlyingBlueStatus] = useState("");
  const [flyingBlueXP, setFlyingBlueXP] = useState(0);
  const [aviosStatus, setAviosStatus] = useState("");
  const [marriottStatus, setMarriottStatus] = useState("");
  const [flyingBlueBalance, setFlyingBlueBalance] = useState(0);
  const [aviosBalance, setAviosBalance] = useState(0);
  const [amexMRBalance, setAmexMRBalance] = useState(0);

  // Step D — Trip
  const [nextTripDestination, setNextTripDestination] = useState("");
  const [nextTripMonth, setNextTripMonth] = useState("");
  const [nextTripYear, setNextTripYear] = useState(new Date().getFullYear().toString());
  const [nextTripCabin, setNextTripCabin] = useState("business");
  const [flightsPerYear, setFlightsPerYear] = useState(4);
  const [travelType, setTravelType] = useState("perso");

  // Load existing profile
  useEffect(() => {
    const savedEmail = typeof window !== "undefined" ? localStorage.getItem("mr_email") : null;
    if (savedEmail) {
      setEmail(savedEmail);
      fetch(`/api/profil?email=${encodeURIComponent(savedEmail)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((p) => {
          if (!p) return;
          setFirstName(p.firstName ?? "");
          setLastName(p.lastName ?? "");
          setCountry(p.country ?? "FR");
          setHomeAirport(p.homeAirport ?? "CDG");
          setAnnualIncomeRange(p.annualIncomeRange ?? "");
          setNewCardsLast24Months(p.newCardsLast24Months ?? 0);
          setSpendTravel(p.spendTravel ?? 0);
          setSpendDining(p.spendDining ?? 0);
          setSpendGroceries(p.spendGroceries ?? 0);
          setSpendOnline(p.spendOnline ?? 0);
          setSpendOther(p.spendOther ?? 0);
          setHasExistingAmex(p.hasExistingAmex ?? false);
          setHasAmexGold(p.hasAmexGold ?? false);
          setHasAmexPlatine(p.hasAmexPlatine ?? false);
          setHasVisaInfinite(p.hasVisaInfinite ?? false);
          setHasMarriottCard(p.hasMarriottCard ?? false);
          setHasHiltonCard(p.hasHiltonCard ?? false);
          setHasAirlineCard(p.hasAirlineCard ?? false);
          setHasChaseCard(p.hasChaseCard ?? false);
          setHasCitiCard(p.hasCitiCard ?? false);
          setFlyingBlueStatus(p.flyingBlueStatus ?? "");
          setAviosStatus(p.aviosStatus ?? "");
          setMarriottStatus(p.marriottStatus ?? "");
          setFlyingBlueBalance(p.flyingBlueBalance ?? 0);
          setAviosBalance(p.aviosBalance ?? 0);
          setAmexMRBalance(p.amexMRBalance ?? 0);
          setNextTripDestination(p.nextTripDestination ?? "");
          setNextTripCabin(p.nextTripCabin ?? "business");
          setFlightsPerYear(p.flightsPerYear ?? 4);
          setTravelType(p.travelType ?? "perso");
          if (p.hasAmexGold) setAmexType("gold");
          if (p.hasAmexPlatine) setAmexType("platine");
        })
        .catch(() => {});
    }
  }, []);

  const regionFromCountry = (c: string) => {
    if (["FR", "BE", "CH", "UK", "LU", "DE", "ES", "IT", "PT", "NL"].includes(c)) return "EU";
    if (c === "US") return "US";
    if (c === "CA") return "CA";
    return "WORLDWIDE";
  };

  const totalSpend = spendTravel + spendDining + spendGroceries + spendOnline + spendOther;

  const handleSave = async () => {
    if (!email) return;
    setSaving(true);

    let nextTripDate: string | null = null;
    if (nextTripMonth && nextTripYear) {
      nextTripDate = new Date(Number(nextTripYear), Number(nextTripMonth) - 1, 15).toISOString();
    }

    const body = {
      email,
      firstName: firstName || null,
      lastName: lastName || null,
      country,
      region: regionFromCountry(country),
      homeAirport,
      annualIncomeRange: annualIncomeRange || null,
      newCardsLast24Months,
      spendTravel,
      spendDining,
      spendGroceries,
      spendOnline,
      spendOther,
      monthlySpendEur: totalSpend || 1000,
      hasExistingAmex,
      hasAmexGold: hasAmexGold || amexType === "gold",
      hasAmexPlatine: hasAmexPlatine || amexType === "platine",
      hasVisaInfinite,
      hasMarriottCard,
      hasHiltonCard,
      hasAirlineCard,
      hasChaseCard,
      hasCitiCard,
      flyingBlueStatus: flyingBlueStatus || null,
      aviosStatus: aviosStatus || null,
      marriottStatus: marriottStatus || null,
      flyingBlueBalance,
      aviosBalance,
      amexMRBalance,
      nextTripDestination: nextTripDestination || null,
      nextTripDate,
      nextTripCabin: nextTripCabin || null,
      flightsPerYear,
      travelType: travelType || null,
    };

    await fetch("/api/profil", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    localStorage.setItem("mr_email", email);
    setSaving(false);
    router.push("/goal");
  };

  const canNext = () => {
    if (step === 0) return !!email;
    return true;
  };

  const selectClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500";
  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500";
  const checkClass = "rounded border-gray-300 text-teal-600 focus:ring-teal-500";

  const SpendSlider = ({
    label,
    emoji,
    value,
    onChange,
    max = 2000,
  }: {
    label: string;
    emoji: string;
    value: number;
    onChange: (v: number) => void;
    max?: number;
  }) => (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700">
          {emoji} {label}
        </span>
        <span className="font-semibold text-gray-900">{value.toLocaleString("fr-FR")} &euro;</span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={50}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-teal-600"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => i <= step && setStep(i)}
                className={`text-xs font-medium transition-colors ${
                  i === step
                    ? "text-teal-700"
                    : i < step
                      ? "text-teal-500 cursor-pointer"
                      : "text-gray-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-teal-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP A — Identity */}
        {step === 0 && (
          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Qui es-tu ?</h2>
            <p className="text-sm text-gray-500 mb-6">On a besoin de te connaître pour personnaliser ton plan</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} placeholder="Ton prénom" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} placeholder="Ton nom" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="ton@email.com" required />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pays de résidence</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)} className={selectClass}>
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aéroport principal</label>
              <div className="flex flex-wrap gap-2">
                {AIRPORTS.map((ap) => (
                  <button
                    key={ap}
                    onClick={() => setHomeAirport(ap)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      homeAirport === ap
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {ap}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* STEP B — Finances */}
        {step === 1 && (
          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Tes finances</h2>
            <p className="text-sm text-gray-500 mb-6">Pour vérifier ton éligibilité aux cartes et calculer tes miles</p>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Revenus annuels bruts</label>
              <div className="flex flex-wrap gap-2">
                {INCOME_RANGES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setAnnualIncomeRange(r.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      annualIncomeRange === r.value
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nouvelles cartes ouvertes ces 24 derniers mois
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Les émetteurs refusent au-delà de 4-5 cartes en 24 mois
              </p>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setNewCardsLast24Months(n)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      newCardsLast24Months === n
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {n === 5 ? "5+" : n}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dépenses mensuelles par catégorie
              </label>
              <p className="text-xs text-gray-400 mb-3">
                Total : <span className="font-semibold text-teal-700">{totalSpend.toLocaleString("fr-FR")} &euro;/mois</span>
              </p>
              <div className="space-y-4">
                <SpendSlider label="Voyages & transport" emoji="✈️" value={spendTravel} onChange={setSpendTravel} />
                <SpendSlider label="Restaurants & bars" emoji="🍽️" value={spendDining} onChange={setSpendDining} max={1500} />
                <SpendSlider label="Courses alimentaires" emoji="🛒" value={spendGroceries} onChange={setSpendGroceries} max={1500} />
                <SpendSlider label="Shopping en ligne" emoji="🛍️" value={spendOnline} onChange={setSpendOnline} />
                <SpendSlider label="Autres dépenses" emoji="💳" value={spendOther} onChange={setSpendOther} />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 mb-3">
                <input type="checkbox" checked={hasExistingAmex} onChange={(e) => setHasExistingAmex(e.target.checked)} className={checkClass} />
                J&apos;ai actuellement une carte Amex active
              </label>
              {hasExistingAmex && (
                <div className="ml-6">
                  <label className="block text-xs text-gray-500 mb-1">Laquelle ?</label>
                  <div className="flex gap-2">
                    {[
                      { value: "gold", label: "Amex Gold" },
                      { value: "platine", label: "Amex Platine" },
                      { value: "green", label: "Amex Green" },
                      { value: "autre", label: "Autre" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setAmexType(opt.value);
                          if (opt.value === "gold") { setHasAmexGold(true); setHasAmexPlatine(false); }
                          if (opt.value === "platine") { setHasAmexPlatine(true); setHasAmexGold(false); }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          amexType === opt.value
                            ? "bg-teal-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* STEP C — Programs & Cards */}
        {step === 2 && (
          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Programmes & cartes</h2>
            <p className="text-sm text-gray-500 mb-6">On ne recommandera jamais une carte que tu as déjà</p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tes cartes actuelles</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Amex Gold", value: hasAmexGold, set: setHasAmexGold },
                  { label: "Amex Platine", value: hasAmexPlatine, set: setHasAmexPlatine },
                  { label: "Visa Infinite", value: hasVisaInfinite, set: setHasVisaInfinite },
                  { label: "Carte Marriott", value: hasMarriottCard, set: setHasMarriottCard },
                  { label: "Carte Hilton", value: hasHiltonCard, set: setHasHiltonCard },
                  { label: "Carte aérienne", value: hasAirlineCard, set: setHasAirlineCard },
                  { label: "Chase Sapphire", value: hasChaseCard, set: setHasChaseCard },
                  { label: "Citi Premier", value: hasCitiCard, set: setHasCitiCard },
                ].map((card) => (
                  <label key={card.label} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 py-1">
                    <input type="checkbox" checked={card.value} onChange={(e) => card.set(e.target.checked)} className={checkClass} />
                    {card.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut Flying Blue</label>
              <div className="flex gap-2 mb-2">
                {["", "silver", "gold", "platinum"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFlyingBlueStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      flyingBlueStatus === s
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {s === "" ? "Aucun" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              {["silver", "gold", "platinum"].includes(flyingBlueStatus) && (
                <div className="ml-1 mt-2">
                  <label className="block text-xs text-gray-500 mb-1">XP actuels (pour calcul status run)</label>
                  <input
                    type="number"
                    min={0}
                    value={flyingBlueXP || ""}
                    onChange={(e) => setFlyingBlueXP(Number(e.target.value) || 0)}
                    className={inputClass}
                    placeholder="Ex: 18000"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut Avios</label>
                <select value={aviosStatus} onChange={(e) => setAviosStatus(e.target.value)} className={selectClass}>
                  <option value="">Aucun</option>
                  <option value="blue">Blue</option>
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut Marriott</label>
                <select value={marriottStatus} onChange={(e) => setMarriottStatus(e.target.value)} className={selectClass}>
                  <option value="">Aucun</option>
                  <option value="member">Member</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                  <option value="titanium">Titanium</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-3">Tes soldes actuels</label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-36">Flying Blue</span>
                  <input type="number" min={0} value={flyingBlueBalance || ""} onChange={(e) => setFlyingBlueBalance(Number(e.target.value) || 0)} className={`flex-1 ${inputClass}`} placeholder="0" />
                  <span className="text-xs text-gray-400 w-10">miles</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-36">Avios</span>
                  <input type="number" min={0} value={aviosBalance || ""} onChange={(e) => setAviosBalance(Number(e.target.value) || 0)} className={`flex-1 ${inputClass}`} placeholder="0" />
                  <span className="text-xs text-gray-400 w-10">miles</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-36">Amex MR</span>
                  <input type="number" min={0} value={amexMRBalance || ""} onChange={(e) => setAmexMRBalance(Number(e.target.value) || 0)} className={`flex-1 ${inputClass}`} placeholder="0" />
                  <span className="text-xs text-gray-400 w-10">points</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* STEP D — Trip */}
        {step === 3 && (
          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Ton prochain voyage</h2>
            <p className="text-sm text-gray-500 mb-6">On priorise les actions en fonction de ta date de voyage</p>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <input
                type="text"
                value={nextTripDestination}
                onChange={(e) => setNextTripDestination(e.target.value)}
                className={inputClass}
                placeholder="New York, Tokyo, Maldives..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mois de départ</label>
                <select value={nextTripMonth} onChange={(e) => setNextTripMonth(e.target.value)} className={selectClass}>
                  <option value="">—</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                      {new Date(2000, i).toLocaleString("fr-FR", { month: "long" })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                <select value={nextTripYear} onChange={(e) => setNextTripYear(e.target.value)} className={selectClass}>
                  {[2026, 2027, 2028].map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cabine souhaitée</label>
              <div className="flex gap-2">
                {CABIN_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setNextTripCabin(opt.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      nextTripCabin === opt.value
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Vols par an</label>
              <input
                type="range"
                min={0}
                max={20}
                step={1}
                value={flightsPerYear}
                onChange={(e) => setFlightsPerYear(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
              <p className="text-center text-sm font-semibold text-teal-700 mt-1">{flightsPerYear} vols/an</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de voyage</label>
              <div className="flex gap-2">
                {[
                  { value: "perso", label: "Personnel" },
                  { value: "pro", label: "Professionnel" },
                  { value: "mixte", label: "Mixte" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTravelType(opt.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      travelType === opt.value
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Retour
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => canNext() && setStep(step + 1)}
              disabled={!canNext()}
              className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white font-semibold transition-colors"
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={!email || saving}
              className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white font-semibold transition-colors text-lg"
            >
              {saving ? "Enregistrement..." : "Enregistrer & voir mon plan"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
