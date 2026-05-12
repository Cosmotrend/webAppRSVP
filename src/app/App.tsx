import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router';
import { AnimatePresence } from 'motion/react';
import { router } from './routes';
import { LanguageProvider, useLang } from './i18n/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';

// Canvas logique design — toutes les pages staff (phase 2) sont designées
// pour rendre dans cette boîte 9:16. Le wrapper kiosk-canvas applique un
// transform: scale() pour fit le viewport tablette de façon proportionnelle,
// que la tablette fasse 1280×800, 1848×2960 (S11 Ultra) ou autre.
const KIOSK_CANVAS_W = 1080;
const KIOSK_CANVAS_H = 1920;

const STAFF_ROUTES = ['/staff-pin', '/wheel-code', '/wheel', '/wheel-game', '/greeting', '/result'];
const isStaffPath = (p: string) => STAFF_ROUTES.some((r) => p === r || p.startsWith(r + '/'));

function AppContent() {
  const { isReady } = useLang();

  // Mode kiosque : ?kiosk=1 ou ?tv=1 dans l'URL → persiste en sessionStorage
  // (laisse pour compat; l'auto-activation par useKioskMode reste prioritaire)
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('kiosk') === '1' || params.get('tv') === '1') {
      window.sessionStorage.setItem('kioskMode', '1');
    }
  }

  // Détection canvas mode : actif sur les routes staff OU si kiosk-mode est sur
  // l'html (poussé par useKioskMode des pages staff au mount).
  const [isCanvasMode, setIsCanvasMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return isStaffPath(window.location.pathname);
  });
  const [scale, setScale] = useState<number>(1);
  // En paysage (tablette couchée pour cast vers TV physiquement pivotée 90°),
  // on rotate le canvas portrait pour qu'il s'aligne avec la TV pivotée.
  const [isLandscape, setIsLandscape] = useState<boolean>(false);

  useEffect(() => {
    const recomputeScale = () => {
      const vpW = window.innerWidth;
      const vpH = window.innerHeight;
      const landscape = vpW > vpH;
      setIsLandscape(landscape);
      if (landscape) {
        // Canvas portrait 1080×1920 rotated 90° → 1920×1080 visuel.
        // Scale fit : min(viewportW / canvasH, viewportH / canvasW)
        setScale(Math.min(vpW / KIOSK_CANVAS_H, vpH / KIOSK_CANVAS_W));
      } else {
        setScale(Math.min(vpW / KIOSK_CANVAS_W, vpH / KIOSK_CANVAS_H));
      }
    };
    const recomputeCanvas = () => {
      const onStaff = isStaffPath(window.location.pathname);
      const hasKioskClass = document.documentElement.classList.contains('kiosk-mode');
      setIsCanvasMode(onStaff || hasKioskClass);
    };
    recomputeScale();
    recomputeCanvas();
    window.addEventListener('resize', recomputeScale);
    window.addEventListener('popstate', recomputeCanvas);
    // Patch pushState pour capter les navigations React Router
    const origPush = history.pushState;
    history.pushState = function (...args) {
      const r = origPush.apply(this, args as any);
      recomputeCanvas();
      return r;
    };
    const observer = new MutationObserver(recomputeCanvas);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      window.removeEventListener('resize', recomputeScale);
      window.removeEventListener('popstate', recomputeCanvas);
      history.pushState = origPush;
      observer.disconnect();
    };
  }, []);

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
            .app-shell:not(.kiosk-canvas-shell) {
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
            .app-shell:not(.kiosk-canvas-shell) {
              width: 430px !important;
              height: min(900px, calc(100dvh - 48px)) !important;
              border-radius: 40px !important;
              box-shadow: 0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(248,164,200,0.08) !important;
              margin: auto !important;
            }
          }
          /* Kiosk canvas — wrapper 1080×1920 logique, scaled to fit le viewport.
             Toutes les unités vh/vw internes restent calculées sur le viewport
             browser, mais les composants phase 2 utilisent des dimensions
             relatives au canvas via container queries (cqh/cqw). */
          /* Fond crème (= fond des pages staff) pour que les marges hors
             canvas se fondent visuellement avec la card → effet "plein écran"
             sur la TV même quand le ratio source (16:10 tablette) ne match pas
             exactement le ratio cible (9:16 canvas). */
          .kiosk-canvas-frame {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #FFFFFF;
            overflow: hidden;
            z-index: 0;
          }
          .kiosk-canvas-shell {
            position: relative;
            width: ${KIOSK_CANVAS_W}px !important;
            height: ${KIOSK_CANVAS_H}px !important;
            max-width: none !important;
            max-height: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            margin: 0 !important;
            background: #FFFFFF;
            overflow: hidden;
            container-type: size;
            container-name: kiosk;
            transform-origin: center center;
          }
          /* Body en crème aussi pour éviter tout flash brun pendant les transitions */
          html.kiosk-mode, html.kiosk-mode body, html.kiosk-mode #root {
            background: #FFFFFF !important;
          }
        `}</style>

        {isCanvasMode ? (
          <div className="kiosk-canvas-frame">
            <div
              className="app-shell kiosk-canvas-shell"
              style={{
                transform: isLandscape
                  ? `scale(${scale}) rotate(90deg)`
                  : `scale(${scale})`,
              }}
            >
              <AnimatePresence>
                {!isReady && <LanguageSelector />}
              </AnimatePresence>
              <RouterProvider router={router} />
            </div>
          </div>
        ) : (
          <div
            className="app-shell relative overflow-hidden w-full h-full"
            style={{ background: '#1A1005' }}
          >
            <AnimatePresence>
              {!isReady && <LanguageSelector />}
            </AnimatePresence>
            <RouterProvider router={router} />
          </div>
        )}
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
