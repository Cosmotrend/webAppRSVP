import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Gift, Ticket, Car, GraduationCap, Sparkles, MessageCircle, Calendar, MapPin, Settings, Camera } from 'lucide-react';
import { AuroraBackground } from '../components/AuroraBackground';
import { ParticleField } from '../components/ParticleField';
import { TopBar } from '../components/TopBar';
import { ShimmerButton } from '../components/ShimmerButton';
import { SemilacDaysLogo } from '../components/logos/SemilacDaysLogo';
import { BrandStrip } from '../components/logos/BrandStrip';
import { sounds } from '../utils/sounds';
import { useLang, t } from '../i18n';

export function Confirmation() {
  const navigate = useNavigate();
  const [ticketNumber, setTicketNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [showContent, setShowContent] = useState(false);
  const { lang } = useLang();

  const handleWhatsApp = useCallback(() => {
    sounds.click();
    const digits = whatsapp.replace(/\D/g, '');
    // Normalize Moroccan number: 06XXXXXXXX or 07XXXXXXXX → 2126XXXXXXXX / 2127XXXXXXXX
    const phone = digits.startsWith('212')
      ? digits
      : digits.startsWith('0')
      ? '212' + digits.slice(1)
      : '212' + digits;
    const msg = lang === 'ar'
      ? `🎫 التيكي ديالي Semilac Days 2026\n\nرقم التيكي : ${ticketNumber}\n📅 14-19 ماي 2026 · الدار البيضاء\n\nوري هاد الميساج للممثل التجاري نهار الحدث باش تدخل لعجلة الحظ 🎡`
      : `🎫 Mon billet Semilac Days 2026\n\nN° Billet : ${ticketNumber}\n📅 14-19 Mai 2026 · Casablanca\n\nPrésentez ce message à votre commercial le jour J pour accéder à la Roue de la Fortune 🎡`;
    const text = encodeURIComponent(msg);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  }, [ticketNumber, whatsapp, lang]);

  useEffect(() => {
    // Route guard
    const rsvpRaw = localStorage.getItem('rsvpData');
    if (!rsvpRaw) {
      navigate('/');
      return;
    }

    sounds.success();

    const rsvpData = rsvpRaw;
    if (rsvpData) {
      const data = JSON.parse(rsvpData);
      setTicketNumber(data.ticketNumber);
      setFullName(data.fullName || '');
      setWhatsapp(data.whatsapp || '');
    }

    // Delay content reveal
    setTimeout(() => setShowContent(true), 500);

    // Epic confetti show
    const duration = 1500;
    const animationEnd = Date.now() + duration;
    const colors = ['#E8007D', '#ff4da6', '#FFE0EF', '#C4904A', '#ffffff'];

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
      title: t('confirmation', 'perk1', lang),
      desc: t('confirmation', 'perk1Desc', lang),
      color: '#E8007D',
      badge: '-25%',
    },
    {
      icon: <Ticket size={22} />,
      title: t('confirmation', 'perk2', lang),
      desc: t('confirmation', 'perk2Desc', lang),
      color: '#ff4da6',
      badge: null,
    },
    {
      icon: <Car size={22} />,
      title: t('confirmation', 'perk3', lang),
      desc: t('confirmation', 'perk3Desc', lang),
      color: '#C4904A',
      badge: null,
    },
    {
      icon: <GraduationCap size={22} />,
      title: t('confirmation', 'perk4', lang),
      desc: t('confirmation', 'perk4Desc', lang),
      color: '#8B5CF6',
      badge: null,
    },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#FAF7F2' }}>
      <AuroraBackground />
      <ParticleField />
      <TopBar />

      <AnimatePresence>
        {showContent && (
          <motion.div
            className="absolute top-[44px] left-0 right-0 bottom-0 px-4 pt-4 pb-2 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="rounded-3xl p-8 text-center backdrop-blur-xl relative"
              style={{
                background: 'rgba(250,247,242,0.92)',
                border: '1px solid rgba(232,0,125,0.22)',
                boxShadow: '0 8px 40px rgba(232,0,125,0.14)',
              }}
            >
              {/* Logo */}
              <motion.div
                className="flex justify-center mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <SemilacDaysLogo height={68} />
              </motion.div>

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
                    background: 'radial-gradient(circle, rgba(232,0,125,0.12), transparent)',
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
                      borderColor: i === 0 ? '#E8007D' : i === 1 ? '#ff4da6' : '#C4904A',
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
                    stroke="#E8007D"
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
                  fontSize: '30px',
                  fontWeight: 400,
                  color: '#1A1005',
                  marginBottom: '6px',
                  lineHeight: 1.2,
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                {fullName ? (
                  lang === 'ar' ? (
                    <>
                      {t('confirmation', 'title', lang)}
                      <span style={{ color: '#E8007D', fontStyle: 'italic' }}>
                        {fullName.trim().split(/\s+/)[0]}
                      </span>
                    </>
                  ) : (
                    <>
                      <span style={{ color: '#E8007D', fontStyle: 'italic' }}>
                        {fullName.trim().split(/\s+/)[0]}
                      </span>
                      {t('confirmation', 'title', lang)}
                    </>
                  )
                ) : (
                  t('confirmation', 'titleFallback', lang)
                )}
              </motion.div>

              <motion.div
                style={{
                  fontSize: '12px',
                  color: 'rgba(26,16,5,0.55)',
                  marginBottom: '24px',
                  letterSpacing: '0.08em',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                {t('confirmation', 'subtitle', lang)}
              </motion.div>

              {/* Animated divider */}
              <motion.div
                style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(232,0,125,0.3), transparent)',
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
                  <Sparkles size={14} color="#E8007D" />
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: 'rgba(232,0,125,0.55)',
                    }}
                  >
                    {t('confirmation', 'ticketLabel', lang)}
                  </span>
                  <Sparkles size={14} color="#E8007D" />
                </motion.div>

                <motion.div
                  className="inline-block rounded-2xl relative overflow-hidden mb-6"
                  style={{
                    padding: '16px 32px',
                    background: 'rgba(232,0,125,0.06)',
                    border: '2px solid rgba(232,0,125,0.2)',
                    boxShadow: '0 8px 32px rgba(248,164,200,0.2)',
                  }}
                  whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(232,0,125,0.12)' }}
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
                      color: '#E8007D',
                      textShadow: '0 0 30px rgba(232,0,125,0.4)',
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
                      background: 'rgba(232,0,125,0.04)',
                      border: '1px solid rgba(232,0,125,0.16)',
                    }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.9 + i * 0.15, type: 'spring' }}
                    whileHover={{
                      scale: 1.03,
                      background: 'rgba(232,0,125,0.06)',
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

                    <div className="flex-1 text-start relative">
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#1A1005',
                          marginBottom: '2px',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {perk.title}
                      </div>
                      {perk.desc && (
                        <div style={{ fontSize: '10px', color: 'rgba(26,16,5,0.55)' }}>
                          {perk.desc}
                        </div>
                      )}
                    </div>
                    {perk.badge && (
                      <motion.div
                        style={{
                          fontSize: '13px',
                          fontWeight: 800,
                          color: '#fff',
                          background: 'linear-gradient(135deg, #C4157A, #E8007D)',
                          borderRadius: '100px',
                          padding: '4px 10px',
                          letterSpacing: '0.04em',
                          boxShadow: '0 4px 12px rgba(232,0,125,0.4)',
                          flexShrink: 0,
                        }}
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {perk.badge}
                      </motion.div>
                    )}
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
                    <Calendar size={16} color="#C4904A" />
                    <span style={{ fontSize: '11px', color: '#1A1005', fontWeight: 600 }}>
                      {t('rsvp', 'dates', lang)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} color="#C4904A" />
                    <span style={{ fontSize: '11px', color: '#1A1005', fontWeight: 600 }}>
                      {t('rsvp', 'location', lang)}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Instruction Roue — bannière proéminente */}
              <motion.div
                className="mb-6 px-4 py-4 rounded-2xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(232,0,125,0.10), rgba(196,21,122,0.08))',
                  border: '1.5px solid rgba(232,0,125,0.3)',
                  boxShadow: '0 4px 20px rgba(232,0,125,0.12)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(232,0,125,0.06), transparent)',
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
                <div className="relative flex items-center gap-3">
                  <span style={{ fontSize: '24px' }}>🎡</span>
                  <div className="text-start">
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#E8007D', letterSpacing: '0.04em', marginBottom: '2px' }}>
                      {t('confirmation', 'wheelReminder', lang)}
                    </div>
                    <div style={{ fontSize: '10px', color: 'rgba(26,16,5,0.55)', lineHeight: 1.5 }}>
                      {t('confirmation', 'wheelReminderDesc', lang)} <span style={{ fontWeight: 700, color: '#C4904A' }}>{t('confirmation', 'dayJ', lang)}</span> {t('confirmation', 'wheelAccess', lang)}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Masterclass block */}
              <motion.div
                className="mb-6 px-4 py-4 rounded-2xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(139,92,246,0.04))',
                  border: '1.5px solid rgba(139,92,246,0.25)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.6 }}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap size={22} color="#8B5CF6" style={{ flexShrink: 0 }} />
                  <div className="text-start">
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#8B5CF6', letterSpacing: '0.04em', marginBottom: '2px' }}>
                      {t('confirmation', 'masterclassTitle', lang)}
                    </div>
                    <div style={{ fontSize: '10px', color: 'rgba(26,16,5,0.6)', lineHeight: 1.5 }}>
                      {t('confirmation', 'masterclassDesc', lang)}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Save ticket — screenshot + WhatsApp */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.8, type: 'spring', stiffness: 200 }}
              >
                <div
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'rgba(232,0,125,0.55)',
                    textAlign: 'center',
                    marginBottom: '12px',
                  }}
                >
                  {t('confirmation', 'saveTicket', lang)}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Screenshot hint */}
                  <div
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl p-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(248,164,200,0.15), rgba(212,165,116,0.1))',
                      border: '1.5px solid rgba(232,0,125,0.25)',
                      minHeight: '80px',
                    }}
                  >
                    <Camera size={22} color="#E8007D" />
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#1A1005', letterSpacing: '0.06em', textAlign: 'center' }}>
                      {t('confirmation', 'screenshotHint', lang)}
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <motion.button
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl p-4 relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(232,0,125,0.10), rgba(196,21,122,0.07))',
                      border: '1.5px solid rgba(232,0,125,0.25)',
                      boxShadow: '0 8px 24px rgba(232,0,125,0.12)',
                      minHeight: '80px',
                    }}
                    whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(232,0,125,0.22)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleWhatsApp}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <MessageCircle size={22} color="#E8007D" />
                    </motion.div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#1A1005', letterSpacing: '0.06em' }}>
                      {t('confirmation', 'whatsappSave', lang)}
                    </div>
                    <div style={{ fontSize: '8px', color: 'rgba(232,0,125,0.5)', letterSpacing: '0.04em' }}>
                      {t('confirmation', 'whatsappSub', lang)}
                    </div>
                  </motion.button>
                </div>

              </motion.div>

            </div>

            {/* Brand strip — outside the card for consistent sizing */}
            <motion.div
              className="mt-6 pb-6 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.2 }}
            >
              <BrandStrip />
            </motion.div>

            {/* Discreet staff access — small icon at the very bottom */}
            <motion.div
              className="flex justify-center pb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              transition={{ delay: 4 }}
            >
              <motion.button
                onClick={() => navigate('/staff-pin')}
                aria-label="Accès staff"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(26,16,5,0.04)',
                  border: '1px solid rgba(26,16,5,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                }}
                whileTap={{ scale: 0.85 }}
              >
                <Settings size={14} color="rgba(26,16,5,0.3)" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
