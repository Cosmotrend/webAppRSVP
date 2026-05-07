import { useEffect, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { AuroraBackground } from '../components/AuroraBackground';
import { ParticleField } from '../components/ParticleField';
import { TopBar } from '../components/TopBar';
import { KioskFullscreenButton } from '../components/KioskFullscreenButton';
import { useKioskMode } from '../utils/useKioskMode';
import { t } from '../i18n';

// Étape 2 — Français uniquement
const lang = 'fr' as const;

const GLOW_KEYFRAMES = ['glow-pulse-1', 'glow-pulse-2', 'glow-pulse-3'] as const;
const ORBITAL_COUNT = 8;
const ORBITAL_RADIUS = 140;

export function Greeting() {
  useKioskMode();
  const navigate = useNavigate();
  const [name, setName] = useState('Invité');

  useEffect(() => {
    const wheelDataRaw = localStorage.getItem('wheelData');
    if (!wheelDataRaw) {
      navigate('/staff-pin');
      return;
    }

    const data = JSON.parse(wheelDataRaw);
    if (data.clientName) setName(data.clientName);

    const timer = setTimeout(() => {
      navigate('/wheel-game');
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#FAF7F2' }}>
      <KioskFullscreenButton />
      <AuroraBackground />
      <ParticleField />
      <TopBar />

      <div className="absolute top-[44px] left-0 right-0 bottom-0 flex flex-col items-center justify-center px-6 text-center">
        {/* Glow effects — pure CSS animation, GPU-composited */}
        {[1, 2, 3].map((i, idx) => (
          <div
            key={i}
            className="absolute gpu-layer"
            style={{
              top: '35%',
              left: '50%',
              width: `${240 + i * 40}px`,
              height: `${240 + i * 40}px`,
              background: `radial-gradient(ellipse, rgba(232,0,125,${0.08 - i * 0.02}) 0%, transparent 70%)`,
              filter: `blur(${40 + i * 10}px)`,
              transform: 'translate3d(-50%, -50%, 0)',
              animation: `${GLOW_KEYFRAMES[idx]} ${4 + i}s ease-in-out infinite`,
            }}
          />
        ))}

        {/* Welcome badge */}
        <motion.div
          style={{
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: 'rgba(232,0,125,0.5)',
            marginBottom: '24px',
            position: 'relative',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t('greeting', 'welcome', lang)}
        </motion.div>

        {/* Greeting text */}
        <motion.div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '24px',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'rgba(26,16,5,0.5)',
            marginBottom: '8px',
            position: 'relative',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {t('greeting', 'hello', lang)}
        </motion.div>

        {/* Client name — Framer one-shot entrance, CSS-driven gradient shift */}
        <motion.div
          className="gpu-layer"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '56px',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.05,
            background: 'linear-gradient(140deg, #C4157A, #E8007D, #ff4da6, #C4904A)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 200%',
            marginBottom: '28px',
            position: 'relative',
            perspective: '1000px',
            animation: 'gradient-shift 5s linear infinite',
          }}
          initial={{ opacity: 0, scale: 0.7, rotateX: -20 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ delay: 0.7, duration: 0.8, type: 'spring' }}
        >
          {name}
        </motion.div>

        {/* Animated divider */}
        <motion.div
          style={{
            width: '80px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(232,0,125,0.5), transparent)',
            margin: '0 auto 28px',
            position: 'relative',
          }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '80px', opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {[-1, 0, 1].map((pos, idx) => (
            <div
              key={pos}
              className="absolute top-1/2 rounded-full gpu-layer"
              style={{
                width: '6px',
                height: '6px',
                background: '#E8007D',
                left: pos === -1 ? '0%' : pos === 0 ? '50%' : '100%',
                boxShadow: '0 0 12px rgba(232,0,125,0.6)',
                animation: `dot-pulse 1.5s ease-in-out ${idx * 0.2}s infinite`,
              }}
            />
          ))}
        </motion.div>

        {/* Message */}
        <motion.div
          style={{ fontSize: '12px', letterSpacing: '0.16em', color: 'rgba(26,16,5,0.35)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <span
            className="gpu-layer"
            style={{ display: 'inline-block', animation: 'text-shimmer 2s ease-in-out infinite' }}
          >
            {t('greeting', 'wheelAwaits', lang)}
          </span>
          {' '}
          <span
            className="inline-block gpu-layer"
            style={{ animation: 'sparkle-wiggle 2s ease-in-out infinite' }}
          >
            ✨
          </span>
        </motion.div>

        {/* Orbiting particles — CSS-driven, parameterized via CSS variables */}
        {[...Array(ORBITAL_COUNT)].map((_, i) => {
          const angle = (360 / ORBITAL_COUNT) * i;
          const x = Math.cos((angle * Math.PI) / 180) * ORBITAL_RADIUS;
          const y = Math.sin((angle * Math.PI) / 180) * ORBITAL_RADIUS;
          return (
            <div
              key={i}
              className="absolute rounded-full gpu-layer"
              style={{
                width: '6px',
                height: '6px',
                background: `rgba(232,0,125,${0.3 + (i % 3) * 0.15})`,
                boxShadow: '0 0 10px rgba(232,0,125,0.4)',
                top: '50%',
                left: '50%',
                ['--ox' as any]: `${x}px`,
                ['--oy' as any]: `${y}px`,
                animation: `orbit-pulse 3s ease-in-out ${i * 0.2}s infinite`,
              } as CSSProperties}
            />
          );
        })}

        {/* Progress dots */}
        <motion.div
          className="absolute bottom-12 left-1/2"
          style={{ transform: 'translateX(-50%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full gpu-layer"
                style={{
                  background: 'rgba(232,0,125,0.4)',
                  animation: `dot-pulse-plain 1s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
