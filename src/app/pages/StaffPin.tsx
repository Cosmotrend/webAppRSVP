import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Shield, AlertCircle } from 'lucide-react';
import { AuroraBackground } from '../components/AuroraBackground';
import { ParticleField } from '../components/ParticleField';
import { TopBar } from '../components/TopBar';
import { ShimmerButton } from '../components/ShimmerButton';
import { SemilacDaysLogo } from '../components/logos/SemilacDaysLogo';
import { BrandStrip } from '../components/logos/BrandStrip';
import { KioskFullscreenButton } from '../components/KioskFullscreenButton';
import { sounds } from '../utils/sounds';
import { callAPI } from '../utils/api';
import { useKioskMode } from '../utils/useKioskMode';
import { t } from '../i18n';

// Étape 2 — Français uniquement
const lang = 'fr' as const;

// Code staff pré-rempli — l'animatrice n'a qu'à cliquer "Accéder".
// Peut être surchargé via l'env var VITE_STAFF_PIN dans Vercel.
const DEFAULT_STAFF_PIN = (import.meta.env.VITE_STAFF_PIN as string) || 'COSMO2026';

export function StaffPin() {
  useKioskMode();
  const navigate = useNavigate();
  const [pin, setPin] = useState(DEFAULT_STAFF_PIN);
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
        sessionStorage.setItem('staffAuth', '1');
        sounds.success();
        navigate('/wheel-code');
      } else {
        setError(t('staffPin', 'errorWrong', lang));
        sounds.error();
        setIsValidating(false);
      }
    } catch {
      setError(t('staffPin', 'errorWrong', lang));
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
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#FAF7F2' }}>
      <KioskFullscreenButton />
      <AuroraBackground />
      <ParticleField />
      <TopBar rightAction={{ icon: <Lock size={18} />, label: t('staffPin', 'title', lang) }} />

      <motion.div
        className="absolute top-[44px] left-0 right-0 bottom-0 px-4 pt-6 pb-4 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex-1 flex flex-col justify-center">
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
              borderColor: 'rgba(232,0,125,0.25)',
              background: 'rgba(232,0,125,0.06)',
              boxShadow: '0 0 20px rgba(232,0,125,0.10)',
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Shield size={14} color="#E8007D" />
            <span
              style={{
                fontSize: '8px',
                fontWeight: 700,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#E8007D',
              }}
            >
              {t('staffPin', 'badge', lang)}
            </span>
          </motion.div>

          {/* Logo officiel */}
          <motion.div
            className="flex justify-center mb-3"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <SemilacDaysLogo height={68} />
          </motion.div>

          <motion.div
            style={{
              fontSize: '8px',
              fontWeight: 600,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(232,0,125,0.5)',
              marginTop: '4px',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {t('staffPin', 'year', lang)}
          </motion.div>
        </motion.div>

        {/* Card */}
        <motion.div
          className="rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden"
          style={{
            background: 'rgba(250,247,242,0.92)',
            border: '1px solid rgba(232,0,125,0.22)',
            boxShadow: '0 8px 40px rgba(232,0,125,0.14)',
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
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="relative">
            {/* Lock icon */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(232,0,125,0.12), rgba(196,144,74,0.08))',
                  border: '2px solid rgba(232,0,125,0.2)',
                  boxShadow: '0 0 30px rgba(232,0,125,0.12)',
                }}
              >
                <Lock size={32} color="#E8007D" />
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
                  color: '#1A1005',
                }}
              >
                {t('staffPin', 'title', lang)}
              </div>
            </motion.div>

            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div
                style={{
                  fontSize: '10px',
                  color: 'rgba(26,16,5,0.5)',
                  letterSpacing: '0.08em',
                }}
              >
                {t('staffPin', 'subtitle', lang)}
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
                readOnly
                inputMode="none"
                onFocus={(e) => e.target.blur()}
                className="w-full rounded-2xl px-6 py-4 outline-none transition-all duration-200"
                style={{
                  background: error ? 'rgba(220,50,50,0.04)' : 'rgba(250,247,242,0.85)',
                  border: error
                    ? '2px solid rgba(220,50,50,0.4)'
                    : '2px solid rgba(232,0,125,0.2)',
                  color: '#1A1005',
                  fontSize: '16px',
                  fontWeight: 700,
                  letterSpacing: '0.3em',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  boxShadow: error
                    ? '0 4px 20px rgba(220,50,50,0.1)'
                    : '0 4px 20px rgba(232,0,125,0.08)',
                  cursor: 'default',
                }}
              />
              <div style={{ fontSize: '9px', color: 'rgba(26,16,5,0.5)', textAlign: 'center', marginTop: '6px', letterSpacing: '0.08em' }}>
                {t('staffPin', 'hint', lang)}
              </div>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  className="mb-6 flex items-center justify-center gap-2 p-3 rounded-xl"
                  style={{
                    background: 'rgba(220,50,50,0.06)',
                    border: '1px solid rgba(220,50,50,0.2)',
                  }}
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                >
                  <AlertCircle size={16} color="rgba(220,50,50,0.8)" />
                  <span style={{ fontSize: '10px', color: 'rgba(220,50,50,0.8)', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {error}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

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
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                      <span>{t('staffPin', 'validating', lang)}</span>
                    </motion.div>
                  ) : (
                    <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {t('staffPin', 'submit', lang)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </ShimmerButton>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div style={{ fontSize: '7px', color: 'rgba(232,0,125,0.55)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {t('staffPin', 'bottomHint', lang)}
          </div>
        </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <BrandStrip />
        </motion.div>
      </motion.div>
    </div>
  );
}
