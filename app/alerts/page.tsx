"use client";

import { useState, useEffect } from "react";

interface ProgramOption {
  id: string;
  code: string;
  name: string;
  parentName: string;
}

export default function AlertsPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [threshold, setThreshold] = useState(30);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/programs").then((r) => r.json()).then(setPrograms);
  }, []);

  const checkSubscription = async () => {
    if (!email) return;
    const res = await fetch(`/api/alerts?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (data.id) {
      setSubscribed(true);
      setFirstName(data.firstName ?? "");
      setSelectedPrograms(data.programIds ?? []);
      setThreshold(data.threshold ?? 30);
    } else {
      setSubscribed(false);
    }
  };

  const toggleProgram = (id: string) => {
    setSelectedPrograms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const subscribe = async () => {
    if (!email) return;
    setLoading(true);
    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, firstName, programIds: selectedPrograms, threshold }),
    });
    if (res.ok) {
      setSubscribed(true);
      setMessage("Inscription confirmée ! Tu recevras les alertes par email.");
    }
    setLoading(false);
  };

  const unsubscribe = async () => {
    setLoading(true);
    await fetch(`/api/alerts?email=${encodeURIComponent(email)}`, { method: "DELETE" });
    setSubscribed(false);
    setMessage("Desinscription confirmée.");
    setLoading(false);
  };

  const topPrograms = programs.filter((p) => {
    const top = ["FB", "AV", "MM", "SK", "UA", "CA", "AMEX_MR", "CHASE_UR", "MR", "HH", "EK", "SQ", "AA", "HY", "CITI_TY"];
    return top.includes(p.code);
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Alertes Miles</h1>
        <p className="text-gray-500 mb-8">
          Recois un email des qu&apos;un deal correspond a tes programmes
        </p>

        {message && (
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6 text-sm text-teal-800">
            {message}
          </div>
        )}

        {/* Email + Name */}
        <section className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ton email</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={checkSubscription}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                placeholder="nom@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prenom</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                placeholder="Jean"
              />
            </div>
          </div>
          {subscribed && (
            <p className="mt-3 text-sm text-teal-600 font-medium">Deja inscrit avec cet email</p>
          )}
        </section>

        {/* Program Selection */}
        <section className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Programmes suivis</h2>
          <p className="text-sm text-gray-500 mb-4">
            Selectionne les programmes qui t&apos;interessent. Aucune selection = tous les programmes.
          </p>
          <div className="flex flex-wrap gap-2">
            {topPrograms.map((p) => (
              <button
                key={p.id}
                onClick={() => toggleProgram(p.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                  selectedPrograms.includes(p.id)
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-teal-300"
                }`}
              >
                {p.code}
              </button>
            ))}
          </div>
          {selectedPrograms.length > 0 && (
            <p className="mt-3 text-xs text-gray-400">
              {selectedPrograms.length} programme{selectedPrograms.length > 1 ? "s" : ""} selectionne{selectedPrograms.length > 1 ? "s" : ""}
            </p>
          )}
        </section>

        {/* Threshold */}
        <section className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Seuil minimum</h2>
          <p className="text-sm text-gray-500 mb-4">
            Ne recevoir que les deals avec un bonus superieur a ce seuil (ou les deals HOT)
          </p>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value))}
              className="flex-1 accent-teal-600"
            />
            <span className="text-lg font-bold text-teal-600 w-16 text-right">{threshold}%</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {threshold === 0 ? "Tous les deals" : `Bonus >= ${threshold}% ou deals HOT uniquement`}
          </p>
        </section>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={subscribe}
            disabled={!email || loading}
            className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "..." : subscribed ? "Mettre a jour" : "S'inscrire aux alertes"}
          </button>
          {subscribed && (
            <button
              onClick={unsubscribe}
              disabled={loading}
              className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Se desinscrire
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
