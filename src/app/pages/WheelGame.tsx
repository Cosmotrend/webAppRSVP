import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { AuroraBackground } from '../components/AuroraBackground';
import { ParticleField } from '../components/ParticleField';
import { TopBar } from '../components/TopBar';
import { SemilacDaysLogo } from '../components/logos/SemilacDaysLogo';
import { Premium3DWheel } from '../components/Premium3DWheel';
import { PageTransition } from '../components/PageTransition';
import { ShimmerButton } from '../components/ShimmerButton';
import { registerResult } from '../utils/api';

export function WheelGame() {
  const navigate = useNavigate();
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

  // Route guard
  const wheelDataStr = localStorage.getItem('wheelData');
  if (!wheelDataStr) {
    navigate('/staff-pin');
    return null;
  }

  const wheelData = JSON.parse(wheelDataStr);
  
  const ticketNumber = wheelData?.ticketNumber || 'SD26-XXXX';
  const clientName = wheelData?.clientName || 'Client VIP';
  
  // Séparer le nom du client en firstName et lastName pour l'affichage
  const nameParts = clientName.split(' ');
  const firstName = nameParts[0] || 'Client';
  const lastName = nameParts.slice(1).join(' ') || 'VIP';

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#FAF7F2' }}>
      <AuroraBackground />
      <ParticleField />
      <TopBar rightText="" />

      <motion.div
        className="absolute top-[44px] left-0 right-0 bottom-0 p-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="rounded-3xl p-4 text-center h-full backdrop-blur-xl flex flex-col"
          style={{
            background: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(232,0,125,0.12)',
            boxShadow: '0 8px 40px rgba(232,0,125,0.08)',
          }}
        >
          {/* Title Section */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* ROUE DE LA FORTUNE TITLE */}
            <motion.div
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#E8007D',
                lineHeight: '1.1',
                marginBottom: '8px',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Roue de la Fortune
            </motion.div>

            {/* SEMILAC DAYS LOGO officiel */}
            <motion.div
              className="flex justify-center mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <SemilacDaysLogo height={90} />
            </motion.div>

            {/* ESSAI indicator */}
            <motion.div
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#E8007D',
                marginBottom: '12px',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {attempt === 1 ? 'ESSAI 1' : 'ESSAI 2'}
            </motion.div>

            {/* BONNE CHANCE + NOM PRENOM */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(26,16,5,0.5)',
                  marginBottom: '4px',
                }}
              >
                BONNE CHANCE
              </div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#E8007D',
                  marginBottom: '8px',
                }}
              >
                {firstName} {lastName}
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: '1px solid rgba(232,0,125,0.2)',
                  borderRadius: '100px',
                  padding: '4px 12px',
                  background: 'rgba(232,0,125,0.05)',
                }}
              >
                <span
                  style={{
                    width: '3px',
                    height: '3px',
                    borderRadius: '50%',
                    background: '#E8007D',
                    boxShadow: '0 0 6px rgba(232,0,125,0.6)',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    fontSize: '8px',
                    fontWeight: 600,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#E8007D',
                  }}
                >
                  {ticketNumber}
                </span>
                <span
                  style={{
                    width: '3px',
                    height: '3px',
                    borderRadius: '50%',
                    background: '#E8007D',
                    boxShadow: '0 0 6px rgba(232,0,125,0.6)',
                    display: 'inline-block',
                  }}
                />
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
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>✨</span> Tournez la roue pour découvrir{' '}
                      <br />
                      <span style={{ 
                        fontFamily: "'Montserrat', sans-serif",
                        color: '#E8007D',
                        fontWeight: 800,
                        fontSize: '13px',
                      }}>
                        votre réduction spécial VIP
                      </span>{' '}
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>✨</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>🎰</span> Dernier essai !{' '}
                      <br />
                      <span style={{ 
                        fontFamily: "'Montserrat', sans-serif",
                        color: '#C4904A',
                        fontWeight: 800,
                      }}>
                        Améliorez votre gain de {firstPrize}
                      </span>
                    </>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Wheel Container */}
          <div className="flex-1 flex items-center justify-center">
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
                Vous avez gagné {firstPrize} !
              </motion.div>
              
              <ShimmerButton
                className="w-full py-3"
                onClick={handleTryAgain}
              >
                Retenter ma chance (Essai 2)
              </ShimmerButton>
              
              <ShimmerButton
                variant="secondary"
                className="w-full py-3"
                onClick={handleKeepPrize}
              >
                Conserver ce gain
              </ShimmerButton>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}