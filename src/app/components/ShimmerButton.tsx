import { useRef, useState, MouseEvent } from 'react';
import { motion } from 'motion/react';
import { sounds } from '../utils/sounds';

interface ShimmerButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
}

export function ShimmerButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
}: ShimmerButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 50;
    if (distance < maxDistance) {
      const strength = 1 - distance / maxDistance;
      setPosition({ x: x * strength * 0.4, y: y * strength * 0.4 });
    }
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    sounds.click();
    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples([...ripples, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }
    onClick?.();
  };

  const isPrimary = variant === 'primary';

  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden font-bold uppercase tracking-[0.18em] rounded-xl flex items-center justify-center cursor-pointer ${className}`}
      style={{
        fontSize: '10px',
        fontFamily: "'Montserrat', sans-serif",
        background: isPrimary
          ? 'linear-gradient(160deg, #d6188a 0%, #E8007D 50%, #f5349e 100%)'
          : 'transparent',
        color: isPrimary ? '#FFFFFF' : 'rgba(26,16,5,0.4)',
        border: isPrimary ? 'none' : '1px solid rgba(26,16,5,0.12)',
        boxShadow: isPrimary
          ? 'inset 0 1px 0 rgba(255,255,255,0.22), 0 2px 4px rgba(0,0,0,0.12), 0 6px 20px rgba(232,0,125,0.38), 0 16px 40px rgba(232,0,125,0.16)'
          : 'none',
      }}
      animate={{ x: position.x, y: position.y }}
      whileHover={
        disabled
          ? {}
          : {
              scale: 1.03,
              background: isPrimary
                ? 'linear-gradient(135deg, #d4207f, #E8007D, #ff6db6)'
                : 'rgba(26,16,5,0.04)',
              borderColor: isPrimary ? undefined : 'rgba(26,16,5,0.18)',
              boxShadow: isPrimary
                ? '0 8px 30px rgba(232,0,125,0.45)'
                : '0 4px 20px rgba(232,0,125,0.1)',
            }
      }
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => !disabled && sounds.hover()}
      onClick={handleClick}
      disabled={disabled}
    >
      {isPrimary && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
            transform: 'translateX(-100%)',
          }}
          animate={{ transform: ['translateX(-100%)', 'translateX(200%)'] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: 'linear' }}
        />
      )}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full"
          style={{ left: ripple.x, top: ripple.y, width: 0, height: 0, background: 'rgba(255,255,255,0.4)' }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 100, height: 100, opacity: 0 }}
          transition={{ duration: 0.6 }}
          exit={{ opacity: 0 }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
