import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar } from 'lucide-react';

interface TopBarAction {
  icon: ReactNode;
  label?: string;
  href?: string;
}

interface TopBarProps {
  leftAction?: TopBarAction;
  rightAction?: TopBarAction;
}

const DEFAULT_LEFT: TopBarAction = {
  icon: <MapPin size={18} />,
  href: 'https://maps.app.goo.gl/AnabacGETpG8W5UD9',
};

const DEFAULT_RIGHT: TopBarAction = {
  icon: <Calendar size={18} />,
  href: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Semilac+Days+2026&dates=20260514/20260520&location=Casablanca,+Morocco&details=Semilac+Days+2%C3%A8me+%C3%89dition',
};

function ActionIcon({ action, side }: { action: TopBarAction; side: 'left' | 'right' }) {
  const iconStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(232,0,125,0.06)',
    border: '1px solid rgba(232,0,125,0.15)',
    color: '#E8007D',
    cursor: action.href ? 'pointer' as const : 'default' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
  };

  if (action.href) {
    return (
      <motion.a
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={side === 'left' ? 'Voir la localisation sur Google Maps' : 'Ajouter au calendrier'}
        style={iconStyle}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.8, delay: side === 'left' ? 1.5 : 2.0, times: [0, 0.5, 1] }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ background: 'rgba(232,0,125,0.12)', borderColor: 'rgba(232,0,125,0.3)' }}
      >
        {action.icon}
      </motion.a>
    );
  }

  if (action.label) {
    return (
      <div className="flex items-center gap-1.5" style={{ color: '#E8007D' }}>
        <motion.div
          style={iconStyle}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.8, delay: side === 'left' ? 1.5 : 2.0, times: [0, 0.5, 1] }}
        >
          {action.icon}
        </motion.div>
        <span style={{ fontSize: '7px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>
          {action.label}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      style={iconStyle}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 1.8, delay: side === 'left' ? 1.5 : 2.0, times: [0, 0.5, 1] }}
    >
      {action.icon}
    </motion.div>
  );
}

export function TopBar({ leftAction, rightAction }: TopBarProps) {
  const left = leftAction ?? DEFAULT_LEFT;
  const right = rightAction ?? DEFAULT_RIGHT;

  return (
    <motion.div
      className="absolute top-0 left-0 right-0 h-[44px] flex items-center justify-between px-3 border-b z-10"
      style={{
        background: 'rgba(250,247,242,0.97)',
        borderColor: 'rgba(232,0,125,0.10)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      initial={{ y: -44, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <ActionIcon action={left} side="left" />

      {/* Animated shimmer line */}
      <div
        style={{
          flex: 1,
          height: '2px',
          borderRadius: '1px',
          background: 'rgba(232,0,125,0.08)',
          margin: '0 10px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(232,0,125,0.4), rgba(196,144,74,0.3), transparent)',
            borderRadius: '1px',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
        />
      </div>

      <ActionIcon action={right} side="right" />
    </motion.div>
  );
}
