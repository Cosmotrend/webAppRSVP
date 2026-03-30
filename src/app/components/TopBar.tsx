import { motion } from 'motion/react';

interface TopBarProps {
  rightText?: string;
}

export function TopBar({ rightText = 'Cosmotrend · 2026' }: TopBarProps) {
  return (
    <motion.div
      className="absolute top-0 left-0 right-0 h-[44px] flex items-center justify-between px-5 border-b z-10"
      style={{
        background: 'rgba(13,0,8,0.95)',
        borderColor: 'rgba(248,164,200,0.07)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      initial={{ y: -44, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-2">
        <motion.div
          className="w-7 h-7 rounded-full flex items-center justify-center border"
          style={{
            background: 'rgba(248,164,200,0.1)',
            borderColor: 'rgba(248,164,200,0.25)',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '12px',
            fontStyle: 'italic',
            color: '#F8A4C8',
          }}
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          S
        </motion.div>
        <span
          style={{
            fontSize: '8px',
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
          }}
        >
          Semilac Days
        </span>
      </div>
      <span
        style={{
          fontSize: '7px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(248,164,200,0.25)',
        }}
      >
        {rightText}
      </span>
    </motion.div>
  );
}
