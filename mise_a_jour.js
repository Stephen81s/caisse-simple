/********************************************************************
 * MODULE : mettreAJourStock — Version PRO 2026
 * AUTEUR : Stephen
 * VERSION : 4.0.0 — FULL PRO
 ********************************************************************/

function mettreAJourStock(lignes) {

  console.log("📘 [mettreAJourStock] Lignes reçues :", JSON.stringify(lignes));

  try {

    /* -------------------------------------------------------------
     * 1) Lecture de la feuille Articles
     * ------------------------------------------------------------- */
    const sheet = SpreadsheetApp.getActive().getSheetByName(FEUILLE_ARTICLES);
    if (!sheet) throw new Error("❌ Feuille Articles introuvable : " + FEUILLE_ARTICLES);

    const data = sheet.getDataRange().getValues();

    const idxNom        = COL_ARTICLES.Nom - 1;
    const idxStock      = COL_ARTICLES.Stock - 1;
    const idxEntreprise = COL_ARTICLES.Entreprise - 1;
    const idxTypeCaisse = COL_ARTICLES.TypeCaisse - 1;

    const mouvements = [];

    /* -------------------------------------------------------------
     * 2) Traitement des lignes reçues
     * ------------------------------------------------------------- */
    lignes.forEach(l => {

      const nom = l.article;
      const qte = Number(l.quantite);
      const mouvement = l.typeMouvement.toUpperCase();

      const rowIndex = data.findIndex(r => r[idxNom] === nom);

      if (rowIndex === -1) {
        console.warn(`⚠️ Article introuvable : ${nom}`);
        return;
      }

      const stockAvant = Number(data[rowIndex][idxStock]);
      const entreprise = data[rowIndex][idxEntreprise];
      const typeCaisse = data[rowIndex][idxTypeCaisse]; // Legal / Illegal

      let stockApres = stockAvant;

      switch (mouvement) {
        case "VENTE":
        case "DESTOCK":
          stockApres -= qte;
          break;

        case "ACHAT":
        case "RESTOCK":
          stockApres += qte;
          break;

        default:
          console.warn(`⚠️ Type de mouvement inconnu : ${mouvement}`);
          return;
      }

      data[rowIndex][idxStock] = stockApres;

      console.log(`🟩 Stock mis à jour : ${nom} → ${stockAvant} → ${stockApres}`);

      mouvements.push({
        nom,
        entreprise,
        typeCaisse,                 // Legal / Illegal (backend)
        mouvement,                  // VENTE / ACHAT / DESTOCK / RESTOCK
        qte,
        stockAvant,
        stockApres,
        difference: stockApres - stockAvant
      });
    });


    /* -------------------------------------------------------------
     * 3) Réécriture optimisée
     * ------------------------------------------------------------- */
    sheet.getRange(1, 1, data.length, data[0].length).setValues(data);

    console.log("🟩 [mettreAJourStock] Mise à jour terminée.");


    /* -------------------------------------------------------------
     * 4) Envoi des embeds
     * ------------------------------------------------------------- */
    if (mouvements.length > 0) {

      console.log("📦 [mettreAJourStock] Envoi des embeds stock…");

      const payload = {
        employe: lignes[0].employe,
        date: new Date().toLocaleString("fr-FR"),
        articles: mouvements
      };

      embedMouvementStock(payload);
      embedStockLegal(mouvements);
      embedStockIllegal(mouvements);
      embedStockReel(mouvements);

      console.log("📦 [mettreAJourStock] Embeds stock envoyés.");
    }


    /* -------------------------------------------------------------
     * 5) Retour au FRONT
     * ------------------------------------------------------------- */
    return mouvements;

  } catch (err) {

    console.error("❌ [mettreAJourStock] ERREUR :", err);
    return STATUS_ERROR;
  }
}