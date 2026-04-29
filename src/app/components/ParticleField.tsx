import { useState, useEffect, type CSSProperties } from 'react';

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
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    const small = window.innerHeight < 700 || window.innerWidth < 375;
    const lowMem = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
    setIsLowEnd(small || !!lowMem);
  }, []);

  // Don't render particles on low-end devices — purely decorative, huge GPU cost
  if (isLowEnd) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full gpu-layer"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `rgba(248,164,200,${p.opacity})`,
            animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            ['--peak-opacity' as any]: p.opacity,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
