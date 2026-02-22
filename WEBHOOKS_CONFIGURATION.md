# 🔗 CONFIGURATION DES WEBHOOKS DISCORD

**Date :** 21/02/2026  
**Projet :** Caisse Simple — GTARP  

---

## 📋 RÉSUMÉ

Il y a **9 webhooks Discord** différents pour différents types d'événements. Ils doivent être configurés dans la feuille `IDDiscord` de Google Sheets.

---

## 🛠️ CONFIGURATION REQUISE

### **Feuille : IDDiscord**

| Colonne A (Type) | Colonne B (ID) | Colonne C (Webhook URL) |
|-------|-------|-------|
| `TransactionLegal` | Discord Channel ID | `https://discord.com/api/webhooks/...` |
| `TransactionIllegal` | Discord Channel ID | `https://discord.com/api/webhooks/...` |
| `StockLegal` | Discord Channel ID | `https://discord.com/api/webhooks/...` |
| `StockIllegal` | Discord Channel ID | `https://discord.com/api/webhooks/...` |
| `StockCombine` | Discord Channel ID | `https://discord.com/api/webhooks/...` |
| `MouvementStock` | Discord Channel ID | `https://discord.com/api/webhooks/...` |
| `OperationBanque` | Discord Channel ID | `https://discord.com/api/webhooks/...` |
| `RecapFinSemaine` | Discord Channel ID | `https://discord.com/api/webhooks/...` |
| `RecapFinSemaineTequiOfficiel` | Discord Channel ID | `https://discord.com/api/webhooks/...` |

---

## 📚 DÉTAILS DES WEBHOOKS

### **1. TransactionLegal** 🟢
- **Fichier :** `embed_transaction.js`
- **Quand :** Lors d'une vente/achat/opération légale
- **Contient :** Articles, prix, employé, client, paiement
- **Couleur embed :** Vert (#2ecc71)

### **2. TransactionIllegal** 🔴
- **Fichier :** `embed_transaction.js`
- **Quand :** Lors d'une opération illégale
- **Contient :** Articles, prix, employé, client, paiement
- **Couleur embed :** Rouge (#e74c3c)

### **3. StockLegal** 📦
- **Fichier :** `embed_stock_reel.js`
- **Quand :** Mise à jour du stock légal
- **Contient :** Articles ajoutés/retirés, quantités
- **Couleur embed :** Bleu

### **4. StockIllegal** 📦
- **Fichier :** `embed_stock_reel.js`
- **Quand :** Mise à jour du stock illégal
- **Contient :** Articles ajoutés/retirés, quantités
- **Couleur embed :** Orange

### **5. StockCombine** 📦
- **Fichier :** `embed_stock_reel.js`
- **Quand :** Mise à jour combinée légal + illégal
- **Contient :** Résumé des stocks
- **Couleur embed :** Jaune

### **6. MouvementStock** 📊
- **Fichier :** `embed_mouvement_stock.js`
- **Quand :** Chaque mouvement de stock (vente, achat, etc.)
- **Contient :** Détail du mouvement, article, quantité
- **Couleur embed :** Cyan

### **7. OperationBanque** 💰
- **Fichier :** `embed_banque.js`
- **Quand :** Dépôt/Retrait d'une caisse
- **Contient :** Montant, type caisse, employé, motif
- **Couleur embed :** Gold

### **8. RecapFinSemaine** 📋
- **Fichier :** `embed_fin_semaine.js`
- **Quand :** Chaque vendredi à 20h (planifié)
- **Contient :** Totaux légal, illégal, par entreprise
- **Couleur embed :** Purple

### **9. RecapFinSemaineTequiOfficiel** 🍸
- **Fichier :** `embed_fin_semaine.js`
- **Quand :** Chaque vendredi à 20h (planifié) — Spécial Tequilalala
- **Contient :** Récap complet Tequilalala uniquement
- **Couleur embed :** Purple

---

## 🔧 COMMENT CRÉER UN WEBHOOK DISCORD ?

### **Étape 1 : Accéder au serveur Discord**
1. Ouvrir Discord
2. Aller sur le serveur GTARP
3. Clicker droit sur le canal où tu veux les embeds

### **Étape 2 : Créer le webhook**
1. Cliquer sur "Paramètres du salon"
2. Aller dans "Intégrations"
3. Cliquer sur "Webhooks"
4. Cliquer sur "Nouveau webhook"
5. Donner un nom : ex. "CAISSE LEGALE"
6. Cliquer sur "Copier l'URL du webhook"

### **Étape 3 : Coller dans Google Sheets**
1. Ouvrir la feuille `IDDiscord`
2. Ajouter une nouvelle ligne :
   - Colonne A : `TransactionLegal` (ou autre type)
   - Colonne B : Discord Channel ID
   - Colonne C : **Coller l'URL du webhook**

**Exemple d'URL :**
```
https://discord.com/api/webhooks/123456789/abcdefghijklmnop
```

---

## ✅ CHECKLIST CONFIGURATION

- [ ] Créer 9 canaux Discord (ou réutiliser des existants)
- [ ] Créer 9 webhooks
- [ ] Remplir la feuille `IDDiscord` avec les types et URLs
- [ ] Tester un appel de caisse pour voir si l'embed arrive
- [ ] Vérifier que les couleurs s'affichent correctement
- [ ] Vérifier que les données sont complètes dans les embeds

---

## 🧪 TEST

**Pour tester si tout fonctionne :**

1. Faire une vente dans l'interface caisse
2. Cliquer sur "Valider la caisse"
3. Vérifier que l'embed arrive dans Discord

**Embeds attendus :**
- ✅ Un embed dans le canal `TransactionLegal` (si articles légaux)
- ✅ Un embed dans le canal `TransactionIllegal` (si articles illégaux)
- ✅ Un embed dans le canal `MouvementStock` (mise à jour stocks)
- ✅ Un embed dans le canal `StockLegal` ou `StockIllegal`

---

## 🔴 ERREURS ATTENDUES SI MAL CONFIGURÉ

```
❌ [embed_transaction] Webhook manquant : TransactionLegal
❌ [embed_banque] ERREUR : URL webhook invalide
❌ [lire_sheet] Aucun webhook trouvé pour le type : TransactionLegal
```

**Solution :** Vérifier que la feuille `IDDiscord` est correctement remplie

---

## 📝 MODÈLE DE FEUILLE IDDiscord

Copier/coller ce modèle dans la feuille IDDiscord (à partir de la ligne 2) :

```
TransactionLegal            | 123456789012345678 | https://discord.com/api/webhooks/YOUR_WEBHOOK_ID_1/YOUR_TOKEN_1
TransactionIllegal          | 123456789012345678 | https://discord.com/api/webhooks/YOUR_WEBHOOK_ID_2/YOUR_TOKEN_2
StockLegal                  | 123456789012345678 | https://discord.com/api/webhooks/YOUR_WEBHOOK_ID_3/YOUR_TOKEN_3
StockIllegal                | 123456789012345678 | https://discord.com/api/webhooks/YOUR_WEBHOOK_ID_4/YOUR_TOKEN_4
StockCombine                | 123456789012345678 | https://discord.com/api/webhooks/YOUR_WEBHOOK_ID_5/YOUR_TOKEN_5
MouvementStock              | 123456789012345678 | https://discord.com/api/webhooks/YOUR_WEBHOOK_ID_6/YOUR_TOKEN_6
OperationBanque             | 123456789012345678 | https://discord.com/api/webhooks/YOUR_WEBHOOK_ID_7/YOUR_TOKEN_7
RecapFinSemaine             | 123456789012345678 | https://discord.com/api/webhooks/YOUR_WEBHOOK_ID_8/YOUR_TOKEN_8
RecapFinSemaineTequiOfficiel | 123456789012345678 | https://discord.com/api/webhooks/YOUR_WEBHOOK_ID_9/YOUR_TOKEN_9
```

---

## 🚀 RÉSUMÉ

| # | Webhook | Usage | Status |
|---|---------|-------|--------|
| 1 | TransactionLegal | Ventes légales | ✅ Configuré |
| 2 | TransactionIllegal | Ventes illégales | ✅ Configuré |
| 3 | StockLegal | Stock légal | ✅ Configuré |
| 4 | StockIllegal | Stock illégal | ✅ Configuré |
| 5 | StockCombine | Stock combiné | ✅ Configuré |
| 6 | MouvementStock | Chaque mouvement | ✅ Configuré |
| 7 | OperationBanque | Opérations caisse | ✅ Configuré |
| 8 | RecapFinSemaine | Récap hebdaire | ✅ Configuré |
| 9 | RecapFinSemaineTequiOfficiel | Récap Tequi | ✅ Configuré |

---

**Documentation générée par :** GitHub Copilot  
**Date :** 21/02/2026
