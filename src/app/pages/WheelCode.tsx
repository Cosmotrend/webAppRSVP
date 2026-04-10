import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, FileText, AlertCircle, Sparkles, Plus, X } from 'lucide-react';
import { AuroraBackground } from '../components/AuroraBackground';
import { ParticleField } from '../components/ParticleField';
import { TopBar } from '../components/TopBar';
import { ShimmerButton } from '../components/ShimmerButton';
import { SemilacDaysLogo } from '../components/logos/SemilacDaysLogo';
import { BrandStrip } from '../components/logos/BrandStrip';
import { CustomKeypad } from '../components/CustomKeypad';
import { sounds } from '../utils/sounds';
import { callAPI } from '../utils/api';
import { useKioskMode } from '../utils/useKioskMode';

// Étape 2 — Français uniquement
const lang = 'fr' as const;
const MAX_DEVIS = 6;

export function WheelCode() {
  useKioskMode();
  const navigate = useNavigate();
  const [ticketNumber, setTicketNumber] = useState('SD26-');
  const [devisNumbers, setDevisNumbers] = useState<string[]>(['']);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [clientName, setClientName] = useState('');
  const [activeField, setActiveField] = useState<string>('ticket');
  const [keypadVisible, setKeypadVisible] = useState(true);

  // Route guard — only accessible after staff PIN
  useEffect(() => {
    if (!sessionStorage.getItem('staffAuth')) {
      navigate('/staff-pin');
    }
  }, [navigate]);

  const handleValidate = async () => {
    setIsValidating(true);
    setError('');
    sounds.click();

    const validDevis = devisNumbers.filter(d => d.length === 6);

    try {
      const result = await callAPI({
        action: 'validate',
        ticket: ticketNumber.toUpperCase(),
        devisNumber: validDevis.map(d => d.toUpperCase()).join(','),
      });

      const apiData = result.data || {};

      if (apiData.devisUsed) {
        setError('Ce bon de commande a déjà été utilisé.');
        sounds.error();
      } else if (apiData.alreadyUsed) {
        setError('Ce billet a déjà été utilisé.');
        sounds.error();
      } else if (apiData.notFound) {
        setError('Billet ou bon de commande introuvable. Vérifiez les numéros.');
        sounds.error();
      } else if (result.success && apiData.clientName) {
        const wheelData = {
          ticketNumber: ticketNumber.toUpperCase(),
          devisNumber: validDevis.map(d => d.toUpperCase()).join(','),
          devisNumbers: validDevis.map(d => d.toUpperCase()),
          clientName: apiData.clientName,
          salon: apiData.salon,
          city: apiData.city,
        };
        localStorage.setItem('wheelData', JSON.stringify(wheelData));
        setClientName(apiData.clientName);
        setShowWelcome(true);
        sounds.success();
        setTimeout(() => navigate('/greeting'), 3000);
      } else {
        setError('Connexion impossible. Réessayez.');
        sounds.error();
      }
    } catch {
      setError('Connexion impossible. Réessayez.');
      sounds.error();
    } finally {
      setIsValidating(false);
    }
  };

  // Format ticket — préfixe SD26- protégé
  const handleTicketChange = (value: string) => {
    const PREFIX = 'SD26-';
    const upper = value.toUpperCase();
    if (!upper.startsWith(PREFIX)) {
      setTicketNumber(PREFIX);
      return;
    }
    const suffix = upper.slice(PREFIX.length).replace(/[^A-Z0-9]/g, '');
    if (suffix.length <= 4) {
      setTicketNumber(PREFIX + suffix);
      setError('');
    }
  };

  // Format devis (SXXXXX — 6 chars max)
  const handleDevisChange = (index: number, value: string) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.length <= 6) {
      const updated = [...devisNumbers];
      updated[index] = cleaned;
      setDevisNumbers(updated);
      setError('');
    }
  };

  const addDevis = () => {
    if (devisNumbers.length < MAX_DEVIS) {
      const newIndex = devisNumbers.length;
      setDevisNumbers([...devisNumbers, '']);
      setActiveField(`devis-${newIndex}`);
      sounds.click();
    }
  };

  const removeDevis = (index: number) => {
    if (devisNumbers.length <= 1) return;
    const updated = devisNumbers.filter((_, i) => i !== index);
    setDevisNumbers(updated);
    const nextIndex = Math.min(index, updated.length - 1);
    setActiveField(`devis-${nextIndex}`);
    sounds.click();
  };

  const validDevis = devisNumbers.filter(d => d.length === 6);
  const isFormValid = ticketNumber.length >= 8 && validDevis.length > 0;

  // Clavier virtuel
  const handleKeypadKey = (key: string) => {
    sounds.click();
    if (activeField === 'ticket') {
      handleTicketChange(ticketNumber + key);
    } else if (activeField.startsWith('devis-')) {
      const index = parseInt(activeField.replace('devis-', ''), 10);
      if (!isNaN(index) && index < devisNumbers.length) {
        handleDevisChange(index, devisNumbers[index] + key);
      }
    }
  };

  const handleKeypadBackspace = () => {
    sounds.click();
    if (activeField === 'ticket') {
      if (ticketNumber.length > 'SD26-'.length) {
        handleTicketChange(ticketNumber.slice(0, -1));
      }
    } else if (activeField.startsWith('devis-')) {
      const index = parseInt(activeField.replace('devis-', ''), 10);
      if (!isNaN(index) && index < devisNumbers.length && devisNumbers[index].length > 0) {
        handleDevisChange(index, devisNumbers[index].slice(0, -1));
      }
    }
  };

  const activeIsDevis = activeField.startsWith('devis-');
  const keypadColor = activeIsDevis ? '#C4904A' : '#E8007D';

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#FAF7F2' }}>
      <AuroraBackground />
      <ParticleField />
      <TopBar rightAction={{ icon: <Sparkles size={18} />, label: 'Roue de la Fortune' }} />

      <motion.div
        className="absolute top-[44px] left-0 right-0 bottom-0 px-4 pt-3 pb-3 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero */}
        <motion.div
          className="text-center mb-3"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <motion.div
            className="inline-flex items-center gap-2 border rounded-full px-5 py-2 mb-4 relative overflow-hidden"
            style={{
              borderColor: 'rgba(232,0,125,0.25)',
              background: 'rgba(232,0,125,0.06)',
              boxShadow: '0 0 20px rgba(232,0,125,0.10)',
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles size={12} color="#E8007D" />
            <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#E8007D' }}>
              Accès Exclusif
            </span>
          </motion.div>

          <motion.div
            className="flex justify-center mb-2"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <SemilacDaysLogo height={60} />
          </motion.div>

          <motion.div
            className="mt-2"
            style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#E8007D' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Roue de la Fortune
          </motion.div>
        </motion.div>

        {/* Card */}
        <motion.div
          className="rounded-3xl p-5 backdrop-blur-xl relative overflow-hidden"
          style={{
            background: 'rgba(250,247,242,0.92)',
            border: '1px solid rgba(232,0,125,0.22)',
            boxShadow: '0 8px 40px rgba(232,0,125,0.14)',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Glow */}
          <motion.div
            className="absolute top-0 left-1/2 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(232,0,125,0.08), transparent)',
              filter: 'blur(40px)',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="relative">
            {/* Instructions */}
            <div className="text-center mb-4" style={{ fontSize: '11px', color: 'rgba(26,16,5,0.65)', letterSpacing: '0.04em', lineHeight: 1.6, fontWeight: 500 }}>
              Entrez votre numéro de billet et vos bons de commande.
            </div>

            {/* Champ 1 : Billet */}
            <motion.div
              className="mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Ticket size={13} color="#F8A4C8" />
                <label style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E8007D' }}>
                  Numéro de billet
                </label>
              </div>
              <input
                type="text"
                value={ticketNumber}
                readOnly
                inputMode="none"
                onFocus={(e) => e.target.blur()}
                onClick={() => { setActiveField('ticket'); setKeypadVisible(true); }}
                dir="ltr"
                placeholder="SD26-0001"
                className="w-full rounded-xl px-5 py-3 outline-none transition-all duration-200"
                style={{
                  background: activeField === 'ticket' ? 'rgba(232,0,125,0.10)' : 'rgba(232,0,125,0.04)',
                  border: activeField === 'ticket' ? '2px solid rgba(232,0,125,0.55)' : '2px solid rgba(232,0,125,0.2)',
                  color: '#1A1005',
                  fontSize: '16px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textAlign: 'center',
                  fontFamily: "'Courier New', monospace",
                  cursor: 'pointer',
                }}
              />
              <div style={{ fontSize: '7px', color: 'rgba(26,16,5,0.45)', textAlign: 'right', marginTop: '3px' }}>
                Format : SD26-XXXX
              </div>
            </motion.div>

            {/* Champs Bons de commande */}
            <motion.div
              className="mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText size={13} color="#D4A574" />
                <label style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C4904A' }}>
                  Bon{devisNumbers.length > 1 ? 's' : ''} de commande
                </label>
                <span style={{ fontSize: '8px', color: 'rgba(196,144,74,0.6)', marginLeft: 'auto' }}>
                  {devisNumbers.length}/{MAX_DEVIS}
                </span>
              </div>

              {/* Liste des bons */}
              <div className="space-y-2">
                <AnimatePresence>
                  {devisNumbers.map((devis, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <div className="flex-1 relative">
                        {devisNumbers.length > 1 && (
                          <span
                            style={{
                              position: 'absolute',
                              left: '10px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              fontSize: '8px',
                              color: 'rgba(196,144,74,0.5)',
                              fontWeight: 700,
                              zIndex: 1,
                              pointerEvents: 'none',
                            }}
                          >
                            {index + 1}.
                          </span>
                        )}
                        <input
                          type="text"
                          value={devis}
                          readOnly
                          inputMode="none"
                          onFocus={(e) => e.target.blur()}
                          onClick={() => { setActiveField(`devis-${index}`); setKeypadVisible(true); }}
                          dir="ltr"
                          placeholder="S_____"
                          className="w-full rounded-xl py-3 outline-none transition-all duration-200"
                          style={{
                            paddingLeft: devisNumbers.length > 1 ? '28px' : '20px',
                            paddingRight: '20px',
                            background: activeField === `devis-${index}` ? 'rgba(196,144,74,0.15)' : 'rgba(196,144,74,0.06)',
                            border: activeField === `devis-${index}` ? '2px solid rgba(196,144,74,0.6)' : '2px solid rgba(196,144,74,0.22)',
                            color: '#1A1005',
                            fontSize: '15px',
                            fontWeight: 700,
                            letterSpacing: '0.25em',
                            textAlign: 'center',
                            fontFamily: "'Courier New', monospace",
                            cursor: 'pointer',
                          }}
                        />
                        {/* Indicateur de validité */}
                        {devis.length === 6 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                              position: 'absolute',
                              right: '8px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#22c55e',
                            }}
                          />
                        )}
                      </div>

                      {/* Bouton supprimer */}
                      {devisNumbers.length > 1 && (
                        <motion.button
                          type="button"
                          onClick={() => removeDevis(index)}
                          whileTap={{ scale: 0.9 }}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'rgba(220,50,50,0.08)',
                            border: '1px solid rgba(220,50,50,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0,
                          }}
                        >
                          <X size={14} color="rgba(220,50,50,0.7)" />
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Bouton + Ajouter un bon */}
              {devisNumbers.length < MAX_DEVIS && (
                <motion.button
                  type="button"
                  onClick={addDevis}
                  whileTap={{ scale: 0.97 }}
                  className="w-full mt-2 rounded-xl flex items-center justify-center gap-2"
                  style={{
                    padding: '10px',
                    border: '1.5px dashed rgba(196,144,74,0.35)',
                    background: 'rgba(196,144,74,0.04)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <Plus size={14} color="rgba(196,144,74,0.7)" />
                  <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(196,144,74,0.7)' }}>
                    Ajouter un bon de commande
                  </span>
                </motion.button>
              )}

              <div style={{ fontSize: '7px', color: 'rgba(26,16,5,0.45)', textAlign: 'right', marginTop: '3px' }}>
                Format : SXXXXX (6 caractères)
              </div>
            </motion.div>

            {/* Erreur */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="mb-3 flex items-center gap-2 p-3 rounded-xl"
                  style={{ background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.3)' }}
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                >
                  <AlertCircle size={16} color="#FF6464" />
                  <span style={{ fontSize: '9px', color: '#FF6464', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {error}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bouton valider */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 }}
            >
              <ShimmerButton
                className="w-full h-13"
                onClick={handleValidate}
                disabled={!isFormValid || isValidating}
              >
                <AnimatePresence mode="wait">
                  {isValidating ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                      <span>Vérification...</span>
                    </motion.div>
                  ) : (
                    <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {validDevis.length > 1
                        ? `Valider (${validDevis.length} bons)`
                        : 'Valider & Lancer la Roue'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </ShimmerButton>
            </motion.div>
          </div>
        </motion.div>

        {/* Clavier virtuel alphanumeric — toujours visible */}
        <motion.div
          className="mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <CustomKeypad
            onKey={handleKeypadKey}
            onBackspace={handleKeypadBackspace}
            mode="alphanumeric"
            accentColor={keypadColor}
            visible={keypadVisible}
            onToggle={() => setKeypadVisible(v => !v)}
          />
        </motion.div>

        {/* BrandStrip en bas */}
        <motion.div
          className="mt-auto pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <BrandStrip />
        </motion.div>
      </motion.div>

      {/* Écran de bienvenue */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center"
            style={{ background: 'radial-gradient(circle at center, rgba(13,0,8,0.98), rgba(13,0,8,0.95))' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="absolute w-96 h-96 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(248,164,200,0.3), transparent)', filter: 'blur(100px)' }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ background: i % 2 === 0 ? '#F8A4C8' : '#D4A574', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{ y: [0, -100, 0], opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}

            <motion.div
              className="relative z-10 text-center px-8"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 border rounded-full px-6 py-2 mb-6"
                style={{ borderColor: 'rgba(248,164,200,0.4)', background: 'rgba(248,164,200,0.12)', boxShadow: '0 0 30px rgba(248,164,200,0.3)' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <Sparkles size={14} color="#F8A4C8" />
                <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#F8A4C8' }}>
                  Bienvenue
                </span>
              </motion.div>

              <motion.div
                style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,248,245,0.7)', marginBottom: '16px' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Bonjour
              </motion.div>

              <motion.div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '48px',
                  fontWeight: 600,
                  fontStyle: 'italic',
                  lineHeight: 1.1,
                  background: 'linear-gradient(135deg, #F8A4C8, #ffc8de, #D4A574)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '24px',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: 'spring', bounce: 0.5 }}
              >
                {clientName}
              </motion.div>

              <motion.div
                style={{ fontSize: '12px', color: 'rgba(255,248,245,0.8)', letterSpacing: '0.08em', lineHeight: 1.6, marginBottom: '32px', maxWidth: '320px', margin: '0 auto 32px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Votre ticket a bien été validé.
                <br />
                <span style={{ fontWeight: 700, color: '#F8A4C8' }}>
                  Préparez-vous à faire tourner la roue !
                </span>
              </motion.div>

              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                transition={{ delay: 1.1, rotate: { duration: 2, repeat: Infinity, ease: 'linear' } }}
              >
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full"
                  style={{ background: 'linear-gradient(135deg, rgba(248,164,200,0.2), rgba(212,165,116,0.2))', border: '2px solid rgba(248,164,200,0.4)', boxShadow: '0 0 30px rgba(248,164,200,0.3)' }}
                >
                  <Sparkles size={32} color="#F8A4C8" />
                </div>
              </motion.div>

              <motion.div className="flex items-center justify-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: '#F8A4C8' }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
