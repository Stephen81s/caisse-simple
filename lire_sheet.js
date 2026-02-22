/********************************************************************
 * FILE    : lire_sheet.gs
 * MODULE  : GTARP - LECTURE DES FEUILLES GOOGLE SHEETS
 * AUTHOR  : Stephen
 * VERSION : 8.0.4 - SAFE VERSION (NO UTF8 RISKS)
 ********************************************************************/

console.log("[lire_sheet] Module charge - version 8.0.4");

/* ====================================================================
   LECTURE GENERIQUE D UNE FEUILLE
==================================================================== */
function lireFeuille(nomFeuille) {
  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(nomFeuille);
    if (!sheet) throw new Error("Feuille introuvable : " + nomFeuille);

    const data = sheet.getDataRange().getValues();
    console.log("[lire_sheet] Feuille lue :", nomFeuille, "->", data.length, "lignes");

    return data;

  } catch (err) {
    console.error("[lire_sheet] Erreur lireFeuille(", nomFeuille, "):", err);
    throw err;
  }
}

/* ====================================================================
   API PUBLIQUE - LECTURE DES MONTANTS DE CAISSE
==================================================================== */
function getMontantsCaisses() {
  try {
    console.log("[lire_sheet] getMontantsCaisses() appele");

    const ss = SpreadsheetApp.getActive();
    const sheet = ss.getSheetByName(FEUILLE_COMPTA);

    if (!sheet) {
      throw new Error("Feuille COMPTA introuvable : " + FEUILLE_COMPTA);
    }

    const result = {
      global:       Number(sheet.getRange("B1").getValue()) || 0,
      illegale:     Number(sheet.getRange(BANQUE_MAPPING["Illegal"]).getValue()) || 0,
      tequilalala:  Number(sheet.getRange(BANQUE_MAPPING["Tequilalala"]).getValue()) || 0,
      downtown:     Number(sheet.getRange(BANQUE_MAPPING["DowntownCabCo"]).getValue()) || 0,
      weazelnews:   Number(sheet.getRange(BANQUE_MAPPING["WeazelNews"]).getValue()) || 0
    };

    console.log("[lire_sheet] Montants renvoyes :", result);
    return result;

  } catch (err) {
    console.error("[lire_sheet] ERREUR getMontantsCaisses :", err);
    throw err;
  }
}

/* ====================================================================
   API PUBLIQUE - LECTURE DIRECTE DES TICKETS
==================================================================== */
function lireTicketsDirect() {
  console.log("[api_tickets] Appel public -> lireTicketsDirect()");
  return lireTicketsDirectInternal();
}

/* ====================================================================
   ALIAS — getAllTickets() pour compatibilité API
==================================================================== */
function getAllTickets() {
  console.log("[lire_sheet] getAllTickets() -> alias vers lireTicketsDirect()");
  return lireTicketsDirect();
}

/* ====================================================================
   LECTURE INTERNE - TABLEAU D OBJETS
==================================================================== */
function lireTicketsDirectInternal() {
  console.log("[lire_sheet] lireTicketsDirectInternal() -> DEMARRAGE");

  const sheet = SpreadsheetApp.getActive().getSheetByName(FEUILLE_TICKETS);
  if (!sheet) {
    console.error("[lire_sheet] ERREUR : Feuille introuvable :", FEUILLE_TICKETS);
    return [];
  }

  const data = sheet.getDataRange().getValues();
  console.log("[lire_sheet] Lignes brutes lues :", data.length);

  const lignes = [];

  for (let i = 1; i < data.length; i++) {
    const r = data[i];

    console.log("[lire_sheet] Ligne brute", i, ":", JSON.stringify(r));

    const isEmpty = r.every(cell => cell === "" || cell === null || cell === undefined);
    if (isEmpty) {
      console.warn("[lire_sheet] Ligne", i, "ignoree (vide)");
      continue;
    }

    const ticket = {
      id:            r[COL_TICKETS.TicketID - 1],
      client:        r[COL_TICKETS.Client - 1],
      vendeur:       r[COL_TICKETS.Vendeur - 1],
      dateAchat:     r[COL_TICKETS.DateAchat - 1],
      dateRevelation:r[COL_TICKETS.DateRevelation - 1],
      rarete:        r[COL_TICKETS.Rarete - 1],
      gain:          r[COL_TICKETS.Gain - 1],
      status:        r[COL_TICKETS.Status - 1],
      dateValidation:r[COL_TICKETS.DateValidation - 1],
      validateur:    r[COL_TICKETS.Validateur - 1],
      messageID:     r[COL_TICKETS.MessageID - 1],
      ChanelID:      r[COL_TICKETS.ChanelID - 1],
      couleurEmbed:  r[COL_TICKETS.CouleurEmbed - 1],
      noteAdmin:     r[COL_TICKETS.NoteAdmin - 1]
    };

    console.log("[lire_sheet] Ticket", i, "->", JSON.stringify(ticket));
    lignes.push(ticket);
  }

  console.log("[lire_sheet] Tickets renvoyes :", lignes.length);
  return lignes;
}