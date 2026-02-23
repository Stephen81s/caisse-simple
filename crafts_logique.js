/***************************************************************
 * Fichier : crafts_logique.gs
 * Module  : Logique métier du système de craft (GTARP)
 * Auteur  : Stephen
 * Version : 4.0.0 — PRO 2026 (support illégal + logs PRO)
 ***************************************************************/

console.log("🟦 [crafts_logique] Module chargé.");

function craftItem(craftName, qty) {
  console.log(`📨 [crafts_logique] Requête craft → ${craftName} × ${qty}`);

  try {

    /* ------------------------------------------------------------
     * 1) Charger les données JSON (purs + finis + illégaux)
     * ------------------------------------------------------------ */
    const data = getCraftsData();

    const allItems = [
      ...data.produits_purs,
      ...data.produits_finis,
      ...data.produits_illegaux   // 🔥 AJOUT ESSENTIEL
    ];

    const craft = allItems.find(i => i.craft === craftName);
    if (!craft) throw new Error("Craft introuvable : " + craftName);

    console.log(`🧪 [crafts_logique] Craft identifié : ${craft.name}`);


    /* ------------------------------------------------------------
     * 2) Charger la feuille ARTICLES
     * ------------------------------------------------------------ */
    const sheet = SpreadsheetApp.getActive().getSheetByName("Articles");
    if (!sheet) throw new Error('Feuille "Articles" introuvable.');

    const values = sheet.getDataRange().getValues();
    const raw = values.slice(1);

    const stockMap = {};

    raw.forEach(row => {
      const nom = String(row[0]).trim();
      const stockCell = row[3];
      const qte = (stockCell === "" || stockCell === null) ? 0 : Number(stockCell);

      if (nom !== "") {
        stockMap[nom] = isNaN(qte) ? 0 : qte;
      }
    });

    console.log("📦 [crafts_logique] Stock chargé :", JSON.stringify(stockMap));


    /* ------------------------------------------------------------
     * 3) Vérifier les ingrédients
     * ------------------------------------------------------------ */
    const consommations = [];
    const manquants = [];

    for (const [nom, qteBase] of craft.ingredients) {

      const besoin = qteBase * qty;
      const dispo = stockMap[nom] || 0;

      consommations.push({ ingredient: nom, besoin, disponible: dispo });

      if (dispo < besoin) {
        manquants.push({
          ingredient: nom,
          besoin,
          disponible: dispo,
          manque: besoin - dispo
        });
      }
    }

    if (manquants.length > 0) {

      const listeManquants = manquants
        .map(m => `• ${m.ingredient} : manque ${m.manque}`)
        .join("\n");

      console.warn("⚠️ [crafts_logique] Ingrédients manquants :", listeManquants);

      return {
        status: "ERROR",
        type: "STOCK_INSUFFISANT",
        craft: craft.name,
        qty,
        consommations,
        manquants,
        message:
          `❌ Impossible de crafter ${craft.name} × ${qty}\n\n` +
          `Ingrédients manquants :\n${listeManquants}`
      };
    }

    console.log("🟩 [crafts_logique] Stock suffisant pour le craft.");


    /* ------------------------------------------------------------
     * 4) Déduire les ingrédients
     * ------------------------------------------------------------ */
    craft.ingredients.forEach(([nom, qteBase]) => {
      const besoin = qteBase * qty;
      stockMap[nom] -= besoin;
      console.log(`➖ [crafts_logique] ${nom} : -${besoin} (reste ${stockMap[nom]})`);
    });


    /* ------------------------------------------------------------
     * 5) Ajouter le craft produit
     * ------------------------------------------------------------ */
    const produitNom = craft.name;

    if (!stockMap[produitNom]) stockMap[produitNom] = 0;
    stockMap[produitNom] += qty;

    console.log(`➕ [crafts_logique] ${produitNom} : +${qty} (total ${stockMap[produitNom]})`);


    /* ------------------------------------------------------------
     * 6) Réécrire le stock dans la feuille Articles
     * ------------------------------------------------------------ */
    const newValues = values.slice();

    for (let i = 1; i < newValues.length; i++) {
      const nom = String(newValues[i][0]).trim();
      if (stockMap[nom] !== undefined) {
        newValues[i][3] = stockMap[nom];
      }
    }

    sheet.getRange(1, 1, newValues.length, newValues[0].length).setValues(newValues);

    console.log("🟩 [crafts_logique] Stock mis à jour.");


    /* ------------------------------------------------------------
     * 7) Message final
     * ------------------------------------------------------------ */
    const messageConsommation = consommations
      .map(c => `• ${c.ingredient} : ${c.besoin}`)
      .join("\n");

    return {
      status: "OK",
      craft: craft.name,
      qty,
      consommations,
      message:
        `✔ Craft réussi : ${craft.name} × ${qty}\n\n` +
        `🧾 Consommation :\n${messageConsommation}\n\n` +
        `📦 Ajout au stock : ${craft.name} × ${qty}`
    };

  } catch (err) {

    console.error("❌ [crafts_logique] ERREUR :", err);

    return {
      status: "ERROR",
      type: "EXCEPTION",
      message: err.message
    };
  }
}

console.log("🟩 [crafts_logique] Module opérationnel.");