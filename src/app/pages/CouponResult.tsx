import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  Trophy,
  Sparkles,
  Camera,
  FileText,
  Share2,
} from "lucide-react";
import { AuroraBackground } from "../components/AuroraBackground";
import { ParticleField } from "../components/ParticleField";
import { TopBar } from "../components/TopBar";
import { BrandStrip } from "../components/logos/BrandStrip";
import { SemilacDaysLogo } from "../components/logos/SemilacDaysLogo";
import { sounds } from "../utils/sounds";
import { callAPI } from "../utils/api";
import { useLang, t } from '../i18n';

function generateStoryImage(prize: string, ticketNumber: string, lang: 'fr' | 'ar'): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d')!;

  const texts = lang === 'ar' ? {
    subtitle: 'تخفيض حصري',
    code: 'الكود ديالي',
    event: '14-19 ماي 2026 · الدار البيضاء',
    edition: 'الطبعة الثانية',
    cta: '!جيو معانا',
  } : {
    subtitle: 'de réduction exclusive',
    code: 'MON CODE',
    event: '14-19 Mai 2026 · Casablanca',
    edition: '2ème Édition',
    cta: 'Rejoignez-nous !',
  };

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, '#FAF7F2');
  bg.addColorStop(0.5, '#FFF0F5');
  bg.addColorStop(1, '#FAF7F2');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1920);

  // Decorative circles
  ctx.fillStyle = 'rgba(232,0,125,0.06)';
  ctx.beginPath(); ctx.arc(540, 400, 300, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(196,144,74,0.05)';
  ctx.beginPath(); ctx.arc(540, 1400, 250, 0, Math.PI * 2); ctx.fill();

  // Top badge
  ctx.font = 'bold 28px Arial, sans-serif';
  ctx.fillStyle = 'rgba(232,0,125,0.5)';
  ctx.textAlign = 'center';
  ctx.fillText('SEMILAC DAYS 2026', 540, 520);

  // Prize
  ctx.font = 'italic 180px Georgia, serif';
  ctx.fillStyle = '#E8007D';
  ctx.fillText(prize, 540, 850);

  // Subtitle
  ctx.font = '600 36px Arial, sans-serif';
  ctx.fillStyle = 'rgba(26,16,5,0.6)';
  ctx.fillText(texts.subtitle, 540, 940);

  // Divider
  const divGrad = ctx.createLinearGradient(340, 0, 740, 0);
  divGrad.addColorStop(0, 'transparent');
  divGrad.addColorStop(0.5, 'rgba(232,0,125,0.4)');
  divGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = divGrad;
  ctx.fillRect(340, 1010, 400, 2);

  // Code
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.fillStyle = 'rgba(232,0,125,0.4)';
  ctx.fillText(texts.code, 540, 1090);
  ctx.font = 'bold 52px "Courier New", monospace';
  ctx.fillStyle = '#E8007D';
  ctx.fillText(ticketNumber, 540, 1160);

  // Event info
  ctx.font = '600 26px Arial, sans-serif';
  ctx.fillStyle = '#C4904A';
  ctx.fillText(texts.event, 540, 1280);
  ctx.fillText(texts.edition, 540, 1320);

  // CTA
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.fillStyle = 'rgba(232,0,125,0.6)';
  ctx.fillText(texts.cta, 540, 1480);

  // Bottom dots
  ctx.fillStyle = '#E8007D';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(470 + i * 28, 1560, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });
}

export function CouponResult() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const [prize, setPrize] = useState("-25%");
  const [ticketNumber, setTicketNumber] = useState("");
  const [devisNumber, setDevisNumber] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [counter, setCounter] = useState(0);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    // Route guard
    const wheelDataRaw = localStorage.getItem("wheelData");
    const savedPrize = localStorage.getItem("wheelPrize");
    if (!wheelDataRaw || !savedPrize) {
      navigate("/");
      return;
    }

    setPrize(savedPrize);

    // Parse wheel data
    let clientData = null;
    if (wheelDataRaw) {
      clientData = JSON.parse(wheelDataRaw);
      setTicketNumber(clientData.ticketNumber || "SD26-XXXX");
      setDevisNumber(clientData.devisNumber || "");
    }

    // Register result in Google Sheets ONCE
    const registerResult = async () => {
      if (clientData && savedPrize && !registered) {
        try {
          await callAPI({
            action: "register",
            ticket: clientData.ticketNumber,
            devisNumber: clientData.devisNumber,
            discount: savedPrize,
            status: "FINAL",
          });
          setRegistered(true);
        } catch (error) {
          console.error("Erreur enregistrement:", error);
        }
      }
    };

    registerResult();

    sounds.win();

    // Confetti celebration
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const colors = ['#E8007D', '#ff4da6', '#FFE0EF', '#C4904A', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 90,
        origin: { x: 0, y: 0.5 },
        colors: colors,
        gravity: 1.2,
        ticks: 400,
        scalar: 1.2,
        shapes: ["circle", "square"],
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 90,
        origin: { x: 1, y: 0.5 },
        colors: colors,
        gravity: 1.2,
        ticks: 400,
        scalar: 1.2,
        shapes: ["circle", "square"],
      });
      confetti({
        particleCount: 4,
        angle: 90,
        spread: 120,
        origin: { x: 0.5, y: 0.2 },
        colors: colors,
        gravity: 0.8,
        ticks: 500,
        scalar: 1.5,
        shapes: ["star"],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Reveal content after brief delay
    setTimeout(() => setShowContent(true), 300);

    // Animated counter for discount
    const prizeValue = parseInt(
      savedPrize?.replace(/[^0-9]/g, "") || "25",
    );
    let current = 0;
    const interval = setInterval(() => {
      if (current < prizeValue) {
        current += 1;
        setCounter(current);
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []); // ✅ Dependency array vide

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: '#FAF7F2' }}
    >
      <AuroraBackground />
      <ParticleField />
      <TopBar />

      <div className="absolute top-[44px] left-0 right-0 bottom-0 overflow-y-auto flex flex-col items-center justify-start pt-6 px-5 text-center pb-8">
        <AnimatePresence>
          {showContent && (
            <>
              {/* Logo */}
              <motion.div
                className="mb-5"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <SemilacDaysLogo height={68} />
              </motion.div>

              {/* Trophy icon with rotation */}
              <motion.div
                className="mb-5"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 12,
                }}
              >
                <motion.div
                  className="relative"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy size={60} color="#E8007D" strokeWidth={1.5} />

                  {/* Orbiting sparkles */}
                  {[0, 1, 2, 3].map((i) => {
                    const angle = (360 / 4) * i;
                    return (
                      <motion.div
                        key={i}
                        className="absolute"
                        style={{ top: "50%", left: "50%" }}
                        animate={{
                          x: [
                            Math.cos((angle * Math.PI) / 180) * 40,
                            Math.cos(((angle + 360) * Math.PI) / 180) * 40,
                          ],
                          y: [
                            Math.sin((angle * Math.PI) / 180) * 40,
                            Math.sin(((angle + 360) * Math.PI) / 180) * 40,
                          ],
                          scale: [1, 1.5, 1],
                          opacity: [1, 0.5, 1],
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                      >
                        <Sparkles size={12} color="#E8007D" />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>

              {/* Bravo text */}
              <motion.div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "64px",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "#1A1005",
                  lineHeight: 1,
                  marginBottom: "12px",
                }}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                {t('couponResult', 'bravo', lang)}
              </motion.div>

              <motion.div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.36em",
                  textTransform: "uppercase",
                  color: "#E8007D",
                  marginBottom: "20px",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {t('couponResult', 'youWon', lang)}
              </motion.div>

              {/* Animated prize percentage */}
              <motion.div
                className="relative mb-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 150 }}
              >
                <motion.div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "92px",
                    fontWeight: 300,
                    background: "linear-gradient(135deg, #C4157A, #E8007D, #ff4da6, #C4904A)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    lineHeight: 1,
                    position: "relative",
                    backgroundSize: "200% 200%",
                  }}
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  -{counter}%
                </motion.div>
              </motion.div>

              <motion.div
                style={{
                  fontSize: "14px",
                  color: "rgba(26,16,5,0.6)",
                  marginBottom: "4px",
                  fontWeight: 600,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {t('couponResult', 'reduction', lang)}
              </motion.div>

              <motion.div
                style={{
                  fontSize: "12px",
                  color: "rgba(26,16,5,0.55)",
                  letterSpacing: "0.06em",
                  marginBottom: "6px",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {t('couponResult', 'onOrder', lang)}
              </motion.div>

              <motion.div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: '#C4904A',
                  letterSpacing: "0.1em",
                  marginBottom: "24px",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                {t('couponResult', 'validUntil', lang)}
              </motion.div>

              {/* Animated divider */}
              <motion.div
                style={{
                  width: "180px",
                  height: "2px",
                  background: "linear-gradient(90deg, transparent, rgba(232,0,125,0.3), transparent)",
                  margin: "0 auto 24px",
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              />

              {/* Coupon code */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                <motion.div
                  className="flex items-center justify-center gap-2 mb-3"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles size={14} color="#E8007D" />
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "rgba(26,16,5,0.55)",
                    }}
                  >
                    {t('couponResult', 'codeLabel', lang)}
                  </span>
                  <Sparkles size={14} color="#E8007D" />
                </motion.div>

                <motion.div
                  className="inline-block rounded-2xl relative overflow-hidden mb-6"
                  style={{
                    padding: "16px 40px",
                    background: "rgba(232,0,125,0.06)",
                    border: "2px solid rgba(232,0,125,0.32)",
                    boxShadow: "0 8px 32px rgba(232,0,125,0.14)",
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6, type: "spring" }}
                  whileHover={{ scale: 1.05, boxShadow: "0 12px 40px rgba(232,0,125,0.2)" }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />

                  <motion.div
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: "22px",
                      fontWeight: 700,
                      letterSpacing: "0.28em",
                      color: "#E8007D",
                      textShadow: "0 0 20px rgba(232,0,125,0.3)",
                      position: "relative",
                    }}
                  >
                    {ticketNumber}
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* CTA Box */}
              <motion.div
                className="w-full max-w-sm px-5 py-4 rounded-2xl mb-3 relative"
                style={{
                  border: "1.5px solid rgba(232,0,125,0.3)",
                  background: "linear-gradient(135deg, rgba(232,0,125,0.08), rgba(196,21,122,0.05))",
                  boxShadow: "0 4px 20px rgba(232,0,125,0.10)",
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(232,0,125,0.18)" }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
                <div className="relative flex items-center gap-4">
                  <motion.div
                    className="flex-shrink-0"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Camera size={26} color="#E8007D" />
                  </motion.div>
                  <div className="text-left">
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#E8007D",
                        letterSpacing: "0.02em",
                        marginBottom: "3px",
                      }}
                    >
                      {t('couponResult', 'screenshot', lang)}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "rgba(26,16,5,0.55)",
                        lineHeight: 1.4,
                      }}
                    >
                      {t('couponResult', 'screenshotDesc', lang)}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Traçabilité : Ticket + Devis */}
              {devisNumber && (
                <motion.div
                  className="w-full max-w-sm px-5 py-4 rounded-2xl mb-5 relative"
                  style={{
                    border: "1px solid rgba(232,0,125,0.22)",
                    background: "rgba(250,247,242,0.92)",
                    boxShadow: "0 4px 20px rgba(232,0,125,0.10)",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={16} color="#E8007D" />
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#E8007D",
                      }}
                    >
                      {t('couponResult', 'traceTitle', lang)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: "10px", color: "rgba(26,16,5,0.55)" }}>
                        {t('couponResult', 'traceTicket', lang)}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontFamily: "'Courier New', monospace",
                          fontWeight: 600,
                          color: "#1A1005",
                        }}
                      >
                        {ticketNumber}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: "10px", color: "rgba(26,16,5,0.55)" }}>
                        {t('couponResult', 'traceDevis', lang)}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontFamily: "'Courier New', monospace",
                          fontWeight: 600,
                          color: "#C4904A",
                        }}
                      >
                        {devisNumber}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: "10px", color: "rgba(26,16,5,0.55)" }}>
                        {t('couponResult', 'traceReduction', lang)}
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#E8007D",
                        }}
                      >
                        {prize}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: "8px",
                      color: "rgba(26,16,5,0.5)",
                      marginTop: "12px",
                      textAlign: "center",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {t('couponResult', 'traceAuto', lang)}
                  </div>
                </motion.div>
              )}

              {/* Partage Instagram Story */}
              <motion.div
                className="w-full max-w-sm mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 }}
              >
                <motion.button
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(232,0,125,0.12), rgba(196,21,122,0.08))',
                    border: '1.5px solid rgba(232,0,125,0.3)',
                    boxShadow: '0 4px 16px rgba(232,0,125,0.12)',
                  }}
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(232,0,125,0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={async () => {
                    try {
                      const blob = await generateStoryImage(prize, ticketNumber, lang);
                      const file = new File([blob], 'semilac-days-gain.png', { type: 'image/png' });

                      if (navigator.share && navigator.canShare?.({ files: [file] })) {
                        const shareText = lang === 'ar'
                          ? `ربحت ${prize} فعجلة الحظ ديال Semilac Days!`
                          : `J'ai gagné ${prize} à la Roue de la Fortune Semilac Days !`;
                        await navigator.share({
                          files: [file],
                          title: 'Semilac Days 2026',
                          text: shareText,
                        });
                      } else {
                        // Fallback : télécharger l'image
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'semilac-days-gain.png';
                        a.click();
                        URL.revokeObjectURL(url);
                      }
                    } catch (e) {
                      console.log('Partage annulé', e);
                    }
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Share2 size={20} color="#E8007D" />
                  </motion.div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#1A1005', letterSpacing: '0.06em' }}>
                    {t('couponResult', 'shareStory', lang)}
                  </span>
                </motion.button>
              </motion.div>

              {/* Brand strip */}
              <motion.div
                className="w-full max-w-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.4 }}
              >
                <BrandStrip />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
