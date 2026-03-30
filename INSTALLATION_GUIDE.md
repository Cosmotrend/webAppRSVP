# 🚀 GUIDE D'INSTALLATION - SEMILAC DAYS 2026

## 📋 VUE D'ENSEMBLE

L'application utilise maintenant Google Sheets comme base de données pour assurer la traçabilité complète :

**Ticket RSVP** ↔ **Numéro de Devis** ↔ **Réduction Gagnée**

---

## ⚙️ CONFIGURATION EN 3 ÉTAPES

### **ÉTAPE 1 : Déployer Google Apps Script** ⏱️ 10 minutes

1. **Ouvrez le fichier** [`GOOGLE_APPS_SCRIPT.md`](./GOOGLE_APPS_SCRIPT.md)
2. **Suivez les instructions** pas à pas pour :
   - Créer le Google Sheet
   - Déployer l'API Google Apps Script
   - Obtenir l'URL de déploiement

📌 **Résultat** : Vous obtenez une URL comme :
```
https://script.google.com/macros/s/AKfycbzXXXXXXXXXXXXXXXXXXXXXXX/exec
```

---

### **ÉTAPE 2 : Configurer l'URL dans l'application** ⏱️ 2 minutes

**Option A : Via la console développeur (Recommandé)**

1. Ouvrez votre application dans le navigateur
2. Appuyez sur **F12** (ouvrir la console)
3. Copiez-collez cette commande en remplaçant l'URL :

```javascript
localStorage.setItem('googleScriptUrl', 'https://script.google.com/macros/s/VOTRE_URL_ICI/exec');
window.location.reload();
```

**Option B : Modifier directement le code**

Ouvrez `/src/app/utils/googleSheetsApi.ts` et remplacez :

```typescript
const GOOGLE_SCRIPT_URL = localStorage.getItem('googleScriptUrl') || '';
```

Par :

```typescript
const GOOGLE_SCRIPT_URL = localStorage.getItem('googleScriptUrl') || 'https://script.google.com/macros/s/VOTRE_URL_ICI/exec';
```

---

### **ÉTAPE 3 : Tester le système** ⏱️ 5 minutes

1. **Créez un RSVP** et récupérez un ticket (ex: `SD26-1234`)
2. **Créez un devis dans Odoo** (ex: `S26001`)
3. **Sur l'écran WheelCode**, entrez le numéro de devis
4. **Jouez à la roue** et gagnez une réduction
5. **Vérifiez dans Google Sheets** que la ligne a bien été enregistrée :

| Ticket | Devis | Client | Salon | Ville | Réduction | Date/Heure | Commercial | Statut |
|--------|-------|--------|-------|-------|-----------|------------|------------|--------|
| SD26-1234 | S26001 | Sarah | Beauty Salon | Casablanca | -30% | 30/03/26 14:32 | Radia | Utilisé |

---

## 🔄 WORKFLOW COMPLET

```
┌─────────────────┐
│  1. CLIENT      │  Remplit le formulaire RSVP
│  Formulaire     │  → Génère Ticket SD26-XXXX
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  2. COMMERCIAL  │  Crée un devis dans Odoo sur sa tablette
│  Odoo (Tablette)│  → Génère Devis S26XXX
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  3. COMMERCIAL  │  Donne le numéro de devis au client
│  → Client       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  4. CLIENT      │  Entre le numéro de devis
│  WheelCode      │  → Validation dans Google Sheets
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  5. CLIENT      │  Joue à la roue
│  Roue Fortune   │  → Gagne une réduction (ex: -30%)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  6. SYSTÈME     │  Enregistre automatiquement :
│  Google Sheets  │  Ticket + Devis + Réduction + Timestamp
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  7. CLIENT      │  Voit l'écran résultat avec :
│  Résultat       │  ✓ Ticket : SD26-1234
│                 │  ✓ Devis : S26001
│                 │  ✓ Réduction : -30%
└─────────────────┘
```

---

## 🔐 SÉCURITÉ & ANTI-TRICHE

✅ **Un numéro de devis = Une seule utilisation**
- Si un client essaie de réutiliser le même devis, le système le refuse

✅ **Validation en temps réel**
- Chaque validation interroge Google Sheets instantanément

✅ **Traçabilité complète**
- Toutes les données sont enregistrées avec timestamp
- Les commerciales peuvent exporter vers Odoo

✅ **Mode offline disponible**
- Si l'API n'est pas configurée, l'app fonctionne en mode localStorage
- Utile pour les tests ou environnements sans internet

---

## 🛠️ DÉPANNAGE

### ❌ "API non configurée"

**Solution** : Configurez l'URL Google Apps Script (voir ÉTAPE 2)

---

### ❌ "Ce devis a déjà été utilisé"

**Solution** : Normal ! C'est le système anti-triche qui fonctionne.
- Le commercial doit créer un nouveau devis dans Odoo

---

### ❌ "Erreur de connexion"

**Causes possibles** :
1. L'URL Google Apps Script est incorrecte
2. Le script n'est pas déployé correctement
3. Les permissions Google ne sont pas accordées

**Solution** : Retournez à [`GOOGLE_APPS_SCRIPT.md`](./GOOGLE_APPS_SCRIPT.md) ÉTAPE 3-4

---

### ❌ Rien ne s'enregistre dans Google Sheets

**Vérifications** :
1. La feuille s'appelle bien **"Devis"** (sensible à la casse)
2. Le script est bien déployé en tant qu'**Application Web**
3. Les permissions sont accordées (Exécuter en tant que : Moi / Accès : Tout le monde)

---

## 📊 EXPORTER LES DONNÉES VERS ODOO

Les commerciales peuvent facilement exporter les données :

1. Ouvrez le Google Sheet
2. Sélectionnez les lignes à exporter
3. **Fichier** → **Télécharger** → **CSV**
4. Importez le fichier dans Odoo

Ou utilisez l'API Odoo pour une synchronisation automatique (nécessite développement custom).

---

## 💡 CONSEILS D'UTILISATION

### Pour les commerciales :
- Créez les devis dans Odoo **AVANT** que le client ne joue
- Donnez le numéro de devis au client **juste avant** qu'il ne joue
- Vérifiez dans Google Sheets que le résultat est bien enregistré

### Pour les clients :
- Conservez une capture d'écran de l'écran résultat
- Notez votre numéro de ticket et de devis

---

## 📞 SUPPORT

En cas de problème technique :
1. Consultez ce guide
2. Vérifiez le fichier [`GOOGLE_APPS_SCRIPT.md`](./GOOGLE_APPS_SCRIPT.md)
3. Testez l'URL de l'API dans votre navigateur (doit afficher `{"status":"ok"}`)

---

## ✅ CHECKLIST FINALE

- [ ] Google Sheet créé avec la feuille "Devis"
- [ ] Google Apps Script déployé avec succès
- [ ] URL de l'API configurée dans l'application
- [ ] Test complet effectué (RSVP → Devis → Roue → Vérification Sheet)
- [ ] Les commerciales savent comment créer des devis dans Odoo
- [ ] Les clients comprennent le workflow

---

**🎉 Félicitations ! Votre système de traçabilité est opérationnel !**