/********************************************************************************************
 * MODULE : LECTURES MÉTIER — PRO 2026
 * Fournit toutes les fonctions nécessaires à lireCaisseEntiere()
 ********************************************************************************************/

console.log("📘 [lire_sheet] Chargement des fonctions lireXXX()…");

/* ============================================================
   📄 Lire les types d’opérations
============================================================ */
function lireTypesOperations() {
  console.log("📘 [lireTypesOperations] Lecture…");

  const sheet = SpreadsheetApp.getActive().getSheetByName(FEUILLE_TYPES_OP);
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();

  const result = values.flat().filter(v => v);
  console.log("🟩 [lireTypesOperations] Types :", result);
  return result;
}

/* ============================================================
   👥 Lire les employés
============================================================ */
function lireEmployes() {
  console.log("📘 [lireEmployes] Lecture…");

  const sheet = SpreadsheetApp.getActive().getSheetByName(FEUILLE_EMPLOYES);
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();

  const result = values.map(r => ({
    id: r[0],
    nom: r[1],
    prenom: r[2],
    role: r[3],
    entreprise: r[4]
  }));

  console.log("🟩 [lireEmployes] Employés :", result.length);
  return result;
}

/* ============================================================
   📞 Lire l’annuaire
============================================================ */
function lireAnnuaire() {
  console.log("📘 [lireAnnuaire] Lecture…");

  const sheet = SpreadsheetApp.getActive().getSheetByName(FEUILLE_ANNUAIRE);
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();

  const result = values.map(r => ({
    nom: r[0],
    prenom: r[1],
    telephone: r[2]
  }));

  console.log("🟩 [lireAnnuaire] Contacts :", result.length);
  return result;
}

/* ============================================================
   💳 Lire les moyens de paiement
============================================================ */
function lireMoyensPaiement() {
  console.log("📘 [lireMoyensPaiement] Lecture…");

  const sheet = SpreadsheetApp.getActive().getSheetByName(FEUILLE_MOYENS_PAIEMENT);
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();

  const result = values.flat().filter(v => v);
  console.log("🟩 [lireMoyensPaiement] Moyens :", result);
  return result;
}

/* ============================================================
   📦 Lire les articles
============================================================ */
function lireArticles() {
  console.log("📘 [lireArticles] Lecture…");

  const sheet = SpreadsheetApp.getActive().getSheetByName(FEUILLE_ARTICLES);
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).getValues();

  const result = values.map(r => ({
    nom: r[0],
    prixAchat: r[1],
    prixVente: r[2],
    stock: r[3],
    categorie: r[4],
    typeCaisse: r[5],
    types: r[6],
    entreprise: r[7]
  }));

  console.log("🟩 [lireArticles] Articles :", result.length);
  return result;
}

console.log("🟩 [lire_sheet] Toutes les fonctions lireXXX() sont opérationnelles.");