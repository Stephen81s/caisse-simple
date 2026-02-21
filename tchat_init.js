/* ============================================================
   FICHIER : tchat_init.gs
   DESCRIPTION : Initialise les feuilles du tchat :
                 - Tchat (messages normaux)
                 - tchatImportant (messages importants)
                 - TchatArchive (archive globale)
   Auteur : Stephen
   ============================================================ */

function tchat_init() {
  console.log("[TCHAT][INIT] Initialisation des feuilles du tchat…");

  const ss = SpreadsheetApp.getActive();

  const sheets = [
    { name: "Tchat",          headers: ["Date", "User", "Message"] },
    { name: "TchatImportant", headers: ["Date", "User", "Message", "Tag"] },
    { name: "TchatArchive",   headers: ["Date", "User", "Message", "Source"] }
  ];

  sheets.forEach(s => {
    let sh = ss.getSheetByName(s.name);

    if (!sh) {
      sh = ss.insertSheet(s.name);
      sh.appendRow(s.headers);
      console.log("[TCHAT][INIT] Feuille créée :", s.name);
    } else {
      console.log("[TCHAT][INIT] Feuille déjà existante :", s.name);
    }
  });

  console.log("[TCHAT][INIT] Initialisation terminée.");
}