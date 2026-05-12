import { motion } from 'motion/react';
import { useLang } from '../i18n/LanguageContext';
import { SemilacDaysLogo } from './logos/SemilacDaysLogo';

export function LanguageSelector() {
  const { setLang } = useLang();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: '#FAF7F2' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Decorative glow */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(232,0,125,0.08), transparent)',
          filter: 'blur(60px)',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      {/* Logo */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <SemilacDaysLogo height={70} />
      </motion.div>

      {/* Title */}
      <motion.div
        className="text-center mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '28px',
            fontWeight: 400,
            color: '#1A1005',
            lineHeight: 1.3,
          }}
        >
          Bienvenue / مرحبا
        </div>
      </motion.div>

      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div style={{ fontSize: '11px', color: 'rgba(26,16,5,0.55)', letterSpacing: '0.08em' }}>
          Choisissez votre langue / ختار اللغة
        </div>
      </motion.div>

      {/* Flags */}
      <motion.div
        className="flex items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {/* Français */}
        <motion.button
          className="flex flex-col items-center gap-3"
          onClick={() => setLang('fr')}
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.05 }}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid rgba(232,0,125,0.25)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08), 0 8px 30px rgba(232,0,125,0.14), inset 0 1px 0 rgba(255,255,255,0.4)',
            }}
          >
            <div className="flag-wave">
              <svg width="90" height="90" viewBox="0 0 90 60" style={{ display: 'block' }}>
                <rect x="0" width="30" height="60" fill="#002395"/>
                <rect x="30" width="30" height="60" fill="#F0F0F0"/>
                <rect x="60" width="30" height="60" fill="#ED2939"/>
              </svg>
            </div>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1005', letterSpacing: '0.04em' }}>
            Français
          </span>
        </motion.button>

        {/* Divider */}
        <div style={{ width: '1px', height: '80px', background: 'rgba(232,0,125,0.15)' }} />

        {/* Arabe */}
        <motion.button
          className="flex flex-col items-center gap-3"
          onClick={() => setLang('ar')}
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.05 }}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid rgba(232,0,125,0.25)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08), 0 8px 30px rgba(232,0,125,0.14), inset 0 1px 0 rgba(255,255,255,0.4)',
            }}
          >
            <div className="flag-wave" style={{ animationDelay: '0.5s' }}>
              <svg width="90" height="90" viewBox="0 0 90 60" style={{ display: 'block' }}>
                <rect width="90" height="60" fill="#C1272D"/>
                <path fillRule="evenodd" fill="#006233" d="M45,18 L52.1,39.7 L33.6,26.3 L56.4,26.3 L37.9,39.7 Z"/>
              </svg>
            </div>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1005', letterSpacing: '0.04em' }}>
            العربية
          </span>
        </motion.button>
      </motion.div>

      {/* Bottom shimmer */}
      <motion.div
        className="absolute bottom-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div
          style={{
            width: '120px',
            height: '2px',
            borderRadius: '1px',
            background: 'rgba(232,0,125,0.08)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent, rgba(232,0,125,0.4), rgba(196,144,74,0.3), transparent)',
              borderRadius: '1px',
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
