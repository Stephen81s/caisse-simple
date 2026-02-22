/********************************************************************************************
 * FILE    : embed_fin_semaine.gs
 * MODULE  : FIN DE SEMAINE — Version PRO FISCALE + DOUBLE ENVOI TEQUI + RESET + SEMAINE
 * AUTHOR  : Stephen
 * VERSION : 2026 — PRO GTARP
 ********************************************************************************************/

console.log("📆 [FIN_SEMAINE] Module chargé…");

// Dérogation fiscale (40% par défaut)
const FDS_USE_DEROGATION = false;

/* ============================================================
   📤 ENVOI DES EMBEDS FIN DE SEMAINE (FISCAL + COMPTABLE)
============================================================ */
function embed_fin_semaine() {

  console.log("📆 [FIN_SEMAINE] Début du traitement…");

  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(FEUILLE_RESUME);

  if (!sheet) return console.error("❌ Feuille Résumé introuvable :", FEUILLE_RESUME);

  const last = sheet.getLastRow();
  if (last < 2) return console.warn("⚠️ Résumé vide.");

  const data = sheet.getRange(2, 1, last - 1, sheet.getLastColumn()).getValues();

  // Regroupement par entreprise
  const entreprises = {};

  data.forEach(row => {
    const entreprise = row[COL_RESUME.TypeCaisse - 1] || "Inconnue";
    const typeMvtRaw = String(row[COL_RESUME.TypeMouvement - 1] || "").trim().toUpperCase();
    const article    = row[COL_RESUME.Articles - 1] || "N/A";
    const pu         = Number(row[COL_RESUME.PrixUnitaire - 1]) || 0;
    const qte        = Number(row[COL_RESUME.Quantite - 1]) || 0;
    const total      = pu * qte;

    if (!entreprises[entreprise]) {
      entreprises[entreprise] = {
        achats: {},
        ventes: {},
        totalAchats: 0,
        totalVentes: 0,
        totalDepots: 0,
        totalRetraits: 0
      };
    }

    // BANQUE
    if (typeMvtRaw === "DEPOT_BANQUE") {
      entreprises[entreprise].totalDepots += total;
      return;
    }

    if (typeMvtRaw === "RETRAIT_BANQUE") {
      entreprises[entreprise].totalRetraits += total;
      return;
    }

    if (article === "BANQUE") return;

    // ACHATS
    if (typeMvtRaw === "ACHAT") {
      if (!entreprises[entreprise].achats[article]) {
        entreprises[entreprise].achats[article] = { pu, qte: 0, total: 0 };
      }
      entreprises[entreprise].achats[article].qte   += qte;
      entreprises[entreprise].achats[article].total += total;
      entreprises[entreprise].totalAchats           += total;
      return;
    }

    // VENTES
    if (typeMvtRaw === "VENTE") {
      if (!entreprises[entreprise].ventes[article]) {
        entreprises[entreprise].ventes[article] = { pu, qte: 0, total: 0 };
      }
      entreprises[entreprise].ventes[article].qte   += qte;
      entreprises[entreprise].ventes[article].total += total;
      entreprises[entreprise].totalVentes           += total;
      return;
    }
  });

  // Numéro de semaine ISO
  const semaine = getWeekNumber();

  // ============================================================
  // 2) Génération d’un embed par entreprise
  // ============================================================
  Object.keys(entreprises).forEach(entreprise => {

    const bloc = entreprises[entreprise];

    // ---------- COMPTABLE ----------
    const beneficeComptable = bloc.totalVentes - bloc.totalAchats;

    // ---------- FISCAL ----------
    const chiffreAffaires   = bloc.totalVentes + bloc.totalDepots;
    const depensesReelles   = bloc.totalAchats + bloc.totalRetraits;

    const plafondTaux       = FDS_USE_DEROGATION ? 0.50 : 0.40;
    const plafondDepenses   = chiffreAffaires * plafondTaux;
    const depensesDeductibles = Math.min(depensesReelles, plafondDepenses);

    const beneficeImposable = Math.max(0, chiffreAffaires - depensesDeductibles);
    const { taux, impot }   = calculImpotBenefice(beneficeImposable);

    const color =
      beneficeComptable > 0 ? 0x2ecc71 :
      beneficeComptable < 0 ? 0xe74c3c :
                              0xf1c40f;

    const formatSection = obj => {
      const keys = Object.keys(obj);
      if (keys.length === 0) return "_Aucune opération_";
      return keys.map(a => {
        const l = obj[a];
        return `• **${a}** — ${l.qte} × ${l.pu}$ = **${l.total}$**`;
      }).join("\n");
    };

    const achatsTxt = formatSection(bloc.achats);
    const ventesTxt = formatSection(bloc.ventes);

    // ============================================================
    // 3) Embed final
    // ============================================================
    const embed = {
      title: `📆 Fin de semaine ${String(semaine).padStart(2, "0")} — ${entreprise}`,
      color: color,
      fields: [
        { name: "🛒 Achats", value: achatsTxt, inline: false },
        { name: "💸 Ventes", value: ventesTxt, inline: false },
        {
          name: "🏦 Mouvements Banque",
          value:
            `• **Dépôts :** ${bloc.totalDepots}$\n` +
            `• **Retraits :** ${bloc.totalRetraits}$`,
          inline: false
        },
        {
          name: "📊 Totaux comptables",
          value:
            `• **Total achats :** ${bloc.totalAchats}$\n` +
            `• **Total ventes :** ${bloc.totalVentes}$\n` +
            `• **Bénéfice comptable :** ${beneficeComptable}$`,
          inline: false
        },
        {
          name: "🏛 Données fiscales",
          value:
            `• **Chiffre d’affaires :** ${chiffreAffaires}$\n` +
            `• **Dépenses réelles :** ${depensesReelles}$\n` +
            `• **Plafond dépenses (${plafondTaux * 100}% CA) :** ${plafondDepenses}$\n` +
            `• **Dépenses déductibles :** ${depensesDeductibles}$\n` +
            `• **Bénéfice imposable :** ${beneficeImposable}$`,
          inline: false
        },
        {
          name: "💰 Impôt dû",
          value:
            beneficeImposable <= 0
              ? "_Aucun impôt dû_"
              : `• **Taux appliqué :** ${taux}%\n` +
                `• **Montant de l’impôt :** ${impot}$`,
          inline: false
        }
      ],
      footer: { text: `Fin de semaine — Megalo ${entreprise}` },
      timestamp: new Date().toISOString()
    };

    // ============================================================
    // 4) Envoi principal (toutes entreprises)
    // ============================================================
    try {
      const webhook = getWebhook(WEBHOOK_RECAP_FIN_SERVICE);

      if (!webhook) {
        console.warn(`⚠️ Webhook manquant : ${WEBHOOK_RECAP_FIN_SERVICE} — embed NON envoyé`);
      } else {
        sendWebhook(webhook, embed);
        console.log("📨 Embed envoyé pour :", entreprise);
      }

    } catch (err) {
      console.error("❌ Erreur envoi webhook principal :", err);
    }

    // ============================================================
    // 5) Envoi supplémentaire pour Tequilalala
    // ============================================================
    if (entreprise === "Tequilalala") {
      try {
        const webhookTequi = getWebhook(WEBHOOK_RECAP_FIN_SERVICE_OFFICIEL);

        if (!webhookTequi) {
          console.warn(`⚠️ Webhook manquant : ${WEBHOOK_RECAP_FIN_SERVICE_OFFICIEL} — embed TEQUI NON envoyé`);
        } else {
          sendWebhook(webhookTequi, embed);
          console.log("📨 Embed TEQUI OFFICIEL envoyé !");
        }

      } catch (err) {
        console.error("❌ Erreur envoi webhook TEQUI OFFICIEL :", err);
      }
    }

  });

  // ============================================================
  // 6) Réinitialisation de la feuille Résumé (on garde les en-têtes)
  // ============================================================
  try {
    const resumeSheet = ss.getSheetByName(FEUILLE_RESUME);
    if (resumeSheet) {
      const lastRow = resumeSheet.getLastRow();
      if (lastRow > 1) {
        resumeSheet.getRange(2, 1, lastRow - 1, resumeSheet.getLastColumn()).clearContent();
        console.log("🧹 Feuille Résumé réinitialisée (données effacées, en-têtes conservées)");
      }
    }
  } catch (err) {
    console.error("❌ Erreur lors de la réinitialisation de Résumé :", err);
  }

  console.log("✔ Tous les embeds FIN_SEMAINE ont été envoyés.");
}

/* ============================================================
   📐 BARÈME FISCAL
============================================================ */
function calculImpotBenefice(benefice) {
  let taux = 0;

  if (benefice <= 10000) taux = 0;
  else if (benefice <= 20000) taux = 10;
  else if (benefice <= 30000) taux = 20;
  else if (benefice <= 40000) taux = 25;
  else if (benefice <= 50000) taux = 30;
  else if (benefice <= 60000) taux = 35;
  else taux = 40;

  const impot = Math.round(benefice * taux / 100);
  return { taux, impot };
}

/* ============================================================
   📆 NUMÉRO DE SEMAINE ISO
============================================================ */
function getWeekNumber(date = new Date()) {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  const dayNr2 = (target.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr2 + 3);
  return 1 + Math.round((firstThursday - target) / 604800000);
}