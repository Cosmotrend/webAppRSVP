import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { AuroraBackground } from '../components/AuroraBackground';
import { ParticleField } from '../components/ParticleField';
import { TopBar } from '../components/TopBar';
import { SemilacDaysLogo } from '../components/logos/SemilacDaysLogo';
import { Premium3DWheel } from '../components/Premium3DWheel';
import { ShimmerButton } from '../components/ShimmerButton';
import { registerResult } from '../utils/api';
import { useLang, t } from '../i18n';

export function WheelGame() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [attempt, setAttempt] = useState(1);
  const [firstPrize, setFirstPrize] = useState<string | null>(null);
  const [wheelKey, setWheelKey] = useState(0);
  const [showChoiceButtons, setShowChoiceButtons] = useState(false); // Show choice after attempt 1
  const [isRegistering, setIsRegistering] = useState(false);

  // Enregistre le résultat final dans Google Sheets
  const saveResultToAPI = async (finalPrize: string, attempts: number) => {
    setIsRegistering(true);
    try {
      const wheelDataStr = localStorage.getItem('wheelData');
      if (!wheelDataStr) return;
      const wheelData = JSON.parse(wheelDataStr);

      await registerResult({
        ticket: wheelData.ticketNumber || 'SD26-XXXX',
        devisNumber: wheelData.devisNumber || 'S26XXX',
        clientName: wheelData.clientName || 'Client',
        salon: wheelData.salon || '',
        city: wheelData.city || '',
        discount: finalPrize,
        representative: '',
        attempts,
      });
    } catch (error) {
      console.error('Erreur enregistrement résultat:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSpinComplete = (prizeIndex: number) => {
    setIsSpinning(false);
    setHasSpun(true);

    const prizes = ['-25%', '-30%', '-35%', '-40%', '-25%', '-30%', '-35%', '-40%', '-25%', '-30%', '-35%', '-40%'];
    const currentPrize = prizes[prizeIndex];

    if (attempt === 1) {
      setFirstPrize(currentPrize);
      localStorage.setItem('wheelPrize', currentPrize);
      setTimeout(() => setShowChoiceButtons(true), 1500);
    } else {
      // Essai 2 — garder le meilleur
      const firstValue = parseInt(firstPrize?.replace(/[^0-9]/g, '') || '0');
      const currentValue = parseInt(currentPrize.replace(/[^0-9]/g, ''));
      const finalPrize = currentValue > firstValue ? currentPrize : (firstPrize || currentPrize);
      localStorage.setItem('wheelPrize', finalPrize);

      // 2 tentatives utilisées
      saveResultToAPI(finalPrize, 2);
      setTimeout(() => navigate('/result'), 1500);
    }
  };

  const handleTryAgain = () => {
    setShowChoiceButtons(false);
    setHasSpun(false);
    setAttempt(2);
    setWheelKey(prev => prev + 1);
  };

  const handleKeepPrize = async () => {
    // Client conserve après seulement 1 essai
    const prize = localStorage.getItem('wheelPrize') || firstPrize || '-25%';
    await saveResultToAPI(prize, 1);
    navigate('/result');
  };

  const handleSpinStart = () => {
    if (!isSpinning && !hasSpun) {
      setIsSpinning(true);
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
            {/* SEMILAC DAYS LOGO */}
            <motion.div
              className="flex justify-center mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <SemilacDaysLogo height={68} />
            </motion.div>

            {/* Nom client — élément principal */}
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

              {/* Essai + ticket sur une ligne */}
              <div className="flex items-center justify-center gap-3 mt-2">
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(26,16,5,0.55)',
                  }}
                >
                  {attempt === 1 ? t('wheelGame', 'attemptStatus', lang) : t('wheelGame', 'lastAttempt', lang)}
                </span>
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

          {/* Instructions Box - Positioned prominently */}
          {!showChoiceButtons && (
            <motion.div
              className="mb-6 mx-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <motion.div
                className="relative rounded-2xl p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(232,0,125,0.06), rgba(196,144,74,0.06))',
                  border: '1.5px solid rgba(232,0,125,0.2)',
                  boxShadow: '0 8px 32px rgba(232,0,125,0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
                }}
                animate={{
                  borderColor: ['rgba(232,0,125,0.2)', 'rgba(232,0,125,0.4)', 'rgba(232,0,125,0.2)'],
                  boxShadow: [
                    '0 8px 32px rgba(232,0,125,0.08)',
                    '0 8px 40px rgba(232,0,125,0.15)',
                    '0 8px 32px rgba(232,0,125,0.08)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Corner accents */}
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
                  animate={
                    !isSpinning && !hasSpun
                      ? {
                          scale: [1, 1.02, 1],
                        }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {attempt === 1 ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>🎰</span> {t('wheelGame', 'lastAttemptInstruction', lang)}{' '}
                      <br />
                      <span style={{
                        fontFamily: "'Montserrat', sans-serif",
                        color: '#C4904A',
                        fontWeight: 800,
                      }}>
                        {t('wheelGame', 'improveGain', lang)} {firstPrize}
                      </span>
                    </>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Wheel Container */}
          <div className="flex items-center justify-center py-2">
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, type: 'spring', stiffness: 100 }}
            >
              <Premium3DWheel onSpinComplete={handleSpinComplete} isSpinning={isSpinning} key={wheelKey} />
            </motion.div>
          </div>

          {/* Choice buttons after first attempt */}
          {showChoiceButtons && (
            <motion.div 
              className="mt-6 space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                style={{
                  fontSize: '13px',
                  color: '#E8007D',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  marginBottom: '12px',
                }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {t('wheelGame', 'resultTitle', lang)} {firstPrize} !
              </motion.div>
              
              <ShimmerButton
                className="w-full py-3"
                onClick={handleTryAgain}
              >
                {t('wheelGame', 'retryButton', lang)}
              </ShimmerButton>
              
              <ShimmerButton
                variant="secondary"
                className="w-full py-3"
                onClick={handleKeepPrize}
              >
                {t('wheelGame', 'keepButton', lang)}
              </ShimmerButton>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}