import { useRef, useState, MouseEvent } from 'react';
import { motion } from 'motion/react';
import { sounds } from '../utils/sounds';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
}

export function MagneticButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
}: MagneticButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 30;

    if (distance < maxDistance) {
      const strength = 1 - distance / maxDistance;
      setPosition({
        x: x * strength * 0.3,
        y: y * strength * 0.3,
      });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      sounds.hover();
    }
  };

  const handleClick = () => {
    if (!disabled) {
      sounds.click();
      onClick?.();
    }
  };

  const baseStyles = variant === 'primary' 
    ? 'bg-gradient-to-br from-[#c47090] via-[#F8A4C8] to-[#D4A574] text-[#0D0008]'
    : 'bg-transparent text-[rgba(255,248,245,0.35)] border border-[rgba(255,248,245,0.1)]';

  return (
    <motion.button
      ref={buttonRef}
      className={`font-bold uppercase tracking-[0.18em] rounded-lg flex items-center justify-center cursor-pointer transition-shadow ${baseStyles} ${className}`}
      style={{
        fontSize: '10px',
        fontFamily: "'Montserrat', sans-serif",
      }}
      animate={{
        x: position.x,
        y: position.y,
      }}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}
