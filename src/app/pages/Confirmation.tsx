import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Gift, Ticket, Car, Sparkles, Camera, Download, MessageCircle, Calendar, MapPin } from 'lucide-react';
import { AuroraBackground } from '../components/AuroraBackground';
import { ParticleField } from '../components/ParticleField';
import { TopBar } from '../components/TopBar';
import { ShimmerButton } from '../components/ShimmerButton';
import { BrandStrip } from '../components/logos/BrandStrip';
import { sounds } from '../utils/sounds';

function generateTicketImage(ticketNumber: string, fullName: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 420;
  const ctx = canvas.getContext('2d')!;

  // Background
  const bg = ctx.createLinearGradient(0, 0, 800, 420);
  bg.addColorStop(0, '#0D0008');
  bg.addColorStop(1, '#1a0010');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 800, 420);

  // Pink glow top center
  const glow = ctx.createRadialGradient(400, 0, 0, 400, 0, 300);
  glow.addColorStop(0, 'rgba(248,164,200,0.25)');
  glow.addColorStop(1, 'rgba(248,164,200,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 800, 420);

  // Border
  ctx.strokeStyle = 'rgba(248,164,200,0.35)';
  ctx.lineWidth = 2;
  roundRect(ctx, 16, 16, 768, 388, 24);
  ctx.stroke();

  // Dashed separator
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = 'rgba(248,164,200,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(200, 16);
  ctx.lineTo(200, 404);
  ctx.stroke();
  ctx.setLineDash([]);

  // LEFT SECTION — Logo
  ctx.save();
  ctx.font = 'italic 300 52px Georgia, serif';
  const logoGrad = ctx.createLinearGradient(30, 0, 200, 0);
  logoGrad.addColorStop(0, '#c47090');
  logoGrad.addColorStop(0.5, '#F8A4C8');
  logoGrad.addColorStop(1, '#D4A574');
  ctx.fillStyle = logoGrad;
  ctx.fillText('Semilac', 30, 130);
  ctx.restore();

  ctx.font = 'bold 16px Montserrat, Arial, sans-serif';
  ctx.fillStyle = '#FFF8F5';
  ctx.letterSpacing = '6px';
  ctx.fillText('DAYS', 38, 158);

  ctx.font = '10px Arial, sans-serif';
  ctx.fillStyle = 'rgba(248,164,200,0.55)';
  ctx.fillText('14–19 MAI 2026  ·  CASABLANCA', 30, 195);
  ctx.fillText('2ÈME ÉDITION', 30, 214);

  // Little dots
  ctx.fillStyle = '#F8A4C8';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(30 + i * 16, 370, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // RIGHT SECTION
  // "BILLET D'INVITATION" label
  ctx.font = 'bold 9px Arial, sans-serif';
  ctx.fillStyle = 'rgba(248,164,200,0.5)';
  ctx.fillText('BILLET D\'INVITATION', 225, 60);

  // Client name
  ctx.font = 'italic 300 28px Georgia, serif';
  ctx.fillStyle = '#FFF8F5';
  ctx.fillText(fullName || 'Invité(e)', 225, 140);

  // Divider
  const divGrad = ctx.createLinearGradient(225, 0, 750, 0);
  divGrad.addColorStop(0, 'rgba(248,164,200,0.4)');
  divGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = divGrad;
  ctx.fillRect(225, 155, 520, 1);

  // Ticket number label
  ctx.font = 'bold 8px Arial, sans-serif';
  ctx.fillStyle = 'rgba(248,164,200,0.5)';
  ctx.fillText('NUMÉRO DE BILLET', 225, 185);

  // Ticket number
  ctx.font = 'bold 32px "Courier New", monospace';
  const ticketGrad = ctx.createLinearGradient(225, 0, 500, 0);
  ticketGrad.addColorStop(0, '#F8A4C8');
  ticketGrad.addColorStop(1, '#ffc8de');
  ctx.fillStyle = ticketGrad;
  ctx.fillText(ticketNumber, 225, 225);

  // Validity notice
  ctx.font = '10px Arial, sans-serif';
  ctx.fillStyle = 'rgba(248,164,200,0.4)';
  ctx.fillText('Valable uniquement sur place · En présence du commercial', 225, 260);

  // Stamp circle
  ctx.save();
  ctx.translate(680, 320);
  ctx.beginPath();
  ctx.arc(0, 0, 52, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(248,164,200,0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 44, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = 'bold 9px Arial';
  ctx.fillStyle = 'rgba(248,164,200,0.7)';
  ctx.textAlign = 'center';
  ctx.fillText('SEMILAC', 0, -6);
  ctx.fillText('DAYS 2026', 0, 8);
  ctx.restore();

  return canvas.toDataURL('image/png');
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function Confirmation() {
  const navigate = useNavigate();
  const [ticketNumber, setTicketNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [showContent, setShowContent] = useState(false);

  const handleDownloadTicket = useCallback(() => {
    sounds.click();
    const imgData = generateTicketImage(ticketNumber, fullName);
    const link = document.createElement('a');
    link.download = `ticket-semilac-${ticketNumber}.png`;
    link.href = imgData;
    link.click();
  }, [ticketNumber, fullName]);

  const handleWhatsApp = useCallback(() => {
    sounds.click();
    const phone = whatsapp.replace(/\D/g, '');
    const text = encodeURIComponent(
      `🎫 Mon billet Semilac Days 2026\n\nN° Billet : ${ticketNumber}\n📅 14-19 Mai 2026 · Casablanca\n\nPrésentez ce message à votre commercial le jour J pour accéder à la Roue de la Fortune 🎡`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  }, [ticketNumber, whatsapp]);

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

              {/* Save ticket — download + WhatsApp */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.6, type: 'spring', stiffness: 200 }}
              >
                <div
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'rgba(248,164,200,0.5)',
                    textAlign: 'center',
                    marginBottom: '12px',
                  }}
                >
                  Sauvegardez votre billet
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Télécharger image */}
                  <motion.button
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl p-4 relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(248,164,200,0.15), rgba(212,165,116,0.1))',
                      border: '1.5px solid rgba(248,164,200,0.35)',
                      boxShadow: '0 8px 24px rgba(248,164,200,0.2)',
                      minHeight: '80px',
                    }}
                    whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(248,164,200,0.35)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleDownloadTicket}
                  >
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Download size={22} color="#F8A4C8" />
                    </motion.div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#FFF8F5', letterSpacing: '0.06em' }}>
                      Télécharger
                    </div>
                    <div style={{ fontSize: '8px', color: 'rgba(248,164,200,0.5)', letterSpacing: '0.04em' }}>
                      Image PNG
                    </div>
                  </motion.button>

                  {/* WhatsApp */}
                  <motion.button
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl p-4 relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(37,211,102,0.12), rgba(37,211,102,0.06))',
                      border: '1.5px solid rgba(37,211,102,0.3)',
                      boxShadow: '0 8px 24px rgba(37,211,102,0.15)',
                      minHeight: '80px',
                    }}
                    whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(37,211,102,0.25)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleWhatsApp}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <MessageCircle size={22} color="#25D366" />
                    </motion.div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#FFF8F5', letterSpacing: '0.06em' }}>
                      WhatsApp
                    </div>
                    <div style={{ fontSize: '8px', color: 'rgba(37,211,102,0.6)', letterSpacing: '0.04em' }}>
                      Sauvegarder
                    </div>
                  </motion.button>
                </div>

                <motion.div
                  className="mt-3 text-center"
                  style={{ fontSize: '9px', color: 'rgba(255,248,245,0.35)', lineHeight: 1.5 }}
                >
                  Présentez votre billet à votre commercial{' '}
                  <span style={{ color: '#D4A574', fontWeight: 600 }}>le jour J</span>
                  {' '}pour la{' '}
                  <span style={{ color: '#F8A4C8', fontWeight: 600 }}>Roue de la Fortune 🎡</span>
                </motion.div>
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

              {/* Brand strip */}
              <motion.div
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2 }}
              >
                <BrandStrip />
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}