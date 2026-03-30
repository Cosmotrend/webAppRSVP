import { motion } from 'motion/react';

// Reduced to 8 particles (was 30) — 30 GPU composited layers crashed iOS Safari
const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  size: (i % 3) * 1.5 + 2,
  x: (i * 13) % 100,
  y: (i * 17) % 100,
  duration: 12 + (i % 4) * 3,
  delay: i * 0.7,
  opacity: 0.3 + (i % 3) * 0.2,
}));

export function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `rgba(248,164,200,${p.opacity})`,
          }}
          animate={{
            y: [0, -80, 0],
            opacity: [0, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
