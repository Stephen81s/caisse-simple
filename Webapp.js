/********************************************************************
 * FILE    : Webapp.gs
 * MODULE  : BACKEND — POINT D’ENTRÉE WEBAPP + INCLUDES
 * AUTHOR  : Stephen
 * VERSION : 3.0.0 — PRO (AJOUT doPost + ROUTAGE LOTERIE)
 ********************************************************************/

console.log("🟦 [Webapp] Initialisation du module WebApp…");

/* ============================================================
   🌐 doGet() — Point d’entrée principal
============================================================ */
function doGet() {
  console.log("🟦 [Webapp] doGet() appelé — rendu de index.html…");

  try {
    const page = HtmlService
      .createTemplateFromFile("index")
      .evaluate()
      .setTitle("Le consortium — Interface")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

    console.log("🟩 [Webapp] index.html servi avec succès.");
    return page;

  } catch (err) {
    console.error("❌ [Webapp] ERREUR dans doGet() :", err);
    throw err;
  }
}

/* ============================================================
   📄 include() — Inclusion HTML
============================================================ */
function include(filename) {
  console.log(`📄 [Webapp] include("${filename}") demandé…`);

  try {
    const content = HtmlService.createHtmlOutputFromFile(filename).getContent();
    console.log(`🟩 [Webapp] include("${filename}") OK`);
    return content;

  } catch (err) {
    console.error(`❌ [Webapp] ERREUR include("${filename}") :`, err);
    return `<div style="color:red;">Erreur include : ${filename}</div>`;
  }
}

/* ============================================================
   📄 loadPage() — Chargement dynamique d’une page HTML
============================================================ */
function loadPage(pageName) {
  console.log(`📄 [Webapp] loadPage("${pageName}") demandé…`);

  try {
    const template = HtmlService.createTemplateFromFile(pageName);
    const html = template.evaluate().getContent();

    console.log(`🟩 [Webapp] Page "${pageName}" chargée avec succès.`);
    return html;

  } catch (err) {
    console.error(`❌ [Webapp] ERREUR loadPage("${pageName}") :`, err);
    return `<div style="color:red;">Erreur : page introuvable (${pageName})</div>`;
  }
}

/* ============================================================
   🌐 doPost() — Point d’entrée API (POST /exec)
   → Permet aux modules modernes (comme LOTERIE) de fonctionner
   → Compatible DEV et EXEC automatiquement
============================================================ */
function doPost(e) {
  console.log("🟦 [Webapp] doPost() appelé…");

  try {
    const data = JSON.parse(e.postData.contents);
    console.log("📨 [Webapp] Données reçues :", data);

    /* === LOTERIE === */
    if (data.action && data.action.startsWith("TICKET_")) {
      console.log("🎟️ [Webapp] → Route LOTERIE détectée :", data.action);
      return ContentService
        .createTextOutput(ticket_router(data))
        .setMimeType(ContentService.MimeType.JSON);
    }

    /* === API GÉNÉRALE (si existante) === */
    if (typeof api_router === "function") {
      console.log("🛠️ [Webapp] → Route API générale");
      return ContentService
        .createTextOutput(api_router(data))
        .setMimeType(ContentService.MimeType.JSON);
    }

    console.warn("⚠️ [Webapp] Action inconnue :", data.action);
    return ContentService
      .createTextOutput(JSON.stringify({ error: "Action inconnue" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error("❌ [Webapp] ERREUR doPost() :", err);
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

console.log("🟦 [Webapp] Module WebApp opérationnel.");