import { useState, useEffect } from 'react';

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
      <div
        className="absolute w-[350px] h-[350px] rounded-full gpu-layer"
        style={{
          background: 'radial-gradient(ellipse, rgba(232,0,125,0.10) 0%, transparent 70%)',
          filter: 'blur(70px)',
          top: '-100px',
          left: '-80px',
          animation: 'aurora-drift-1 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-[280px] h-[280px] rounded-full gpu-layer"
        style={{
          background: 'radial-gradient(ellipse, rgba(232,0,125,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
          top: '40%',
          right: '-70px',
          animation: 'aurora-drift-2 10s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-[220px] h-[220px] rounded-full gpu-layer"
        style={{
          background: 'radial-gradient(ellipse, rgba(196,144,74,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
          bottom: '-20px',
          left: '15%',
          animation: 'aurora-drift-3 12s ease-in-out infinite',
        }}
      />
    </div>
  );
}
