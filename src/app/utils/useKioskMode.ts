import { useEffect } from 'react';
import { useLang } from '../i18n/LanguageContext';

/**
 * Active le mode kiosque (rotation + plein écran) sur les pages staff (étape 2).
 *
 * Auto-activation : plus besoin de `?kiosk=1` dans l'URL. Dès qu'une page
 * staff utilise ce hook, le mode kiosque est activé. La phase 2 est de
 * toute façon strictement encadrée (PIN obligatoire), donc considérer
 * automatiquement la tablette comme un kiosque est sûr.
 *
 * Force aussi dir="ltr" et lang="fr" pour toute l'étape 2 — règle les
 * problèmes de BiDi (SD26- qui s'affichait -SD26, BRAVO !, -25%, etc.)
 *
 * IMPORTANT : pas de cleanup return — on ne veut pas que React StrictMode
 * (qui double-invoque les effects en dev) retire la classe après 1s.
 */
export function useKioskMode() {
  const { setLang } = useLang();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Force LTR + FR pour l'étape 2 — empêche tout héritage RTL depuis l'étape 1
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'fr';
    setLang('fr');

    // Auto-active le mode kiosque dès l'entrée en étape 2 — la page staff
    // est de fait un kiosque (tablette qui projette sur la TV).
    window.sessionStorage.setItem('kioskMode', '1');
    if (!document.documentElement.classList.contains('kiosk-mode')) {
      document.documentElement.classList.add('kiosk-mode');
    }
  });
}
