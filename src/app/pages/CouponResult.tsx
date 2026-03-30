import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  Trophy,
  Sparkles,
  Camera,
  FileText,
  MessageCircle,
} from "lucide-react";
import { AuroraBackground } from "../components/AuroraBackground";
import { ParticleField } from "../components/ParticleField";
import { TopBar } from "../components/TopBar";
import { BrandStrip } from "../components/logos/BrandStrip";
import { SemilacDaysLogo } from "../components/logos/SemilacDaysLogo";
import { sounds } from "../utils/sounds";
import { callAPI } from "../utils/api";

export function CouponResult() {
  const navigate = useNavigate();
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
    const duration = 5000;
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
      <TopBar rightText="" />

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
                Bravo !
              </motion.div>

              <motion.div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.36em",
                  textTransform: "uppercase",
                  color: "rgba(232,0,125,0.6)",
                  marginBottom: "20px",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Vous avez gagné
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
                de réduction immédiate
              </motion.div>

              <motion.div
                style={{
                  fontSize: "12px",
                  color: "rgba(26,16,5,0.45)",
                  letterSpacing: "0.06em",
                  marginBottom: "6px",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Sur votre prochaine commande Semilac
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
                Valable jusqu'au 19 Mai 2026
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
                      color: "rgba(26,16,5,0.4)",
                    }}
                  >
                    Code Promo
                  </span>
                  <Sparkles size={14} color="#E8007D" />
                </motion.div>

                <motion.div
                  className="inline-block rounded-2xl relative overflow-hidden mb-6"
                  style={{
                    padding: "16px 40px",
                    background: "rgba(232,0,125,0.06)",
                    border: "2px solid rgba(232,0,125,0.2)",
                    boxShadow: "0 8px 32px rgba(232,0,125,0.12)",
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
                className="w-full max-w-sm px-5 py-5 rounded-2xl mb-3 relative overflow-hidden"
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
                <div className="relative flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Camera size={28} color="#E8007D" />
                  </motion.div>
                  <div className="text-left">
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#1A1005",
                        letterSpacing: "0.02em",
                        marginBottom: "2px",
                      }}
                    >
                      Faites une capture d'écran !
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "rgba(26,16,5,0.45)",
                      }}
                    >
                      Conservez votre code pour l'événement
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Traçabilité : Ticket + Devis */}
              {devisNumber && (
                <motion.div
                  className="w-full max-w-sm px-5 py-4 rounded-2xl mb-5 relative overflow-hidden"
                  style={{
                    border: "1px solid rgba(232,0,125,0.12)",
                    background: "rgba(255,255,255,0.85)",
                    boxShadow: "0 4px 20px rgba(232,0,125,0.06)",
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
                      Traçabilité
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: "10px", color: "rgba(26,16,5,0.4)" }}>
                        Ticket RSVP
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
                      <span style={{ fontSize: "10px", color: "rgba(26,16,5,0.4)" }}>
                        N° Devis
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
                      <span style={{ fontSize: "10px", color: "rgba(26,16,5,0.4)" }}>
                        Réduction
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
                      color: "rgba(26,16,5,0.3)",
                      marginTop: "12px",
                      textAlign: "center",
                      letterSpacing: "0.1em",
                    }}
                  >
                    ✓ Enregistré automatiquement
                  </div>
                </motion.div>
              )}

              {/* Partage WhatsApp */}
              <motion.div
                className="w-full max-w-sm mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 }}
              >
                <motion.button
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(232,0,125,0.10), rgba(196,21,122,0.07))',
                    border: '1.5px solid rgba(232,0,125,0.25)',
                    boxShadow: '0 4px 16px rgba(232,0,125,0.10)',
                  }}
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(232,0,125,0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const text = encodeURIComponent(
                      `🎉 J'ai gagné ${prize} à la Roue de la Fortune Semilac Days !\n\nCode : ${ticketNumber}\n📅 14-19 Mai 2026 · Casablanca`
                    );
                    window.open(`https://wa.me/?text=${text}`, '_blank');
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <MessageCircle size={20} color="#E8007D" />
                  </motion.div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#1A1005', letterSpacing: '0.06em' }}>
                    Partager mon gain
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
