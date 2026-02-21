/********************************************************************
 * MODULE : TRANSACTION — Version PRO synchronisée
 * AUTEUR : Stephen
 * VERSION : 2026 — PRO
 ********************************************************************/

/****************************************************
 * HEADER DYNAMIQUE
 ****************************************************/
function getHeader(operation, type, entreprise) {
  return `📦 ${operation} — ${type} — ${entreprise}`;
}


/****************************************************
 * CONSTRUCTION D’UN EMBED COMPLET
 ****************************************************/
function buildEmbed(operation, entreprise, employe, moyenPaiement, client, telephone, articles, total, date, type) {

  let description =
    `🏢 Entreprise : **${entreprise}**\n` +
    `👤 Employé : ${employe}\n` +
    `💳 Moyen de paiement : ${moyenPaiement}\n` +
    `🧍 Client : ${client}\n` +
    `📱 Téléphone : ${telephone}\n\n` +
    `🛒 **Articles :**\n\n`;

  articles.forEach(a => {
    description +=
      `• **${a.nom}**\n` +
      `  Prix unitaire : ${a.pu}$\n` +
      `  Quantité : ${a.qte}\n` +
      `  Total : ${a.total}$\n\n`;
  });

  description +=
    `💰 **Prix total : ${total}$**\n\n` +
    `📅 Date : ${date}\n\n` +
    `${entreprise} vous remercie pour votre ${operation.toLowerCase()}.`;

  return {
    title: getHeader(operation, type, entreprise),
    color: (type === "Legal") ? 0x2ecc71 : 0xe74c3c,
    description
  };
}


/****************************************************
 * SPLIT PAR ENTREPRISE
 ****************************************************/
function splitByEntreprise(list) {
  const map = {};
  list.forEach(a => {
    const ent = a.entreprise || "Inconnue";
    if (!map[ent]) map[ent] = [];
    map[ent].push(a);
  });
  return map;
}


/****************************************************
 * MODULE PRINCIPAL — TRANSACTION
 ****************************************************/
function processTransaction(data) {

  console.log("📦 [TRANSACTION] Données reçues :", JSON.stringify(data));

  // Split légal / illégal
  const legalArticles   = data.articles.filter(a => a.type === "Legal");
  const illegalArticles = data.articles.filter(a => a.type === "Illegal");

  // Groupement par entreprise
  const legalByEntreprise   = splitByEntreprise(legalArticles);
  const illegalByEntreprise = splitByEntreprise(illegalArticles);


  /************************************************
   * ENVOI DES EMBEDS LÉGAUX
   ************************************************/
  for (const ent in legalByEntreprise) {

    const articles = legalByEntreprise[ent];
    const total = articles.reduce((s, a) => s + a.total, 0);

    const embed = buildEmbed(
      data.operation,
      ent,
      data.employe,
      data.moyenPaiement,
      data.client,
      data.telephone,
      articles,
      total,
      data.date,
      "Legal"
    );

    const webhook = getWebhook(WEBHOOK_TRANSACTION_LEGAL);
    sendWebhook(webhook, embed);
  }


  /************************************************
   * ENVOI DES EMBEDS ILLÉGAUX
   ************************************************/
  for (const ent in illegalByEntreprise) {

    const articles = illegalByEntreprise[ent];
    const total = articles.reduce((s, a) => s + a.total, 0);

    const embed = buildEmbed(
      data.operation,
      ent,
      data.employe,
      data.moyenPaiement,
      data.client,
      data.telephone,
      articles,
      total,
      data.date,
      "Illegal"
    );

    const webhook = getWebhook(WEBHOOK_TRANSACTION_ILLEGAL);
    sendWebhook(webhook, embed);
  }

  console.log("✅ [TRANSACTION] Traitement terminé.");
}