# Project Index — RSVP Semilac Days

Generated: 2026-03-31

## 📋 Projet
Application RSVP premium pour l'événement **Semilac Days 2026** (Casablanca, 14-19 Mai).
SPA React/Vite, mobile-first, style app phone (430px), dark theme premium, bilingue FR/AR Darija.

---

## 🏗️ Stack
- **Framework** : React 18 + Vite 6 + TypeScript
- **Routing** : React Router 7
- **UI** : shadcn/ui + Radix UI + Tailwind CSS 4
- **Animations** : Framer Motion / motion
- **Backend** : Google Apps Script (Google Sheets) via API fetch
- **Deploy** : Vercel (vercel.json présent)

---

## 📁 Structure

```
src/
├── main.tsx                        # Entry point
└── app/
    ├── App.tsx                     # Root — LanguageProvider + RouterProvider
    ├── routes.tsx                  # Toutes les routes
    ├── i18n/
    │   ├── translations.ts         # Toutes les traductions FR/AR
    │   ├── LanguageContext.tsx     # Context langue global
    │   └── index.ts               # Export i18n
    ├── utils/
    │   ├── api.ts                  # API Google Sheets (callAPI, registerResult)
    │   └── sounds.ts              # Sons UI
    ├── pages/
    │   ├── RSVPForm.tsx           # / — Formulaire RSVP principal
    │   ├── Confirmation.tsx       # /confirmation — Succès RSVP
    │   ├── StaffPin.tsx           # /staff-pin — Accès staff (PIN secret)
    │   ├── WheelCode.tsx          # /wheel-code — Saisie code N° devis
    │   ├── Greeting.tsx           # /greeting — Accueil le jour J
    │   ├── WheelGame.tsx          # /wheel — Roue de la fortune
    │   ├── CouponResult.tsx       # /result — Résultat coupon
    │   └── ErrorPage.tsx          # Fallback erreur
    └── components/
        ├── TopBar.tsx             # Barre top (logo + localisation + calendrier)
        ├── LanguageSelector.tsx   # Sélecteur FR/AR (splash screen)
        ├── BrandStrip.tsx         # Bande logos marques
        ├── MagneticButton.tsx     # Bouton effet magnétique
        ├── ShimmerButton.tsx      # Bouton effet shimmer
        ├── PremiumInput.tsx       # Input stylé premium
        ├── PremiumSelect.tsx      # Select stylé premium
        ├── Premium3DWheel.tsx     # Roue 3D interactive
        ├── WheelSpinner.tsx       # Spinner roue
        ├── ParticleField.tsx      # Champ de particules (déco)
        ├── AuroraBackground.tsx   # Fond aurora animé
        ├── PageTransition.tsx     # Transitions entre pages
        ├── LoadingSpinner.tsx     # Spinner chargement
        ├── logos/                 # Logos SVG (Semilac, Footlogix, etc.)
        ├── figma/                 # ImageWithFallback
        └── ui/                    # Composants shadcn/ui (50+)
```

---

## 🔄 Flux utilisateur

```
/ (RSVPForm)
  → submit → /confirmation
  → accès staff discret → /staff-pin

/staff-pin (PIN secret)
  → PIN validé → /wheel-code

/wheel-code (saisie N° devis)
  → devis validé → /greeting

/greeting (accueil client)
  → continuer → /wheel

/wheel (roue de la fortune)
  → résultat → /result

/result (coupon -25% ou autre)
  → PDF généré + affiché
```

---

## 🌐 API Google Sheets

```
URL: https://script.google.com/macros/s/AKfycbxl-.../exec
Actions:
  - registerRSVP   → enregistre un RSVP
  - validate       → vérifie un ticket/devis
  - register       → enregistre résultat roue
  - validatePin    → valide le PIN staff
```

---

## 🌍 i18n

Langues : **FR** (français) et **AR** (arabe Darija marocain)
- Sélecteur langue au démarrage (splash screen AnimatePresence)
- Context global `useLang()` → `{ t, lang, isRTL }`
- Toutes les traductions dans `translations.ts`

---

## 🎨 Design System

- **Fond** : `#1A1005` (brun très foncé)
- **Accent** : rose/gold premium
- **Layout** : app shell 430px (mobile), responsive tablette/desktop
- **Animations** : Framer Motion, grain texture, premium shadows
- **Performances** : animations allégées sur vieux/petits devices

---

## 📦 Dépendances clés

| Package | Usage |
|---------|-------|
| react-router 7 | Routing |
| motion 12 | Animations |
| shadcn/ui (Radix) | Composants UI |
| jspdf | Génération PDF coupon |
| canvas-confetti | Confettis résultat |
| react-hook-form | Validation formulaire |
| tailwindcss 4 | Styles |

---

## ⚙️ Config

- `vite.config.ts` — build config Vite
- `vercel.json` — deploy Vercel
- `guidelines/Guidelines.md` — règles projet
