async function runCron() {
  console.log(`[Cron Local] ${new Date().toISOString()} — Démarrage`);
  try {
    const res = await fetch("http://localhost:3001/api/cron", {
      headers: { Authorization: "Bearer milesradar-cron-2026" },
    });
    const data = await res.json();
    console.log("[Cron Local] Résultat:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("[Cron Local] Erreur:", err);
  }
}

runCron();
setInterval(runCron, 60 * 60 * 1000);
console.log("[Cron Local] Planifié — toutes les heures");
