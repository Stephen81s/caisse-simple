/* ============================================================
   FICHIER : tchat_list.gs
   DESCRIPTION : Alias simple vers tchat_listAll().
                 Maintenu pour compatibilité et lisibilité.
   Auteur : Stephen
   ============================================================ */

function tchat_list() {
  console.log("[TCHAT][LIST] Appel de tchat_list() → redirection vers tchat_listAll()");

  const list = tchat_listAll();

  console.log("[TCHAT][LIST] Total messages renvoyés :", list.length);

  return list;
}