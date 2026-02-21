/* ==========================================================================================
   🧩 MODULE COMPTA — EXTENSION MULTI-JOBS
========================================================================================== */

// TODO COMPTA-JOBS 1 : Compta Weazel News (Taxi)
// - Enregistrer chaque course (chauffeur, client, distance, prix)
// - Calcul automatique des commissions
// - Tableau de bord journalier / hebdo
// - Export comptable pour les patrons

// TODO COMPTA-JOBS 2 : Compta globale pour tous les jobs
// - Feuille unique : Compta_Global
// - Colonnes : Date, Job, Employé, Type, Montant, Description, Source
// - API : ajouterTransaction(job, employe, type, montant, description)
// - Dashboard multi-jobs (CA, dépenses, bilans)

// TODO COMPTA-JOBS 3 : Normalisation des types de transactions
// - Vente
// - Service
// - Course
// - Prime
// - Dépense
// - Bonus RP


/* ==========================================================================================
   🔐 MODULE ABONNEMENTS — ACCÈS PAYANT / DURÉE LIMITÉE
========================================================================================== */

// TODO ABONNEMENT 1 : Feuille Abonnements
// - ID Discord
// - Nom
// - Job
// - DatePaiement
// - DateExpiration
// - Statut (ACTIF / EXPIRE)

// TODO ABONNEMENT 2 : API d’abonnement
// - payerAbonnement(idDiscord, job)
// - verifierAbonnement(idDiscord, job)
// - estActif(idDiscord, job)
// - desactiverAbonnementsExpires()

// TODO ABONNEMENT 3 : Intégration RP
// - Message : "Votre abonnement a expiré."
// - Message : "Renouvelez votre abonnement pour continuer."
// - Message : "Abonnement actif jusqu’au : XX/XX."

// TODO ABONNEMENT 4 : Blocage automatique
// - Si abonnement expiré → accès refusé
// - Si abonnement actif → accès OK
// - Logs détaillés pour audit


/* ==========================================================================================
   🧠 NOTES TECHNIQUES — COMPTA & ABONNEMENTS
========================================================================================== */

// - Tous les modules doivent utiliser la même API comptable (compta_global_core)
// - Les jobs doivent pouvoir être ajoutés sans modifier le backend
// - Le module abonnement doit être indépendant et réutilisable
// - Prévoir un cron journalier pour nettoyer les abonnements expirés
// - Prévoir un cron horaire pour les jobs à forte activité (ex : taxis)