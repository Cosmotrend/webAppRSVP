import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      {/* Mobile: full screen. Desktop: fixed 375×812 phone mockup centered */}
      <div
        className="relative overflow-hidden w-full h-full md:w-[375px] md:h-[812px] md:rounded-2xl md:shadow-2xl"
        style={{
          background: '#0D0008',
          // Use dvh for correct iOS viewport (excludes Dynamic Island + URL bar)
          maxHeight: 'calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
        }}
      >
        <RouterProvider router={router} />
      </div>
    </div>
  );
}
