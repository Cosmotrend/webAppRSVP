import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { t } from '../i18n';
import type { Lang } from '../i18n/translations';

interface LoadingOverlayProps {
  visible: boolean;
  step: number;          // 0 | 1 | 2
  lang: Lang;
}

const STEP_KEYS = ['submittingStep1', 'submittingStep2', 'submittingStep3'] as const;

export function LoadingOverlay({ visible, step, lang }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(26,16,5,0.65), rgba(26,16,5,0.85))',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          {/* Ambient glow behind the card */}
          <motion.div
            className="absolute"
            style={{
              width: '420px',
              height: '420px',
              background: 'radial-gradient(circle, rgba(232,0,125,0.25) 0%, transparent 70%)',
              filter: 'blur(60px)',
              transform: 'translate3d(0,0,0)',
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Card */}
          <motion.div
            className="relative rounded-3xl px-10 py-12 text-center"
            style={{
              background: 'rgba(250,247,242,0.96)',
              border: '1px solid rgba(232,0,125,0.25)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(248,164,200,0.12)',
              maxWidth: '340px',
              width: '100%',
            }}
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          >
            {/* Orbital ring (animated) */}
            <div className="relative mx-auto mb-6" style={{ width: '88px', height: '88px' }}>
              {/* Outer rotating gradient ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0%, #E8007D 25%, #ff4da6 50%, #C4904A 75%, transparent 100%)',
                  padding: '2px',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
              >
                <div
                  className="w-full h-full rounded-full"
                  style={{ background: 'rgba(250,247,242,1)' }}
                />
              </motion.div>

              {/* Inner sparkle */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles size={32} color="#E8007D" />
              </motion.div>
            </div>

            {/* "VIP" mini badge */}
            <motion.div
              style={{
                fontSize: '8px',
                fontWeight: 700,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: 'rgba(232,0,125,0.55)',
                marginBottom: '14px',
              }}
              animate={{ opacity: [0.55, 0.9, 0.55] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {t('rsvp', 'badge', lang)}
            </motion.div>

            {/* Cycling status message */}
            <div style={{ minHeight: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '20px',
                    fontWeight: 500,
                    fontStyle: 'italic',
                    color: '#1A1005',
                    lineHeight: 1.3,
                  }}
                >
                  {t('rsvp', STEP_KEYS[step] ?? 'submittingStep1', lang)}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: '8px',
                    height: '8px',
                    background: i <= step ? '#E8007D' : 'rgba(232,0,125,0.18)',
                    boxShadow: i <= step ? '0 0 12px rgba(232,0,125,0.5)' : 'none',
                  }}
                  animate={i === step ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              ))}
            </div>

            {/* Reassurance hint */}
            <motion.div
              style={{
                fontSize: '9px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(26,16,5,0.4)',
                marginTop: '20px',
                fontWeight: 600,
              }}
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {t('rsvp', 'submittingHint', lang)}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
