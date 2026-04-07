import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { sounds } from '../utils/sounds';

interface Premium3DWheelProps {
  onSpinComplete: (prizeIndex: number) => void;
  isSpinning: boolean;
  resetKey?: number; // Add a key to force reset
  size?: number | string; // Responsive size override
}

const prizes = [
  { label: '-25%', color: '#E8007D', gradient: ['#E8007D', '#C4157A'] },
  { label: '-30%', color: '#C4157A', gradient: ['#C4157A', '#A00060'] },
  { label: '-35%', color: '#ff4da6', gradient: ['#ff4da6', '#E8007D'] },
  { label: '-40%', color: '#E8007D', gradient: ['#E8007D', '#C4157A'] },
  { label: '-25%', color: '#C4157A', gradient: ['#C4157A', '#A00060'] },
  { label: '-30%', color: '#ff4da6', gradient: ['#ff4da6', '#E8007D'] },
  { label: '-35%', color: '#E8007D', gradient: ['#E8007D', '#C4157A'] },
  { label: '-40%', color: '#C4157A', gradient: ['#C4157A', '#A00060'] },
  { label: '-25%', color: '#ff4da6', gradient: ['#ff4da6', '#E8007D'] },
  { label: '-30%', color: '#E8007D', gradient: ['#E8007D', '#C4157A'] },
  { label: '-35%', color: '#C4157A', gradient: ['#C4157A', '#A00060'] },
  { label: '-40%', color: '#ff4da6', gradient: ['#ff4da6', '#E8007D'] },
];

export function Premium3DWheel({ onSpinComplete, isSpinning, resetKey, size = 'min(86vw, 56vh, 520px)' }: Premium3DWheelProps) {
  const [hasSpun, setHasSpun] = useState(false);
  const rotation = useMotionValue(0);

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;
    
    setHasSpun(true);
    sounds.spin();

    // Weighted random selection — probabilités contrôlées
    // -40% : 7.5% | -35% : 12.5% | -30% : 30% | -25% : 50%
    const weights: Array<{ label: string; weight: number }> = [
      { label: '-40%', weight: 0.075 },
      { label: '-35%', weight: 0.125 },
      { label: '-30%', weight: 0.30 },
      { label: '-25%', weight: 0.50 },
    ];
    const r = Math.random();
    let cumulative = 0;
    let selectedLabel = '-25%';
    for (const w of weights) {
      cumulative += w.weight;
      if (r <= cumulative) {
        selectedLabel = w.label;
        break;
      }
    }
    // Trouver un segment visuel correspondant au label gagnant
    const matchingIndices = prizes
      .map((p, i) => (p.label === selectedLabel ? i : -1))
      .filter((i) => i !== -1);
    const prizeIndex = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];

    const degreesPerSegment = 360 / prizes.length;
    const targetRotation = rotation.get() + (360 * 7) + (360 - prizeIndex * degreesPerSegment - degreesPerSegment / 2);
    
    // Animate with easing
    animate(rotation, targetRotation, {
      duration: 5,
      ease: [0.32, 0.72, 0, 1], // Custom easing for smooth deceleration
      onComplete: () => {
        setTimeout(() => {
          sounds.win();
          onSpinComplete(prizeIndex);
        }, 500);
      },
    });
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Pointer with glow */}
      <motion.div
        className="absolute top-[-16px] left-1/2 z-20 pointer-events-none"
        style={{
          width: 0,
          height: 0,
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderTop: '24px solid #F8A4C8',
          filter: 'drop-shadow(0 4px 12px rgba(248,164,200,0.8))',
          marginLeft: '-12px',
        }}
        animate={{ y: [0, 6, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />

      {/* Wheel container - NO HOVER EFFECTS */}
      <div
        className="relative select-none"
        style={{
          width: size,
          height: size,
          aspectRatio: '1 / 1',
        }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(248,164,200,0.4), transparent 70%)',
            filter: 'blur(30px)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Main wheel */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            rotate: rotation,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), rgba(232,0,125,0.06))',
            boxShadow: '0 10px 40px rgba(232,0,125,0.25)',
          }}
        >
          <svg viewBox="0 0 350 350" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" className="absolute inset-0">
            <defs>
              {prizes.map((prize, i) => (
                <linearGradient key={`grad-${i}`} id={`seg-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={prize.gradient[0]} />
                  <stop offset="100%" stopColor={prize.gradient[1]} />
                </linearGradient>
              ))}
              
              {/* Lighting effect */}
              <radialGradient id="light" cx="30%" cy="30%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            <g transform="translate(175,175)">
              {/* Draw segments */}
              {prizes.map((prize, i) => {
                const angle = (360 / prizes.length) * i;
                const nextAngle = (360 / prizes.length) * (i + 1);
                const rad1 = ((angle - 90) * Math.PI) / 180;
                const rad2 = ((nextAngle - 90) * Math.PI) / 180;
                const x1 = Math.cos(rad1) * 165;
                const y1 = Math.sin(rad1) * 165;
                const x2 = Math.cos(rad2) * 165;
                const y2 = Math.sin(rad2) * 165;

                return (
                  <g key={i}>
                    <path
                      d={`M0,0 L${x1},${y1} A165,165 0 0,1 ${x2},${y2} Z`}
                      fill={`url(#seg-grad-${i})`}
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="1.5"
                    />
                    
                    {/* Prize text */}
                    <text
                      x={(x1 + x2) / 2 * 0.65}
                      y={(y1 + y2) / 2 * 0.65}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#FFFFFF"
                      fontSize="14"
                      fontWeight="800"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                        letterSpacing: '0.05em',
                      }}
                      transform={`rotate(${angle + 360 / prizes.length / 2}, ${(x1 + x2) / 2 * 0.65}, ${(y1 + y2) / 2 * 0.65})`}
                    >
                      {prize.label}
                    </text>
                  </g>
                );
              })}

              {/* Lighting overlay */}
              <circle cx="0" cy="0" r="165" fill="url(#light)" />

              {/* Inner ring decoration - positioned at segment boundaries */}
              {prizes.map((_, i) => {
                const angle = (360 / prizes.length) * i;
                const rad = ((angle - 90) * Math.PI) / 180;
                const x = Math.cos(rad) * 155;
                const y = Math.sin(rad) * 155;
                return (
                  <circle
                    key={`dot-${i}`}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="rgba(255,255,255,0.7)"
                    filter="url(#glow)"
                  />
                );
              })}
            </g>

            {/* Glow filter */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* Center button */}
          <motion.button
            className="absolute top-1/2 left-1/2 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              transform: 'translate(-50%, -50%)',
              width: '23%',
              height: '23%',
              minWidth: '64px',
              minHeight: '64px',
              background: 'linear-gradient(135deg, #c47090, #F8A4C8, #ffc8de)',
              boxShadow: '0 6px 30px rgba(248,164,200,0.6), inset 0 -2px 10px rgba(0,0,0,0.3)',
              border: '3px solid rgba(255,255,255,0.3)',
              cursor: !hasSpun && !isSpinning ? 'pointer' : 'default',
            }}
            onClick={handleSpin}
            disabled={hasSpun || isSpinning}
          >
            {/* Shimmer effect on button */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
            />

            <span
              className="relative z-10"
              style={{
                color: '#0D0008',
                fontSize: '14px',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textShadow: '0 1px 2px rgba(255,255,255,0.5)',
              }}
            >
              {hasSpun ? '...' : 'SPIN'}
            </span>
          </motion.button>
        </motion.div>

        {/* Reflection effect */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  );
}