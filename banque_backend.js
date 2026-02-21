/********************************************************************
 * FILE    : banque_backend.gs
 * MODULE  : BANQUE RP — BACKEND (VERSION PRO FINALE)
 * AUTHOR  : Stephen
 * VERSION : 4.0.0 — PRO GTARP (CENTRALISÉ)
 ********************************************************************/

console.log("🏦 [banque_backend] Initialisation du module BANQUE RP…");

/* ============================================================
   👥 CHARGEMENT DES EMPLOYÉS (Nom + Prenom)
============================================================ */
function getListeEmployes() {
  console.log("👥 [banque_backend] getListeEmployes() appelé…");

  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(FEUILLE_EMPLOYES);

  if (!sheet) {
    const msg = "Feuille employés introuvable : " + FEUILLE_EMPLOYES;
    console.error("❌ [banque_backend] " + msg);
    throw new Error(msg);
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    console.warn("⚠️ [banque_backend] Aucun employé trouvé.");
    return [];
  }

  const data = sheet.getRange(
    2,
    COL_EMPLOYES.Nom,
    lastRow - 1,
    2
  ).getValues();

  const liste = data
    .map(row => {
      const nom    = row[0] ? row[0].toString().trim() : "";
      const prenom = row[1] ? row[1].toString().trim() : "";
      return (prenom + " " + nom).trim();
    })
    .filter(n => n !== "");

  console.log("👥 [banque_backend] Employés chargés :", liste);
  return liste;
}

/* ============================================================
   🏦 AJOUTER UN MONTANT À UNE CAISSE (VERSION PRO)
   Utilise BANQUE_MAPPING (centralisé)
============================================================ */
function ajouterMontantCaisse(typeCaisse, montant) {
  console.log("💰 [ajouterMontantCaisse] Crédit demandé :", { typeCaisse, montant });

  try {
    const cellA1 = BANQUE_MAPPING[typeCaisse];

    if (!cellA1) {
      throw new Error(
        "❌ Mapping caisse introuvable pour : " + typeCaisse +
        "\nVérifie BANQUE_MAPPING dans 00_constantes_globales.gs"
      );
    }

    const sheet = SpreadsheetApp.getActive().getSheetByName(FEUILLE_COMPTA);
    if (!sheet) {
      throw new Error("❌ Feuille COMPTA introuvable : " + FEUILLE_COMPTA);
    }

    const cell = sheet.getRange(cellA1);
    const actuel = Number(cell.getValue()) || 0;
    const nouveau = actuel + Number(montant || 0);

    cell.setValue(nouveau);

    console.log("🟩 [ajouterMontantCaisse] Mise à jour OK :", {
      caisse: typeCaisse,
      cell: cellA1,
      ancien: actuel,
      nouveau: nouveau
    });

    return nouveau;

  } catch (err) {
    console.error("❌ [ajouterMontantCaisse] ERREUR :", err);
    throw err;
  }
}

/* ============================================================
   🏦 FONCTION PRINCIPALE : Dépôt / Retrait
============================================================ */
function banqueAjouterMontant(typeCaisse, montant, employe, motif) {
  console.log("🏦 [banqueAjouterMontant] Reçu :", {
    typeCaisse,
    montant,
    employe,
    motif
  });

  try {
    const nouveauMontant = ajouterMontantCaisse(typeCaisse, montant);

    const typeOp = montant >= 0 ? "DEPOT_BANQUE" : "RETRAIT_BANQUE";
    banqueLogDansResume(employe, typeOp, typeCaisse, montant, motif);

    embed_operation_banque({
      entreprise: typeCaisse,
      employe:    employe,
      montant:    montant,
      motif:      motif
    });

    console.log("✅ [banqueAjouterMontant] Opération terminée avec succès.");
    return { nouveauMontant };

  } catch (err) {
    console.error("❌ [banqueAjouterMontant] ERREUR :", err);
    throw err;
  }
}

/* ============================================================
   🧾 LOG DANS RÉSUMÉ
============================================================ */
function banqueLogDansResume(employe, typeOperation, entreprise, montant, motif) {
  console.log("🧾 [banqueLogDansResume] Log demandé :", {
    employe,
    typeOperation,
    entreprise,
    montant,
    motif
  });

  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(FEUILLE_RESUME);

  if (!sheet) {
    const msg = "Feuille Résumé introuvable : " + FEUILLE_RESUME;
    console.error("❌ [banqueLogDansResume] " + msg);
    throw new Error(msg);
  }

  const ligne = [
    new Date(),
    employe,
    typeOperation,
    "",
    "BANQUE",
    montant,
    1,
    montant,
    "BANQUE",
    entreprise,
    motif || ""
  ];

  sheet.appendRow(ligne);

  console.log("🟩 [banqueLogDansResume] Ligne ajoutée :", ligne);
}

/* ============================================================
   📨 EMBED DISCORD — DÉPÔT / RETRAIT
============================================================ */
function embed_operation_banque(data) {
  console.log("📨 [embed_operation_banque] Préparation de l’embed…", data);

  const entreprise = data.entreprise;
  const employe    = data.employe;
  const montant    = Number(data.montant);
  const motif      = data.motif || "Aucun motif";

  const type  = montant >= 0 ? "Dépôt" : "Retrait";
  const emoji = montant >= 0 ? "📥" : "📤";

  const label = BANQUE_LABELS?.[entreprise] || entreprise;

  const embed = {
    title: `${emoji} ${type} — ${label}`,
    color: montant >= 0 ? 0x2ecc71 : 0xe74c3c,
    description:
      `• **Employé :** ${employe}\n` +
      `• **Somme :** ${montant}$\n` +
      `• **Motif :** ${motif}\n`
  };

  const webhook = getWebhook(WEBHOOK_OPERATION_BANQUE);

  try {
    const response = UrlFetchApp.fetch(webhook, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({ embeds: [embed] }),
      muteHttpExceptions: true
    });

    console.log("📨 [embed_operation_banque] Embed envoyé. Code HTTP :", response.getResponseCode());
  } catch (err) {
    console.error("❌ [embed_operation_banque] ERREUR envoi webhook :", err);
  }

  console.log("📨 [embed_operation_banque] Embed construit :", embed);
}

console.log("🏦 [banque_backend] Module BANQUE RP chargé avec succès.");