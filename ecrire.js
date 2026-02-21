/********************************************************************
 * FILE    : ecrire.gs
 * MODULE  : FONCTIONS D’ÉCRITURE (WRITE)
 * AUTHOR  : Stephen
 * VERSION : 4.0.0 (FULL PRO — SYNCHRONISÉ)
 * ------------------------------------------------------------------
 * Rôle :
 *   - Centraliser toutes les fonctions d’écriture dans Google Sheets
 *   - Utiliser UNIQUEMENT les constantes globales
 *   - Supprimer les anciennes fonctions obsolètes
 *   - Garantir une architecture propre, stable et maintenable
 ********************************************************************/

console.log("📗 [ecrire.gs] Initialisation du module ECRIRE…");


/* ============================================================
 * 🟪 ecrireCaisse(data)
 * ------------------------------------------------------------
 *  Ajoute une ligne dans la feuille COMPTA (historique)
============================================================ */
function ecrireCaisse(data) {
  console.log("📗 [ecrireCaisse] Données reçues :", JSON.stringify(data));

  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(FEUILLE_COMPTA);
    if (!sheet) throw new Error("Feuille COMPTA introuvable : " + FEUILLE_COMPTA);

    sheet.appendRow([
      new Date(),
      data.typeOperation,
      data.employe,
      data.client,
      data.paiement,
      data.total
    ]);

    console.log("🟩 [ecrireCaisse] Ligne ajoutée avec succès.");
    return STATUS_OK;

  } catch (err) {
    console.error("❌ [ecrireCaisse] ERREUR :", err);
    return STATUS_ERROR;
  }
}



/* ============================================================
 * 🟪 ecrireAnnuaire(client)
 * ------------------------------------------------------------
 *  Ajoute automatiquement un client dans l'annuaire
============================================================ */
function ecrireAnnuaire(client) {
  console.log("📗 [ecrireAnnuaire] Client reçu :", JSON.stringify(client));

  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(FEUILLE_ANNUAIRE);
    if (!sheet) throw new Error("Feuille ANNUAIRE introuvable : " + FEUILLE_ANNUAIRE);

    const lastRow = sheet.getLastRow();
    const data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();

    const nom = (client.nom || "").trim();
    const prenom = (client.prenom || "").trim();
    const telephone = (client.telephone || "").trim();

    if (!nom || !prenom) {
      console.warn("⚠️ [ecrireAnnuaire] Nom ou prénom manquant → client non enregistré.");
      return STATUS_OK;
    }

    // Vérifier si le client existe déjà
    for (let i = 0; i < data.length; i++) {
      const rowNom = (data[i][0] || "").trim();
      const rowPrenom = (data[i][1] || "").trim();
      const rowTel = (data[i][2] || "").trim();

      if (
        rowNom.toLowerCase() === nom.toLowerCase() &&
        rowPrenom.toLowerCase() === prenom.toLowerCase()
      ) {
        if (!rowTel && telephone) {
          sheet.getRange(i + 2, 3).setValue(telephone);
          console.log("📞 Téléphone mis à jour pour :", nom, prenom);
        }
        return STATUS_OK;
      }
    }

    // Ajouter le client
    sheet.appendRow([nom, prenom, telephone]);
    console.log("🟩 Nouveau client ajouté :", nom, prenom);

    return STATUS_OK;

  } catch (err) {
    console.error("❌ [ecrireAnnuaire] ERREUR :", err);
    return STATUS_ERROR;
  }
}



/* ============================================================
 * 🟪 ecrireResume(data)
============================================================ */
function ecrireResume(data) {
  console.log("📗 [ecrireResume] Résumé reçu :", JSON.stringify(data));

  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(FEUILLE_RESUME);
    if (!sheet) throw new Error("Feuille RESUME introuvable : " + FEUILLE_RESUME);

    sheet.appendRow([
      new Date(),
      data.typeOperation,
      data.employe,
      data.client,
      data.paiement,
      data.total
    ]);

    console.log("🟩 [ecrireResume] Ligne ajoutée.");
    return STATUS_OK;

  } catch (err) {
    console.error("❌ [ecrireResume] ERREUR :", err);
    return STATUS_ERROR;
  }
}



/* ============================================================
 * 🟪 envoyerDansResume(lignes)
============================================================ */
function envoyerDansResume(lignes) {
  console.log("📗 [envoyerDansResume] Lignes reçues :", JSON.stringify(lignes));

  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(FEUILLE_RESUME);
    if (!sheet) throw new Error("Feuille RESUME introuvable : " + FEUILLE_RESUME);

    lignes.forEach(l => {
      sheet.appendRow([
        l.heure,
        l.employe,
        l.typeMouvement,
        l.client,
        l.article,
        l.prixUnitaire,
        l.quantite,
        l.totalArticle,
        l.paiement,
        l.typeCaisse
      ]);
    });

    console.log("🟩 [envoyerDansResume] Toutes les lignes ont été ajoutées.");
    return STATUS_OK;

  } catch (err) {
    console.error("❌ [envoyerDansResume] ERREUR :", err);
    return STATUS_ERROR;
  }
}





console.log("🟩 [ecrire.gs] Module opérationnel.");