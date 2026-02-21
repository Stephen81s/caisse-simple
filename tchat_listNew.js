/* ============================================================
   FICHIER : tchat_listNew.gs
   DESCRIPTION : Renvoie uniquement les nouveaux messages
                 (normaux + importants) dont le timestamp est
                 supérieur à lastTimestamp.
   Auteur : Stephen
   ============================================================ */

function tchat_listNew(lastTimestamp) {
  console.log("[TCHAT][LISTNEW] Recherche des nouveaux messages…");
  console.log("[TCHAT][LISTNEW] Dernier timestamp connu :", lastTimestamp);

  // Récupération de tous les messages (normaux + importants)
  const allMessages = tchat_listAll();

  if (!Array.isArray(allMessages)) {
    console.error("[TCHAT][LISTNEW] ERREUR : tchat_listAll() n'a pas renvoyé une liste.");
    return [];
  }

  // Filtrage des messages plus récents
  const newMessages = allMessages.filter(m => m.date > lastTimestamp);

  console.log("[TCHAT][LISTNEW] Nouveaux messages trouvés :", newMessages.length);

  return newMessages;
}