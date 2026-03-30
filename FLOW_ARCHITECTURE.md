# 🎯 ARCHITECTURE DE L'APPLICATION - FLOW COMPLET

## 📱 CONFIGURATION GÉNÉRALE

- ✅ **Viewport mobile uniquement** : 375×812 (iPhone X)
- ✅ **Pas de bouton API** en bas à droite (supprimé de toutes les pages)
- ✅ **Design premium** : Rose (#F8A4C8) + Doré (#D4A574)
- ✅ **Animations dynamiques** : Confettis, parallaxe, particules, glow
- ✅ **Persistance frontend** : localStorage (pas de backend pour les clients)
- ✅ **Backend Google Sheets** : Via Google Apps Script pour traçabilité

---

## 🎬 FLOW UTILISATEUR COMPLET

### **📍 ÉTAPE 1 : EXPÉRIENCE CLIENT (Public)**

#### **Page 1 : RSVP Form** (`/` ou `/rsvp`)
- **Objectif** : Inscription du client à l'événement Semilac DAYS
- **Champs** :
  - Prénom *
  - Nom *
  - Salon / Institut *
  - Ville *
  - WhatsApp *
  - Nombre de personnes * (select 1-4)
  - Représentant commercial * (Radia, Zineb, Boutaina, Chaimae, Kamilia, Maroua, Wafaa)
  - Jour de venue * (14-19 mai 2026)
- **Actions** :
  - Bouton "✓ Je confirme" → Génère ticket SD26-XXXX + appel API `registerRSVP` → Navigue vers `/confirmation`
  - Bouton "Décliner" → Navigue vers `/decline`
- **Backend** : 
  ```javascript
  callAPI({
    action: 'registerRSVP',
    ticket: 'SD26-XXXX',
    firstName: 'Sarah',
    lastName: 'Bennani',
    salon: 'Beauty Lounge',
    city: 'Casablanca',
    ...
  })
  ```
- **Animations** :
  - Badge "Invitation Exclusive" avec shimmer
  - Logo Semilac avec gradient animé
  - Glow rose pulsant en arrière-plan
  - Particules flottantes
  - Progress bar (5 dots) qui se remplissent

---

#### **Page 2 : Confirmation** (`/confirmation`)
- **Objectif** : Confirmation visuelle + Ticket numérique + **Instruction de capture d'écran**
- **Affichage** :
  - ✨ Animation confettis (4 secondes)
  - 🎫 Numéro de ticket **SD26-XXXX** (glow rose, monospace, taille 26px)
  - ✅ Badge "Réservation confirmée"
  - 🎁 Avantages : Coupon -25%, Ticket tombola, VTC privé
  - 📅 Dates : 14—19 MAI 2026
  - 📍 Lieu : CASABLANCA
  - 📸 **INSTRUCTION IMPORTANTE** : Box rose/doré avec animation caméra pulsante
    - "📸 Prenez une capture d'écran !"
    - "Présentez cette page à votre commercial **le jour J** pour accéder à la **Roue de la Fortune** 🎡"
- **Actions** :
  - Bouton principal : "Compris ! ✨" → Retour vers `/rsvp` (pour inscription suivante)
  - ❌ **PAS d'accès direct à la roue** (le client ne peut pas y accéder seul)
- **Animations** :
  - Explosion de confettis roses/dorés
  - Ticket qui apparaît avec spring bounce
  - Glow rose autour du numéro
  - Icônes animées (Gift, Ticket, Car)
  - **Caméra pulsante** avec rings d'expansion
  - Box d'instruction avec glow animé

---

#### **Page 3 : Decline** (`/decline`)
- **Objectif** : Page de déclinaison élégante
- **Affichage** :
  - Message : "Nous espérons vous voir prochainement"
  - Contact : Email/téléphone pour se remanifester
- **Actions** :
  - Bouton "Retour" → Navigue vers `/rsvp`

---

### **📍 ÉTAPE 2 : EXPÉRIENCE STAFF (Sécurisé)**

#### **Page 4 : Staff PIN** (`/staff-pin`)
- **Objectif** : Sécuriser l'accès à l'expérience roue de la fortune
- **Champ** : Code PIN (6 caractères)
- **Code valide** : `COSMO2026`
- **Actions** :
  - Si code correct → Navigue vers `/wheel-code`
  - Si code incorrect → Message d'erreur "Code incorrect"
- **Animations** :
  - Inputs avec effet neon rose
  - Glow pulsant sur le bouton
  - Badge "Accès Réservé"

---

#### **Page 5 : Wheel Code (Validation)** (`/wheel-code`)
- **Objectif** : Validation croisée ticket client + devis commercial
- **Champs** :
  - **Code billet client** : SD26-XXXX (9 caractères)
  - **Numéro de devis Odoo** : S26XXX (6 caractères)
- **Actions** :
  - Bouton "Valider et lancer la roue"
  - Appel API `validate` avec ticket + devis
- **Backend** :
  ```javascript
  callAPI({
    action: 'validate',
    ticket: 'SD26-0042',
    devisNumber: 'S26ABC'
  })
  // Retourne : { success: true, clientName: 'Sarah Bennani', salon: '...' }
  ```
- **Validations** :
  - ✅ Ticket existe dans la base RSVP ?
  - ✅ Ticket n'a pas déjà joué ?
  - ✅ Devis n'a pas déjà été utilisé ?
- **Erreurs possibles** :
  - ❌ "Billet non trouvé dans le système"
  - ❌ "Ce billet a déjà participé"
  - ❌ "Ce numéro de devis a déjà été utilisé"
- **Succès** → Affiche écran d'accueil "Bonjour..." (3 secondes) → Navigue vers `/wheel`

---

#### **Page 5.5 : Greetings** (Animation intégrée dans `/wheel-code`)
- **Objectif** : Accueil personnalisé du client avant la roue
- **Affichage** :
  - ✅ Badge "Validation Réussie"
  - 📢 Titre "BONJOUR"
  - 💎 **Nom du client** (typo Cormorant Garamond 48px, gradient rose→doré)
  - 📝 "Préparez-vous à tenter votre chance **à la Roue de la Fortune**"
  - 🎡 Icône roue rotative infinie
  - ⚫⚫⚫ Dots de progression animés
- **Durée** : 3 secondes
- **Redirection automatique** : `/wheel`
- **Animations** :
  - Glow rose pulsant (blur 100px)
  - 20 particules roses/dorées qui montent/descendent
  - Spring bounce sur le nom du client
  - Rotation infinie de l'icône roue

---

#### **Page 6 : Wheel Game** (`/wheel` ou `/wheel-game`)
- **Objectif** : Jeu de la roue de la fortune (2 essais)
- **Configuration roue** :
  - **12 segments** : 3× -25%, 3× -30%, 3× -35%, 3× -40%
  - **Couleurs alternées** : Rose (#F8A4C8) / Doré (#D4A574)
  - **Physique réaliste** : Friction + décélération
- **ESSAI 1** :
  - Bouton "LANCER LA ROUE"
  - Roue tourne (3-5 secondes)
  - Affiche le gain (ex: -30%)
  - Appel API `register` avec statut `ESSAI1`
  - **Modal de choix** :
    - Bouton 1 : "CONSERVER -30%" → Navigue vers `/result`
    - Bouton 2 : "RETENTER MA CHANCE" → Lance ESSAI 2
- **ESSAI 2** (si retente) :
  - Bouton "DERNIER ESSAI"
  - Roue tourne
  - Affiche le gain final (ex: -35%)
  - Appel API `register` avec statut `FINAL`
  - **Redirection automatique** → `/result` (3 secondes)
- **Backend** :
  ```javascript
  // ESSAI 1
  callAPI({
    action: 'register',
    ticket: 'SD26-0042',
    devisNumber: 'S26ABC',
    discount: '-30%',
    status: 'ESSAI1'
  })
  
  // Si conserve
  callAPI({ ...status: 'CONSERVER' })
  
  // Si retente → ESSAI 2
  callAPI({ ...discount: '-35%', status: 'FINAL' })
  ```
- **Animations** :
  - Rotation de la roue avec easing personnalisé
  - Confettis lors du gain
  - Glow rose autour du segment gagnant
  - Vibration du device (optionnel)

---

#### **Page 7 : Results (Coupon)** (`/result`)
- **Objectif** : Affichage du coupon final avec la réduction gagnée
- **Affichage** :
  - 🏆 Badge "FÉLICITATIONS !"
  - 💎 Réduction gagnée (ex: **-35%**) en gros caractères
  - 🎫 Numéro de ticket SD26-XXXX
  - 📄 Numéro de devis S26XXX
  - 📅 Validité : "Valable du 14 au 19 mai 2026"
  - 💬 Message : "Présentez ce coupon lors de votre commande"
- **Actions** :
  - Bouton "TERMINER" → Retourne vers `/staff-pin` (pour client suivant)
- **Animations** :
  - Confettis d'or/rose
  - Glow intense sur la réduction
  - Spring bounce sur tous les éléments
  - Étoiles scintillantes en arrière-plan

---

## 🗄️ DONNÉES LOCALSTORAGE

### **Données RSVP** (après inscription)
```javascript
localStorage.setItem('rsvpData', JSON.stringify({
  firstName: 'Sarah',
  lastName: 'Bennani',
  salonName: 'Beauty Lounge',
  city: 'Casablanca',
  whatsapp: '0612345678',
  people: '2',
  representative: 'Radia',
  day: '15 MAI 2026',
  ticketNumber: 'SD26-0042'
}));
```

### **Données Wheel** (après validation staff)
```javascript
localStorage.setItem('wheelData', JSON.stringify({
  ticketNumber: 'SD26-0042',
  devisNumber: 'S26ABC',
  clientName: 'Sarah Bennani',
  salon: 'Beauty Lounge',
  city: 'Casablanca'
}));
```

### **Résultat Roue** (après jeu)
```javascript
localStorage.setItem('wheelResult', JSON.stringify({
  discount: '-35%',
  trial: 2,  // Essai 1 ou 2
  status: 'FINAL'  // ESSAI1, CONSERVER, FINAL
}));
```

---

## 🔄 API GOOGLE APPS SCRIPT

### **Endpoint 1 : registerRSVP**
**Objectif** : Enregistrer l'inscription client dans Google Sheets "RSVP"

**Requête** :
```javascript
{
  action: 'registerRSVP',
  ticket: 'SD26-0042',
  firstName: 'Sarah',
  lastName: 'Bennani',
  salon: 'Beauty Lounge',
  city: 'Casablanca',
  email: 'sarah@example.com',
  phone: '0612345678',
  representative: 'Radia'
}
```

**Réponse** :
```javascript
{
  success: true,
  ticketNumber: 'SD26-0042'
}
```

---

### **Endpoint 2 : validate**
**Objectif** : Valider ticket + devis et récupérer les données client

**Requête** :
```javascript
{
  action: 'validate',
  ticket: 'SD26-0042',
  devisNumber: 'S26ABC'
}
```

**Réponse (succès)** :
```javascript
{
  success: true,
  clientName: 'Sarah Bennani',  // Prénom + Nom depuis RSVP
  salon: 'Beauty Lounge',
  city: 'Casablanca',
  email: 'sarah@example.com',
  devisUsed: false,
  alreadyUsed: false
}
```

**Réponse (erreurs)** :
```javascript
// Ticket non trouvé
{ success: false, notFound: true }

// Ticket déjà utilisé
{ success: false, alreadyUsed: true }

// Devis déjà utilisé
{ success: false, devisUsed: true }
```

---

### **Endpoint 3 : register**
**Objectif** : Enregistrer le résultat de la roue dans Google Sheets "WHEEL"

**Requête** :
```javascript
{
  action: 'register',
  ticket: 'SD26-0042',
  devisNumber: 'S26ABC',
  discount: '-35%',
  status: 'FINAL'  // ou 'ESSAI1', 'CONSERVER'
}
```

**Réponse** :
```javascript
{
  success: true
}
```

---

## 📊 STRUCTURE GOOGLE SHEETS

### **Feuille "RSVP"**
| Timestamp        | Ticket    | Prénom | Nom     | Salon         | Ville      | Email            | Téléphone  | Représentant |
|------------------|-----------|--------|---------|---------------|------------|------------------|------------|--------------|
| 30/03/26 14:25   | SD26-0042 | Sarah  | Bennani | Beauty Lounge | Casablanca | sarah@email.com  | 0612345678 | Radia        |

### **Feuille "WHEEL"**
| Timestamp        | Ticket    | Devis  | Réduction | Statut    |
|------------------|-----------|--------|-----------|-----------|
| 30/03/26 17:30   | SD26-0042 | S26ABC | -30%      | ESSAI1    |
| 30/03/26 17:31   | SD26-0042 | S26ABC | -35%      | FINAL     |

---

## 🎨 DESIGN SYSTEM

### **Couleurs principales**
- Rose : `#F8A4C8`
- Rose clair : `#ffc8de`, `#ffdaec`
- Doré : `#D4A574`
- Rose foncé : `#c47090`
- Fond noir : `#0D0008`
- Fond card : `rgba(20,5,15,0.88)`
- Texte blanc : `#FFF8F5`

### **Typographies**
- Titres : `Cormorant Garamond` (serif italique)
- Corps : System fonts
- Code : `Courier New` (monospace)

### **Animations**
- Confettis : `canvas-confetti`
- Transitions : `motion/react` (Framer Motion)
- Glow : `radial-gradient` + `blur()`
- Particules : Composant `ParticleField`

---

## ✅ CHECKLIST PAGES CRÉÉES

- ✅ `/` et `/rsvp` → `RSVPForm.tsx`
- ✅ `/confirmation` → `Confirmation.tsx`
- ✅ `/decline` → `DeclinePage.tsx`
- ✅ `/staff-pin` → `StaffPin.tsx`
- ✅ `/wheel-code` → `WheelCode.tsx` (avec animation Greetings intégrée)
- ✅ `/wheel` et `/wheel-game` → `WheelGame.tsx`
- ✅ `/result` → `CouponResult.tsx`
- ❌ `/ticket` → **SUPPRIMÉ** (remplacé par `/confirmation`)

---

## 🔒 SÉCURITÉ

- **Code PIN staff** : `COSMO2026` (hardcodé, peut être changé dans `StaffPin.tsx`)
- **Validation croisée** : Ticket + Devis obligatoires
- **Anti-triche** :
  - Un ticket ne peut jouer qu'une fois
  - Un devis ne peut être utilisé qu'une fois
  - Traçabilité complète dans Google Sheets

---

## 📱 OPTIMISATION MOBILE

- **Viewport** : 375×812 (iPhone X)
- **Responsive** : Plein écran mobile, card centrée desktop
- **Touch-friendly** : Boutons min 44px de hauteur
- **Animations performantes** : GPU-accelerated avec `transform` et `opacity`
- **Scroll** : `overflow-y-auto` sur les pages longues

---

## 🎯 RÉSUMÉ FLOW

```
CLIENT
  ↓
RSVP Form → [Inscription] → Confirmation → [Affiche ticket SD26-XXXX]
  ↓
[Client montre son ticket au commercial]
  ↓
STAFF
  ↓
Staff PIN → [Entre COSMO2026] → Wheel Code → [Entre SD26-XXXX + S26XXX]
  ↓
[API valide et récupère nom du client]
  ↓
Greetings → [Animation "Bonjour Sarah Bennani" 3s]
  ↓
Wheel Game → ESSAI 1 → [Gagne -30%] → Choix : Conserver OU Retenter
  ↓
Si retente → ESSAI 2 → [Gagne -35%] → Results → [Affiche coupon -35%]
  ↓
[Commercial clique "TERMINER" pour passer au client suivant]
```

---

## 🚀 PROCHAINES ÉTAPES

1. ✅ Créer les 2 feuilles Google Sheets ("RSVP" + "WHEEL")
2. ✅ Déployer le Google Apps Script
3. ✅ Mettre à jour l'URL API dans `/src/utils/api.ts`
4. ✅ Tester le flow complet en local
5. ✅ Déployer l'application
6. ✅ Former les commerciaux au processus