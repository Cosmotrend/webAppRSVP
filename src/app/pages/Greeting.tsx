import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { AuroraBackground } from '../components/AuroraBackground';
import { ParticleField } from '../components/ParticleField';
import { TopBar } from '../components/TopBar';

export function Greeting() {
  const navigate = useNavigate();
  const [name, setName] = useState('Invité');

  useEffect(() => {
    const wheelData = localStorage.getItem('wheelData');
    if (wheelData) {
      const data = JSON.parse(wheelData);
      if (data.clientName) {
        setName(data.clientName);
      }
    }

    // Auto-navigate after 3.5 seconds
    const timer = setTimeout(() => {
      navigate('/wheel-game');
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#0D0008' }}>
      <AuroraBackground />
      <ParticleField />
      <TopBar rightText="" />

      <div className="absolute top-[44px] left-0 right-0 bottom-0 flex flex-col items-center justify-center px-6 text-center">
        {/* Multiple layered glow effects */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: '35%',
              left: '50%',
              width: `${240 + i * 40}px`,
              height: `${240 + i * 40}px`,
              background: `radial-gradient(ellipse, rgba(248,164,200,${0.2 - i * 0.05}) 0%, transparent 70%)`,
              filter: `blur(${40 + i * 10}px)`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 1.2 + i * 0.1, 1],
              opacity: [0.3 + i * 0.1, 0.6 + i * 0.1, 0.3 + i * 0.1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
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
            color: 'rgba(248,164,200,0.5)',
            marginBottom: '24px',
            position: 'relative',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.span
            animate={{
              textShadow: [
                '0 0 10px rgba(248,164,200,0.3)',
                '0 0 20px rgba(248,164,200,0.6)',
                '0 0 10px rgba(248,164,200,0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            BIENVENUE
          </motion.span>
        </motion.div>

        {/* Greeting text */}
        <motion.div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '24px',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'rgba(255,248,245,0.5)',
            marginBottom: '8px',
            position: 'relative',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Bonjour,
        </motion.div>

        {/* Name with 3D effect */}
        <motion.div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '56px',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.05,
            background: 'linear-gradient(140deg, #c47090, #F8A4C8, #ffdaec, #D4A574)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 200%',
            marginBottom: '28px',
            position: 'relative',
            perspective: '1000px',
          }}
          initial={{ opacity: 0, scale: 0.7, rotateX: -20 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotateX: 0,
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            scale: { delay: 0.7, duration: 0.8, type: 'spring' },
            backgroundPosition: { duration: 5, repeat: Infinity },
          }}
        >
          {name}
        </motion.div>

        {/* Animated divider */}
        <motion.div
          style={{
            width: '80px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(248,164,200,0.5), transparent)',
            margin: '0 auto 28px',
            position: 'relative',
          }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '80px', opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {/* Glowing dots on divider */}
          {[-1, 0, 1].map((pos) => (
            <motion.div
              key={pos}
              className="absolute top-1/2 rounded-full"
              style={{
                width: '6px',
                height: '6px',
                background: '#F8A4C8',
                left: pos === -1 ? '0%' : pos === 0 ? '50%' : '100%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 12px rgba(248,164,200,0.8)',
              }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [1, 0.6, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: pos * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Message with sparkles */}
        <motion.div
          className="relative"
          style={{
            fontSize: '12px',
            letterSpacing: '0.16em',
            color: 'rgba(255,248,245,0.35)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.span
            animate={{ opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Votre roue vous attend
          </motion.span>
          {' '}
          <motion.span
            className="inline-block"
            animate={{ rotate: [0, 14, -14, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.span>
        </motion.div>

        {/* Orbiting particles around name */}
        {[...Array(8)].map((_, i) => {
          const angle = (360 / 8) * i;
          const radius = 140;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: '8px',
                height: '8px',
                background: `rgba(248,164,200,${0.4 + Math.random() * 0.4})`,
                boxShadow: '0 0 12px rgba(248,164,200,0.6)',
                top: '50%',
                left: '50%',
              }}
              animate={{
                x: [0, x, 0],
                y: [0, y, 0],
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          );
        })}

        {/* Progress indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2"
          style={{ transform: 'translateX(-50%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="flex gap-2"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ background: 'rgba(248,164,200,0.5)' }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}