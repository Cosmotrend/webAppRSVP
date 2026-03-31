import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: '#1A1005' }}>
      {/*
        Mobile  (<768px)  : full screen, no wrapper
        Tablet  (768–1023px): centré, max 600px, padding vertical 16px, border-radius
        Desktop (≥1024px) : phone mockup 430×900px centré avec ombre
      */}
      <div
        className="relative overflow-hidden"
        style={{
          width: '100%',
          height: '100%',
          maxHeight: 'calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
          background: '#1A1005',
        }}
      >
        <style>{`
          @media (min-width: 768px) and (max-width: 1023px) {
            .app-shell {
              width: 100% !important;
              max-width: 620px !important;
              height: calc(100dvh - 32px) !important;
              max-height: calc(100dvh - 32px) !important;
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
        `}</style>
        <div
          className="app-shell relative overflow-hidden w-full h-full"
          style={{ background: '#1A1005' }}
        >
          <RouterProvider router={router} />
        </div>
      </div>
    </div>
  );
}
