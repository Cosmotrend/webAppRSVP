import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  Trophy,
  Sparkles,
  FileText,
} from "lucide-react";
import { AuroraBackground } from "../components/AuroraBackground";
import { ParticleField } from "../components/ParticleField";
import { TopBar } from "../components/TopBar";
import { BrandStrip } from "../components/logos/BrandStrip";
import { SemilacDaysLogo } from "../components/logos/SemilacDaysLogo";
import { sounds } from "../utils/sounds";
import { callAPI } from "../utils/api";
import { t } from '../i18n';

// Étape 2 — Français uniquement
const lang = 'fr' as const;

// Legacy stub kept to minimise diff churn — unused.
function _legacyGenerateStoryImage(prize: string, ticketNumber: string, lang: 'fr' | 'ar'): Promise<Blob> {
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

import { useKioskMode } from '../utils/useKioskMode';
import { KioskFullscreenButton } from '../components/KioskFullscreenButton';

export function CouponResult() {
  useKioskMode();
  const navigate = useNavigate();
  const [prize, setPrize] = useState("-25%");
  const [ticketNumber, setTicketNumber] = useState("");
  const [devisNumber, setDevisNumber] = useState("");
  const [devisList, setDevisList] = useState<string[]>([]);
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

    // Parse wheel data — défensif contre un localStorage corrompu (extension,
    // manipulation manuelle, ancienne session). En cas d'échec, redirect home.
    let clientData = null;
    try {
      clientData = JSON.parse(wheelDataRaw);
    } catch {
      navigate('/');
      return;
    }
    setTicketNumber(clientData.ticketNumber || "SD26-XXXX");
    setDevisNumber(clientData.devisNumber || "");
    // Support multi-devis : lit le tableau devisNumbers s'il existe, sinon split la string
    const list: string[] = Array.isArray(clientData.devisNumbers) && clientData.devisNumbers.length > 0
      ? clientData.devisNumbers
      : (clientData.devisNumber || "").split(',').map((d: string) => d.trim()).filter(Boolean);
    setDevisList(list);

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

    // ═══════════════════════════════════════════════════════════
    // Confetti premium — cascade symétrique depuis les deux côtés
    // Palette rose-or-nacré, formes variées, rythme élégant
    // ═══════════════════════════════════════════════════════════
    // Palette DA : rose Semilac, rose clair, nacré, or champagne, blanc (pas de jaune criard)
    const palette = ['#E8007D', '#ff4da6', '#FFE0EF', '#D4A574', '#ffffff', '#F8A4C8'];

    // 1) Grande explosion centrale initiale (étoiles uniquement, lumineuses)
    confetti({
      particleCount: 60,
      spread: 360,
      startVelocity: 28,
      origin: { x: 0.5, y: 0.5 },
      colors: palette,
      scalar: 1.4,
      ticks: 220,
      shapes: ['star'],
      gravity: 0.6,
    });

    // 2) Cascades symétriques depuis les côtés inférieurs (effet coupe de champagne)
    const duration = 2800;
    const animationEnd = Date.now() + duration;
    const cascadeInterval = setInterval(() => {
      const remaining = animationEnd - Date.now();
      if (remaining <= 0) {
        clearInterval(cascadeInterval);
        return;
      }
      const intensity = remaining / duration; // fade out progressif
      const particleCount = Math.max(6, Math.floor(40 * intensity));

      // Canon gauche
      confetti({
        particleCount,
        angle: 60,
        spread: 65,
        startVelocity: 55,
        origin: { x: 0.08, y: 0.9 },
        colors: palette,
        scalar: 1,
        ticks: 360,
        gravity: 1.1,
        drift: 0.2,
        shapes: ['circle', 'square'],
      });

      // Canon droit
      confetti({
        particleCount,
        angle: 120,
        spread: 65,
        startVelocity: 55,
        origin: { x: 0.92, y: 0.9 },
        colors: palette,
        scalar: 1,
        ticks: 360,
        gravity: 1.1,
        drift: -0.2,
        shapes: ['circle', 'square'],
      });

      // Pluie d'étoiles douce au centre
      confetti({
        particleCount: Math.floor(particleCount * 0.4),
        angle: 90,
        spread: 120,
        startVelocity: 32,
        origin: { x: 0.5, y: 0.15 },
        colors: ['#D4A574', '#ffffff', '#FFE0EF'],
        scalar: 1.6,
        ticks: 460,
        gravity: 0.7,
        shapes: ['star'],
      });
    }, 220);

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

    return () => {
      clearInterval(interval);
      clearInterval(cascadeInterval);
    };
  }, []); // ✅ Dependency array vide

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: '#FAF7F2' }}
    >
      <KioskFullscreenButton />
      <AuroraBackground />
      <ParticleField />
      <TopBar />

      <div className="absolute top-[44px] left-0 right-0 bottom-0 flex flex-col">
        {/* Contenu scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col items-center px-5 pt-3 pb-2 text-center">
          <AnimatePresence>
            {showContent && (
              <>
                {/* Logo */}
              <motion.div
                className="mb-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <SemilacDaysLogo height={130} />
              </motion.div>

              {/* Trophy icon with rotation */}
              <motion.div
                className="mb-3"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 12,
                }}
              >
                <div
                  className="relative gpu-layer"
                  style={{ animation: 'float-y 2s ease-in-out infinite' }}
                >
                  <Trophy size={88} color="#E8007D" strokeWidth={1.5} />

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
                            Math.cos((angle * Math.PI) / 180) * 72,
                            Math.cos(((angle + 360) * Math.PI) / 180) * 72,
                          ],
                          y: [
                            Math.sin((angle * Math.PI) / 180) * 72,
                            Math.sin(((angle + 360) * Math.PI) / 180) * 72,
                          ],
                          scale: [1, 1.5, 1],
                          opacity: [1, 0.5, 1],
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                      >
                        <Sparkles size={22} color="#E8007D" />
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Bravo text */}
              <motion.div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "92px",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "#1A1005",
                  lineHeight: 1,
                  marginBottom: "16px",
                }}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                {t('couponResult', 'bravo', lang)}
              </motion.div>

              <motion.div
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  letterSpacing: "0.36em",
                  textTransform: "uppercase",
                  color: "#E8007D",
                  marginBottom: "24px",
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
                <div
                  className="gpu-layer"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "140px",
                    fontWeight: 300,
                    background: "linear-gradient(135deg, #C4157A, #E8007D, #ff4da6, #C4904A)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    lineHeight: 1,
                    position: "relative",
                    backgroundSize: "200% 200%",
                    animation: "gradient-shift 3s linear infinite",
                  }}
                >
                  -{counter}%
                </div>
              </motion.div>

              <motion.div
                style={{
                  fontSize: "26px",
                  color: "rgba(26,16,5,0.6)",
                  marginBottom: "10px",
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
                  fontSize: "22px",
                  color: "rgba(26,16,5,0.55)",
                  letterSpacing: "0.06em",
                  marginBottom: "14px",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {t('couponResult', 'onOrder', lang)}
              </motion.div>

              <motion.div
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: '#C4904A',
                  letterSpacing: "0.1em",
                  marginBottom: "28px",
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
                  width: "280px",
                  height: "3px",
                  background: "linear-gradient(90deg, transparent, rgba(232,0,125,0.3), transparent)",
                  margin: "0 auto 28px",
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              />

              {/* Traçabilité — toujours visible : CODE PROMO = ticket joué */}
              {ticketNumber && (
                <motion.div
                  className="w-full max-w-xl rounded-3xl mb-6 relative overflow-hidden"
                  style={{
                    border: "2px solid rgba(232,0,125,0.28)",
                    background: "linear-gradient(135deg, rgba(250,247,242,0.96), rgba(255,240,248,0.92))",
                    boxShadow: "0 16px 48px rgba(232,0,125,0.14), inset 0 1px 0 rgba(255,255,255,0.6)",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                >
                  {/* Shimmer premium */}
                  <div
                    className="absolute inset-0 pointer-events-none gpu-layer"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                      animation: "shimmer-slide 6s linear infinite",
                    }}
                  />

                  {/* Header */}
                  <div
                    className="flex items-center justify-center gap-3 px-7 py-5"
                    style={{
                      borderBottom: "1px solid rgba(232,0,125,0.15)",
                      background: "rgba(232,0,125,0.04)",
                    }}
                  >
                    <FileText size={24} color="#E8007D" />
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 800,
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: "#E8007D",
                      }}
                    >
                      {t('couponResult', 'traceTitle', lang)}
                    </span>
                  </div>

                  {/* Corps — grille compacte */}
                  <div className="px-7 py-6 relative">
                    {/* CODE PROMO — toujours affiché, = ticket joué */}
                    <div
                      className="flex items-center justify-between mb-5 pb-5"
                      style={{ borderBottom: devisList.length > 0 ? "1px dashed rgba(232,0,125,0.2)" : "none" }}
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles size={20} color="#E8007D" />
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: 700,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "rgba(26,16,5,0.55)",
                          }}
                        >
                          {t('couponResult', 'codeLabel', lang)}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: "'Courier New', monospace",
                          fontSize: "30px",
                          fontWeight: 800,
                          letterSpacing: "0.22em",
                          color: "#E8007D",
                          textShadow: "0 0 18px rgba(232,0,125,0.3)",
                        }}
                      >
                        {ticketNumber}
                      </span>
                    </div>

                    {/* Lignes — uniquement si des bons de commande existent */}
                    {devisList.length > 0 && (
                      <div className="space-y-3">
                        {/* Bons de commande */}
                        <div>
                          <div style={{ fontSize: "18px", color: "rgba(26,16,5,0.55)", letterSpacing: "0.03em", marginBottom: "8px" }}>
                            {devisList.length > 1
                              ? `Bons de commande (${devisList.length})`
                              : t('couponResult', 'traceDevis', lang)}
                          </div>
                          <div className="flex flex-wrap gap-2 justify-end">
                            {devisList.map((d, i) => (
                              <span
                                key={i}
                                style={{
                                  fontSize: "18px",
                                  fontFamily: "'Courier New', monospace",
                                  fontWeight: 700,
                                  color: "#C4904A",
                                  letterSpacing: "0.08em",
                                  padding: "6px 14px",
                                  borderRadius: "10px",
                                  background: "rgba(196,144,74,0.08)",
                                  border: "1px solid rgba(196,144,74,0.22)",
                                }}
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span style={{ fontSize: "18px", color: "rgba(26,16,5,0.55)", letterSpacing: "0.03em" }}>
                            {t('couponResult', 'traceReduction', lang)}
                          </span>
                          <span
                            style={{
                              fontSize: "28px",
                              fontWeight: 800,
                              color: "#E8007D",
                            }}
                          >
                            {prize}
                          </span>
                        </div>
                      </div>
                    )}

                    <div
                      className="flex items-center justify-center gap-2.5 mt-5 pt-4"
                      style={{
                        borderTop: "1px dashed rgba(232,0,125,0.15)",
                        fontSize: "14px",
                        color: "rgba(26,16,5,0.5)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      <Sparkles size={16} color="rgba(196,144,74,0.7)" />
                      {t('couponResult', 'traceAuto', lang)}
                      <Sparkles size={16} color="rgba(196,144,74,0.7)" />
                    </div>
                  </div>
                </motion.div>
              )}

              </>
            )}
          </AnimatePresence>
        </div>

        {/* Footer — flex-shrink-0 garantit qu'il ne sera jamais écrasé */}
        <div className="flex-shrink-0 flex flex-col items-center px-5 pb-3 pt-2" style={{ background: '#FAF7F2' }}>
        <motion.button
          type="button"
          onClick={() => {
            localStorage.removeItem('wheelData');
            localStorage.removeItem('wheelPrize');
            navigate('/staff-pin');
          }}
          whileTap={{ scale: 0.96 }}
          className="w-full max-w-xl rounded-3xl flex items-center justify-center gap-3"
          style={{
            padding: "24px",
            background: "linear-gradient(135deg, #E8007D, #ff4da6)",
            border: "none",
            color: "#ffffff",
            fontSize: "22px",
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "0 12px 32px rgba(232,0,125,0.4)",
            marginBottom: "20px",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <Sparkles size={24} />
          Nouveau client
        </motion.button>

        <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <BrandStrip />
        </motion.div>
      </div>
      </div>
    </div>
  );
}
