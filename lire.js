/********************************************************************************************
 * FILE    : lire.gs
 * MODULE  : GTARP — LECTURE LOGIQUE (CAISSE & ALIAS)
 * AUTHOR  : Stephen
 * VERSION : 1.0.0 — PRO 2026 (Alias lireFeuille + Ultra Logs)
 * ------------------------------------------------------------------------------------------
 * RÔLE :
 *   - Fournir les fonctions de lecture "logiques" utilisées par l’API
 *   - lireCaisseEntiere() → utilisé par FN_LIRE_CAISSE_INITIALE
 *   - S’appuie sur lireFeuille() défini dans lire_sheet.gs
 ********************************************************************************************/

console.log("📘 [lire.gs] Module chargé — version 1.0.0");

/* ==========================================================================================
   🟦 LECTURE CAISSE INITIALE
   - Appelée par FN_LIRE_CAISSE_INITIALE (API)
   - Utilise lireFeuille(FEUILLE_RESUME) comme moteur central
========================================================================================== */
function lireCaisseEntiere() {
  console.log("📘 [lireCaisseEntiere] Lecture de la caisse via lireFeuille(FEUILLE_RESUME)…");

  try {
    const data = lireFeuille(FEUILLE_RESUME);

    console.log("🟩 [lireCaisseEntiere] Lignes renvoyées :", data.length);
    return data;

  } catch (err) {
    console.error("❌ [lireCaisseEntiere] ERREUR :", err);
    throw err;
  }
}

/********************************************************************************************
 * ✔ FIN DU MODULE
 ********************************************************************************************/
console.log("🟩 [lire.gs] Module opérationnel.");