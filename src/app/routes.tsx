import { createBrowserRouter } from 'react-router';
import { RSVPForm } from './pages/RSVPForm';
import { StaffPin } from './pages/StaffPin';
import { Confirmation } from './pages/Confirmation';
import { WheelCode } from './pages/WheelCode';
import { Greeting } from './pages/Greeting';
import { WheelGame } from './pages/WheelGame';
import { CouponResult } from './pages/CouponResult';
import { DeclinePage } from './pages/DeclinePage';
import { ErrorPage } from './pages/ErrorPage';

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
    Component: StaffPin,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/wheel-code',
    Component: WheelCode,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/greeting',
    Component: Greeting,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/wheel',
    Component: WheelGame,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/wheel-game',
    Component: WheelGame,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/result',
    Component: CouponResult,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '/decline',
    Component: DeclinePage,
    ErrorBoundary: ErrorPage,
  },
  {
    path: '*',
    Component: RSVPForm,
    ErrorBoundary: ErrorPage,
  },
]);