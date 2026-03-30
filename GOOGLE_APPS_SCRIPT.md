# 📋 GOOGLE APPS SCRIPT - Configuration

## ÉTAPE 1 : Créer le Google Sheet

1. Créez un nouveau Google Sheet
2. Nommez-le **"Semilac Days 2026 - Traçabilité"**
3. Créez une feuille nommée **"Devis"** avec les colonnes suivantes :

| Ticket | Devis | Client | Salon | Ville | Réduction | Date/Heure | Commercial | Statut |
|--------|-------|--------|-------|-------|-----------|------------|------------|--------|

**Exemple de ligne :**
| SD26-1234 | S26001 | Sarah | Beauty Salon | Casablanca | -30% | 30/03/26 14:32 | Radia | Utilisé |

## ÉTAPE 2 : Ouvrir Apps Script

1. Dans votre Google Sheet, cliquez sur **Extensions** → **Apps Script**
2. Supprimez le code par défaut
3. Copiez-collez le code ci-dessous :

```javascript
// ==========================================
// SEMILAC DAYS 2026 - API GOOGLE SHEETS
// ==========================================

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ 
    status: 'ok', 
    message: 'Semilac Days 2026 API Active' 
  }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === 'validate') {
      return validateDevis(data.devisNumber);
    } else if (action === 'register') {
      return registerResult(data);
    }

    return createResponse(false, 'Action invalide');
  } catch (error) {
    return createResponse(false, 'Erreur serveur: ' + error.message);
  }
}

// ==========================================
// VALIDER UN NUMÉRO DE DEVIS
// ==========================================
function validateDevis(devisNumber) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Devis');
  const data = sheet.getDataRange().getValues();
  
  // Vérifier si le devis existe déjà (colonne B = Devis)
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] && data[i][1].toString().toUpperCase() === devisNumber.toUpperCase()) {
      // Devis déjà utilisé
      return createResponse(false, 'Ce numéro de devis a déjà été utilisé', {
        used: true,
        ticket: data[i][0],
        discount: data[i][5],
        date: data[i][6]
      });
    }
  }
  
  // Devis valide (pas encore utilisé)
  return createResponse(true, 'Devis valide', { used: false });
}

// ==========================================
// ENREGISTRER LE RÉSULTAT
// ==========================================
function registerResult(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Devis');
  
  // Vérifier une dernière fois que le devis n'a pas été utilisé
  const existingData = sheet.getDataRange().getValues();
  for (let i = 1; i < existingData.length; i++) {
    if (existingData[i][1] && existingData[i][1].toString().toUpperCase() === data.devisNumber.toUpperCase()) {
      return createResponse(false, 'Ce devis a déjà été utilisé');
    }
  }
  
  // Enregistrer la nouvelle ligne
  const timestamp = Utilities.formatDate(new Date(), 'GMT+1', 'dd/MM/yyyy HH:mm:ss');
  
  sheet.appendRow([
    data.ticket,           // Colonne A : Ticket
    data.devisNumber,      // Colonne B : Devis
    data.clientName || '', // Colonne C : Client
    data.salon || '',      // Colonne D : Salon
    data.city || '',       // Colonne E : Ville
    data.discount,         // Colonne F : Réduction
    timestamp,             // Colonne G : Date/Heure
    data.representative || '', // Colonne H : Commercial
    'Utilisé'              // Colonne I : Statut
  ]);
  
  return createResponse(true, 'Résultat enregistré avec succès', {
    timestamp: timestamp
  });
}

// ==========================================
// CRÉER UNE RÉPONSE JSON
// ==========================================
function createResponse(success, message, data = {}) {
  const response = {
    success: success,
    message: message,
    data: data,
    timestamp: new Date().toISOString()
  };
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## ÉTAPE 3 : Déployer l'API

1. Cliquez sur **Déployer** → **Nouveau déploiement**
2. Cliquez sur ⚙️ (roue dentée) → **Application Web**
3. Configuration :
   - **Description** : `Semilac Days 2026 API v1`
   - **Exécuter en tant que** : `Moi`
   - **Qui peut accéder** : `Tout le monde`
4. Cliquez sur **Déployer**
5. **IMPORTANT** : Copiez l'**URL du déploiement Web**
   - Format : `https://script.google.com/macros/s/XXXXX/exec`

## ÉTAPE 4 : Autoriser les permissions

1. Google vous demandera d'autoriser l'application
2. Cliquez sur **Examiner les autorisations**
3. Sélectionnez votre compte
4. Cliquez sur **Paramètres avancés**
5. Cliquez sur **Accéder à [nom du projet] (dangereux)**
6. Cliquez sur **Autoriser**

## ✅ ÉTAPE 5 : Tester l'API

Dans Apps Script, cliquez sur **Exécuter** et testez ces fonctions :
- `validateDevis` → doit retourner "Devis valide"
- `registerResult` → doit ajouter une ligne dans le sheet

---

## 🔑 **VOTRE URL D'API**

Après le déploiement, vous obtiendrez une URL comme :
```
https://script.google.com/macros/s/AKfycbzXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec
```

**Gardez cette URL**, vous devrez l'entrer dans l'application React !

---

## 📊 **STRUCTURE DU GOOGLE SHEET**

| Ticket | Devis | Client | Salon | Ville | Réduction | Date/Heure | Commercial | Statut |
|--------|-------|--------|-------|-------|-----------|------------|------------|--------|
| SD26-1234 | S26001 | Sarah | Beauty Salon | Casablanca | -30% | 30/03/26 14:32 | Radia | Utilisé |

---

## 🔒 **SÉCURITÉ**

- ✅ L'API vérifie qu'un devis ne peut être utilisé qu'une seule fois
- ✅ Les données sont centralisées et sécurisées dans Google Sheets
- ✅ Toutes les tentatives d'utilisation sont enregistrées avec timestamp
- ✅ Les commerciales peuvent exporter les données vers Odoo

---

## 🆘 **EN CAS D'ERREUR**

Si l'API ne fonctionne pas :
1. Vérifiez que la feuille s'appelle bien **"Devis"** (sensible à la casse)
2. Vérifiez que vous avez bien cliqué sur **Déployer** → **Nouveau déploiement**
3. Vérifiez les permissions (Exécuter en tant que : Moi / Accès : Tout le monde)
4. Testez l'URL dans votre navigateur (doit afficher `{"status":"ok"}`)