/********************************************************************
     FILE    : auth_backend.gs
     MODULE  : SYSTEME DE CONNEXION — GTARP
     AUTHOR  : Stephen
     VERSION : 1.0.0 — PRO GTARP
---------------------------------------------------------------------
     DESCRIPTION :
       - Vérifie si un utilisateur existe et est validé
       - Enregistre une demande de connexion (Nom + Prénom)
       - Utilise la feuille USERS (Nom, Prenom, Date, Validation)
*********************************************************************/

function checkUser(nom, prenom) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("USERS");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const idxNom = headers.indexOf("Nom");
  const idxPrenom = headers.indexOf("Prenom");
  const idxValid = headers.indexOf("Validation");

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

function registerUserRequest(nom, prenom) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("USERS");
  sheet.appendRow([nom, prenom, new Date(), false]);
  return true;
}