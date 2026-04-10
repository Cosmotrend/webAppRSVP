import { useEffect } from 'react';
import { useLang } from '../i18n/LanguageContext';

/**
 * Active le mode kiosque (rotation + plein écran) UNIQUEMENT sur la page courante.
 * Force aussi dir="ltr" et lang="fr" pour toute l'étape 2 — ça règle les
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

    const sessionKiosk = window.sessionStorage.getItem('kioskMode') === '1';
    if (sessionKiosk && !document.documentElement.classList.contains('kiosk-mode')) {
      document.documentElement.classList.add('kiosk-mode');
    }
  });
}
