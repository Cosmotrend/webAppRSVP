import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle } from 'lucide-react';

interface PremiumInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  pattern?: string;
  required?: boolean;
  validate?: (value: string) => boolean;
  errorMessage?: string;
}

export function PremiumInput({
  placeholder,
  value,
  onChange,
  type = 'text',
  inputMode,
  pattern,
  required = false,
  validate,
  errorMessage,
}: PremiumInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const isValid = validate ? validate(value) : value.length > 0;
  const showValidation = hasInteracted && value.length > 0;

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
            ? '0 0 0 2px rgba(232,0,125,0.25), 0 8px 20px rgba(232,0,125,0.08)'
            : '0 0 0 1px rgba(26,16,5,0.10)',
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: isFocused
              ? 'linear-gradient(135deg, rgba(232,0,125,0.04), rgba(196,144,74,0.04))'
              : 'rgba(250,247,242,0.85)',
          }}
        />

        <input
          className="relative w-full px-4 pt-6 pb-2 outline-none bg-transparent"
          style={{
            color: '#1A1005',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            fontFamily: "'Montserrat', sans-serif",
          }}
          type={type}
          inputMode={inputMode}
          pattern={pattern}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (!hasInteracted) setHasInteracted(true);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* Floating label */}
        <motion.label
          className="absolute left-4 pointer-events-none"
          style={{
            fontSize: isFocused || value ? '7px' : '10px',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: isFocused ? '#E8007D' : 'rgba(26,16,5,0.4)',
            fontFamily: "'Montserrat', sans-serif",
          }}
          animate={{
            top: isFocused || value ? '8px' : '50%',
            y: isFocused || value ? 0 : '-50%',
          }}
          transition={{ duration: 0.2 }}
        >
          {placeholder} {required && '*'}
        </motion.label>

        {/* Validation icon */}
        <AnimatePresence>
          {showValidation && (
            <motion.div
              className="absolute right-3 top-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, y: '-50%' }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {isValid ? (
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 0.5 }}>
                  <Check size={16} color="#E8007D" strokeWidth={3} />
                </motion.div>
              ) : (
                <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 0.3, repeat: 2 }}>
                  <AlertCircle size={16} color="rgba(220,50,50,0.7)" strokeWidth={2} />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            className="flex items-center gap-1 mt-1 px-1"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            <AlertCircle size={10} color="rgba(220,50,50,0.8)" />
            <span style={{ fontSize: '9px', color: 'rgba(220,50,50,0.8)', fontWeight: 600, letterSpacing: '0.05em' }}>
              {errorMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom glow effect when focused */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className="absolute -bottom-1 left-0 right-0 h-1 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(232,0,125,0.4), transparent)',
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
