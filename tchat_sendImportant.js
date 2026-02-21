/********************************************************************
 * FICHIER : tchat_sendImportant.gs — Version PRO 5.0.0
 * Auteur  : Stephen
 * Rôle    : Enregistre un message important + archive
 ********************************************************************/

function tchat_sendImportant(user, message, tag) {
  console.log("[TCHAT][IMPORTANT] Envoi d'un message important…");

  if (!user || !message) {
    throw new Error("[TCHAT][IMPORTANT] ERREUR : user ou message vide.");
  }

  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName("TchatImportant"); // ✔ Correction MAJUSCULE

  if (!sheet) {
    throw new Error("[TCHAT][IMPORTANT] ERREUR : Feuille 'TchatImportant' introuvable.");
  }

  const now = new Date();

  const row = [
    now,
    user,
    message,
    tag || "important"
  ];

  sheet.appendRow(row);
  console.log("[TCHAT][IMPORTANT] Message ajouté :", JSON.stringify(row));

  // Archive PRO
  tchat_archiveMessage(user, message, "important");

  return {
    status: "ok",
    timestamp: now.getTime()
  };
}