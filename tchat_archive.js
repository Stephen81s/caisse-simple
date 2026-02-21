/* ============================================================
   FICHIER : tchat_archive.gs
   DESCRIPTION : Archive chaque message (normal ou important)
                 dans la feuille TchatArchive.
   Auteur : Stephen
   ============================================================ */

function tchat_archiveMessage(user, message, source) {
  console.log("[TCHAT][ARCHIVE] Archivage d'un message…");

  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName("TchatArchive");

  if (!sheet) {
    throw new Error("[TCHAT][ARCHIVE] ERREUR : Feuille 'TchatArchive' introuvable.");
  }

  const row = [
    new Date(), // Date
    user,       // Auteur
    message,    // Contenu
    source      // "normal" | "important"
  ];

  sheet.appendRow(row);

  console.log("[TCHAT][ARCHIVE] Message archivé :", JSON.stringify(row));
}