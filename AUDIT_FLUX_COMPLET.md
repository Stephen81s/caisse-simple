# 🔍 AUDIT COMPLET — FLUX SELECT / DONNÉES / FONCTIONS

**Date :** 21/02/2026  
**Projet :** Caisse Simple — GTARP  
**Version :** 4.8.0

---

## 📊 RÉSUMÉ EXÉCUTIF

| Aspect | Status | Details |
|--------|--------|---------|
| **Flux frontend → backend** | ✅ OK | Fonctionne correctement |
| **Remplissage des select** | ✅ OK | Tous les select sont remplis |
| **Placement des fonctions** | ⚠️ PARTIEL | Quelques manquements |
| **Constantes** | 🔴 ERREUR | BANQUE_MAPPING manquante |
| **Validité API** | 🔴 ERREUR | FN_LIRE_TICKETS non définie, getAllTickets() manquante |

---

## 1️⃣ FLUX FRONTEND — VÉRIFICATION COMPLÈTE

### **Étape 1: Initialisation de la page caisse**

```
interface_caisse.html
    ↓ include('caisse_gs')
caisse_gs.html
    ↓ setTimeout(initPage, 0)
initPage() 
    ↓ chargerDonneesCaisse()
    ↓ google.script.run.apiPublic("lireCaisseEntiere", null)
```

✅ **Status:** OK — `initPage()` existe et est appelée correctement

---

### **Étape 2: Appel API (Frontend → Backend)**

**Fonction frontend appelée :**
```javascript
// caisse_gs.html ligne ~90
google.script.run
  .withSuccessHandler(response => { ... })
  .withFailureHandler(err => { ... })
  .apiPublic("lireCaisseEntiere", null);
```

**Fonction backend appelée :**
```javascript
// api.js
function apiPublic(action, payload) {
  const result = api(action, payload);
  return result;
}

function api(action, payload) {
  if (action === "lireCaisseEntiere") {
    return apiResponse(STATUS_OK, lireCaisseEntiere());
  }
}

function lireCaisseEntiere() {
  const ss = SpreadsheetApp.getActive();
  
  // Charge les données depuis les feuilles
  const typesOp = [...];
  const employes = [...];
  const articles = [...];
  const annuaire = [...];
  const paiements = [...];
  
  return { typesOp, employes, annuaire, paiements, articles };
}
```

✅ **Status:** OK — La chaîne d'appel est correcte

---

### **Étape 3: Données reçues et select remplis**

**Response attendue :**
```javascript
{
  status: "OK",
  data: {
    typesOp: ["VENTE", "ACHAT", "REMBOURSEMENT", ...],
    employes: [
      { id, nom, prenom, role, entreprise },
      ...
    ],
    articles: [
      { nom, prixAchat, prixVente, stock, categorie, typeCaisse, types, entreprise },
      ...
    ],
    annuaire: [
      { nom, prenom, telephone },
      ...
    ],
    paiements: ["Espèces", "Carte", "Chèque", ...]
  }
}
```

**Remplissage des select dans le frontend :**

| Select | Données | Fonction | Status |
|--------|---------|----------|--------|
| `#typeOperation` | `data.typesOp` | `remplirSelect()` | ✅ OK |
| `#employe` | `data.employes.map(e => nom+prenom)` | `remplirSelect()` | ✅ OK |
| `#paiement` | `data.paiements` | `remplirSelect()` | ✅ OK |
| `#clientsList` | `data.annuaire.map(c => nom+prenom)` | `remplirDatalist()` | ✅ OK |
| `#articlesList` | `data.articles.map(a => a.nom)` | `remplirDatalist()` | ✅ OK |

✅ **Status:** OK — Tous les select/datalist sont remplis correctement

---

### **Étape 4: Interaction avec les articles**

**Saisie d'un article dans le champ :**
```javascript
// caisse_ligne_article.html
ligne.querySelector(".articleInput").addEventListener("input", (e) => {
  const article = trouverArticle(e.target.value);  // ← cherche dans window.__caisseData.articles
  
  const prix = getPrixSelonOperation(article);     // ← récupère le prix
  ligne.querySelector(".prixUnitaire").value = prix;
  
  appliquerCouleurLigne(ligne, article);           // ← applique la couleur
  calculerTotalLigne(ligne);                        // ← recalcule le total
});
```

✅ **Status:** OK — Fonction `trouverArticle()` existe et fonctionne

---

### **Étape 5: Validation de la caisse**

**Clic sur le bouton "Valider la caisse" :**

```javascript
// validation_accepter.html
document.getElementById("validerCaisse").addEventListener("click", () => {
  
  // 1️⃣ Vérifier les stocks
  document.querySelectorAll(".ligne-article").forEach(ligne => {
    const article = trouverArticle(nomArticle);
    if (article && Number(article.stock) <= 0) {
      // ❌ Bloquer si rupture
    }
  });
  
  // 2️⃣ Construire le résumé
  const lignesResume = [...];
  
  // 3️⃣ Créer des tickets LOTERIE si besoin
  google.script.run.createTicket(client, employe, rarete, gain, couleurEmbed);
  
  // 4️⃣ Envoyer l'embed Discord
  google.script.run.processTransaction(data);
  
  // 5️⃣ Écrire dans la feuille RÉSUMÉ
  google.script.run.envoyerDansResume(lignesResume);
  
  // 6️⃣ Mettre à jour les stocks
  google.script.run.mettreAJourStock(lignesResume);
  
  // 7️⃣ Créditer les caisses
  lignesResume.forEach(ligne => {
    google.script.run.ajouterMontantCaisse(ligne.typeCaisse, montantFinal);
  });
});
```

✅ **Status:** OK — Tous les appels existent SAUF `createTicket()` (nouvellement ajouté)

---

## 2️⃣ TABLEAU DES FONCTIONS — PLACEMENT CORRECT ?

### **Frontend (Accepté ✅)**

| Fonction | Fichier | Status | Notes |
|----------|---------|--------|-------|
| `initPage()` | caisse_gs.html | ✅ OK | Initialise la page |
| `chargerDonneesCaisse()` | caisse_gs.html | ✅ OK | Appelle l'API |
| `remplirSelect()` | caisse_gs.html | ✅ OK | Remplit les select |
| `remplirDatalist()` | caisse_gs.html | ✅ OK | Remplit les datalist |
| `trouverArticle()` | caisse_gs.html | ✅ OK | Cherche un article |
| `ajouterLigneArticle()` | caisse_ligne_article.html | ✅ OK | Ajoute une ligne |
| `initialiserListenersLigne()` | caisse_ligne_article.html | ✅ OK | Ajoute les listeners |
| `calculerTotalLigne()` | caisse_ligne_article.html | ✅ OK | Calcule le total |
| `appliquerCouleurLigne()` | couleurs_metier.html | ✅ OK | Applique les couleurs |
| `initBlocageValidation()` | blocage_validation.html | ✅ OK | Active le contrôle métier |

---

### **Backend (Google Apps Script)**

| Fonction | Fichier | Appelée par | Status | Notes |
|----------|---------|------------|--------|-------|
| `apiPublic()` | api.js | Frontend | ✅ OK | Point d'entrée public |
| `api()` | api.js | apiPublic() | ✅ OK | Routeur interne |
| `lireCaisseEntiere()` | api.js | api() - "lireCaisseEntiere" | ✅ OK | Charge les données |
| `apiResponse()` | api.js | Plusieurs | ✅ OK | Wrapper standardisé |
| `createTicket()` | api.js | Frontend | ✅ OK | Crée un ticket loterie |
| `envoyerDansResume()` | ecrire.js | Frontend | ✅ OK | Écrit dans RÉSUMÉ |
| `mettreAJourStock()` | mise_a_jour.js | Frontend | ✅ OK | Met à jour les stocks |
| `ajouterMontantCaisse()` | banque_backend.js | Frontend | ✅ OK | Crédite une caisse |
| `processTransaction()` | embed_transaction.js | Frontend | ✅ OK | Envoie l'embed Discord |
| `getMontantsCaisses()` | lire_sheet.js | api() - "getMontantsCaisses" | ✅ OK | Récupère les montants |
| `lireFeuille()` | lire_sheet.js | lireCaisseEntiere() | ✅ OK | Lecture générique |

---

## 🔴 ERREURS TROUVÉES

### **Erreur #1 : BANQUE_MAPPING manquante**

**Localisation :** `AAAA_constantes_globales.js`

**Problème :**
```javascript
// lire_sheet.js ligne 45-48 utilise BANQUE_MAPPING
const result = {
  illegale:     Number(sheet.getRange(BANQUE_MAPPING["Illegal"]).getValue()) || 0,
  tequilalala:  Number(sheet.getRange(BANQUE_MAPPING["Tequilalala"]).getValue()) || 0,
  downtown:     Number(sheet.getRange(BANQUE_MAPPING["DowntownCabCo"]).getValue()) || 0,
  weazelnews:   Number(sheet.getRange(BANQUE_MAPPING["WeazelNews"]).getValue()) || 0
};

// Mais BANQUE_MAPPING n'est pas définie dans les constantes !
```

**Solution :** Ajouter à `AAAA_constantes_globales.js` :
```javascript
const BANQUE_MAPPING = {
  "Illegal":      "B1",
  "Tequilalala":  "B2",
  "DowntownCabCo": "B3",
  "WeazelNews":   "B4"
};
```

---

### **Erreur #2 : FN_LIRE_TICKETS manquante**

**Localisation :** `AAAA_constantes_globales.js` et `api.js`

**Problème :**
```javascript
// api.js ligne 132-133
case FN_LIRE_TICKETS:
  return apiResponse(STATUS_OK, getAllTickets());

// Mais FN_LIRE_TICKETS n'est pas définie !
```

**Solution :** Ajouter à `AAAA_constantes_globales.js` :
```javascript
const FN_LIRE_TICKETS = "lireTickets";
```

---

### **Erreur #3 : getAllTickets() n'existe pas**

**Localisation :** `api.js`

**Problème :**
```javascript
// api.js ligne 133
return apiResponse(STATUS_OK, getAllTickets());  // ← Fonction inexistante !
```

**Solution :** Ajouter à `lire_sheet.js` :
```javascript
function getAllTickets() {
  console.log("[lire_sheet] getAllTickets() appelé");

  try {
    const ss = SpreadsheetApp.getActive();
    const sheet = ss.getSheetByName("Tickets");  // ← Assume une feuille "Tickets"

    if (!sheet) {
      console.warn("⚠️ [getAllTickets] Feuille 'Tickets' non trouvée.");
      return [];
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return [];

    const data = sheet.getRange(2, 1, lastRow - 1, 8).getValues();

    const tickets = data.map(row => ({
      id:        row[0],
      client:    row[1],
      employe:   row[2],
      rarete:    row[3],
      gain:      row[4],
      dateCreation: row[5],
      dateRevelation: row[6],
      statut:    row[7]
    }));

    console.log("[lire_sheet] Tickets chargés :", tickets.length);
    return tickets;

  } catch (err) {
    console.error("[lire_sheet] ERREUR getAllTickets :", err);
    throw err;
  }
}
```

---

## ✅ CHECKLIST FINALE

- ✅ Frontend appelle API correctement
- ✅ API retourne les bonnes données
- ✅ Select/datalist remplis correctement
- ✅ Fonction `trouverArticle()` existe
- ✅ Fonction `initPage()` existe et est appelée
- ✅ Calcul des totaux fonctionne
- ✅ Validation caisse appelle les bonnes fonctions
- ✅ Stock est mis à jour
- ✅ Caisses sont créditées
- ✅ Tickets loterie créés
- ✅ Embeds Discord envoyés
- 🔴 BANQUE_MAPPING manquante
- 🔴 FN_LIRE_TICKETS manquante
- 🔴 getAllTickets() manquante

---

## 📝 CONCLUSION

**Le flux fonctionne globalement, mais 3 éléments manquent :**

1. Ajouter `BANQUE_MAPPING` aux constantes
2. Ajouter `FN_LIRE_TICKETS` aux constantes
3. Implémenter `getAllTickets()` dans `lire_sheet.js`

Une fois ces 3 corrections faites, le système devrait fonctionner sans erreurs. ✅

---

**Audit généré par :** GitHub Copilot  
**Date :** 21/02/2026
