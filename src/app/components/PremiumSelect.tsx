import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface PremiumSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
}

export function PremiumSelect({ label, value, onChange, options, required }: PremiumSelectProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="relative rounded-xl overflow-hidden"
        animate={{
          boxShadow: isFocused
            ? '0 0 0 2px rgba(248,164,200,0.3), 0 8px 20px rgba(248,164,200,0.15)'
            : '0 0 0 1px rgba(248,164,200,0.11)',
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: isFocused
              ? 'linear-gradient(135deg, rgba(248,164,200,0.08), rgba(212,165,116,0.08))'
              : 'rgba(255,255,255,0.03)',
          }}
        />

        {/* Floating label */}
        <motion.label
          className="absolute left-4 pointer-events-none z-10"
          style={{
            fontSize: isFocused || hasValue ? '7px' : '10px',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: isFocused ? '#F8A4C8' : 'rgba(248,164,200,0.4)',
            fontFamily: "'Montserrat', sans-serif",
          }}
          animate={{
            top: isFocused || hasValue ? '8px' : '50%',
            y: isFocused || hasValue ? 0 : '-50%',
          }}
          transition={{ duration: 0.2 }}
        >
          {label}{required && ' *'}
        </motion.label>

        {/* Native select — preserves iOS/Android native picker UX */}
        <select
          className="relative w-full outline-none bg-transparent appearance-none cursor-pointer"
          style={{
            paddingLeft: '16px',
            paddingRight: '36px',
            paddingTop: isFocused || hasValue ? '22px' : '14px',
            paddingBottom: '6px',
            color: hasValue ? 'rgba(255,248,245,0.9)' : 'transparent',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            fontFamily: "'Montserrat', sans-serif",
            minHeight: '52px',
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <option value="" disabled style={{ background: '#140510', color: 'transparent' }}></option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              style={{ background: '#140510', color: '#FFF8F5' }}
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom chevron */}
        <motion.div
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          animate={{ rotate: isFocused ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} color={isFocused ? '#F8A4C8' : 'rgba(248,164,200,0.4)'} />
        </motion.div>
      </motion.div>

      {/* Bottom glow when focused */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className="absolute -bottom-1 left-0 right-0 h-1 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #F8A4C8, transparent)',
              filter: 'blur(4px)',
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
