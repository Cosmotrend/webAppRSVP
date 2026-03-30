# 📦 GUIDE COMPLET - RSVP SEMILAC DAYS

## 🎯 Guide pour recréer le projet sur votre ordinateur

Ce guide vous permet de télécharger et installer **TOUT le code** de votre application RSVP Semilac Days.

---

## 📋 ÉTAPE 1 : Créer la structure du projet

Ouvrez votre terminal et exécutez ces commandes :

```bash
# Créer le dossier principal
mkdir rsvp-semilac-days
cd rsvp-semilac-days

# Créer la structure des dossiers
mkdir -p src/app/components/ui
mkdir -p src/app/components/figma
mkdir -p src/app/pages
mkdir -p src/app/utils
mkdir -p src/styles
mkdir -p src/imports
mkdir -p public
```

---

## 📦 ÉTAPE 2 : Créer package.json

Créez le fichier `package.json` à la racine :

```json
{
  "name": "rsvp-semilac-days",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "description": "Expérience RSVP premium avec roue de la fortune pour l'événement Semilac Days",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@emotion/react": "11.14.0",
    "@emotion/styled": "11.14.1",
    "@mui/icons-material": "7.3.5",
    "@mui/material": "7.3.5",
    "@popperjs/core": "2.11.8",
    "@radix-ui/react-accordion": "1.2.3",
    "@radix-ui/react-alert-dialog": "1.1.6",
    "@radix-ui/react-aspect-ratio": "1.1.2",
    "@radix-ui/react-avatar": "1.1.3",
    "@radix-ui/react-checkbox": "1.1.4",
    "@radix-ui/react-collapsible": "1.1.3",
    "@radix-ui/react-context-menu": "2.2.6",
    "@radix-ui/react-dialog": "1.1.6",
    "@radix-ui/react-dropdown-menu": "2.1.6",
    "@radix-ui/react-hover-card": "1.1.6",
    "@radix-ui/react-label": "2.1.2",
    "@radix-ui/react-menubar": "1.1.6",
    "@radix-ui/react-navigation-menu": "1.2.5",
    "@radix-ui/react-popover": "1.1.6",
    "@radix-ui/react-progress": "1.1.2",
    "@radix-ui/react-radio-group": "1.2.3",
    "@radix-ui/react-scroll-area": "1.2.3",
    "@radix-ui/react-select": "2.1.6",
    "@radix-ui/react-separator": "1.1.2",
    "@radix-ui/react-slider": "1.2.3",
    "@radix-ui/react-slot": "1.1.2",
    "@radix-ui/react-switch": "1.1.3",
    "@radix-ui/react-tabs": "1.1.3",
    "@radix-ui/react-toggle-group": "1.1.2",
    "@radix-ui/react-toggle": "1.1.2",
    "@radix-ui/react-tooltip": "1.1.8",
    "canvas-confetti": "1.9.4",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "cmdk": "1.1.1",
    "date-fns": "3.6.0",
    "embla-carousel-react": "8.6.0",
    "input-otp": "1.4.2",
    "lucide-react": "0.487.0",
    "motion": "12.23.24",
    "next-themes": "0.4.6",
    "react": "18.3.1",
    "react-day-picker": "8.10.1",
    "react-dnd": "16.0.1",
    "react-dnd-html5-backend": "16.0.1",
    "react-dom": "18.3.1",
    "react-hook-form": "7.55.0",
    "react-popper": "2.3.0",
    "react-resizable-panels": "2.1.7",
    "react-responsive-masonry": "2.7.1",
    "react-router": "7.13.0",
    "react-slick": "0.31.0",
    "recharts": "2.15.2",
    "sonner": "2.0.3",
    "tailwind-merge": "3.2.0",
    "tw-animate-css": "1.3.8",
    "vaul": "1.1.2"
  },
  "devDependencies": {
    "@tailwindcss/vite": "4.1.12",
    "@types/react": "18.3.18",
    "@types/react-dom": "18.3.5",
    "@vitejs/plugin-react": "4.7.0",
    "tailwindcss": "4.1.12",
    "typescript": "5.7.2",
    "vite": "6.3.5"
  }
}
```

---

## ⚙️ ÉTAPE 3 : Fichiers de configuration

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### `tsconfig.node.json`

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### `postcss.config.mjs`

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

---

## 🌐 ÉTAPE 4 : Fichier HTML principal

### `index.html`

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#0D0008" />
    <title>Semilac Days - RSVP Premium</title>
    <meta name="description" content="Événement VIP exclusif Semilac Days avec roue de la fortune et réductions jusqu'à -40%" />
    
    <!-- Preconnect to Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    
    <!-- Google Fonts - Montserrat & Cormorant Garamond -->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
    
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      html, body, #root {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #0D0008;
        font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      /* Mobile viewport fix */
      @supports (-webkit-touch-callout: none) {
        html, body, #root {
          height: -webkit-fill-available;
        }
      }
      
      /* Prevent pull-to-refresh */
      body {
        overscroll-behavior: none;
        touch-action: pan-x pan-y;
      }
      
      /* Loading state */
      #root:empty::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        border: 3px solid rgba(248, 164, 200, 0.2);
        border-top-color: #F8A4C8;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 🚀 ÉTAPE 5 : Installation

```bash
# Installer toutes les dépendances
npm install

# Lancer en mode développement
npm run dev

# Builder pour production
npm run build

# Prévisualiser la version de production
npm run preview
```

---

## 📝 SUITE DU GUIDE

Les fichiers source complets (composants, pages, styles) sont dans les fichiers suivants du projet :

- `DOWNLOAD_PART_2_MAIN_FILES.md` - Fichiers principaux (App.tsx, routes.tsx, main.tsx)
- `DOWNLOAD_PART_3_COMPONENTS.md` - Tous les composants
- `DOWNLOAD_PART_4_PAGES.md` - Toutes les pages
- `DOWNLOAD_PART_5_STYLES.md` - Tous les styles CSS

Consultez ces fichiers pour copier le code complet !

---

## 🌍 DÉPLOIEMENT SUR VERCEL

### Option 1 : Via GitHub (Recommandé)

```bash
# Initialiser Git
git init
git add .
git commit -m "Initial commit - RSVP Semilac Days"

# Créer un repo sur GitHub et push
git remote add origin https://github.com/VOTRE-USERNAME/rsvp-semilac-days.git
git branch -M main
git push -u origin main

# Sur vercel.com
# 1. Cliquez "New Project"
# 2. Importez votre repo GitHub
# 3. Cliquez "Deploy"
```

### Option 2 : Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Déployer en production
vercel --prod
```

---

## ✅ CHECKLIST

- [ ] Créer la structure des dossiers
- [ ] Copier package.json
- [ ] Copier les fichiers de config (vite, tsconfig, vercel, postcss)
- [ ] Copier index.html
- [ ] Copier tous les fichiers source (voir parties 2-5)
- [ ] Exécuter `npm install`
- [ ] Tester avec `npm run dev`
- [ ] Builder avec `npm run build`
- [ ] Déployer sur Vercel

---

## 🆘 SUPPORT

Si vous avez des questions, vérifiez que :
1. Node.js version 18+ est installé
2. Tous les fichiers sont dans les bons dossiers
3. `npm install` s'est exécuté sans erreurs

**Prochaine étape : Consultez `DOWNLOAD_PART_2_MAIN_FILES.md` pour les fichiers principaux !** 🚀
