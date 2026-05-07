import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { AuroraBackground } from '../components/AuroraBackground';
import { ParticleField } from '../components/ParticleField';
import { TopBar } from '../components/TopBar';
import { SemilacDaysLogo } from '../components/logos/SemilacDaysLogo';
import { Premium3DWheel } from '../components/Premium3DWheel';
import { KioskFullscreenButton } from '../components/KioskFullscreenButton';
import { BrandStrip } from '../components/logos/BrandStrip';
import { registerResult } from '../utils/api';
import { useKioskMode } from '../utils/useKioskMode';
import { t } from '../i18n';

const lang = 'fr' as const;

// Délais après le spin
const RESULT_REVEAL_DELAY = 1500;     // attente avant d'afficher "Vous avez gagné"
const NAVIGATE_AFTER_RESULT = 2500;   // durée d'affichage du résultat avant /result

export function WheelGame() {
  useKioskMode();
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSpinComplete = (prizeIndex: number) => {
    setIsSpinning(false);
    setHasSpun(true);

    const prizes = ['-25%', '-30%', '-35%', '-40%', '-25%', '-30%', '-35%', '-40%', '-25%', '-30%', '-35%', '-40%'];
    const wonPrize = prizes[prizeIndex];
    setPrize(wonPrize);
    localStorage.setItem('wheelPrize', wonPrize);

    // Reveal result, register in background, then auto-navigate
    setTimeout(() => {
      setShowResult(true);
      registerWinResult(wonPrize);
      setTimeout(() => navigate('/result'), NAVIGATE_AFTER_RESULT);
    }, RESULT_REVEAL_DELAY);
  };

  const registerWinResult = async (finalPrize: string) => {
    try {
      const wheelDataStr = localStorage.getItem('wheelData');
      const wheelData = wheelDataStr ? JSON.parse(wheelDataStr) : {};
      await registerResult({
        ticket: wheelData.ticketNumber || 'SD26-XXXX',
        devisNumber: wheelData.devisNumber || 'S26XXX',
        clientName: wheelData.clientName || 'Client',
        salon: wheelData.salon || '',
        city: wheelData.city || '',
        discount: finalPrize,
        representative: '',
        attempts: 1,
      });
    } catch (error) {
      console.error('Erreur enregistrement résultat:', error);
    }
  };

  // Route guard — in useEffect to avoid calling navigate during render
  useEffect(() => {
    if (!localStorage.getItem('wheelData')) {
      navigate('/staff-pin');
    }
  }, [navigate]);

  const [wheelData] = useState(() => {
    try {
      const str = localStorage.getItem('wheelData');
      return str ? JSON.parse(str) : {};
    } catch { return {}; }
  });

  const ticketNumber = wheelData?.ticketNumber || 'SD26-XXXX';
  const clientName = wheelData?.clientName || 'Client VIP';

  const nameParts = clientName.split(' ');
  const firstName = nameParts[0] || 'Client';

  return (
    <div className="relative w-full h-full overflow-y-auto overflow-x-hidden" style={{ background: '#FAF7F2', WebkitOverflowScrolling: 'touch' }}>
      <KioskFullscreenButton />
      <AuroraBackground />
      <ParticleField />
      <TopBar />

      <motion.div
        className="relative pt-[52px] px-3 pb-6"
        style={{ minHeight: '100%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="rounded-3xl p-4 text-center backdrop-blur-xl flex flex-col"
          style={{
            background: 'rgba(250,247,242,0.92)',
            border: '1px solid rgba(232,0,125,0.22)',
            boxShadow: '0 8px 40px rgba(232,0,125,0.14)',
          }}
        >
          {/* Title Section */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="flex justify-center mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <SemilacDaysLogo height={68} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '22px',
                  fontWeight: 600,
                  fontStyle: 'italic',
                  color: '#1A1005',
                  marginBottom: '4px',
                  lineHeight: 1.2,
                }}
              >
                {t('wheelGame', 'greeting', lang)} <span style={{ color: '#E8007D' }}>{firstName}</span> !
              </div>

              {/* Ticket badge centré */}
              <div className="flex items-center justify-center mt-2">
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    border: '1px solid rgba(232,0,125,0.2)',
                    borderRadius: '100px',
                    padding: '3px 10px',
                    background: 'rgba(232,0,125,0.05)',
                  }}
                >
                  <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#E8007D', display: 'inline-block' }} />
                  <span style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.18em', color: '#E8007D', textTransform: 'uppercase' }}>
                    {ticketNumber}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Wheel Container — placée juste sous le titre pour faciliter le cadrage photo en kiosque TV */}
          <div className="flex items-center justify-center py-2">
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, type: 'spring', stiffness: 100 }}
            >
              <Premium3DWheel onSpinComplete={handleSpinComplete} isSpinning={isSpinning} lang={lang} />
            </motion.div>
          </div>

          {/* Instructions Box — déplacée sous la roue pour libérer l'espace au-dessus */}
          {!showResult && (
            <motion.div
              className="mt-6 mx-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div
                className="relative rounded-2xl p-4 gpu-layer"
                style={{
                  background: 'linear-gradient(135deg, rgba(232,0,125,0.06), rgba(196,144,74,0.06))',
                  border: '1.5px solid rgba(232,0,125,0.2)',
                  animation: 'card-border-pulse 2s ease-in-out infinite',
                }}
              >
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-pink-300/40 rounded-tl" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-pink-300/40 rounded-tr" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-pink-300/40 rounded-bl" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-pink-300/40 rounded-br" />

                <motion.div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '12px',
                    color: '#1A1005',
                    letterSpacing: '0.08em',
                    fontWeight: 600,
                    textAlign: 'center',
                    lineHeight: '1.6',
                  }}
                  animate={!isSpinning && !hasSpun ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>✨</span> {t('wheelGame', 'instruction', lang)}{' '}
                  <br />
                  <span style={{
                    fontFamily: "'Montserrat', sans-serif",
                    color: '#E8007D',
                    fontWeight: 800,
                    fontSize: '13px',
                  }}>
                    {t('wheelGame', 'instructionBold', lang)}
                  </span>{' '}
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>✨</span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Result reveal — auto-navigates to /result after a short pause */}
          {showResult && (
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="gpu-layer"
                style={{
                  fontSize: '15px',
                  color: '#E8007D',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  animation: 'pulse-text-scale 1.5s ease-in-out infinite',
                }}
              >
                {t('wheelGame', 'resultTitle', lang)} {prize} !
              </div>
            </motion.div>
          )}
        </div>

        {/* BrandStrip — same footer treatment as the other staff pages */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <BrandStrip />
        </motion.div>
      </motion.div>
    </div>
  );
}
