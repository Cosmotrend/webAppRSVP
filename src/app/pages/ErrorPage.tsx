import { useRouteError, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { AuroraBackground } from '../components/AuroraBackground';
import { ShimmerButton } from '../components/ShimmerButton';

export function ErrorPage() {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center" style={{ background: '#0D0008' }}>
      <AuroraBackground />
      
      <div className="relative z-10 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-bold mb-4" style={{ 
            background: 'linear-gradient(135deg, #F8A4C8 0%, #D4849A 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Cormorant Garamond, serif'
          }}>
            Oups !
          </h1>
          
          <p className="text-white/60 text-lg mb-8">
            {error?.statusText || error?.message || 'Une erreur est survenue'}
          </p>

          <ShimmerButton
            onClick={() => navigate('/')}
            className="px-8 py-4"
          >
            Retour à l'accueil
          </ShimmerButton>
        </motion.div>
      </div>
    </div>
  );
}
