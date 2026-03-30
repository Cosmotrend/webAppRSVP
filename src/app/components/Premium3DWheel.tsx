import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { sounds } from '../utils/sounds';

interface Premium3DWheelProps {
  onSpinComplete: (prizeIndex: number) => void;
  isSpinning: boolean;
  resetKey?: number; // Add a key to force reset
}

const prizes = [
  { label: '-25%', color: '#4a1530', gradient: ['#4a1530', '#2a0818'] },
  { label: '-30%', color: '#3d1028', gradient: ['#3d1028', '#1d0010'] },
  { label: '-35%', color: '#5a1838', gradient: ['#5a1838', '#3a0820'] },
  { label: '-40%', color: '#2e0815', gradient: ['#2e0815', '#1e0008'] },
  { label: '-25%', color: '#4a1530', gradient: ['#4a1530', '#2a0818'] },
  { label: '-30%', color: '#3d1028', gradient: ['#3d1028', '#1d0010'] },
  { label: '-35%', color: '#5a1838', gradient: ['#5a1838', '#3a0820'] },
  { label: '-40%', color: '#2e0815', gradient: ['#2e0815', '#1e0008'] },
  { label: '-25%', color: '#4a1530', gradient: ['#4a1530', '#2a0818'] },
  { label: '-30%', color: '#3d1028', gradient: ['#3d1028', '#1d0010'] },
  { label: '-35%', color: '#5a1838', gradient: ['#5a1838', '#3a0820'] },
  { label: '-40%', color: '#2e0815', gradient: ['#2e0815', '#1e0008'] },
];

export function Premium3DWheel({ onSpinComplete, isSpinning, resetKey }: Premium3DWheelProps) {
  const [hasSpun, setHasSpun] = useState(false);
  const rotation = useMotionValue(0);

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;
    
    setHasSpun(true);
    sounds.spin();
    
    // Random prize
    const prizeIndex = Math.floor(Math.random() * prizes.length);
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
          width: '350px',
          height: '350px',
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
            background: 'radial-gradient(circle at 30% 30%, rgba(248,164,200,0.15), rgba(13,0,8,0.95))',
            boxShadow: '0 10px 40px rgba(248,164,200,0.3)',
          }}
        >
          <svg viewBox="0 0 350 350" width="350" height="350" className="absolute inset-0">
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
                      stroke="rgba(248,164,200,0.3)"
                      strokeWidth="1.5"
                    />
                    
                    {/* Prize text */}
                    <text
                      x={(x1 + x2) / 2 * 0.65}
                      y={(y1 + y2) / 2 * 0.65}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#F8A4C8"
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
                    fill="rgba(248,164,200,0.6)"
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
              width: '80px',
              height: '80px',
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