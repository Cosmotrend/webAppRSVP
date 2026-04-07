import { RouterProvider } from 'react-router';
import { AnimatePresence } from 'motion/react';
import { router } from './routes';
import { LanguageProvider, useLang } from './i18n/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';

function AppContent() {
  const { isReady } = useLang();

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
          /* TV 62" portrait HD — projection roue */
          @media (min-width: 1080px) and (orientation: portrait), (min-height: 1600px) {
            .app-shell {
              width: min(1080px, 92vw) !important;
              height: min(calc(100dvh - 48px), 1920px) !important;
              max-width: none !important;
              border-radius: 48px !important;
              margin: auto !important;
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
