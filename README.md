# 🎰✨ Semilac Days - RSVP Premium Experience

Une expérience RSVP luxueuse et interactive pour l'événement Semilac Days avec roue de la fortune, animations premium, et effets visuels époustouflants.

## 🌟 Fonctionnalités Premium

### 🎨 Design & Animations
- ✨ **Système de particules** dynamique avec ParticleField
- 🌈 **Arrière-plan Aurora** avec gradients morphing
- 💫 **Effets 3D** sur tous les composants interactifs
- 🎭 **Transitions de page** fluides avec Motion
- ✨ **Boutons magnétiques** avec effet d'attraction
- 🌟 **Effets de lueur** multi-couches

### 🎰 Roue de la Fortune
- 🎯 Système à **2 essais** avec choix utilisateur
- 🎁 12 segments : **-25%, -30%, -35%, -40%** (3× chaque)
- ⚡ Physique réaliste avec easing personnalisé
- 🎉 Confettis épiques lors des gains
- 🔊 Feedback sonore immersif

### 📱 Parcours Utilisateur (6 Écrans)
1. **Greeting** - Page d'accueil avec compte à rebours
2. **RSVP Form** - Formulaire de confirmation premium
3. **Confirmation** - Ticket numérique avec QR code
4. **Wheel Code** - Saisie du code d'accès
5. **Wheel Game** - Roue de la fortune interactive
6. **Result** - Page de résultat avec réduction gagnée

### 🛡️ Fonctionnalités Techniques
- 💾 **Persistance frontend** avec localStorage
- 📱 **Mobile-first** optimisé pour 375×812px
- 🎯 **React Router** avec Data mode
- 🎨 **Tailwind CSS v4** avec système de tokens
- ⚡ **Vite** pour des performances optimales

## 🚀 Déploiement sur Vercel

### Déploiement Automatique

1. **Push vers GitHub**
   ```bash
   git init
   git add .
   git commit -m "🎰 Initial commit - Semilac Days RSVP Premium"
   git remote add origin <votre-repo>
   git push -u origin main
   ```

2. **Connecter à Vercel**
   - Visitez [vercel.com](https://vercel.com)
   - Cliquez sur "Add New Project"
   - Importez votre repository GitHub
   - Vercel détectera automatiquement Vite
   - Cliquez sur "Deploy"

### Déploiement via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

## 🛠️ Développement Local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview
```

## 📦 Structure du Projet

```
/
├── src/
│   ├── app/
│   │   ├── components/        # Composants réutilisables
│   │   │   ├── Premium3DWheel.tsx
│   │   │   ├── ShimmerButton.tsx
│   │   │   ├── PremiumInput.tsx
│   │   │   ├── ParticleField.tsx
│   │   │   ├── AuroraBackground.tsx
│   │   │   └── ...
│   │   ├── pages/             # Pages du parcours
│   │   │   ├── Greeting.tsx
│   │   │   ├── RSVPForm.tsx
│   │   │   ├── Confirmation.tsx
│   │   │   ├── WheelCode.tsx
│   │   │   ├── WheelGame.tsx
│   │   │   ├── CouponResult.tsx
│   │   │   └── DeclinePage.tsx
│   │   ├── utils/             # Utilitaires
│   │   │   └── sounds.ts
│   │   ├── App.tsx            # Composant principal
│   │   └── routes.ts          # Configuration routing
│   └── styles/                # Styles globaux
│       ├── index.css
│       ├── fonts.css
│       ├── theme.css
│       └── tailwind.css
├── index.html                 # Point d'entrée HTML
├── vite.config.ts            # Configuration Vite
├── vercel.json               # Configuration Vercel
└── package.json              # Dépendances

```

## 🎨 Technologies Utilisées

- **React 18.3.1** - Framework UI
- **Vite 6.3.5** - Build tool
- **Motion (Framer Motion) 12.x** - Animations
- **React Router 7.x** - Routing
- **Tailwind CSS 4.x** - Styling
- **Canvas Confetti** - Effets de confettis
- **TypeScript** - Type safety

## 🎯 Configuration Vercel

Le fichier `vercel.json` configure automatiquement :
- ✅ Build avec Vite
- ✅ SPA routing avec redirections
- ✅ Optimisations de production
- ✅ Compression et cache

## 📱 Optimisations Mobile

- Viewport fixe 375×812px
- Prévention du pull-to-refresh
- Gestion des safe areas iOS
- Touch events optimisés
- Performance 60fps garantie

## 🎉 Prêt pour la Production

Tous les fichiers nécessaires sont créés :
- ✅ `index.html` - Point d'entrée
- ✅ `vercel.json` - Configuration déploiement
- ✅ `.gitignore` - Fichiers à ignorer
- ✅ Build scripts configurés

**Déployez maintenant sur Vercel et profitez de votre app premium ! 🚀✨**

---

Made with 💖 for Semilac Days
