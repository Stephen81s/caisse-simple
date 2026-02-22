/********************************************************************************************
 * FILE    : 00_constantes_globales.gs
 * MODULE  : GTARP — CONSTANTES GLOBALES BACKEND
 * AUTHOR  : Stephen
 * VERSION : 10.1.1 — PRO 2026 (API FIX + Ultra Logs + BANQUE_LABELS)
 ********************************************************************************************/

console.log("📘 [constantes_globales] Chargement des constantes BACKEND…");

/* ==========================================================================================
   🟢 STATUTS API
========================================================================================== */
const STATUS_OK    = "OK";
const STATUS_ERROR = "ERROR";

/* ==========================================================================================
   🟦 CONSTANTES API — ACTIONS DISPONIBLES
========================================================================================== */
const FN_LIRE_CAISSE_INITIALE = "lireCaisseEntiere";
const FN_LIRE_ARTICLES        = "lireArticles";
const FN_LIRE_ARTICLE_INFO    = "lireArticleInfo";
const FN_LIRE_ANNUAIRE        = "lireAnnuaire";
const FN_LIRE_ANNUAIRE_MAP    = "lireAnnuaireMap";
const FN_LIRE_TICKETS         = "lireTickets";

const FN_ECRIRE_CAISSE        = "ecrireCaisse";
const FN_ECRIRE_ANNUAIRE      = "ecrireAnnuaire";

console.log("🟦 [constantes_globales] Actions API chargées :", {
  FN_LIRE_CAISSE_INITIALE,
  FN_LIRE_ARTICLES,
  FN_LIRE_ARTICLE_INFO,
  FN_LIRE_ANNUAIRE,
  FN_LIRE_ANNUAIRE_MAP,
  FN_ECRIRE_CAISSE,
  FN_ECRIRE_ANNUAIRE
});

/* ==========================================================================================
     WEBHOOKS DISCORD — TYPES D'ÉVÉNEMENTS
========================================================================================== */
const WEBHOOK_TRANSACTION_LEGAL           = "TRANSACTION_LEGALE";
const WEBHOOK_TRANSACTION_ILLEGAL         = "TRANSACTION_ILLEGALE";
const WEBHOOK_STOCK_LEGAL                 = "STOCK_LEGAL";
const WEBHOOK_STOCK_ILLEGAL               = "STOCK_ILLEGAL";
const WEBHOOK_STOCK_COMBINE               = "STOCK_COMBINE";
const WEBHOOK_MOUVEMENT_STOCK             = "MOUVEMENT_STOCK";
const WEBHOOK_OPERATION_BANQUE            = "OPERATION_BANQUE";
const WEBHOOK_RECAP_FIN_SERVICE           = "RECAP_FIN_SERVICE";
const WEBHOOK_RECAP_FIN_SERVICE_OFFICIEL  = "RECAP_FIN_SERVICE_OFFICIEL";

console.log("🔗 [constantes_globales] Webhooks Discord chargés :", {
  WEBHOOK_TRANSACTION_LEGAL,
  WEBHOOK_TRANSACTION_ILLEGAL,
  WEBHOOK_STOCK_LEGAL,
  WEBHOOK_STOCK_ILLEGAL,
  WEBHOOK_STOCK_COMBINE,
  WEBHOOK_MOUVEMENT_STOCK,
  WEBHOOK_OPERATION_BANQUE,
  WEBHOOK_RECAP_FIN_SERVICE,
  WEBHOOK_RECAP_FIN_SERVICE_OFFICIEL
});

/* ==========================================================================================
    📄 FEUILLES GOOGLE SHEETS
========================================================================================== */
const FEUILLE_ARTICLES        = "Articles";
const FEUILLE_EMPLOYES        = "Employées";
const FEUILLE_ANNUAIRE        = "Annuaire";
const FEUILLE_TYPES_OP        = "TypeOperations";
const FEUILLE_MOYENS_PAIEMENT = "MoyenPaiements";
const FEUILLE_RESUME          = "Résumé";
const FEUILLE_COMPTA          = "Compta";
const FEUILLE_ENTREPRISES     = "Entreprises";
const FEUILLE_IDDISCORD       = "IDDiscord";
const FEUILLE_TCHAT           = "Tchat";
const FEUILLE_TCHAT_IMPORTANT = "TchatImportant";
const FEUILLE_TCHAT_ARCHIVE   = "TchatArchive";
const FEUILLE_ITEMS_CACHE     = "ItemsCache";
const FEUILLE_TICKETS         = "Tickets";

console.log("📄 [constantes_globales] Feuilles chargées.");

/* ==========================================================================================
   🧩 COLONNES — (inchangé)
========================================================================================== */
const COL_ARTICLES = { Nom:1, PrixAchat:2, PrixVente:3, Stock:4, Categorie:5, TypeCaisse:6, Types:7, Entreprise:8 };
const COL_EMPLOYES = { ID:1, Nom:2, Prenom:3, Role:4, Entreprise:5 };
const COL_ANNUAIRE = { Nom:1, Prenom:2, Telephone:3 };
const COL_TYPES_OP = { Operation:1 };
const COL_MOYENS_PAIEMENT = { Moyen:1 };
const COL_RESUME = { Heure:1, Employe:2, TypeMouvement:3, Client:4, Articles:5, PrixUnitaire:6, Quantite:7, TotalArticle:8, ModePaiement:9, TypeCaisse:10, Motif:11 };
const COL_COMPTA = { Label:1, Valeur:2 };
const COL_IDDISCORD = { Type:1, ID:2, Webhook:3 };
const COL_TCHAT = { Date:1, User:2, Message:3 };
const COL_TCHAT_IMPORTANT = { Date:1, User:2, Message:3, Tag:4 };
const COL_TCHAT_ARCHIVE = { Date:1, User:2, Message:3, Source:4 };
const COL_ITEMS_CACHE = { ItemsCache:1, ItemsRachat:2 };
const COL_TICKETS = { TicketID:1, Client:2, Vendeur:3, DateAchat:4, DateRevelation:5, Rarete:6, Gain:7, Status:8, DateValidation:9, Validateur:10, MessageID:11, ChanelID:12, CouleurEmbed:13, NoteAdmin:14 };

/* ==========================================================================================
   🏢 ENTREPRISES
========================================================================================== */
const ENTREPRISES = {
  TEQUI:    "Tequi-la-la",
  DOWNTOWN: "Downtown Cab Co",
  WEAZEL:   "Weazel News",
  ILLEGAL:  "Illegal"
};

console.log("🏢 [constantes_globales] ENTREPRISES chargées :", ENTREPRISES);

/* ==========================================================================================
   💰 MAPPING CAISSES (BANQUE) — Cellules dans la feuille COMPTA
========================================================================================== */
const BANQUE_MAPPING = {
  "Global":                 "B1",
  "Caisse illegale":        "B2",
  "Caisse Tequi-la-la":     "B3",
  "Caisse Downtown Cab Co": "B4",
  "Caisse Weazel News":     "B5"
};

console.log("💰 [constantes_globales] BANQUE_MAPPING chargés :", BANQUE_MAPPING);

/* ==========================================================================================
   🏷️ LABELS DES CAISSES — (MANQUAIT, maintenant FIX)
========================================================================================== */
const BANQUE_LABELS = {
  "Global":                 "Global",
  "Caisse illegale":        "Caisse illegale",
  "Caisse Tequi-la-la":     "Caisse Tequi-la-la",
  "Caisse Downtown Cab Co": "Caisse Downtown Cab Co",
  "Caisse Weazel News":     "Caisse Weazel News"
};

console.log("🏷️ [constantes_globales] BANQUE_LABELS chargés :", BANQUE_LABELS);

/* ==========================================================================================
   ✔ FIN
========================================================================================== */
console.log("📘 [constantes_globales] Chargement terminé.");