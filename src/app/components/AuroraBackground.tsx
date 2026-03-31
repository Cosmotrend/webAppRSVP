import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export function AuroraBackground() {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    const small = window.innerHeight < 700 || window.innerWidth < 375;
    const lowMem = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
    setIsLowEnd(small || !!lowMem);
  }, []);

  // Low-end: static gradients, no blur, no animation — saves massive GPU
  if (isLowEnd) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[250px] h-[250px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(232,0,125,0.08) 0%, transparent 70%)',
            top: '-80px',
            left: '-60px',
          }}
        />
        <div
          className="absolute w-[200px] h-[200px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(232,0,125,0.05) 0%, transparent 70%)',
            top: '40%',
            right: '-50px',
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(232,0,125,0.10) 0%, transparent 70%)',
          filter: 'blur(70px)',
          top: '-100px',
          left: '-80px',
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[280px] h-[280px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(232,0,125,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
          top: '40%',
          right: '-70px',
        }}
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[220px] h-[220px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(196,144,74,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
          bottom: '-20px',
          left: '15%',
        }}
        animate={{
          x: [0, 25, 0],
          y: [0, -15, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
