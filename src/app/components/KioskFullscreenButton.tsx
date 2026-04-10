import { useEffect, useState } from 'react';
import { Maximize2 } from 'lucide-react';

/**
 * Bouton plein écran visible UNIQUEMENT en mode kiosque.
 * Cache la barre d'URL de Chrome Android et remplit tout l'écran de la tablette
 * via l'API Fullscreen native du navigateur.
 *
 * À placer dans les pages étape 2 (StaffPin en premier, puis il persiste
 * pendant toute la session grâce au fullscreen natif du navigateur).
 */
export function KioskFullscreenButton() {
  const [isKiosk, setIsKiosk] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsKiosk(document.documentElement.classList.contains('kiosk-mode'));
      setIsFullscreen(!!document.fullscreenElement);
    };
    check();
    document.addEventListener('fullscreenchange', check);
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      document.removeEventListener('fullscreenchange', check);
      observer.disconnect();
    };
  }, []);

  if (!isKiosk || isFullscreen) return null;

  const handleFullscreen = async () => {
    try {
      const el = document.documentElement as any;
      if (el.requestFullscreen) {
        await el.requestFullscreen({ navigationUI: 'hide' });
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
      // Lock orientation en paysage si supporté (Android Chrome)
      try {
        if (screen.orientation && (screen.orientation as any).lock) {
          await (screen.orientation as any).lock('landscape');
        }
      } catch {
        /* orientation lock non critique */
      }
    } catch (err) {
      console.warn('Fullscreen refusé', err);
    }
  };

  return (
    <button
      onClick={handleFullscreen}
      aria-label="Activer le plein écran"
      style={{
        position: 'fixed',
        top: '12px',
        right: '12px',
        zIndex: 9999,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #E8007D, #ff4da6)',
        border: '2px solid rgba(255,255,255,0.4)',
        boxShadow: '0 4px 20px rgba(232,0,125,0.5), 0 0 0 4px rgba(232,0,125,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        cursor: 'pointer',
        animation: 'kioskPulse 2s ease-in-out infinite',
      }}
    >
      <style>{`
        @keyframes kioskPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
      <Maximize2 size={26} strokeWidth={2.5} />
    </button>
  );
}
