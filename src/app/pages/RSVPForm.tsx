import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, MapPin, Users } from 'lucide-react';
import { AuroraBackground } from '../components/AuroraBackground';
import { ParticleField } from '../components/ParticleField';
import { TopBar } from '../components/TopBar';
import { ShimmerButton } from '../components/ShimmerButton';
import { PremiumInput } from '../components/PremiumInput';
import { PageTransition } from '../components/PageTransition';
import { sounds } from '../utils/sounds';
import { callAPI } from '../utils/api';

// Fonction pour générer un identifiant SD26-XXXX (4 caractères alphanumériques aléatoires)
function generateTicketNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SD26-${code}`;
}

export function RSVPForm() {
  console.log('RSVPForm rendering'); // Debug log
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    salon: '',
    city: '',
    whatsapp: '',
    people: '',
    representative: '',
    day: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    sounds.click();

    try {
      // Générer le numéro de billet unique SD26-XXXX
      const ticketNumber = generateTicketNumber();
      const clientName = `${formData.firstName} ${formData.lastName}`.trim();

      // Sauvegarder dans localStorage
      const rsvpData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        salonName: formData.salon,
        city: formData.city,
        whatsapp: formData.whatsapp,
        people: formData.people,
        representative: formData.representative,
        day: formData.day,
        ticketNumber,
      };
      localStorage.setItem('rsvpData', JSON.stringify(rsvpData));

      // Appeler l'API pour enregistrer le RSVP
      await callAPI({
        action: 'registerRSVP',
        ticket: ticketNumber,
        clientName,
        salon: formData.salon,
        city: formData.city,
        representative: formData.representative,
      });

      sounds.success();
      
      // Naviguer vers la page de confirmation
      navigate('/confirmation');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement RSVP:', error);
      sounds.error();
      // Naviguer quand même vers la confirmation (mode offline)
      navigate('/confirmation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.firstName.length > 1 &&
    formData.lastName.length > 1 &&
    formData.salon.length > 2 &&
    formData.city.length > 2 &&
    formData.whatsapp.length > 5 &&
    formData.representative.length > 2 &&
    formData.people.length > 0 &&
    formData.day.length > 0;

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
        {/* Hero Section with 3D perspective */}
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
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
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

          {/* Main title with gradient animation */}
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

          {/* Animated info with icons */}
          <motion.div
            className="flex items-center justify-center gap-2 mt-4 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div
              className="flex items-center gap-1"
              whileHover={{ scale: 1.1 }}
              style={{
                fontSize: '9px',
                color: 'rgba(248,164,200,0.6)',
                letterSpacing: '0.1em',
              }}
            >
              <Calendar size={12} />
              <span>14—19 MAI 2026</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-1"
              whileHover={{ scale: 1.1 }}
              style={{
                fontSize: '9px',
                color: 'rgba(248,164,200,0.6)',
                letterSpacing: '0.1em',
              }}
            >
              <MapPin size={12} />
              <span>CASABLANCA</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-1"
              whileHover={{ scale: 1.1 }}
              style={{
                fontSize: '9px',
                color: 'rgba(248,164,200,0.6)',
                letterSpacing: '0.1em',
              }}
            >
              <Users size={12} />
              <span>2ÈME ÉDITION</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Form Card with 3D transform */}
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
          {/* Ambient glow inside card */}
          <motion.div
            className="absolute top-0 left-1/2 w-64 h-64 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(248,164,200,0.15), transparent)',
              filter: 'blur(40px)',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
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
            <PremiumInput
              placeholder="Prénom"
              value={formData.firstName}
              onChange={(value) => setFormData({ ...formData, firstName: value })}
              required
              validate={(v) => v.length > 1}
            />

            <PremiumInput
              placeholder="Nom"
              value={formData.lastName}
              onChange={(value) => setFormData({ ...formData, lastName: value })}
              required
              validate={(v) => v.length > 1}
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
                placeholder="WhatsApp"
                value={formData.whatsapp}
                onChange={(value) => setFormData({ ...formData, whatsapp: value })}
                type="tel"
                required
                validate={(v) => v.length > 5}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select
                className="w-full rounded-xl px-2 py-4 outline-none transition-transform duration-200 hover:scale-[1.02] focus:scale-[1.02]"
                style={{
                  background: 'rgba(248,164,200,0.08)',
                  border: '1px solid rgba(248,164,200,0.2)',
                  color: formData.people ? '#FFF8F5' : 'rgba(255,248,245,0.4)',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: 0,
                  boxShadow: '0 4px 12px rgba(248,164,200,0.1)',
                  textAlign: 'center',
                  textAlignLast: 'center',
                }}
                value={formData.people}
                onChange={(e) => setFormData({ ...formData, people: e.target.value })}
              >
                <option value="">PERSONNES *</option>
                <option value="1">1 PERSONNE</option>
                <option value="2">2 PERSONNES</option>
                <option value="3">3 PERSONNES</option>
                <option value="4">4 PERSONNES</option>
              </select>

              <select
                className="w-full rounded-xl px-2 py-4 outline-none transition-transform duration-200 hover:scale-[1.02] focus:scale-[1.02]"
                style={{
                  background: 'rgba(248,164,200,0.08)',
                  border: '1px solid rgba(248,164,200,0.2)',
                  color: formData.representative ? '#FFF8F5' : 'rgba(255,248,245,0.4)',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: 0,
                  boxShadow: '0 4px 12px rgba(248,164,200,0.1)',
                  textAlign: 'center',
                  textAlignLast: 'center',
                }}
                value={formData.representative}
                onChange={(e) => setFormData({ ...formData, representative: e.target.value })}
              >
                <option value="">REPRÉSENTANT *</option>
                <option value="Radia">RADIA</option>
                <option value="Zineb">ZINEB</option>
                <option value="Boutaina">BOUTAINA</option>
                <option value="Chaimae">CHAIMAE</option>
                <option value="Kamilia">KAMILIA</option>
                <option value="Maroua">MAROUA</option>
                <option value="Wafaa">WAFAA</option>
              </select>
            </div>

            <select
              className="w-full rounded-xl px-4 py-4 outline-none transition-transform duration-200 hover:scale-[1.02] focus:scale-[1.02]"
              style={{
                background: 'rgba(248,164,200,0.08)',
                border: '1px solid rgba(248,164,200,0.2)',
                color: formData.day ? '#FFF8F5' : 'rgba(255,248,245,0.4)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                boxShadow: '0 4px 12px rgba(248,164,200,0.1)',
                textAlign: 'center',
                textAlignLast: 'center',
              }}
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
            >
              <option value="">JOUR DE VENUE *</option>
              <option>14 MAI 2026</option>
              <option>15 MAI 2026</option>
              <option>16 MAI 2026</option>
              <option>17 MAI 2026</option>
              <option>18 MAI 2026</option>
              <option>19 MAI 2026</option>
            </select>
          </div>

          <div className="flex gap-3 mt-6 relative">
            <ShimmerButton
              className="flex-[2] h-14"
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

            <ShimmerButton variant="secondary" className="flex-1 h-14" onClick={() => {
              sounds.click();
              navigate('/decline');
            }}>
              Décliner
            </ShimmerButton>
          </div>

          {/* Form progress indicator */}
          <motion.div className="mt-4 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            <div className="flex justify-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background:
                      (i === 0 && formData.firstName) ||
                      (i === 1 && formData.salon) ||
                      (i === 2 && formData.city && formData.whatsapp) ||
                      (i === 3 && formData.representative) ||
                      (i === 4 && formData.day)
                        ? 'linear-gradient(135deg, #F8A4C8, #ffc8de)'
                        : 'rgba(255,255,255,0.1)',
                    boxShadow:
                      (i === 0 && formData.firstName) ||
                      (i === 1 && formData.salon) ||
                      (i === 2 && formData.city && formData.whatsapp) ||
                      (i === 3 && formData.representative) ||
                      (i === 4 && formData.day)
                        ? '0 0 8px rgba(248,164,200,0.6)'
                        : 'none',
                  }}
                  animate={
                    (i === 0 && formData.firstName) ||
                    (i === 1 && formData.salon) ||
                    (i === 2 && formData.city && formData.whatsapp) ||
                    (i === 3 && formData.representative) ||
                    (i === 4 && formData.day)
                      ? { scale: [1, 1.3, 1] }
                      : {}
                  }
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Floating hint */}
        <motion.div
          className="text-center mt-6"
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