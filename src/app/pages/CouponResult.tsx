import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  Trophy,
  Sparkles,
  Camera,
  FileText,
} from "lucide-react";
import { PageTransition } from "../components/PageTransition";
import { BrandStrip } from "../components/logos/BrandStrip";
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

    // Mega confetti celebration
    const duration = 6000;
    const animationEnd = Date.now() + duration;
    const colors = [
      "#F8A4C8",
      "#ffdaec",
      "#D4A574",
      "#c47090",
      "#ffc8de",
      "#ffffff",
    ];

    const frame = () => {
      // Continuous confetti from multiple angles
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
      className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center px-5 text-center"
      style={{
        background:
          "radial-gradient(ellipse at center, #1a0010 0%, #0a0006 100%)",
      }}
    >
      {/* Multiple layered glows */}
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: "-100px",
            left: "50%",
            width: `${400 + i * 100}px`,
            height: `${350 + i * 80}px`,
            background: `radial-gradient(ellipse, rgba(248,164,200,${0.25 - i * 0.04}) 0%, transparent 65%)`,
            filter: `blur(${50 + i * 10}px)`,
            transform: "translateX(-50%)",
          }}
          animate={{
            scale: [1, 1.15 + i * 0.05, 1],
            opacity: [
              0.4 + i * 0.05,
              0.7 + i * 0.05,
              0.4 + i * 0.05,
            ],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
          }}
        />
      ))}

      <AnimatePresence>
        {showContent && (
          <>
            {/* Trophy icon with rotation */}
            <motion.div
              className="mb-6"
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
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy
                  size={60}
                  color="#F8A4C8"
                  strokeWidth={1.5}
                />

                {/* Orbiting sparkles */}
                {[0, 1, 2, 3].map((i) => {
                  const angle = (360 / 4) * i;
                  return (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        top: "50%",
                        left: "50%",
                      }}
                      animate={{
                        x: [
                          Math.cos((angle * Math.PI) / 180) *
                            40,
                          Math.cos(
                            ((angle + 360) * Math.PI) / 180,
                          ) * 40,
                        ],
                        y: [
                          Math.sin((angle * Math.PI) / 180) *
                            40,
                          Math.sin(
                            ((angle + 360) * Math.PI) / 180,
                          ) * 40,
                        ],
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    >
                      <Sparkles size={12} color="#ffc8de" />
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
                color: "#FFF8F5",
                lineHeight: 1,
                marginBottom: "12px",
                textShadow: "0 0 40px rgba(248,164,200,0.5)",
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
                color: "rgba(248,164,200,0.6)",
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
              transition={{
                delay: 0.7,
                type: "spring",
                stiffness: 150,
              }}
            >
              <motion.div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "92px",
                  fontWeight: 300,
                  background:
                    "linear-gradient(135deg, #c47090, #F8A4C8, #ffdaec, #D4A574)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1,
                  position: "relative",
                  backgroundSize: "200% 200%",
                }}
                animate={{
                  backgroundPosition: [
                    "0% 50%",
                    "100% 50%",
                    "0% 50%",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                -{counter}%
              </motion.div>
            </motion.div>

            <motion.div
              style={{
                fontSize: "14px",
                color: "rgba(255,248,245,0.5)",
                marginBottom: "6px",
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
                fontSize: "10px",
                color: "rgba(255,248,245,0.25)",
                letterSpacing: "0.12em",
                marginBottom: "24px",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Sur votre prochaine commande Semilac
            </motion.div>

            {/* Animated divider */}
            <motion.div
              style={{
                width: "180px",
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, rgba(248,164,200,0.4), transparent)",
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
                <Sparkles size={14} color="#F8A4C8" />
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(255,248,245,0.3)",
                  }}
                >
                  Code Promo
                </span>
                <Sparkles size={14} color="#F8A4C8" />
              </motion.div>

              <motion.div
                className="inline-block rounded-2xl relative overflow-hidden mb-6"
                style={{
                  padding: "16px 40px",
                  background: "rgba(248,164,200,0.12)",
                  border: "2px solid rgba(248,164,200,0.3)",
                  boxShadow: "0 8px 40px rgba(248,164,200,0.3)",
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6, type: "spring" }}
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    "0 12px 50px rgba(248,164,200,0.5)",
                }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />

                <motion.div
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "22px",
                    fontWeight: 700,
                    letterSpacing: "0.28em",
                    color: "#F8A4C8",
                    textShadow:
                      "0 0 30px rgba(248,164,200,0.6)",
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
                border: "2px dashed rgba(248,164,200,0.35)",
                background: "rgba(248,164,200,0.08)",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              whileHover={{
                scale: 1.02,
                background: "rgba(248,164,200,0.12)",
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  fontSize: "28px",
                  marginBottom: "8px",
                }}
              >
                <Camera size={32} color="#F8A4C8" />
              </motion.div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#FFF8F5",
                  lineHeight: 1.5,
                  letterSpacing: "0.02em",
                }}
              >
                Capture d'écran recommandée !
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "rgba(255,248,245,0.4)",
                  marginTop: "4px",
                }}
              >
                Conservez votre code pour l'événement
              </div>
            </motion.div>

            {/* Traçabilité : Ticket + Devis */}
            {devisNumber && (
              <motion.div
                className="w-full max-w-sm px-5 py-4 rounded-2xl mb-5 relative overflow-hidden"
                style={{
                  border: "1px solid rgba(248,164,200,0.25)",
                  background: "rgba(20,5,15,0.6)",
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={16} color="#F8A4C8" />
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(248,164,200,0.8)",
                    }}
                  >
                    Traçabilité
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span
                      style={{
                        fontSize: "10px",
                        color: "rgba(255,248,245,0.4)",
                      }}
                    >
                      Ticket RSVP
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontFamily: "'Courier New', monospace",
                        fontWeight: 600,
                        color: "#FFF8F5",
                      }}
                    >
                      {ticketNumber}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span
                      style={{
                        fontSize: "10px",
                        color: "rgba(255,248,245,0.4)",
                      }}
                    >
                      N° Devis
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontFamily: "'Courier New', monospace",
                        fontWeight: 600,
                        color: "#F8A4C8",
                      }}
                    >
                      {devisNumber}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span
                      style={{
                        fontSize: "10px",
                        color: "rgba(255,248,245,0.4)",
                      }}
                    >
                      Réduction
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#F8A4C8",
                      }}
                    >
                      {prize}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "8px",
                    color: "rgba(255,248,245,0.25)",
                    marginTop: "12px",
                    textAlign: "center",
                    letterSpacing: "0.1em",
                  }}
                >
                  ✓ Enregistré automatiquement
                </div>
              </motion.div>
            )}

            {/* Brand strip */}
            <motion.div
              className="w-full max-w-sm mt-4"
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
  );
}