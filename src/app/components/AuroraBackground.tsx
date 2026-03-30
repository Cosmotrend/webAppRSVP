import { motion } from 'motion/react';

export function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(248,164,200,0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          top: '-80px',
          left: '-60px',
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
        className="absolute w-[250px] h-[250px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(212,100,150,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
          top: '40%',
          right: '-60px',
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
        className="absolute w-[200px] h-[200px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(212,165,116,0.18) 0%, transparent 70%)',
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
