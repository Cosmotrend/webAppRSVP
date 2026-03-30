import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Shield, AlertCircle } from 'lucide-react';
import { AuroraBackground } from '../components/AuroraBackground';
import { ParticleField } from '../components/ParticleField';
import { TopBar } from '../components/TopBar';
import { ShimmerButton } from '../components/ShimmerButton';
import { sounds } from '../utils/sounds';
import { callAPI } from '../utils/api';

export function StaffPin() {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async () => {
    setIsValidating(true);
    setError('');
    sounds.click();

    try {
      const result = await callAPI({
        action: 'validatePin',
        pin: pin.toUpperCase(),
      });

      if (result.success) {
        // Stocker l'autorisation en session (expire à la fermeture de l'onglet)
        sessionStorage.setItem('staffAuth', '1');
        sounds.success();
        navigate('/wheel-code');
      } else {
        setError('Code incorrect');
        sounds.error();
        setIsValidating(false);
      }
    } catch {
      // Fallback offline — supprimer si connexion disponible en prod
      setError('Erreur de connexion');
      sounds.error();
      setIsValidating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && pin.length >= 3) {
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#0D0008' }}>
      <AuroraBackground />
      <ParticleField />
      <TopBar rightText="Accès Staff" />

      <motion.div
        className="absolute top-[44px] left-0 right-0 bottom-0 px-4 pt-6 pb-4 flex flex-col"
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
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 border rounded-full px-5 py-2 mb-6 relative overflow-hidden"
            style={{
              borderColor: 'rgba(248,164,200,0.25)',
              background: 'rgba(248,164,200,0.06)',
              boxShadow: '0 0 20px rgba(248,164,200,0.2)',
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(248,164,200,0.4)' }}
          >
            <Shield size={14} color="#F8A4C8" />
            <span
              style={{
                fontSize: '8px',
                fontWeight: 700,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#F8A4C8',
              }}
            >
              Zone Sécurisée
            </span>
          </motion.div>

          {/* Logo */}
          <motion.div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '56px',
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 0.85,
              background: 'linear-gradient(150deg, #c47090, #F8A4C8, #ffdaec, #D4A574)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Semilac
          </motion.div>

          <motion.div
            style={{
              fontSize: '20px',
              fontWeight: 800,
              letterSpacing: '0.48em',
              textTransform: 'uppercase',
              color: '#FFF8F5',
              marginTop: '4px',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            DAYS
          </motion.div>

          <motion.div
            style={{
              fontSize: '8px',
              fontWeight: 600,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(248,164,200,0.6)',
              marginTop: '8px',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            2026
          </motion.div>
        </motion.div>

        {/* Card */}
        <motion.div
          className="rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden flex-1 flex flex-col justify-center"
          style={{
            background: 'rgba(20,5,15,0.92)',
            border: '1px solid rgba(248,164,200,0.18)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Glow */}
          <motion.div
            className="absolute top-0 left-1/2 w-64 h-64 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(248,164,200,0.15), transparent)',
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
            {/* Icon */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(248,164,200,0.2), rgba(212,165,116,0.1))',
                  border: '2px solid rgba(248,164,200,0.3)',
                  boxShadow: '0 0 30px rgba(248,164,200,0.2)',
                }}
              >
                <Lock size={32} color="#F8A4C8" />
              </div>
            </motion.div>

            {/* Titre */}
            <motion.div
              className="text-center mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  background: 'linear-gradient(90deg, #F8A4C8, #D4A574, #F8A4C8)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Accès Staff
              </div>
            </motion.div>

            {/* Sous-titre */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div
                style={{
                  fontSize: '10px',
                  color: 'rgba(255,248,245,0.6)',
                  letterSpacing: '0.08em',
                }}
              >
                Entrez le code d'accès commercial
              </div>
            </motion.div>

            {/* Input PIN */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                maxLength={9}
                placeholder="CODE PIN"
                className="w-full rounded-2xl px-6 py-4 outline-none transition-all duration-200"
                style={{
                  background: 'rgba(248,164,200,0.08)',
                  border: error
                    ? '2px solid rgba(255,100,100,0.5)'
                    : '2px solid rgba(248,164,200,0.25)',
                  color: '#FFF8F5',
                  fontSize: '16px',
                  fontWeight: 700,
                  letterSpacing: '0.3em',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  boxShadow: error
                    ? '0 4px 20px rgba(255,100,100,0.2)'
                    : '0 4px 20px rgba(248,164,200,0.15)',
                }}
                autoFocus
              />
            </motion.div>

            {/* Message d'erreur */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="mb-6 flex items-center justify-center gap-2 p-3 rounded-xl"
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
                      fontSize: '10px',
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
              transition={{ delay: 1.1 }}
            >
              <ShimmerButton
                className="w-full h-14"
                onClick={handleSubmit}
                disabled={pin.length < 3 || isValidating}
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
                      <span>Vérification...</span>
                    </motion.div>
                  ) : (
                    <motion.span
                      key="text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Accéder
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
          transition={{ delay: 1.2 }}
        >
          <div
            style={{
              fontSize: '7px',
              color: 'rgba(248,164,200,0.5)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Accès réservé aux commerciaux Semilac Days
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
