/********************************************************************
 * FILE    : embed_banque.gs
 * MODULE  : EMBED BANQUE — Version PRO synchronisée
 * AUTHOR  : Stephen
 * VERSION : 2026 — PRO
 ********************************************************************/

/********************************************************************
 * ENVOI DES EMBEDS BANQUE
 ********************************************************************/
function embed_banque(employe) {

  console.log("🏦 [BANQUE] Début du traitement…");

  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(FEUILLE_RESUME);

  if (!sheet) {
    console.error("❌ [BANQUE] Feuille Résumé introuvable :", FEUILLE_RESUME);
    return;
  }

  const last = sheet.getLastRow();
  if (last < 2) {
    console.warn("⚠️ [BANQUE] Résumé vide.");
    return;
  }

  const data = sheet.getRange(2, 1, last - 1, sheet.getLastColumn()).getValues();

  data.forEach(row => {

    const typeMvt = String(row[COL_RESUME.TypeMouvement - 1] || "")
      .trim()
      .toUpperCase();

    if (typeMvt !== "DEPOT" && typeMvt !== "RETRAIT") {
      return;
    }

    const entreprise = row[COL_RESUME.TypeCaisse - 1] || "Entreprise inconnue";
    const motif      = row[COL_RESUME.Motif - 1] || "Aucun motif";
    const pu         = Number(row[COL_RESUME.PrixUnitaire - 1]) || 0;
    const qte        = Number(row[COL_RESUME.Quantite - 1]) || 0;
    const total      = pu * qte;

    const type  = typeMvt === "DEPOT" ? "Dépôt" : "Retrait";
    const emoji = typeMvt === "DEPOT" ? "📥" : "📤";

    console.log(`🏦 [BANQUE] Ligne détectée → ${type} | ${entreprise} | ${total}$`);

    const label = BANQUE_LABELS[entreprise] || entreprise;

    const embed = {
      title: `${emoji} ${type} — ${label}`,
      color: typeMvt === "DEPOT" ? 0x3498db : 0xe74c3c,
      description:
        `• **Employé :** ${employe}\n` +
        `• **Somme :** ${total}$\n` +
        `• **Motif :** ${motif}\n` +
        `• **Type :** ${type}\n`
    };

    try {
      const webhook = getWebhook(WEBHOOK_OPERATION_BANQUE);
      sendWebhook(webhook, embed);
      console.log("📨 [BANQUE] Embed envoyé pour :", entreprise);
    } catch (err) {
      console.error("❌ [BANQUE] Erreur envoi webhook :", err);
    }

  });

  console.log("✔ [BANQUE] Embeds banque envoyés.");
}

/********************************************************************
 * GET WEBHOOK — Récupération depuis la feuille IDDiscord
 ********************************************************************/
function getWebhook(type) {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(FEUILLE_IDDISCORD);

  if (!sheet) {
    throw new Error("❌ Feuille IDDiscord introuvable : " + FEUILLE_IDDISCORD);
  }

  const last = sheet.getLastRow();
  if (last < 2) {
    throw new Error("❌ Aucune donnée dans IDDiscord.");
  }

  const data = sheet.getRange(2, 1, last - 1, 3).getValues();

  for (let i = 0; i < data.length; i++) {
    const rowType    = data[i][COL_IDDISCORD.Type - 1];
    const rowWebhook = data[i][COL_IDDISCORD.Webhook - 1];

    if (rowType === type) {
      return rowWebhook;
    }
  }

  throw new Error("❌ Aucun webhook trouvé pour le type : " + type);
}

/********************************************************************
 * SEND WEBHOOK — Envoi d’un embed Discord
 ********************************************************************/
function sendWebhook(url, embed) {
  if (!url) {
    throw new Error("❌ URL webhook invalide.");
  }

  const payload = {
    embeds: [embed]
  };

  const params = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, params);

  console.log("📨 [sendWebhook] Webhook envoyé. Code HTTP :", response.getResponseCode());
}