import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, MapPin, Users } from 'lucide-react';
import { AuroraBackground } from '../components/AuroraBackground';
import { ParticleField } from '../components/ParticleField';
import { TopBar } from '../components/TopBar';
import { ShimmerButton } from '../components/ShimmerButton';
import { PremiumInput } from '../components/PremiumInput';
import { PremiumSelect } from '../components/PremiumSelect';
import { sounds } from '../utils/sounds';
import { callAPI } from '../utils/api';

// Fallback local uniquement si l'API échoue
function generateFallbackTicket(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SD26-${code}`;
}

const PEOPLE_OPTIONS = [
  { value: '1', label: '1 personne' },
  { value: '2', label: '2 personnes' },
  { value: '3', label: '3 personnes' },
  { value: '4', label: '4 personnes' },
];

const REPRESENTATIVE_OPTIONS = [
  { value: 'Radia', label: 'Radia' },
  { value: 'Zineb', label: 'Zineb' },
  { value: 'Boutaina', label: 'Boutaina' },
  { value: 'Chaimae', label: 'Chaimae' },
  { value: 'Kamelia', label: 'Kamelia' },
  { value: 'Maroua', label: 'Maroua' },
  { value: 'Wafaa', label: 'Wafaa' },
];

const DAY_OPTIONS = [
  { value: '14 MAI 2026', label: '14 Mai 2026' },
  { value: '15 MAI 2026', label: '15 Mai 2026' },
  { value: '16 MAI 2026', label: '16 Mai 2026' },
  { value: '17 MAI 2026', label: '17 Mai 2026' },
  { value: '18 MAI 2026', label: '18 Mai 2026' },
  { value: '19 MAI 2026', label: '19 Mai 2026' },
];

export function RSVPForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    salon: '',
    city: '',
    whatsapp: '',
    people: '',
    representative: '',
    day: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const isValidPhone = (v: string) => /^0[67]\d{8}$/.test(v.replace(/\s/g, ''));

  // Nombre de champs valides pour la barre de progression
  const filledCount = [
    formData.fullName.length > 2,
    formData.salon.length > 2,
    formData.city.length > 2,
    isValidPhone(formData.whatsapp),
    formData.people.length > 0,
    formData.representative.length > 0,
    formData.day.length > 0,
  ].filter(Boolean).length;

  const progress = filledCount / 7;

  const isFormValid =
    formData.fullName.length > 2 &&
    formData.salon.length > 2 &&
    formData.city.length > 2 &&
    isValidPhone(formData.whatsapp) &&
    formData.representative.length > 0 &&
    formData.people.length > 0 &&
    formData.day.length > 0;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    sounds.click();

    try {
      // Séparer fullName pour l'API (prénom = premier mot, nom = reste)
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Appeler l'API — le ticket est généré côté serveur
      const result = await callAPI({
        action: 'registerRSVP',
        clientName: formData.fullName.trim(),
        firstName,
        lastName,
        salon: formData.salon,
        city: formData.city,
        phone: formData.whatsapp,
        representative: formData.representative,
        people: formData.people,
        day: formData.day,
      });

      // Bloquer si numéro déjà inscrit
      if (result.data?.phoneDuplicate) {
        setPhoneError('Ce numéro WhatsApp est déjà inscrit');
        setIsSubmitting(false);
        return;
      }

      // Utiliser le ticket retourné par le serveur, sinon fallback local
      const ticketNumber =
        (result.success && result.ticketNumber) ? result.ticketNumber : generateFallbackTicket();

      // Sauvegarder dans localStorage
      localStorage.setItem('rsvpData', JSON.stringify({
        fullName: formData.fullName.trim(),
        salonName: formData.salon,
        city: formData.city,
        whatsapp: formData.whatsapp,
        people: formData.people,
        representative: formData.representative,
        day: formData.day,
        ticketNumber,
      }));

      sounds.success();
      navigate('/confirmation');
    } catch (error) {
      console.error('Erreur RSVP:', error);
      // Mode offline : ticket local + navigation quand même
      const ticketNumber = generateFallbackTicket();
      localStorage.setItem('rsvpData', JSON.stringify({
        fullName: formData.fullName.trim(),
        salonName: formData.salon,
        city: formData.city,
        whatsapp: formData.whatsapp,
        people: formData.people,
        representative: formData.representative,
        day: formData.day,
        ticketNumber,
      }));
      sounds.success();
      navigate('/confirmation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#0D0008' }}>
      <AuroraBackground />
      <ParticleField />
      <TopBar />

      <motion.div
        className="absolute top-[44px] left-0 right-0 bottom-0 px-4 pt-4 pb-2 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Hero Section */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Animated badge */}
          <motion.div
            className="inline-flex items-center gap-2 border rounded-full px-4 py-2 mb-4 relative overflow-hidden"
            style={{
              borderColor: 'rgba(248,164,200,0.3)',
              background: 'rgba(248,164,200,0.06)',
              boxShadow: '0 0 20px rgba(248,164,200,0.2)',
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(248,164,200,0.4)' }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={12} color="#F8A4C8" />
            </motion.div>
            <span
              style={{
                fontSize: '8px',
                fontWeight: 700,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#F8A4C8',
              }}
            >
              Invitation Exclusive
            </span>
          </motion.div>

          {/* Main title */}
          <motion.div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '64px',
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 0.85,
              background: 'linear-gradient(150deg, #c47090, #F8A4C8, #ffdaec, #D4A574)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 200%',
            }}
            whileHover={{ scale: 1.05 }}
          >
            Semilac
          </motion.div>

          <motion.div
            style={{
              fontSize: '22px',
              fontWeight: 800,
              letterSpacing: '0.48em',
              textTransform: 'uppercase',
              color: '#FFF8F5',
              marginTop: '4px',
              textShadow: '0 2px 20px rgba(248,164,200,0.3)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            DAYS
          </motion.div>

          {/* Event info */}
          <motion.div
            className="flex items-center justify-center gap-2 mt-4 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {[
              { icon: <Calendar size={12} />, text: '14—19 MAI 2026' },
              { icon: <MapPin size={12} />, text: 'CASABLANCA' },
              { icon: <Users size={12} />, text: '2ÈME ÉDITION' },
            ].map(({ icon, text }) => (
              <motion.div
                key={text}
                className="flex items-center gap-1"
                whileHover={{ scale: 1.1 }}
                style={{ fontSize: '9px', color: 'rgba(248,164,200,0.6)', letterSpacing: '0.1em' }}
              >
                {icon}
                <span>{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden"
          style={{
            background: 'rgba(20,5,15,0.88)',
            border: '1px solid rgba(248,164,200,0.18)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(248,164,200,0.1)',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{
            boxShadow: '0 25px 70px rgba(248,164,200,0.3), 0 0 0 1px rgba(248,164,200,0.2)',
          }}
        >
          {/* Ambient glow */}
          <motion.div
            className="absolute top-0 left-1/2 w-64 h-64 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(248,164,200,0.15), transparent)',
              filter: 'blur(40px)',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <motion.div
            className="text-center mb-5 relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.h2
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                background: 'linear-gradient(90deg, #F8A4C8, #ffc8de, #F8A4C8)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Confirmez votre présence
            </motion.h2>
          </motion.div>

          <div className="flex flex-col gap-2 relative">
            {/* Champ fusionné Nom complet */}
            <PremiumInput
              placeholder="Nom complet"
              value={formData.fullName}
              onChange={(value) => setFormData({ ...formData, fullName: value })}
              required
              validate={(v) => v.trim().split(/\s+/).length >= 2 && v.length > 2}
            />

            <PremiumInput
              placeholder="Salon / Institut"
              value={formData.salon}
              onChange={(value) => setFormData({ ...formData, salon: value })}
              required
              validate={(v) => v.length > 2}
            />

            <div className="grid grid-cols-2 gap-3">
              <PremiumInput
                placeholder="Ville"
                value={formData.city}
                onChange={(value) => setFormData({ ...formData, city: value })}
                required
                validate={(v) => v.length > 2}
              />
              <PremiumInput
                placeholder="WhatsApp (06 ou 07...)"
                value={formData.whatsapp}
                onChange={(value) => { setFormData({ ...formData, whatsapp: value }); setPhoneError(''); }}
                type="tel"
                required
                validate={(v) => isValidPhone(v)}
                errorMessage={phoneError || (formData.whatsapp.length > 5 && !isValidPhone(formData.whatsapp) ? 'Format invalide : 06 ou 07 XXXXXXXX' : '')}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <PremiumSelect
                label="Personnes"
                value={formData.people}
                onChange={(value) => setFormData({ ...formData, people: value })}
                options={PEOPLE_OPTIONS}
                required
              />
              <PremiumSelect
                label="Représentant"
                value={formData.representative}
                onChange={(value) => setFormData({ ...formData, representative: value })}
                options={REPRESENTATIVE_OPTIONS}
                required
              />
            </div>

            <PremiumSelect
              label="Jour de venue"
              value={formData.day}
              onChange={(value) => setFormData({ ...formData, day: value })}
              options={DAY_OPTIONS}
              required
            />
          </div>

          {/* Progress bar */}
          <div className="mt-5 relative">
            <div
              className="relative w-full rounded-full overflow-hidden"
              style={{ height: '3px', background: 'rgba(255,255,255,0.07)' }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #c47090, #F8A4C8, #D4A574)',
                }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <motion.span
                style={{
                  fontSize: '7px',
                  letterSpacing: '0.1em',
                  color: 'rgba(248,164,200,0.35)',
                  textTransform: 'uppercase',
                }}
                animate={{ opacity: progress === 1 ? [0.35, 0.8, 0.35] : 0.35 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {progress === 1 ? '✓ Formulaire complet' : 'Informations requises'}
              </motion.span>
              <span
                style={{
                  fontSize: '7px',
                  letterSpacing: '0.1em',
                  color: 'rgba(248,164,200,0.35)',
                }}
              >
                {filledCount}/7
              </span>
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-4 relative">
            <ShimmerButton
              className="w-full h-14"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      className="w-4 h-4 border-2 border-[#0D0008] border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                    <span>Envoi...</span>
                  </motion.div>
                ) : (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ fontSize: '13px', letterSpacing: '0.14em' }}
                  >
                    ✓ JE CONFIRME
                  </motion.span>
                )}
              </AnimatePresence>
            </ShimmerButton>
          </div>
        </motion.div>

        {/* Bottom hint */}
        <motion.div
          className="text-center mt-6 pb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            style={{
              fontSize: '8px',
              color: 'rgba(248,164,200,0.6)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨ Une expérience inoubliable vous attend ✨
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
