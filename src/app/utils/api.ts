// ==========================================
// API GOOGLE SHEETS - SEMILAC DAYS 2026
// ==========================================

const API_URL = 'https://script.google.com/macros/s/AKfycbxl-vNl8iyGZYlTUkcoGmVph6jE8VRFbP1ZFHZAHpcRHk0BybdDoWxabQ2sA8aeaA1j/exec';

export interface APIPayload {
  action: 'registerRSVP' | 'validate' | 'register' | 'validatePin';
  devisNumber?: string;
  ticket?: string;
  ticketNumber?: string;
  clientName?: string;
  firstName?: string;
  lastName?: string;
  salon?: string;
  city?: string;
  phone?: string;
  people?: string;
  day?: string;
  discount?: string;
  representative?: string;
  pin?: string;
  attempts?: number;
  status?: string;
}

export interface APIResponse {
  success: boolean;
  message: string;
  ticketNumber?: string;
  data?: {
    used?: boolean;
    devisUsed?: boolean;
    alreadyUsed?: boolean;
    notFound?: boolean;
    phoneDuplicate?: boolean;
    ticket?: string;
    ticketNumber?: string;
    discount?: string;
    date?: string;
    timestamp?: string;
    clientName?: string;
    salon?: string;
    city?: string;
  };
  timestamp?: string;
}

/**
 * Appelle l'API Google Sheets
 */
export async function callAPI(payload: APIPayload): Promise<APIResponse> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    return {
      success: false,
      message: 'Erreur de connexion, réessayez',
    };
  }
}

/**
 * Warmup Google Apps Script — fire-and-forget.
 *
 * GAS instances cold-start in 5-20s after ~10min of inactivity. Calling this
 * on page mount (before the user fills the form / types the PIN) ensures the
 * instance is warm by the time the real request fires, cutting perceived
 * latency from 20s → 1-3s. Safe to call multiple times.
 */
let warmupPromise: Promise<unknown> | null = null;
export function warmupAPI(): void {
  if (warmupPromise) return; // already warming
  warmupPromise = fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'validate', ticket: 'WARMUP' }),
    redirect: 'follow',
  })
    .catch(() => {})
    .finally(() => {
      // Allow re-warmup after 8 min (GAS goes cold around 10-15 min idle)
      setTimeout(() => { warmupPromise = null; }, 8 * 60 * 1000);
    });
}

/**
 * Enregistre le résultat de la roue
 */
export async function registerResult(data: {
  ticket: string;
  devisNumber: string;
  clientName: string;
  salon: string;
  city: string;
  discount: string;
  representative: string;
  attempts?: number;
}): Promise<APIResponse> {
  const payload: APIPayload = {
    action: 'register',
    ...data,
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erreur enregistrement résultat:', error);
    return {
      success: false,
      message: 'Erreur de connexion, réessayez',
    };
  }
}