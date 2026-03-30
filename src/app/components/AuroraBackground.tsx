import { motion } from 'motion/react';

export function AuroraBackground() {
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
