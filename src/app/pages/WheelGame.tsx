import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { AuroraBackground } from '../components/AuroraBackground';
import { ParticleField } from '../components/ParticleField';
import { TopBar } from '../components/TopBar';
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

  // Fonction pour enregistrer le résultat dans Google Sheets
  const saveResultToAPI = async (finalPrize: string) => {
    setIsRegistering(true);
    
    try {
      // Récupérer les données depuis localStorage
      const wheelDataStr = localStorage.getItem('wheelData');
      
      if (!wheelDataStr) {
        console.error('Données wheelData manquantes');
        return;
      }
      
      const wheelData = JSON.parse(wheelDataStr);
      
      // Appel API pour enregistrer le résultat
      const result = await registerResult({
        ticket: wheelData.ticketNumber || 'SD26-XXXX',
        devisNumber: wheelData.devisNumber || 'S26XXX',
        clientName: wheelData.clientName || 'Client',
        salon: wheelData.salon || '',
        city: wheelData.city || '',
        discount: finalPrize,
        representative: '', // Pas de représentant dans wheelData
      });
      
      if (result.success) {
        console.log('✅ Résultat enregistré avec succès dans Google Sheets');
      } else {
        console.warn('⚠️ Erreur lors de l\'enregistrement:', result.message);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement du résultat:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSpinComplete = (prizeIndex: number) => {
    setIsSpinning(false);
    setHasSpun(true);
    
    // Save prize to localStorage
    const prizes = ['-25%', '-30%', '-35%', '-40%', '-25%', '-30%', '-35%', '-40%', '-25%', '-30%', '-35%', '-40%'];
    const currentPrize = prizes[prizeIndex];
    
    if (attempt === 1) {
      setFirstPrize(currentPrize);
      localStorage.setItem('wheelPrize', currentPrize);
      
      // Show choice buttons after a short delay
      setTimeout(() => {
        setShowChoiceButtons(true);
      }, 1500);
    } else {
      // Second attempt - compare and keep the best
      const firstValue = parseInt(firstPrize?.replace(/[^0-9]/g, '') || '0');
      const currentValue = parseInt(currentPrize.replace(/[^0-9]/g, ''));
      const bestPrize = currentValue > firstValue ? currentPrize : firstPrize;
      
      const finalPrize = bestPrize || currentPrize;
      localStorage.setItem('wheelPrize', finalPrize);
      
      // Enregistrer le résultat dans Google Sheets
      saveResultToAPI(finalPrize);
      
      // Navigate to result after a short delay
      setTimeout(() => {
        navigate('/result');
      }, 1500);
    }
  };

  const handleTryAgain = () => {
    setShowChoiceButtons(false);
    setHasSpun(false);
    setAttempt(2);
    setWheelKey(prev => prev + 1);
  };

  const handleKeepPrize = async () => {
    // Enregistrer le résultat dans Google Sheets avant de naviguer
    const prize = localStorage.getItem('wheelPrize') || firstPrize || '-25%';
    await saveResultToAPI(prize);
    
    navigate('/result');
  };

  const handleSpinStart = () => {
    if (!isSpinning && !hasSpun) {
      setIsSpinning(true);
    }
  };

  // Récupérer les données depuis wheelData au lieu de rsvpData
  const wheelDataStr = localStorage.getItem('wheelData');
  const wheelData = wheelDataStr ? JSON.parse(wheelDataStr) : null;
  
  const ticketNumber = wheelData?.ticketNumber || 'SD26-XXXX';
  const clientName = wheelData?.clientName || 'Client VIP';
  
  // Séparer le nom du client en firstName et lastName pour l'affichage
  const nameParts = clientName.split(' ');
  const firstName = nameParts[0] || 'Client';
  const lastName = nameParts.slice(1).join(' ') || 'VIP';

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#0D0008' }}>
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
            background: 'rgba(20,5,15,0.88)',
            border: '1px solid rgba(248,164,200,0.18)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
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
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                background: 'linear-gradient(90deg, #F8A4C8, #D4A574, #F8A4C8)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: '1.1',
                marginBottom: '12px',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Roue de la Fortune
            </motion.div>

            {/* SEMILAC DAYS LOGO */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '28px',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  background: 'linear-gradient(150deg, #c47090, #F8A4C8, #ffdaec, #D4A574)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: '0.9',
                }}
              >
                Semilac
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  letterSpacing: '0.42em',
                  textTransform: 'uppercase',
                  color: '#FFF8F5',
                  marginTop: '2px',
                }}
              >
                DAYS
              </div>
            </motion.div>

            {/* ESSAI indicator */}
            <motion.div
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#F8A4C8',
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
                  color: 'rgba(255,248,245,0.6)',
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
                  color: '#F8A4C8',
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
                  border: '1px solid rgba(248,164,200,0.25)',
                  borderRadius: '100px',
                  padding: '4px 12px',
                  background: 'rgba(248,164,200,0.05)',
                }}
              >
                <span
                  style={{
                    width: '3px',
                    height: '3px',
                    borderRadius: '50%',
                    background: '#F8A4C8',
                    boxShadow: '0 0 6px rgba(248,164,200,0.8)',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    fontSize: '8px',
                    fontWeight: 600,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#F8A4C8',
                  }}
                >
                  {ticketNumber}
                </span>
                <span
                  style={{
                    width: '3px',
                    height: '3px',
                    borderRadius: '50%',
                    background: '#F8A4C8',
                    boxShadow: '0 0 6px rgba(248,164,200,0.8)',
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
                  background: 'linear-gradient(135deg, rgba(248,164,200,0.12), rgba(212,165,116,0.08))',
                  border: '1.5px solid rgba(248,164,200,0.3)',
                  boxShadow: '0 8px 32px rgba(248,164,200,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
                animate={{
                  borderColor: ['rgba(248,164,200,0.3)', 'rgba(248,164,200,0.5)', 'rgba(248,164,200,0.3)'],
                  boxShadow: [
                    '0 8px 32px rgba(248,164,200,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
                    '0 8px 40px rgba(248,164,200,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
                    '0 8px 32px rgba(248,164,200,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
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
                    color: '#F8A4C8',
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
                        background: 'linear-gradient(90deg, #F8A4C8, #D4A574, #F8A4C8)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
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
                        color: '#D4A574',
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
                  color: '#F8A4C8',
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