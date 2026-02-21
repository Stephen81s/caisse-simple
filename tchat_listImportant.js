/********************************************************************
 * FICHIER : tchat_listImportant.gs — Version PRO 5.0.0
 * Auteur  : Stephen
 * Rôle    : Renvoie uniquement les messages importants
 ********************************************************************/

function tchat_listImportant() {
  console.log("[TCHAT][IMPORTANT][LIST] Lecture des messages importants…");

  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName("TchatImportant"); // ✔ Correction MAJUSCULE

  if (!sheet) {
    console.error("[TCHAT][IMPORTANT][LIST] ERREUR : Feuille 'TchatImportant' introuvable.");
    return [];
  }

  const last = sheet.getLastRow();
  let important = [];

  if (last > 1) {
    const data = sheet.getRange(2, 1, last - 1, 4).getValues();

    important = data.map(r => ({
      date: new Date(r[0]).getTime(),
      user: r[1],
      message: r[2],
      tag: r[3],
      important: true
    }));
  }

  console.log("[TCHAT][IMPORTANT][LIST] Total messages importants :", important.length);

  return important;
}