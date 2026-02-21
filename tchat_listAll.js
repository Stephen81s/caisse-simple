/********************************************************************
 * FICHIER : tchat_listAll.gs — Version PRO 5.0.0
 * Auteur  : Stephen
 * Rôle    : Fusionne Tchat + TchatImportant et renvoie un tableau trié
 ********************************************************************/

function tchat_listAll() {
  console.log("[TCHAT][LISTALL] Lecture des messages…");

  const ss = SpreadsheetApp.getActive();

  const sheetNormal = ss.getSheetByName(FEUILLE_TCHAT);
  const sheetImportant = ss.getSheetByName(FEUILLE_TCHAT_IMPORTANT);

  if (!sheetNormal) {
    console.error("[TCHAT][LISTALL] ERREUR : Feuille Tchat introuvable.");
    return [];
  }

  if (!sheetImportant) {
    console.error("[TCHAT][LISTALL] ERREUR : Feuille TchatImportant introuvable.");
    return [];
  }

  const lastNormal = sheetNormal.getLastRow();
  const lastImportant = sheetImportant.getLastRow();

  let normal = [];
  let important = [];

  /* MESSAGES NORMAUX */
  if (lastNormal > 1) {
    const dataNormal = sheetNormal.getRange(2, 1, lastNormal - 1, 3).getValues();

    normal = dataNormal.map(r => ({
      date: new Date(r[COL_TCHAT.Date - 1]).getTime(),
      user: r[COL_TCHAT.User - 1],
      message: r[COL_TCHAT.Message - 1],
      important: false
    }));
  }

  /* MESSAGES IMPORTANTS */
  if (lastImportant > 1) {
    const dataImportant = sheetImportant.getRange(2, 1, lastImportant - 1, 4).getValues();

    important = dataImportant.map(r => ({
      date: new Date(r[COL_TCHAT_IMPORTANT.Date - 1]).getTime(),
      user: r[COL_TCHAT_IMPORTANT.User - 1],
      message: r[COL_TCHAT_IMPORTANT.Message - 1],
      important: true
    }));
  }

  const merged = [...normal, ...important].sort((a, b) => a.date - b.date);

  console.log("[TCHAT][LISTALL] Total messages renvoyés :", merged.length);

  return merged;
}