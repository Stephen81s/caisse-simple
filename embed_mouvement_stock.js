/********************************************************************
 * MODULE : EMBED MOUVEMENT DE STOCK — Version PRO synchronisée
 * AUTEUR : Stephen
 * VERSION : 2026 — PRO
 ********************************************************************/

function embedMouvementStock(data) {

  console.log("📦 [STOCK_MOUVEMENT] Données reçues :", JSON.stringify(data));

  if (!data || !data.articles || data.articles.length === 0) {
    console.error("❌ [STOCK_MOUVEMENT] Aucune donnée article reçue.");
    return;
  }

  // Groupement par entreprise
  const mouvementsParEntreprise = {};

  data.articles.forEach(a => {
    const ent = a.entreprise || "Inconnue";
    if (!mouvementsParEntreprise[ent]) mouvementsParEntreprise[ent] = [];
    mouvementsParEntreprise[ent].push(a);
  });

  // Un embed par entreprise
  for (const entreprise in mouvementsParEntreprise) {

    const embed = buildStockMovementEmbed(
      entreprise,
      data.employe,
      data.date,
      mouvementsParEntreprise[entreprise]
    );

    // Webhook centralisé
    const webhook = getWebhook(WEBHOOK_MOUVEMENT_STOCK);
    sendWebhook(webhook, embed);

    console.log(`📦 [STOCK_MOUVEMENT] Embed envoyé pour ${entreprise}`);
  }
}


/********************************************************************
 * CONSTRUCTION DE L’EMBED
 ********************************************************************/
function buildStockMovementEmbed(entreprise, employe, date, articles) {

  let description =
    `🏢 Entreprise : **${entreprise}**\n` +
    `👤 Employé : ${employe}\n\n` +
    `📊 **Mouvement de stock :**\n\n`;

  articles.forEach(a => {

    description +=
      `• **${a.nom}**\n` +
      `  Avant : ${a.stockAvant}\n` +
      `  Après : ${a.stockApres}\n` +
      `  Différence : ${a.difference > 0 ? "+" : ""}${a.difference}\n\n`;
  });

  description += `📅 Date : ${date}`;

  return {
    title: `📦 Mise à jour du stock — ${entreprise}`,
    color: 0x3498db,
    description
  };
}