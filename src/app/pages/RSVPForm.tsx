import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, MapPin, Users, Gift, Ticket, Car } from 'lucide-react';
import { AuroraBackground } from '../components/AuroraBackground';
import { SemilacDaysLogo } from '../components/logos/SemilacDaysLogo';
import { ParticleField } from '../components/ParticleField';
import { TopBar } from '../components/TopBar';
import { ShimmerButton } from '../components/ShimmerButton';
import { PremiumInput } from '../components/PremiumInput';
import { PremiumSelect } from '../components/PremiumSelect';
import { BrandStrip } from '../components/logos/BrandStrip';
import { sounds } from '../utils/sounds';
import { callAPI } from '../utils/api';
import { useLang, t } from '../i18n';

// Fallback local uniquement si l'API échoue
function generateFallbackTicket(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SD26-${code}`;
}

const REPRESENTATIVE_OPTIONS = [
  { value: 'Radia', label: 'Radia' },
  { value: 'Zineb', label: 'Zineb' },
  { value: 'Boutaina', label: 'Boutaina' },
  { value: 'Chaimae', label: 'Chaimae' },
  { value: 'Kamelia', label: 'Kamelia' },
  { value: 'Maroua', label: 'Maroua' },
  { value: 'Wafaa', label: 'Wafaa' },
];

function getPeopleOptions(lang: 'fr' | 'ar') {
  const s = lang === 'fr' ? 'personne' : 'شخص';
  const p = lang === 'fr' ? 'personnes' : 'أشخاص';
  return [
    { value: '1', label: `1 ${s}` },
    { value: '2', label: `2 ${p}` },
    { value: '3', label: `3 ${p}` },
    { value: '4', label: `4 ${p}` },
  ];
}

function getDayOptions(lang: 'fr' | 'ar') {
  const month = lang === 'fr' ? 'Mai' : 'ماي';
  return [14, 15, 16, 17, 18, 19].map((d) => ({
    value: `${d} MAI 2026`,
    label: `${d} ${month} 2026`,
  }));
}

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
  const { lang } = useLang();

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
        setPhoneError(t('rsvp', 'phoneDuplicate', lang));
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
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#FAF7F2' }}>
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
              borderColor: 'rgba(232,0,125,0.25)',
              background: 'rgba(232,0,125,0.06)',
              boxShadow: '0 0 20px rgba(232,0,125,0.12)',
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(232,0,125,0.2)' }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={12} color="#E8007D" />
            </motion.div>
            <span
              style={{
                fontSize: '8px',
                fontWeight: 700,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#E8007D',
              }}
            >
              {t('rsvp', 'badge', lang)}
            </span>
          </motion.div>

          {/* Main title — logo officiel */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            whileHover={{ scale: 1.03 }}
          >
            <SemilacDaysLogo height={80} />
          </motion.div>

          {/* Event info */}
          <motion.div
            className="flex items-center justify-center gap-2 mt-4 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {[
              { icon: <Calendar size={12} />, text: t('rsvp', 'dates', lang) },
              { icon: <MapPin size={12} />, text: t('rsvp', 'location', lang) },
              { icon: <Users size={12} />, text: t('rsvp', 'edition', lang) },
            ].map(({ icon, text }) => (
              <motion.div
                key={text}
                className="flex items-center gap-1"
                whileHover={{ scale: 1.1 }}
                style={{ fontSize: '10px', color: '#E8007D', letterSpacing: '0.1em', fontWeight: 600, paddingTop: '2px' }}
              >
                {icon}
                <span>{text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Event teaser — 3 avantages clés */}
          <motion.div
            className="mt-5 px-4 py-4 rounded-2xl"
            style={{
              background: 'rgba(250,247,242,0.75)',
              border: '1px solid rgba(232,0,125,0.22)',
              backdropFilter: 'blur(8px)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {[
              { icon: <Gift size={18} color="#E8007D" />, text: t('rsvp', 'perk1', lang) },
              { icon: <Ticket size={18} color="#ff4da6" />, text: t('rsvp', 'perk2', lang) },
              { icon: <Car size={18} color="#C4904A" />, text: t('rsvp', 'perk3', lang) },
            ].map(({ icon, text }, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 mb-2 last:mb-0"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + i * 0.1 }}
              >
                <span className="flex-shrink-0" style={{ opacity: 0.85 }}>{icon}</span>
                <span style={{ fontSize: '11px', color: 'rgba(26,16,5,0.65)', fontWeight: 500 }}>{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden"
          style={{
            background: 'rgba(250,247,242,0.92)',
            border: '1px solid rgba(232,0,125,0.22)',
            boxShadow: '0 8px 40px rgba(232,0,125,0.14)',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{
            boxShadow: '0 12px 50px rgba(232,0,125,0.12)',
          }}
        >
          {/* Ambient glow */}
          <motion.div
            className="absolute top-0 left-1/2 w-64 h-64 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(232,0,125,0.08), transparent)',
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
                color: '#E8007D',
              }}
            >
              {t('rsvp', 'formTitle', lang)}
            </motion.h2>
          </motion.div>

          <div className="flex flex-col gap-2 relative">
            {/* Champ fusionné Nom complet */}
            <PremiumInput
              placeholder={t('rsvp', 'fullName', lang)}
              value={formData.fullName}
              onChange={(value) => setFormData({ ...formData, fullName: value })}
              required
              validate={(v) => v.trim().split(/\s+/).length >= 2 && v.trim().length > 4}
            />

            <PremiumInput
              placeholder={t('rsvp', 'salon', lang)}
              value={formData.salon}
              onChange={(value) => setFormData({ ...formData, salon: value })}
              required
              validate={(v) => v.length > 2}
            />

            <div className="grid grid-cols-2 gap-3">
              <PremiumInput
                placeholder={t('rsvp', 'city', lang)}
                value={formData.city}
                onChange={(value) => setFormData({ ...formData, city: value })}
                required
                validate={(v) => v.length > 2}
              />
              <PremiumInput
                placeholder={t('rsvp', 'whatsapp', lang)}
                value={formData.whatsapp}
                onChange={(value) => { setFormData({ ...formData, whatsapp: value }); setPhoneError(''); }}
                type="tel"
                required
                validate={(v) => isValidPhone(v)}
                errorMessage={phoneError || (formData.whatsapp.length > 5 && !isValidPhone(formData.whatsapp) ? t('rsvp', 'phoneError', lang) : '')}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <PremiumSelect
                label={t('rsvp', 'people', lang)}
                value={formData.people}
                onChange={(value) => setFormData({ ...formData, people: value })}
                options={getPeopleOptions(lang)}
                required
              />
              <PremiumSelect
                label={t('rsvp', 'representative', lang)}
                value={formData.representative}
                onChange={(value) => setFormData({ ...formData, representative: value })}
                options={REPRESENTATIVE_OPTIONS}
                required
              />
            </div>

            <PremiumSelect
              label={t('rsvp', 'day', lang)}
              value={formData.day}
              onChange={(value) => setFormData({ ...formData, day: value })}
              options={getDayOptions(lang)}
              required
            />
          </div>

          {/* Progress bar */}
          <div className="mt-5 relative">
            <div
              className="relative w-full rounded-full overflow-hidden"
              style={{ height: '4px', background: 'rgba(26,16,5,0.08)' }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #C4157A, #E8007D, #C4904A)',
                }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <motion.span
                style={{
                  fontSize: '9px',
                  fontWeight: progress === 1 ? 700 : 600,
                  letterSpacing: '0.08em',
                  color: progress === 1 ? '#E8007D' : 'rgba(232,0,125,0.65)',
                  textTransform: 'uppercase',
                }}
                animate={{ opacity: progress === 1 ? [0.6, 1, 0.6] : 1 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {progress === 1 ? t('rsvp', 'progressDone', lang) : progress > 0 ? t('rsvp', 'progressActive', lang) : t('rsvp', 'progress0', lang)}
              </motion.span>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: 'rgba(232,0,125,0.65)',
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
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                    <span>{t('rsvp', 'submitting', lang)}</span>
                  </motion.div>
                ) : (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ fontSize: '13px', letterSpacing: '0.14em' }}
                  >
                    {t('rsvp', 'submit', lang)}
                  </motion.span>
                )}
              </AnimatePresence>
            </ShimmerButton>
          </div>
        </motion.div>

        {/* Bottom hint */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            style={{
              fontSize: '9px',
              color: '#E8007D',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {t('rsvp', 'bottomHint', lang)}
          </motion.div>
        </motion.div>

        {/* Sponsored by */}
        <motion.div
          className="mt-6 pb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <BrandStrip />
        </motion.div>
      </motion.div>
    </div>
  );
}
