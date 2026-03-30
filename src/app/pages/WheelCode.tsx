import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { AuroraBackground } from '../components/AuroraBackground';
import { ParticleField } from '../components/ParticleField';
import { TopBar } from '../components/TopBar';
import { ShimmerButton } from '../components/ShimmerButton';
import { SemilacDaysLogo } from '../components/logos/SemilacDaysLogo';
import { sounds } from '../utils/sounds';
import { callAPI } from '../utils/api';

export function WheelCode() {
  const navigate = useNavigate();

  // Route guard — only accessible after staff PIN
  if (!sessionStorage.getItem('staffAuth')) {
    navigate('/staff-pin');
    return null;
  }

  const [ticketNumber, setTicketNumber] = useState('');
  const [devisNumber, setDevisNumber] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [clientName, setClientName] = useState('');

  const handleValidate = async () => {
    setIsValidating(true);
    setError('');
    sounds.click();

    try {
      // Appel API pour valider
      const result = await callAPI({
        action: 'validate',
        ticket: ticketNumber.toUpperCase(),
        devisNumber: devisNumber.toUpperCase(),
      });

      // ✅ UTILISER LES VRAIES DONNÉES DE L'API (pas mockData)
      const apiData = result.data || {};

      // Vérifier les erreurs
      if (apiData.devisUsed) {
        setError('Ce numéro de devis a déjà été utilisé');
        sounds.error();
      } else if (apiData.alreadyUsed) {
        setError('Ce billet a déjà participé');
        sounds.error();
      } else if (apiData.notFound) {
        setError('Billet non trouvé dans le système');
        sounds.error();
      } else if (result.success && apiData.clientName) {
        // Succès - sauvegarder les données
        const wheelData = {
          ticketNumber: ticketNumber.toUpperCase(),
          devisNumber: devisNumber.toUpperCase(),
          clientName: apiData.clientName,  // 👈 Nom réel depuis l'API
          salon: apiData.salon,
          city: apiData.city,
        };
        localStorage.setItem('wheelData', JSON.stringify(wheelData));
        
        // Afficher l'écran de bienvenue avec le vrai nom
        setClientName(apiData.clientName);
        setShowWelcome(true);
        sounds.success();
        
        // Rediriger vers la page d'accueil puis la roue
        setTimeout(() => {
          navigate('/greeting');
        }, 3000);
      } else {
        setError('Erreur de connexion, réessayez');
        sounds.error();
      }
    } catch (error) {
      console.error('Erreur validation:', error);
      setError('Erreur de connexion, réessayez');
      sounds.error();
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid) {
      handleValidate();
    }
  };

  // Format automatique pour le ticket (SD26-001 à SD26-1000)
  const handleTicketChange = (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (cleaned.length <= 9) {
      setTicketNumber(cleaned);
      setError('');
    }
  };

  // Format automatique pour le devis (S26XXX)
  const handleDevisChange = (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.length <= 6) {
      setDevisNumber(cleaned);
      setError('');
    }
  };

  const isFormValid = ticketNumber.length >= 8 && devisNumber.length === 6;

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#FAF7F2' }}>
      <AuroraBackground />
      <ParticleField />
      <TopBar rightText="Roue de la Fortune" />

      <motion.div
        className="absolute top-[44px] left-0 right-0 bottom-0 px-4 pt-4 pb-4 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero */}
        <motion.div
          className="text-center mb-4"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <motion.div
            className="inline-flex items-center gap-2 border rounded-full px-5 py-2 mb-5 relative overflow-hidden"
            style={{
              borderColor: 'rgba(232,0,125,0.25)',
              background: 'rgba(232,0,125,0.06)',
              boxShadow: '0 0 20px rgba(232,0,125,0.10)',
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles size={12} color="#E8007D" />
            <span
              style={{
                fontSize: '8px',
                fontWeight: 700,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#E8007D',
              }}
            >
              Validation Client
            </span>
          </motion.div>

          {/* Logo officiel */}
          <motion.div
            className="flex justify-center mb-2"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <SemilacDaysLogo height={68} />
          </motion.div>

          <motion.div
            className="mt-3"
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#E8007D',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Roue de la Fortune
          </motion.div>
        </motion.div>

        {/* Card */}
        <motion.div
          className="rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(232,0,125,0.12)',
            boxShadow: '0 8px 40px rgba(232,0,125,0.08)',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Glow */}
          <motion.div
            className="absolute top-0 left-1/2 w-64 h-64 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(232,0,125,0.08), transparent)',
              filter: 'blur(40px)',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="relative">
            {/* Instructions */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: 'rgba(26,16,5,0.65)',
                  letterSpacing: '0.04em',
                  lineHeight: '1.6',
                  fontWeight: 500,
                }}
              >
                Entrez le code billet du client et le numéro de devis
                <br />
                pour déverrouiller la roue
              </div>
            </motion.div>

            {/* Champ 1 : Code billet */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Ticket size={14} color="#F8A4C8" />
                <label
                  style={{
                    fontSize: '9px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#E8007D',
                  }}
                >
                  Code Billet Client
                </label>
              </div>
              <input
                type="text"
                value={ticketNumber}
                onChange={(e) => handleTicketChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="SD26-001"
                className="w-full rounded-xl px-5 py-4 outline-none transition-all duration-200"
                style={{
                  background: 'rgba(232,0,125,0.04)',
                  border: '2px solid rgba(232,0,125,0.2)',
                  color: '#1A1005',
                  fontSize: '16px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textAlign: 'center',
                  fontFamily: "'Courier New', monospace",
                  boxShadow: '0 4px 20px rgba(232,0,125,0.08)',
                }}
              />
              <div
                className="mt-1 text-right"
                style={{
                  fontSize: '7px',
                  color: 'rgba(26,16,5,0.35)',
                  letterSpacing: '0.05em',
                }}
              >
                Format: SD26-001 → SD26-1000
              </div>
            </motion.div>

            {/* Champ 2 : Numéro de devis */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} color="#D4A574" />
                <label
                  style={{
                    fontSize: '9px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#C4904A',
                  }}
                >
                  Numéro de Devis
                </label>
              </div>
              <input
                type="text"
                value={devisNumber}
                onChange={(e) => handleDevisChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="S26___"
                className="w-full rounded-xl px-5 py-4 outline-none transition-all duration-200"
                style={{
                  background: 'rgba(196,144,74,0.06)',
                  border: '2px solid rgba(196,144,74,0.25)',
                  color: '#1A1005',
                  fontSize: '16px',
                  fontWeight: 700,
                  letterSpacing: '0.3em',
                  textAlign: 'center',
                  fontFamily: "'Courier New', monospace",
                  boxShadow: '0 4px 20px rgba(196,144,74,0.10)',
                }}
              />
              <div
                className="mt-1 text-right"
                style={{
                  fontSize: '7px',
                  color: 'rgba(26,16,5,0.35)',
                  letterSpacing: '0.05em',
                }}
              >
                Format: S26XXX (6 caractères)
              </div>
            </motion.div>

            {/* Message d'erreur */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="mb-6 flex items-center gap-2 p-3 rounded-xl"
                  style={{
                    background: 'rgba(255,100,100,0.1)',
                    border: '1px solid rgba(255,100,100,0.3)',
                  }}
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                >
                  <AlertCircle size={16} color="#FF6464" />
                  <span
                    style={{
                      fontSize: '9px',
                      color: '#FF6464',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {error}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bouton */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <ShimmerButton
                className="w-full h-14"
                onClick={handleValidate}
                disabled={!isFormValid || isValidating}
              >
                <AnimatePresence mode="wait">
                  {isValidating ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        className="w-4 h-4 border-2 border-[#0D0008] border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      />
                      <span>Validation...</span>
                    </motion.div>
                  ) : (
                    <motion.span
                      key="text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Valider et lancer la roue
                    </motion.span>
                  )}
                </AnimatePresence>
              </ShimmerButton>
            </motion.div>
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          className="text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <div
            style={{
              fontSize: '7px',
              color: 'rgba(232,0,125,0.4)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Les deux codes sont requis pour continuer
          </div>
        </motion.div>
      </motion.div>

      {/* Écran de bienvenue */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at center, rgba(13,0,8,0.98), rgba(13,0,8,0.95))',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Glow animé */}
            <motion.div
              className="absolute w-96 h-96 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(248,164,200,0.3), transparent)',
                filter: 'blur(100px)',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Particules animées */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: i % 2 === 0 ? '#F8A4C8' : '#D4A574',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}

            {/* Card de bienvenue */}
            <motion.div
              className="relative z-10 text-center px-8"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                type: 'spring',
                bounce: 0.4,
              }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 border rounded-full px-6 py-2 mb-6"
                style={{
                  borderColor: 'rgba(248,164,200,0.4)',
                  background: 'rgba(248,164,200,0.12)',
                  boxShadow: '0 0 30px rgba(248,164,200,0.3)',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <Sparkles size={14} color="#F8A4C8" />
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: '#F8A4C8',
                  }}
                >
                  Validation Réussie
                </span>
              </motion.div>

              {/* Titre Bonjour */}
              <motion.div
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,248,245,0.7)',
                  marginBottom: '16px',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Bonjour
              </motion.div>

              {/* Nom du client */}
              <motion.div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '48px',
                  fontWeight: 600,
                  fontStyle: 'italic',
                  lineHeight: 1.1,
                  background: 'linear-gradient(135deg, #F8A4C8, #ffc8de, #D4A574)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '24px',
                  textShadow: '0 0 40px rgba(248,164,200,0.5)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: 'spring', bounce: 0.5 }}
              >
                {clientName}
              </motion.div>

              {/* Message */}
              <motion.div
                style={{
                  fontSize: '12px',
                  color: 'rgba(255,248,245,0.8)',
                  letterSpacing: '0.08em',
                  lineHeight: 1.6,
                  marginBottom: '32px',
                  maxWidth: '320px',
                  margin: '0 auto 32px',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Préparez-vous à tenter votre chance
                <br />
                <span
                  style={{
                    fontWeight: 700,
                    color: '#F8A4C8',
                  }}
                >
                  à la Roue de la Fortune
                </span>
              </motion.div>

              {/* Icône roue animée */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ 
                  opacity: 1,
                  rotate: 360,
                }}
                transition={{ 
                  delay: 1.1,
                  rotate: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }
                }}
              >
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(248,164,200,0.2), rgba(212,165,116,0.2))',
                    border: '2px solid rgba(248,164,200,0.4)',
                    boxShadow: '0 0 30px rgba(248,164,200,0.3)',
                  }}
                >
                  <Sparkles size={32} color="#F8A4C8" />
                </div>
              </motion.div>

              {/* Dots de progression */}
              <motion.div
                className="flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: '#F8A4C8',
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}