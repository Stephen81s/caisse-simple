/* ============================================================
   FICHIER : tchat_send.gs
   DESCRIPTION : Enregistre un message normal dans la feuille Tchat.
   Auteur : Stephen
   ============================================================ */

function tchat_send(user, message) {
  console.log("[TCHAT][SEND] Enregistrement message normal…");

  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName("Tchat");

  if (!sheet) {
    console.error("[TCHAT][SEND] ERREUR : Feuille 'Tchat' introuvable.");
    return false;
  }

  const now = new Date();

  sheet.appendRow([
    now,
    user,
    message
  ]);

  console.log("[TCHAT][SEND] Message enregistré.");
  return true;
}