import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { sounds } from '../utils/sounds';

interface WheelSpinnerProps {
  onSpinComplete: (prizeIndex: number) => void;
  isSpinning: boolean;
}

const prizes = [
  { label: '-10%', color: '#3d1028' },
  { label: '-15%', color: '#280918' },
  { label: '-20%', color: '#4a1530' },
  { label: '-5%', color: '#1e0815' },
  { label: '-25%', color: '#3d1028' },
  { label: '-30%', color: '#280918' },
  { label: 'BONUS', color: '#4a1530' },
  { label: '-10%', color: '#1e0815' },
];

export function WheelSpinner({ onSpinComplete, isSpinning }: WheelSpinnerProps) {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const handleSpin = () => {
    if (isSpinning) return;
    
    sounds.spin();
    
    // Random prize index
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    
    // Calculate rotation (5+ full spins + landing position)
    const degreesPerSegment = 360 / prizes.length;
    const targetRotation = 360 * 5 + (360 - prizeIndex * degreesPerSegment) + degreesPerSegment / 2;
    
    setRotation(rotation + targetRotation);
    
    // Callback after spin completes
    setTimeout(() => {
      sounds.win();
      onSpinComplete(prizeIndex);
    }, 4000);
  };

  return (
    <div className="relative w-[290px] h-[290px]">
      {/* Pointer */}
      <motion.div
        className="absolute top-[-10px] left-1/2 z-10"
        style={{
          width: 0,
          height: 0,
          borderLeft: '9px solid transparent',
          borderRight: '9px solid transparent',
          borderTop: '18px solid #F8A4C8',
          filter: 'drop-shadow(0 2px 8px rgba(248,164,200,0.7))',
          marginLeft: '-9px',
        }}
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />

      {/* Wheel */}
      <motion.div
        ref={wheelRef}
        className="w-full h-full rounded-full relative cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, rgba(248,164,200,0.1), rgba(212,165,116,0.1))',
          border: '3px solid rgba(248,164,200,0.3)',
          boxShadow: '0 0 30px rgba(248,164,200,0.2), inset 0 0 50px rgba(0,0,0,0.3)',
        }}
        animate={{ rotate: rotation }}
        transition={{
          duration: 4,
          ease: [0.22, 1, 0.36, 1],
        }}
        onClick={handleSpin}
        whileHover={!isSpinning ? { scale: 1.02 } : {}}
      >
        <svg viewBox="0 0 290 290" width="290" height="290" className="absolute inset-0">
          <defs>
            {prizes.map((prize, i) => (
              <radialGradient key={`grad-${i}`} id={`seg-${i}`} cx="50%" cy="50%">
                <stop offset="5%" stopColor={prize.color} />
                <stop offset="100%" stopColor="#0D0008" />
              </radialGradient>
            ))}
          </defs>
          <g transform="translate(145,145)">
            {prizes.map((prize, i) => {
              const angle = (360 / prizes.length) * i;
              const nextAngle = (360 / prizes.length) * (i + 1);
              const rad1 = (angle * Math.PI) / 180;
              const rad2 = (nextAngle * Math.PI) / 180;
              const x1 = Math.sin(rad1) * 136;
              const y1 = -Math.cos(rad1) * 136;
              const x2 = Math.sin(rad2) * 136;
              const y2 = -Math.cos(rad2) * 136;

              return (
                <g key={i}>
                  <path
                    d={`M0,0 L${x1},${y1} A136,136 0 0,1 ${x2},${y2} Z`}
                    fill={`url(#seg-${i})`}
                    stroke="rgba(248,164,200,0.2)"
                    strokeWidth="1"
                  />
                  <text
                    x={(x1 + x2) / 2 * 0.7}
                    y={(y1 + y2) / 2 * 0.7}
                    textAnchor="middle"
                    fill="#F8A4C8"
                    fontSize="14"
                    fontWeight="700"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {prize.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Center button */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(135deg, #c47090, #F8A4C8)',
            boxShadow: '0 4px 20px rgba(248,164,200,0.5)',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-[#0D0008] font-bold" style={{ fontSize: '12px' }}>
            SPIN
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
