import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Lang } from './translations';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'fr',
  setLang: () => {},
  isReady: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('semilac-lang') as Lang | null;
    if (saved === 'fr' || saved === 'ar') {
      setLangState(saved);
      setIsReady(true);
    }
    // If no saved lang, isReady stays false → show selector
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('semilac-lang', newLang);
    setIsReady(true);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, isReady }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
