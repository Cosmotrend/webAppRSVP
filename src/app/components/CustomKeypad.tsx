import { motion, AnimatePresence } from 'motion/react';
import { Delete, Keyboard, ChevronDown } from 'lucide-react';

interface CustomKeypadProps {
  onKey: (key: string) => void;
  onBackspace: () => void;
  mode?: 'numeric' | 'alphanumeric';
  accentColor?: string;
  visible?: boolean;
  onToggle?: () => void;
}

/**
 * Clavier virtuel AZERTY LTR — remplace le clavier système.
 * Layout : chiffres en haut, puis AZERTYUIOP / QSDFGHJKLM / WXCVBN.
 * Pliable via le bouton toggle.
 */
export function CustomKeypad({
  onKey,
  onBackspace,
  mode = 'alphanumeric',
  accentColor = '#E8007D',
  visible = true,
  onToggle,
}: CustomKeypadProps) {
  // Layout AZERTY, ordre gauche → droite
  const row0 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const row1 = ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const row2 = ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'];
  const row3 = ['W', 'X', 'C', 'V', 'B', 'N'];

  const keyStyle = {
    padding: '7px 0',
    background: `${accentColor}0d`,
    border: `1px solid ${accentColor}22`,
    color: '#1A1005',
    fontSize: '12px',
    fontFamily: "'Montserrat', sans-serif",
    cursor: 'pointer',
    borderRadius: '6px',
    fontWeight: 700,
  };

  const renderRow = (keys: string[], offset = 0, extraCells = 0) => (
    <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}>
      {offset > 0 && <div style={{ gridColumn: `span ${offset}` }} />}
      {keys.map((k) => (
        <motion.button key={k} type="button" onClick={() => onKey(k)} whileTap={{ scale: 0.88 }} style={keyStyle}>
          {k}
        </motion.button>
      ))}
      {extraCells > 0 && <div style={{ gridColumn: `span ${extraCells}` }} />}
    </div>
  );

  const numericOnly = mode === 'numeric';

  return (
    <div
      className="rounded-2xl"
      style={{
        background: 'rgba(250,247,242,0.94)',
        border: `1px solid ${accentColor}22`,
        boxShadow: `0 6px 24px ${accentColor}14`,
      }}
    >
      {/* Toggle bar */}
      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2"
          style={{
            padding: '6px',
            background: 'transparent',
            border: 'none',
            borderBottom: visible ? `1px solid ${accentColor}14` : 'none',
            cursor: 'pointer',
            color: accentColor,
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          <Keyboard size={12} />
          {visible ? 'Masquer le clavier' : 'Afficher le clavier'}
          <motion.div animate={{ rotate: visible ? 0 : 180 }}>
            <ChevronDown size={12} />
          </motion.div>
        </button>
      )}

      <AnimatePresence initial={false}>
        {visible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="p-2 flex flex-col gap-1">
              {renderRow(row0)}
              {!numericOnly && (
                <>
                  {renderRow(row1)}
                  {renderRow(row2)}
                  {renderRow(row3, 0, 4)}
                </>
              )}

              {/* Backspace pleine largeur */}
              <motion.button
                type="button"
                onClick={onBackspace}
                whileTap={{ scale: 0.92 }}
                className="rounded-lg flex items-center justify-center gap-2"
                style={{
                  padding: '8px 0',
                  background: `${accentColor}14`,
                  border: `1px solid ${accentColor}33`,
                  color: accentColor,
                  cursor: 'pointer',
                  marginTop: '2px',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                <Delete size={14} />
                Effacer
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
