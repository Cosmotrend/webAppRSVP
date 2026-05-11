import { useEffect, useState } from 'react';
import { Maximize2 } from 'lucide-react';

/**
 * Bouton plein écran pour les pages staff (étape 2).
 *
 * Le composant est monté UNIQUEMENT sur les pages staff (StaffPin,
 * WheelCode, Greeting, WheelGame, CouponResult) — il n'apparaîtra
 * jamais sur le flow client. Plus besoin de `?kiosk=1` dans l'URL :
 * dès qu'on est sur une page staff, le bouton s'affiche tant que le
 * fullscreen natif n'est pas actif. Il se cache automatiquement quand
 * le fullscreen est demandé pour ne pas polluer la TV cast.
 */
export function KioskFullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const check = () => setIsFullscreen(!!document.fullscreenElement);
    check();
    document.addEventListener('fullscreenchange', check);
    return () => document.removeEventListener('fullscreenchange', check);
  }, []);

  if (isFullscreen) return null;

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
      // Pas de lock orientation : sur certaines tablettes, lock('portrait')
      // alors que le device est physiquement en paysage rotate le contenu
      // perpendiculairement au sens d'observation — résultat illisible.
      // On laisse l'OS gérer l'orientation et on demande à l'utilisateur de
      // tenir la tablette en portrait (canvas 1080×1920).
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
