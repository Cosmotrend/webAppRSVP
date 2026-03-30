import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Gift, Ticket, Car, Sparkles, Camera, Calendar, MapPin } from 'lucide-react';
import { AuroraBackground } from '../components/AuroraBackground';
import { ParticleField } from '../components/ParticleField';
import { TopBar } from '../components/TopBar';
import { ShimmerButton } from '../components/ShimmerButton';
import { PageTransition } from '../components/PageTransition';
import { sounds } from '../utils/sounds';

export function Confirmation() {
  const navigate = useNavigate();
  const [ticketNumber, setTicketNumber] = useState('');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    sounds.success();

    const rsvpData = localStorage.getItem('rsvpData');
    if (rsvpData) {
      const data = JSON.parse(rsvpData);
      setTicketNumber(data.ticketNumber);
    }

    // Delay content reveal
    setTimeout(() => setShowContent(true), 500);

    // Epic confetti show
    const duration = 4000;
    const animationEnd = Date.now() + duration;
    const colors = ['#F8A4C8', '#ffdaec', '#D4A574', '#c47090', '#ffc8de'];

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.6 },
        colors: colors,
        gravity: 1,
        ticks: 300,
        shapes: ['circle', 'square'],
        scalar: randomInRange(0.8, 1.2),
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.6 },
        colors: colors,
        gravity: 1,
        ticks: 300,
        shapes: ['circle', 'square'],
        scalar: randomInRange(0.8, 1.2),
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []); // ✅ Ajout dependency array vide

  const perks = [
    {
      icon: <Gift size={22} />,
      title: 'Coupon -25% exclusif',
      desc: 'Sur commandes durant l\'événement',
      color: '#F8A4C8',
    },
    {
      icon: <Ticket size={22} />,
      title: 'Ticket tombola offert',
      desc: 'Participez au grand tirage',
      color: '#ffc8de',
    },
    {
      icon: <Car size={22} />,
      title: 'VTC privé offert',
      desc: 'Transport premium inclus',
      color: '#D4A574',
    },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#0D0008' }}>
      <AuroraBackground />
      <ParticleField />
      <TopBar rightText="" />

      <AnimatePresence>
        {showContent && (
          <motion.div
            className="absolute top-[44px] left-0 right-0 bottom-0 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="rounded-3xl p-8 text-center h-full backdrop-blur-xl overflow-y-auto relative"
              style={{
                background: 'rgba(20,5,15,0.88)',
                border: '1px solid rgba(248,164,200,0.18)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              {/* Success animation */}
              <motion.div
                className="relative mx-auto mb-6"
                style={{ width: '80px', height: '80px' }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              >
                {/* Outer glow ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(248,164,200,0.3), transparent)',
                    filter: 'blur(20px)',
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Animated rings */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2"
                    style={{
                      borderColor: i === 0 ? '#F8A4C8' : i === 1 ? '#ffc8de' : '#D4A574',
                      borderTopColor: 'transparent',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3 - i * 0.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                ))}

                {/* Checkmark */}
                <svg width="80" height="80" viewBox="0 0 80 80" className="relative">
                  <motion.polyline
                    points="20,40 35,55 60,25"
                    stroke="#F8A4C8"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  />
                </svg>
              </motion.div>

              {/* Title */}
              <motion.div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '32px',
                  fontWeight: 400,
                  color: '#FFF8F5',
                  marginBottom: '8px',
                  lineHeight: 1.2,
                  textShadow: '0 2px 20px rgba(248,164,200,0.3)',
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                Votre place est réservée
              </motion.div>

              <motion.div
                style={{
                  fontSize: '12px',
                  color: 'rgba(255,248,245,0.4)',
                  marginBottom: '24px',
                  letterSpacing: '0.08em',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                Nous avons hâte de vous accueillir
              </motion.div>

              {/* Animated divider */}
              <motion.div
                style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(248,164,200,0.4), transparent)',
                  marginBottom: '20px',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.3, duration: 0.8 }}
              />

              {/* Ticket number */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <motion.div
                  className="flex items-center justify-center gap-2 mb-3"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles size={14} color="#F8A4C8" />
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,248,245,0.3)',
                    }}
                  >
                    Numéro de billet
                  </span>
                  <Sparkles size={14} color="#F8A4C8" />
                </motion.div>

                <motion.div
                  className="inline-block rounded-2xl relative overflow-hidden mb-6"
                  style={{
                    padding: '16px 32px',
                    background: 'rgba(248,164,200,0.08)',
                    border: '2px solid rgba(248,164,200,0.25)',
                    boxShadow: '0 8px 32px rgba(248,164,200,0.2)',
                  }}
                  whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(248,164,200,0.3)' }}
                >
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />

                  <motion.div
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: '26px',
                      fontWeight: 700,
                      letterSpacing: '0.2em',
                      color: '#F8A4C8',
                      textShadow: '0 0 30px rgba(248,164,200,0.5)',
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.7, type: 'spring' }}
                  >
                    {ticketNumber}
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Perks with staggered animation */}
              <div className="flex flex-col gap-3 mb-6">
                {perks.map((perk, i) => (
                  <motion.div
                    key={i}
                    className="relative flex items-center gap-4 px-4 py-4 rounded-2xl overflow-hidden group"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.9 + i * 0.15, type: 'spring' }}
                    whileHover={{
                      scale: 1.03,
                      background: 'rgba(248,164,200,0.08)',
                      borderColor: 'rgba(248,164,200,0.2)',
                    }}
                  >
                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle at 0% 50%, ${perk.color}20, transparent)`,
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    <motion.div
                      className="flex-shrink-0"
                      style={{ color: perk.color }}
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      {perk.icon}
                    </motion.div>

                    <div className="flex-1 text-left relative">
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#FFF8F5',
                          marginBottom: '2px',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {perk.title}
                      </div>
                      {perk.desc && (
                        <div style={{ fontSize: '10px', color: 'rgba(255,248,245,0.4)' }}>
                          {perk.desc}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Event Info */}
              <motion.div
                className="mb-6 p-4 rounded-2xl relative overflow-hidden"
                style={{
                  background: 'rgba(212,165,116,0.08)',
                  border: '1px solid rgba(212,165,116,0.2)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.4 }}
              >
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} color="#D4A574" />
                    <span style={{ fontSize: '11px', color: '#FFF8F5', fontWeight: 600 }}>
                      14-19 MAI 2026
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} color="#D4A574" />
                    <span style={{ fontSize: '11px', color: '#FFF8F5', fontWeight: 600 }}>
                      CASABLANCA
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Screenshot Instruction - MOST IMPORTANT */}
              <motion.div
                className="mb-6 p-6 rounded-3xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(248,164,200,0.15), rgba(212,165,116,0.15))',
                  border: '2px solid rgba(248,164,200,0.4)',
                  boxShadow: '0 8px 32px rgba(248,164,200,0.3), inset 0 0 60px rgba(248,164,200,0.1)',
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.6, type: 'spring', stiffness: 200 }}
              >
                {/* Pulsing glow */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(248,164,200,0.2), transparent)',
                    filter: 'blur(40px)',
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Animated camera icon */}
                <motion.div
                  className="mx-auto mb-3 flex justify-center"
                  animate={{
                    y: [0, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    className="p-3 rounded-full relative"
                    style={{
                      background: 'rgba(248,164,200,0.2)',
                      border: '2px solid rgba(248,164,200,0.5)',
                    }}
                  >
                    <Camera size={24} color="#F8A4C8" />
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: '2px solid rgba(248,164,200,0.4)',
                      }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                </motion.div>

                <div className="relative text-center">
                  <motion.div
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#F8A4C8',
                      marginBottom: '8px',
                      textShadow: '0 2px 10px rgba(248,164,200,0.5)',
                    }}
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    📸 Prenez une capture d'écran !
                  </motion.div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'rgba(255,248,245,0.8)',
                      lineHeight: 1.5,
                      letterSpacing: '0.02em',
                    }}
                  >
                    Présentez cette page à votre commercial{' '}
                    <span style={{ fontWeight: 700, color: '#D4A574' }}>le jour J</span>
                    <br />
                    pour accéder à la{' '}
                    <span style={{ fontWeight: 700, color: '#F8A4C8' }}>
                      Roue de la Fortune
                    </span>{' '}
                    🎡
                  </div>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.8 }}
              >
                <ShimmerButton className="w-full h-14" onClick={() => {
                  sounds.click();
                  navigate('/rsvp');
                }}>
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles size={16} />
                    Compris ! ✨
                  </span>
                </ShimmerButton>

              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}