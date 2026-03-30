import { motion } from 'motion/react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-16 h-16">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: i === 0 ? '#F8A4C8' : i === 1 ? '#ffc8de' : '#D4A574',
              borderTopColor: 'transparent',
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5 - i * 0.2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
        
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(248,164,200,0.3), transparent)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </div>
    </div>
  );
}
