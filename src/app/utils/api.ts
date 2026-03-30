// ==========================================
// API GOOGLE SHEETS - SEMILAC DAYS 2026
// ==========================================

const API_URL = 'https://script.google.com/macros/s/AKfycbxMbW-f3gvc4CsRlVHSI2V8LZXKC30Ludig1pQGWcRPtIAG29aUSWwLi0mYvklBNeYt/exec';

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
        'Content-Type': 'application/json',
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
        'Content-Type': 'application/json',
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