# 📊 GOOGLE APPS SCRIPT - BACKEND API

## 🎯 Vue d'ensemble

Votre application utilise **Google Sheets** comme base de données et **Google Apps Script** comme API backend.

**URL API actuelle :**
```
https://script.google.com/macros/s/AKfycbxMbW-f3gvc4CsRlVHSI2V8LZXKC30Ludig1pQGWcRPtIAG29aUSWwLi0mYvklBNeYt/exec
```

---

## 📋 STRUCTURE GOOGLE SHEETS

### **Feuille 1 : "RSVP"** (Inscription clients)

| Colonne | Nom            | Type     | Description                          |
|---------|----------------|----------|--------------------------------------|
| A       | Timestamp      | DateTime | Date/heure d'inscription             |
| B       | Ticket         | Text     | Numéro unique SD26-XXXX              |
| C       | Prénom         | Text     | Prénom du client                     |
| D       | Nom            | Text     | Nom de famille du client             |
| E       | Salon          | Text     | Nom du salon/institut                |
| F       | Ville          | Text     | Ville du salon                       |
| G       | Email          | Email    | Email du client                      |
| H       | Téléphone      | Text     | Numéro de téléphone                  |
| I       | Représentant   | Text     | Nom du commercial (Radia, Zineb...) |

**Exemple de données :**
```
2026-03-30 14:25:30 | SD26-0001 | Sarah   | Bennani | Beauty Lounge | Casablanca | sarah@example.com | 0612345678 | Radia
2026-03-30 15:12:45 | SD26-0002 | Fatima  | Alami   | Nails Expert  | Rabat      | fatima@mail.com   | 0623456789 | Zineb
2026-03-30 16:08:12 | SD26-0003 | Amina   | Tazi    | Glam Studio   | Marrakech  | amina@test.com    | 0634567890 | Boutaina
```

---

### **Feuille 2 : "WHEEL"** (Résultats roue de la fortune)

| Colonne | Nom            | Type     | Description                     |
|---------|----------------|----------|---------------------------------|
| A       | Timestamp      | DateTime | Date/heure du jeu               |
| B       | Ticket         | Text     | Numéro ticket SD26-XXXX         |
| C       | Devis          | Text     | Numéro devis S26XXX             |
| D       | Réduction      | Text     | Gain (-25%, -30%, -35%, -40%)   |
| E       | Statut         | Text     | ESSAI1, ESSAI2, CONSERVER, FINAL|

**Exemple de données :**
```
2026-03-30 17:30:12 | SD26-0001 | S26ABC | -30% | ESSAI1
2026-03-30 17:30:45 | SD26-0001 | S26ABC | -35% | FINAL
2026-03-30 18:15:20 | SD26-0002 | S26DEF | -25% | ESSAI1
2026-03-30 18:15:35 | SD26-0002 | S26DEF | -40% | FINAL
```

---

## 🔧 CODE GOOGLE APPS SCRIPT

### **Configuration initiale**

```javascript
// ID de votre fichier Google Sheets
const SPREADSHEET_ID = 'VOTRE_ID_ICI';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    switch (data.action) {
      case 'registerRSVP':
        return registerRSVP(sheet, data);
      case 'validate':
        return validateTicket(sheet, data);
      case 'register':
        return registerWheelResult(sheet, data);
      default:
        return createResponse({ success: false, error: 'Action inconnue' });
    }
  } catch (error) {
    return createResponse({ success: false, error: error.message });
  }
}

function createResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

### **1️⃣ ACTION : registerRSVP** (Inscription client)

**Requête de l'app :**
```javascript
{
  action: 'registerRSVP',
  firstName: 'Sarah',
  lastName: 'Bennani',
  salon: 'Beauty Lounge',
  city: 'Casablanca',
  email: 'sarah@example.com',
  phone: '0612345678',
  representative: 'Radia'
}
```

**Code Google Apps Script :**
```javascript
function registerRSVP(sheet, data) {
  const rsvpSheet = sheet.getSheetByName('RSVP');
  
  // Générer un numéro de ticket unique
  const lastRow = rsvpSheet.getLastRow();
  const ticketNumber = 'SD26-' + String(lastRow).padStart(4, '0');
  
  // Ajouter une nouvelle ligne
  rsvpSheet.appendRow([
    new Date(),
    ticketNumber,
    data.firstName,
    data.lastName,
    data.salon,
    data.city,
    data.email,
    data.phone,
    data.representative
  ]);
  
  return createResponse({
    success: true,
    ticketNumber: ticketNumber
  });
}
```

**Réponse API :**
```javascript
{
  success: true,
  ticketNumber: 'SD26-0042'
}
```

---

### **2️⃣ ACTION : validate** (Validation ticket + devis)

**Requête de l'app :**
```javascript
{
  action: 'validate',
  ticket: 'SD26-0001',
  devisNumber: 'S26ABC'
}
```

**Code Google Apps Script :**
```javascript
function validateTicket(sheet, data) {
  const rsvpSheet = sheet.getSheetByName('RSVP');
  const wheelSheet = sheet.getSheetByName('WHEEL');
  
  // 1. Chercher le ticket dans RSVP
  const rsvpData = rsvpSheet.getDataRange().getValues();
  let clientRow = null;
  
  for (let i = 1; i < rsvpData.length; i++) {
    if (rsvpData[i][1] === data.ticket) {  // Colonne B = Ticket
      clientRow = rsvpData[i];
      break;
    }
  }
  
  // 2. Vérifier si le ticket existe
  if (!clientRow) {
    return createResponse({
      success: false,
      notFound: true
    });
  }
  
  // 3. Vérifier si le ticket a déjà joué
  const wheelData = wheelSheet.getDataRange().getValues();
  for (let i = 1; i < wheelData.length; i++) {
    if (wheelData[i][1] === data.ticket) {
      return createResponse({
        success: false,
        alreadyUsed: true
      });
    }
  }
  
  // 4. Vérifier si le devis a déjà été utilisé
  for (let i = 1; i < wheelData.length; i++) {
    if (wheelData[i][2] === data.devisNumber) {
      return createResponse({
        success: false,
        devisUsed: true
      });
    }
  }
  
  // 5. ✅ Succès - Retourner les données du client
  return createResponse({
    success: true,
    clientName: clientRow[2] + ' ' + clientRow[3],  // Prénom + Nom
    salon: clientRow[4],
    city: clientRow[5],
    email: clientRow[6],
    devisUsed: false,
    alreadyUsed: false
  });
}
```

**Réponse API :**
```javascript
// ✅ Succès
{
  success: true,
  clientName: 'Sarah Bennani',
  salon: 'Beauty Lounge',
  city: 'Casablanca',
  email: 'sarah@example.com',
  devisUsed: false,
  alreadyUsed: false
}

// ❌ Ticket non trouvé
{
  success: false,
  notFound: true
}

// ❌ Ticket déjà utilisé
{
  success: false,
  alreadyUsed: true
}

// ❌ Devis déjà utilisé
{
  success: false,
  devisUsed: true
}
```

---

### **3️⃣ ACTION : register** (Enregistrer résultat roue)

**Requête de l'app :**
```javascript
{
  action: 'register',
  ticket: 'SD26-0001',
  devisNumber: 'S26ABC',
  discount: '-35%',
  status: 'FINAL'  // ou 'ESSAI1', 'ESSAI2', 'CONSERVER'
}
```

**Code Google Apps Script :**
```javascript
function registerWheelResult(sheet, data) {
  const wheelSheet = sheet.getSheetByName('WHEEL');
  
  // Ajouter le résultat
  wheelSheet.appendRow([
    new Date(),
    data.ticket,
    data.devisNumber,
    data.discount,
    data.status
  ]);
  
  return createResponse({
    success: true
  });
}
```

**Réponse API :**
```javascript
{
  success: true
}
```

---

## 🔐 DÉPLOIEMENT DE L'API

### **Étapes pour déployer votre script :**

1. **Ouvrir Google Apps Script**
   - Aller sur : https://script.google.com
   - Cliquer sur "Nouveau projet"

2. **Copier le code complet**
   - Coller tout le code des fonctions ci-dessus

3. **Déployer comme Web App**
   - Cliquer sur "Déployer" → "Nouvelle déploiement"
   - Type : "Application Web"
   - Exécuter en tant que : "Moi"
   - Qui peut accéder : "Tout le monde"
   - Copier l'URL générée

4. **Mettre à jour l'URL dans votre app**
   - Remplacer l'URL dans `/src/utils/api.ts`

---

## 📊 EXEMPLE DE FLOW COMPLET

### **Scénario : Sarah s'inscrit et joue à la roue**

**1. Sarah remplit le formulaire RSVP**
```
→ App envoie : registerRSVP
→ Google Sheets RSVP : Nouvelle ligne avec SD26-0042
→ App reçoit : { ticketNumber: 'SD26-0042' }
→ App affiche le billet PDF téléchargeable
```

**2. Le commercial Radia crée un devis S26XYZ dans Odoo**
```
→ Devis S26XYZ créé manuellement dans Odoo
```

**3. Radia accède à l'expérience staff**
```
→ /staff-pin → Entre COSMO2026
→ /wheel-code → Entre SD26-0042 + S26XYZ
→ App envoie : validate
→ Google Sheets cherche SD26-0042 dans RSVP
→ Google Sheets vérifie que SD26-0042 n'est pas dans WHEEL
→ Google Sheets vérifie que S26XYZ n'est pas dans WHEEL
→ App reçoit : { success: true, clientName: 'Sarah Bennani', ... }
→ Animation "Bonjour Sarah Bennani" s'affiche
```

**4. Sarah joue à la roue**
```
→ ESSAI 1 : Gagne -30%
  → App envoie : register (ticket, devis, -30%, ESSAI1)
  → Google Sheets WHEEL : Nouvelle ligne
  
→ Sarah choisit : "Retenter"

→ ESSAI 2 : Gagne -35%
  → App envoie : register (ticket, devis, -35%, FINAL)
  → Google Sheets WHEEL : Nouvelle ligne
  
→ Page résultat affiche : -35% de réduction
```

---

## 🧪 TESTER L'API

### **Utiliser Postman ou curl**

```bash
# Test registerRSVP
curl -X POST https://VOTRE_URL_API/exec \
  -H "Content-Type: application/json" \
  -d '{
    "action": "registerRSVP",
    "firstName": "Test",
    "lastName": "User",
    "salon": "Test Salon",
    "city": "Casablanca",
    "email": "test@example.com",
    "phone": "0600000000",
    "representative": "Radia"
  }'

# Test validate
curl -X POST https://VOTRE_URL_API/exec \
  -H "Content-Type: application/json" \
  -d '{
    "action": "validate",
    "ticket": "SD26-0001",
    "devisNumber": "S26ABC"
  }'
```

---

## ✅ CHECKLIST DE CONFIGURATION

- [ ] Créer un nouveau Google Sheets avec 2 feuilles : "RSVP" et "WHEEL"
- [ ] Ajouter les en-têtes dans chaque feuille (ligne 1)
- [ ] Créer un nouveau projet Google Apps Script
- [ ] Copier le code complet des 3 fonctions
- [ ] Remplacer `SPREADSHEET_ID` par l'ID de votre Google Sheets
- [ ] Déployer comme "Application Web"
- [ ] Copier l'URL générée
- [ ] Mettre à jour `/src/utils/api.ts` avec la nouvelle URL
- [ ] Tester chaque endpoint avec des données de test

---

## 🎯 RÉSUMÉ

✅ **Base de données = Google Sheets** (gratuit, facile, pas de setup)
✅ **API = Google Apps Script** (serverless, scalable)
✅ **3 endpoints** : registerRSVP, validate, register
✅ **Lien automatique** : Ticket SD26-XXXX → Nom/Prénom du client
✅ **Anti-triche** : Validation croisée ticket + devis
✅ **Traçabilité complète** : Chaque action est enregistrée avec timestamp

Le nom du client apparaît dans l'animation "Bonjour..." car l'API Google Apps Script **cherche le ticket dans la feuille RSVP** et **retourne le prénom + nom** associé ! 🎉
