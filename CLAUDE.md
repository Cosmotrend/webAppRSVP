# CLAUDE.md — RSVP Semilac Days

> Ce fichier est chargé automatiquement à chaque session Claude Code.
> Il contient les règles permanentes du projet. Pour le contexte de travail en cours, lis PROGRESS.md.

---

## 🚀 Démarrage rapide

```bash
npm run dev   # Lance le serveur dev Vite
npm run build # Build production
```

---

## 🏗️ Stack & Conventions

- **React 18 + Vite 6 + TypeScript** — pas de Next.js
- **React Router 7** — SPA classique, pas d'App Router
- **Tailwind CSS 4** — pas de config tailwind.config.js (Vite plugin)
- **Framer Motion / motion 12** — pour toutes les animations
- **shadcn/ui** — composants dans `src/app/components/ui/`
- Pas de base de données — tout passe par **Google Apps Script** (Google Sheets)

---

## 🎨 Design Rules

- **Fond global** : `#1A1005` — NE PAS changer
- **Layout** : app shell 430px max sur desktop, plein écran mobile
- **Dark theme** uniquement — pas de light mode
- Animations légères sur vieux/petits devices (déjà géré)
- Style **premium, élégant** — pas de design générique

---

## 🌍 i18n — IMPORTANT

- 2 langues : **FR** (français) et **AR** (arabe Darija marocain)
- Toutes les traductions dans `src/app/i18n/translations.ts`
- Hook : `useLang()` → `{ t, lang, isRTL }`
- **Toujours ajouter FR + AR** quand on crée un nouveau texte
- AR = Darija marocain (dialecte), pas arabe classique

---

## 🔌 API

```
Google Apps Script URL dans src/app/utils/api.ts
Actions : registerRSVP | validate | register | validatePin
```
- Ne pas changer l'URL de l'API sans confirmation
- Toujours utiliser `callAPI()` de `api.ts`, pas de fetch direct

---

## 📁 Où créer les fichiers

| Type | Dossier |
|------|---------|
| Page (route) | `src/app/pages/` |
| Composant réutilisable | `src/app/components/` |
| Composant UI base | `src/app/components/ui/` |
| Logo SVG | `src/app/components/logos/` |
| Utilitaire | `src/app/utils/` |
| Traductions | `src/app/i18n/translations.ts` |

---

## ⛔ À ne pas faire

- Ne pas installer Next.js ou modifier vers Next.js
- Ne pas supprimer/remplacer Framer Motion
- Ne pas casser le système i18n FR/AR
- Ne pas changer la couleur de fond `#1A1005`
- Ne pas utiliser `fetch` direct — toujours passer par `callAPI()`

---

## 📖 Contexte session en cours

> Lis **PROGRESS.md** pour savoir où on en est.
