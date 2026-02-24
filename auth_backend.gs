/********************************************************************
 * FILE    : auth_backend.gs
 * MODULE  : SYSTEME DE CONNEXION — GTARP
 * AUTHOR  : Stephen
 * VERSION : 1.1.0 — PRO GTARP (LOGS + ROBUSTESSE)
 ********************************************************************/

/* ============================================================
   Vérifie si un utilisateur existe et est validé
   ============================================================ */
function checkUser(nom, prenom) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("USERS");
  if (!sheet) {
    Logger.log("❌ Feuille USERS introuvable !");
    return { exists: false };
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const idxNom = headers.indexOf("Nom");
  const idxPrenom = headers.indexOf("Prenom");
  const idxValid = headers.indexOf("Validation");

  if (idxNom === -1 || idxPrenom === -1 || idxValid === -1) {
    Logger.log("❌ Colonnes manquantes dans USERS !");
    return { exists: false };
  }

  for (let i = 1; i < data.length; i++) {
    if (data[i][idxNom] === nom && data[i][idxPrenom] === prenom) {
      return {
        exists: true,
        validated: data[i][idxValid] === true
      };
    }
  }

  return { exists: false };
}

/* ============================================================
   Enregistre une demande de connexion (Nom + Prénom)
   ============================================================ */
function registerUserRequest(nom, prenom) {
  Logger.log("🔥 registerUserRequest() REÇU → " + nom + " " + prenom);

  const sheet = SpreadsheetApp.getActive().getSheetByName("USERS");
  if (!sheet) {
    Logger.log("❌ Feuille USERS introuvable !");
    return false;
  }

  try {
    sheet.appendRow([nom, prenom, new Date(), false]);
    Logger.log("🟩 Ligne ajoutée dans USERS.");
    return true;

  } catch (err) {
    Logger.log("❌ ERREUR appendRow() : " + err);
    return false;
  }
}