/********************************************************************
 * FILE    : api.gs
 * MODULE  : BACKEND — ROUTEUR API CENTRALISÉ
 * AUTHOR  : Stephen
 * VERSION : 4.7.0 — PRO GTARP
 * ------------------------------------------------------------------
 * Description :
 *   - Point d’entrée unique pour toutes les actions backend
 *   - Appelé via google.script.run.apiPublic(action, payload)
 *   - Architecture propre, maintenable et extensible
 *   - Retour standardisé pour le front
 ********************************************************************/

console.log("🟩 [api] Routeur API initialisé.");




/* ============================================================
   🧰 WRAPPER DE RÉPONSE STANDARDISÉ
============================================================ */
function apiResponse(status, data = null, message = "") {
  return { status, data, message };
}



/* ============================================================
   📦 LECTURE COMPLÈTE DE LA CAISSE
   (Fonction manquante — maintenant ajoutée)
============================================================ */
function lireCaisseEntiere() {
  try {
    console.log("📦 [caisse_api] Lecture complète de la caisse…");

    const ss = SpreadsheetApp.getActive();

    /* ---------------------- TYPES OP ---------------------- */
    const sheetTypes = ss.getSheetByName(FEUILLE_TYPES_OP);
    const typesOp = sheetTypes
      .getRange(2, COL_TYPES_OP.Operation, sheetTypes.getLastRow() - 1, 1)
      .getValues()
      .flat()
      .filter(v => v);

    /* ---------------------- EMPLOYÉS ---------------------- */
    const sheetEmp = ss.getSheetByName(FEUILLE_EMPLOYES);
    const employes = sheetEmp
      .getRange(2, 1, sheetEmp.getLastRow() - 1, 5)
      .getValues()
      .map(row => ({
        id:         row[COL_EMPLOYES.ID - 1],
        nom:        row[COL_EMPLOYES.Nom - 1],
        prenom:     row[COL_EMPLOYES.Prenom - 1],
        role:       row[COL_EMPLOYES.Role - 1],
        entreprise: row[COL_EMPLOYES.Entreprise - 1]
      }));

    /* ---------------------- ANNUAIRE ---------------------- */
    const sheetAnn = ss.getSheetByName(FEUILLE_ANNUAIRE);
    const annuaire = sheetAnn
      .getRange(2, 1, sheetAnn.getLastRow() - 1, 3)
      .getValues()
      .map(row => ({
        nom:       row[COL_ANNUAIRE.Nom - 1],
        prenom:    row[COL_ANNUAIRE.Prenom - 1],
        telephone: row[COL_ANNUAIRE.Telephone - 1]
      }));

    /* ---------------------- PAIEMENTS ---------------------- */
    const sheetPay = ss.getSheetByName(FEUILLE_MOYENS_PAIEMENT);
    const paiements = sheetPay
      .getRange(2, COL_MOYENS_PAIEMENT.Moyen, sheetPay.getLastRow() - 1, 1)
      .getValues()
      .flat()
      .filter(v => v);

    /* ---------------------- ARTICLES ---------------------- */
    const sheetArt = ss.getSheetByName(FEUILLE_ARTICLES);
    const articles = sheetArt
      .getRange(2, 1, sheetArt.getLastRow() - 1, 8)
      .getValues()
      .map(row => ({
        nom:        row[COL_ARTICLES.Nom - 1],
        prixAchat:  Number(row[COL_ARTICLES.PrixAchat - 1]) || 0,
        prixVente:  Number(row[COL_ARTICLES.PrixVente - 1]) || 0,
        stock:      Number(row[COL_ARTICLES.Stock - 1]) || 0,
        categorie:  row[COL_ARTICLES.Categorie - 1],
        typeCaisse: row[COL_ARTICLES.TypeCaisse - 1],
        types:      row[COL_ARTICLES.Types - 1],
        entreprise: row[COL_ARTICLES.Entreprise - 1]
      }));

    /* ---------------------- ASSEMBLAGE ---------------------- */
    const payload = {
      typesOp,
      employes,
      annuaire,
      paiements,
      articles
    };

    console.log("🟩 [caisse_api] Payload caisse généré :", payload);
    return payload;

  } catch (err) {
    console.error("❌ [caisse_api] ERREUR lireCaisseEntiere :", err);
    throw err;
  }
}



/* ============================================================
   🚀 API — Point d’entrée interne
============================================================ */
function api(action, payload) {
  console.log(`🟦 [api] Appel reçu → action="${action}" | payload=`, payload);

  try {

    switch (action) {

      /* ---------------------- CAISSE ---------------------- */
      case "lireCaisseEntiere":
        return apiResponse(STATUS_OK, lireCaisseEntiere());

      case "getMontantsCaisses":
        return apiResponse(STATUS_OK, getMontantsCaisses());

      /* ---------------------- LOTERIE ---------------------- */
      case FN_LIRE_TICKETS:
        return apiResponse(STATUS_OK, getAllTickets());

      /* ---------------------- ÉCRITURE ---------------------- */
      case FN_ECRIRE_CAISSE:
        return apiResponse(STATUS_OK, ecrireCaisse(payload));

      /* ---------------------- ACTION INCONNUE ---------------------- */
      default:
        console.error("❌ [api] Action inconnue :", action);
        return apiResponse(STATUS_ERROR, null, `Action inconnue : ${action}`);
    }

  } catch (err) {
    console.error("❌ [api] ERREUR interne :", err);
    return apiResponse(STATUS_ERROR, null, "Erreur interne API : " + String(err));
  }
}



/* ============================================================
   🌐 API PUBLIC — EXPOSEE À LA WEBAPP
============================================================ */
function apiPublic(action, payload) {
  console.log(`🟦 [apiPublic] Appel WebApp → action="${action}"`);
  const result = api(action, payload);
  console.log("🟩 [apiPublic] Résultat renvoyé :", JSON.stringify(result));
  return result;
}