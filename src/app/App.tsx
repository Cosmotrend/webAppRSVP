import { RouterProvider } from 'react-router';
import { AnimatePresence } from 'motion/react';
import { router } from './routes';
import { LanguageProvider, useLang } from './i18n/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';

function AppContent() {
  const { isReady } = useLang();

  // Mode kiosque : ?kiosk=1 ou ?tv=1 dans l'URL → persiste en sessionStorage
  // La classe kiosk-mode est appliquée PAR PAGE (uniquement StaffPin/WheelCode/WheelGame/CouponResult)
  // → l'étape 1 (RSVP + Confirmation) n'est JAMAIS affectée
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('kiosk') === '1' || params.get('tv') === '1') {
      window.sessionStorage.setItem('kioskMode', '1');
    }
  }

  return (
    <div className="w-full min-h-full flex items-center justify-center" style={{ background: '#1A1005' }}>
      <div
        className="relative"
        style={{
          width: '100%',
          minHeight: '100dvh',
          background: '#1A1005',
        }}
      >
        <style>{`
          .app-shell { width: 100%; height: 100dvh; }
          @media (min-width: 768px) and (max-width: 1023px) {
            .app-shell {
              width: 100% !important;
              max-width: 620px !important;
              height: calc(100dvh - 32px) !important;
              border-radius: 24px !important;
              box-shadow: 0 32px 80px rgba(0,0,0,0.7) !important;
              margin: 16px auto !important;
              position: relative !important;
            }
          }
          @media (min-width: 1024px) {
            .app-shell {
              width: 430px !important;
              height: min(900px, calc(100dvh - 48px)) !important;
              border-radius: 40px !important;
              box-shadow: 0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(248,164,200,0.08) !important;
              margin: auto !important;
            }
          }
          /* TV 58/62" portrait HD — détection par ratio (marche quand le navigateur voit directement la TV) */
          @media (min-width: 1080px) and (orientation: portrait), (min-aspect-ratio: 9/16) and (min-height: 1600px) {
            .app-shell {
              width: min(1080px, 96vw) !important;
              height: min(calc(100dvh - 48px), 1920px) !important;
              max-width: none !important;
              border-radius: 48px !important;
              margin: auto !important;
            }
          }
          /* Mode KIOSQUE (?kiosk=1) — override TOUT, plein écran HD pour TV encastrée */
          html.kiosk-mode,
          html.kiosk-mode body,
          html.kiosk-mode #root {
            width: 100vw !important;
            height: 100vh !important;
            height: 100dvh !important;
            overflow: hidden !important;
            background: #1A1005 !important;
          }
          /* Portrait kiosk (tablette tenue en portrait, usage direct) */
          html.kiosk-mode .app-shell {
            width: 100vw !important;
            height: 100vh !important;
            height: 100dvh !important;
            max-width: none !important;
            max-height: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            margin: 0 !important;
          }
          /*
           * Landscape kiosk — TV Samsung montée en portrait (pivotée 90°)
           *
           * Principe : la TV affiche toujours en paysage natif (1920×1080).
           * On CSS-pivote l'app de 90° pour que, vue sur la TV pivotée,
           * le contenu apparaisse en portrait.
           *
           * MODE D'EMPLOI :
           *   1. Tenir la tablette Huawei en PAYSAGE (couchée)
           *   2. Ouvrir l'URL kiosque dans Chrome
           *   3. Lancer le cast vers la Samsung TV
           *   → L'app remplit tout l'écran, le contenu s'affiche en portrait sur la TV
           *
           * Si le contenu apparaît à l'envers, changer rotate(90deg) → rotate(-90deg)
           */
          @media (orientation: landscape) {
            html.kiosk-mode,
            html.kiosk-mode body,
            html.kiosk-mode #root {
              overflow: hidden !important;
              background: #1A1005 !important;
            }
            /*
             * TV portrait (TV physiquement pivotée 90°) :
             * La tablette est en paysage (ex: 1280×800 ou 1920×1080).
             * On crée un "canvas" virtuel de dimensions INVERSÉES (hauteur × largeur)
             * puis on le pivote de 90°. Le contenu rend donc dans un viewport
             * "portrait" qui devient paysage visuellement, et s'affiche droit
             * sur la TV pivotée.
             *
             * IMPORTANT : on utilise 100vh et 100vw qui sont figés par le navigateur
             * au chargement et ne changent pas quand la barre d'URL bouge.
             */
            html.kiosk-mode .app-shell {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              /* Shell dimensionné avec vw/vh INVERSÉS :
                 - width  = 100vh (deviendra la hauteur visuelle après rotation)
                 - height = 100vw (deviendra la largeur visuelle après rotation) */
              width: 100vh !important;
              height: 100vw !important;
              max-width: none !important;
              max-height: none !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              margin: 0 !important;
              /* Pivot 90° autour du coin haut-gauche (0,0), puis translation
                 en X de +100vw pour ramener l'élément dans le viewport.
                 Ordre CSS : transforms appliqués de DROITE à GAUCHE,
                 donc rotate() d'abord, translateX() ensuite. */
              transform-origin: 0 0 !important;
              transform: translateX(100vw) rotate(90deg) !important;
            }
          }
        `}</style>
        <div
          className="app-shell relative overflow-hidden w-full h-full"
          style={{ background: '#1A1005' }}
        >
          <AnimatePresence>
            {!isReady && <LanguageSelector />}
          </AnimatePresence>
          <RouterProvider router={router} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
