import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { AuroraBackground } from '../components/AuroraBackground';
import { ParticleField } from '../components/ParticleField';
import { TopBar } from '../components/TopBar';
import { ShimmerButton } from '../components/ShimmerButton';
import { PageTransition } from '../components/PageTransition';
import { sounds } from '../utils/sounds';

export function DeclinePage() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="relative w-full h-full overflow-hidden" style={{ background: '#0D0008' }}>
        <AuroraBackground />
        <ParticleField />
        <TopBar rightText="" />

        <motion.div
          className="absolute top-[44px] left-0 right-0 bottom-0 px-4 py-3 flex items-center justify-center overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="rounded-3xl p-6 text-center backdrop-blur-xl"
            style={{
              background: 'rgba(20,5,15,0.88)',
              border: '1px solid rgba(248,164,200,0.18)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Emoji or icon */}
            <motion.div
              style={{ fontSize: '56px', marginBottom: '12px' }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
            >
              💔
            </motion.div>

            {/* Main title */}
            <motion.div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '36px',
                fontWeight: 300,
                fontStyle: 'italic',
                background: 'linear-gradient(150deg, #c47090, #F8A4C8, #ffdaec)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: '1.2',
                marginBottom: '16px',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Êtes-vous sûr(e) ?
            </motion.div>

            {/* Subtitle */}
            <motion.div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#D4A574',
                marginBottom: '24px',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Vous allez manquer quelque chose d'incroyable
            </motion.div>

            {/* Marketing text */}
            <motion.div
              style={{
                fontSize: '12px',
                color: 'rgba(255,248,245,0.7)',
                lineHeight: '1.6',
                marginBottom: '16px',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p style={{ marginBottom: '16px' }}>
                <span style={{ color: '#F8A4C8', fontWeight: 700 }}>Semilac Days 2026</span> est bien plus qu'un événement.
              </p>
              <p style={{ marginBottom: '16px' }}>
                C'est une expérience <span style={{ color: '#D4A574', fontWeight: 600 }}>exclusive VIP</span> avec des{' '}
                <span style={{ color: '#F8A4C8', fontWeight: 600 }}>réductions exceptionnelles</span>, des démonstrations live,
                des cadeaux surprises et une ambiance glamour inoubliable.
              </p>
              <p>
                Sans compter la{' '}
                <span
                  style={{
                    background: 'linear-gradient(90deg, #F8A4C8, #D4A574, #F8A4C8)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 800,
                    fontSize: '14px',
                  }}
                >
                  Roue de la Fortune
                </span>{' '}
                qui vous attend avec jusqu'à <span style={{ color: '#F8A4C8', fontWeight: 800 }}>-40%</span> de réduction !
              </p>
            </motion.div>

            {/* Highlight boxes */}
            <motion.div
              className="grid grid-cols-3 gap-3 mb-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
            >
              <div
                className="p-3 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(248,164,200,0.1), rgba(212,165,116,0.05))',
                  border: '1px solid rgba(248,164,200,0.2)',
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>🎁</div>
                <div style={{ fontSize: '9px', color: '#F8A4C8', fontWeight: 600, letterSpacing: '0.1em' }}>
                  CADEAUX VIP
                </div>
              </div>

              <div
                className="p-3 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,165,116,0.1), rgba(248,164,200,0.05))',
                  border: '1px solid rgba(212,165,116,0.2)',
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>✨</div>
                <div style={{ fontSize: '9px', color: '#D4A574', fontWeight: 600, letterSpacing: '0.1em' }}>
                  DÉMOS LIVE
                </div>
              </div>

              <div
                className="p-3 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(248,164,200,0.1), rgba(212,165,116,0.05))',
                  border: '1px solid rgba(248,164,200,0.2)',
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>🎰</div>
                <div style={{ fontSize: '9px', color: '#F8A4C8', fontWeight: 600, letterSpacing: '0.1em' }}>
                  ROUE -40%
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <ShimmerButton
                variant="primary"
                className="flex-[2] h-14"
                onClick={() => {
                  sounds.click();
                  navigate('/rsvp');
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.15em' }}>
                  ✨ JE PARTICIPE !
                </span>
              </ShimmerButton>

              <ShimmerButton
                variant="secondary"
                className="flex-1 h-14"
                onClick={() => {
                  sounds.click();
                  navigate('/');
                }}
              >
                <span style={{ fontSize: '10px' }}>Vraiment non</span>
              </ShimmerButton>
            </motion.div>

            {/* Final persuasive note */}
            <motion.div
              style={{
                marginTop: '20px',
                fontSize: '9px',
                color: 'rgba(248,164,200,0.5)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              Places limitées · Événement exclusif · Ne le manquez pas
            </motion.div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}