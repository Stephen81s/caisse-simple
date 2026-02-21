/********************************************************************
 * MODULE : STOCK — 3 EMBEDS (PRO SYNCHRONISÉ)
 * AUTEUR : Stephen
 * VERSION : 2026 — PRO
 ********************************************************************/

/*************************************************************
 * LECTURE DU ItemsCache
 *************************************************************/
function getItemCache() {

  const sheet = SpreadsheetApp.getActive().getSheetByName(FEUILLE_ITEMS_CACHE);
  if (!sheet) throw new Error("❌ Feuille ItemsCache introuvable : " + FEUILLE_ITEMS_CACHE);

  const data = sheet.getRange(2, 1, sheet.getLastRow(), 2).getValues();

  const hidden  = new Set();
  const buyback = new Set();

  data.forEach(row => {
    if (row[0]) hidden.add(row[0].toString().trim());
    if (row[1]) buyback.add(row[1].toString().trim());
  });

  return { hidden, buyback };
}


/*************************************************************
 * LECTURE DU STOCK RÉEL (feuille Articles)
 *************************************************************/
function getRealStock() {

  const sheet = SpreadsheetApp.getActive().getSheetByName(FEUILLE_ARTICLES);
  if (!sheet) throw new Error("❌ Feuille Articles introuvable : " + FEUILLE_ARTICLES);

  const last = sheet.getLastRow();
  const data = sheet.getRange(2, 1, last - 1, sheet.getLastColumn()).getValues();

  const list = [];

  data.forEach(row => {

    const nom        = row[COL_ARTICLES.Nom - 1];
    const prixVente  = Number(row[COL_ARTICLES.PrixVente - 1]) || 0;
    const stock      = Number(row[COL_ARTICLES.Stock - 1]) || 0;
    const typeCaisse = row[COL_ARTICLES.TypeCaisse - 1];
    const entreprise = row[COL_ARTICLES.Entreprise - 1];

    if (!nom) return;

    list.push({
      nom,
      pu: prixVente,
      stock,
      type: typeCaisse,
      entreprise
    });
  });

  return list;
}


/*************************************************************
 * GROUPER PAR ENTREPRISE
 *************************************************************/
function groupByEntreprise(list) {
  const map = {};
  list.forEach(a => {
    const ent = a.entreprise || "Inconnue";
    if (!map[ent]) map[ent] = [];
    map[ent].push(a);
  });
  return map;
}


/*************************************************************
 * EMBED STOCK LÉGAL
 *************************************************************/
function buildEmbedStockLegal(employe, date, items, hidden, buyback) {

  let description =
    `👤 Employé : ${employe}\n` +
    `📅 Date : ${date}\n\n`;

  const visibles = items.filter(a =>
    a.type === "Legal" &&
    !hidden.has(a.nom) &&
    a.stock > 0
  );

  visibles.forEach(a => {
    if (buyback.has(a.nom)) a._isBuyback = true;
  });

  const grouped = groupByEntreprise(visibles);

  for (const ent in grouped) {

    description += `🏢 **${ent}**\n`;

    grouped[ent].forEach(a => {

      if (a._isBuyback) {
        description += `• ${a.nom} — RACHAT — ${a.pu}$ — Qté : ${a.stock}\n`;
      } else {
        description += `• ${a.nom} — ${a.pu}$ — Qté : ${a.stock}\n`;
      }

    });

    description += `\n`;
  }

  return {
    title: "📦 Stock Légal",
    color: 0x2ecc71,
    description
  };
}


/*************************************************************
 * EMBED STOCK ILLÉGAL
 *************************************************************/
function buildEmbedStockIllegal(employe, date, items, buyback) {

  let description =
    `📕 **Stock Illégal**\n` +
    `👤 Employé : ${employe}\n` +
    `📅 Date : ${date}\n\n`;

  const visibles = items.filter(a =>
    a.type === "Illegal" &&
    a.stock > 0
  );

  visibles.forEach(a => {
    if (buyback.has(a.nom)) a._isBuyback = true;
  });

  const grouped = groupByEntreprise(visibles);

  for (const ent in grouped) {

    description += `🏢 **${ent}**\n`;

    grouped[ent].forEach(a => {

      if (a._isBuyback) {
        description += `• ${a.nom} — RACHAT — ${a.pu}$ — Qté : ${a.stock}\n`;
      } else {
        description += `• ${a.nom} — ${a.pu}$ — Qté : ${a.stock}\n`;
      }

    });

    description += `\n`;
  }

  return {
    title: "📦 Stock Illégal",
    color: 0xe74c3c,
    description
  };
}


/*************************************************************
 * EMBED STOCK COMBINE (ALL)
 *************************************************************/
function buildEmbedStockCombine(employe, date, items, buyback) {

  let description =
    `📘 **Stock Combine (ALL)**\n` +
    `👤 Employé : ${employe}\n` +
    `📅 Date : ${date}\n\n`;

  const visibles = items.filter(a => a.stock > 0);

  visibles.forEach(a => {
    if (buyback.has(a.nom)) a._isBuyback = true;
  });

  const grouped = groupByEntreprise(visibles);

  for (const ent in grouped) {

    description += `🏢 **${ent}**\n`;

    grouped[ent].forEach(a => {

      if (a._isBuyback) {
        description += `• ${a.nom} — RACHAT — ${a.pu}$ — Qté : ${a.stock}\n`;
      } else {
        description += `• ${a.nom} — ${a.pu}$ — Qté : ${a.stock}\n`;
      }

    });

    description += `\n`;
  }

  return {
    title: "📦 Stock Combine",
    color: 0x3498db,
    description
  };
}


/*************************************************************
 * MODULE PRINCIPAL — ENVOI DES 3 EMBEDS
 *************************************************************/
function embedStockLegal(mouvements) {

  const employe = mouvements?.[0]?.employe || "Système";
  const { hidden, buyback } = getItemCache();
  const items = getRealStock();

  const embed = buildEmbedStockLegal(
    employe,
    new Date().toLocaleString("fr-FR"),
    items,
    hidden,
    buyback
  );

  const webhook = getWebhook(WEBHOOK_STOCK_LEGAL);
  sendWebhook(webhook, embed);
}


function embedStockIllegal(mouvements) {

  const employe = mouvements?.[0]?.employe || "Système";
  const { buyback } = getItemCache();
  const items = getRealStock();

  const embed = buildEmbedStockIllegal(
    employe,
    new Date().toLocaleString("fr-FR"),
    items,
    buyback
  );

  const webhook = getWebhook(WEBHOOK_STOCK_ILLEGAL);
  sendWebhook(webhook, embed);
}


function embedStockReel(mouvements) {

  const employe = mouvements?.[0]?.employe || "Système";
  const { buyback } = getItemCache();
  const items = getRealStock();

  const embed = buildEmbedStockCombine(
    employe,
    new Date().toLocaleString("fr-FR"),
    items,
    buyback
  );

  const webhook = getWebhook(WEBHOOK_STOCK_COMBINE);
  sendWebhook(webhook, embed);
}