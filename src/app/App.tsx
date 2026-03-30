import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      {/* Mobile Container - Responsive: Full screen on mobile, fixed iPhone size on desktop */}
      <div
        className="relative overflow-hidden w-full h-full md:w-[375px] md:h-[812px] md:rounded-2xl md:shadow-2xl"
        style={{
          background: '#0D0008',
          maxHeight: '100vh',
        }}
      >
        <RouterProvider router={router} />
      </div>
    </div>
  );
}