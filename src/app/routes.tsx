import { createBrowserRouter } from 'react-router';
import { RSVPForm } from './pages/RSVPForm';
import { Confirmation } from './pages/Confirmation';
import { ErrorPage } from './pages/ErrorPage';

// Pages CLIENT eager-loaded — point d'entrée et confirmation, doivent être
// instantanées sur le bundle initial pour les utilisateurs mobiles.

// Pages STAFF lazy-loaded — chargées à la demande quand un salarié arrive sur
// /staff-pin. Cela retire ~120 KB du bundle initial client (Framer Motion +
// canvas-confetti + jspdf + Premium3DWheel + CustomKeypad ne sont chargés
// que sur le device staff). Aucun impact pour le staff (chunk pré-fetché par
// Vite après l'idle du navigateur).
const lazyStaffPin   = () => import('./pages/StaffPin').then(m => ({ Component: m.StaffPin }));
const lazyWheelCode  = () => import('./pages/WheelCode').then(m => ({ Component: m.WheelCode }));
const lazyGreeting   = () => import('./pages/Greeting').then(m => ({ Component: m.Greeting }));
const lazyWheelGame  = () => import('./pages/WheelGame').then(m => ({ Component: m.WheelGame }));
const lazyCouponResult = () => import('./pages/CouponResult').then(m => ({ Component: m.CouponResult }));

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RSVPForm,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/rsvp',
    Component: RSVPForm,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/confirmation',
    Component: Confirmation,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/staff-pin',
    lazy: lazyStaffPin,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/wheel-code',
    lazy: lazyWheelCode,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/greeting',
    lazy: lazyGreeting,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/wheel',
    lazy: lazyWheelGame,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/wheel-game',
    lazy: lazyWheelGame,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/result',
    lazy: lazyCouponResult,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '*',
    Component: RSVPForm,
    ErrorBoundary: ErrorPage,
  },
]);
