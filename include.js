/********************************************************************
 * FILE    : include.gs
 * MODULE  : GTARP — LOADER HTML + INCLUDE
 * AUTHOR  : Stephen
 * VERSION : 3.0.0 — PRO (FIX INCLUDES + LOADPAGE)
 ********************************************************************/

console.log("🟦 [include.gs] Initialisation du module d'inclusion HTML…");

/**
 * ============================================================
 *  include(filename)
 * ------------------------------------------------------------
 *  Charge le contenu d'un fichier HTML et le renvoie sous forme
 *  de chaîne. Utilisé par : <?!= include('nom_fichier'); ?>
 * ============================================================
 */
function include(filename) {
  console.log("📥 [include] Requête d'inclusion reçue pour :", filename);

  try {
    if (!filename || typeof filename !== "string") {
      console.error("❌ [include] Nom de fichier invalide :", filename);
      return "<!-- Erreur include : nom de fichier invalide -->";
    }

    const content = HtmlService
      .createHtmlOutputFromFile(filename)
      .getContent();

    console.log("🟩 [include] Fichier chargé avec succès :", filename + ".html");
    return content;

  } catch (err) {
    console.error("❌ [include] ERREUR lors du chargement de :", filename, "| Détails :", err);
    return "<!-- Erreur include : " + filename + " -->";
  }
}


/**
 * ============================================================
 *  loadPage(name)
 * ------------------------------------------------------------
 *  Charge une page HTML complète, exécute les includes,
 *  et renvoie le HTML final au front.
 *
 *  ⚠️ FIX CRITIQUE :
 *     createHtmlOutputFromFile() n'exécute PAS les includes.
 *     createTemplateFromFile() + evaluate() OUI.
 * ============================================================
 */
function loadPage(name) {
  try {
    console.log("📄 [backend] loadPage() →", name);

    const html = HtmlService
      .createTemplateFromFile(name)   // exécute les includes
      .evaluate()                     // génère le HTML final
      .getContent();                  // renvoie la chaîne HTML

    console.log("🟩 [backend] Page générée avec includes :", name);
    return html;

  } catch (err) {
    console.error("❌ [backend] ERREUR loadPage(", name, ") :", err);
    throw err;
  }
}

console.log("🟦 [include.gs] Module d'inclusion HTML opérationnel.");