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
      setPosition({
        x: x * strength * 0.4,
        y: y * strength * 0.4,
      });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    sounds.click();
    
    // Create ripple effect
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
          ? 'linear-gradient(135deg, #c47090, #F8A4C8, #ffc8de, #D4A574)'
          : 'transparent',
        color: isPrimary ? '#0D0008' : 'rgba(255,248,245,0.35)',
        border: isPrimary ? 'none' : '1px solid rgba(255,248,245,0.1)',
        boxShadow: isPrimary ? '0 4px 20px rgba(248,164,200,0.3)' : 'none',
      }}
      animate={{
        x: position.x,
        y: position.y,
      }}
      whileHover={
        disabled
          ? {}
          : {
              scale: 1.03,
              background: isPrimary
                ? 'linear-gradient(135deg, #d088a4, #F8A4C8, #ffdaec, #e0b894)'
                : 'rgba(255,255,255,0.03)',
              borderColor: isPrimary ? undefined : 'rgba(255, 255, 255, 0.08)',
              boxShadow: isPrimary
                ? '0 8px 30px rgba(248,164,200,0.5)'
                : '0 4px 20px rgba(248,164,200,0.2)',
            }
      }
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => !disabled && sounds.hover()}
      onClick={handleClick}
      disabled={disabled}
    >
      {/* Shimmer effect */}
      {isPrimary && (
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            transform: 'translateX(-100%)',
          }}
          animate={{
            transform: ['translateX(-100%)', 'translateX(200%)'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: 'linear',
          }}
        />
      )}

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            background: 'rgba(255,255,255,0.5)',
          }}
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