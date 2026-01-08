/**
 * RARE 4N - Language Context
 * Context للغة الحالية
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translationService } from '../services/translationService';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => Promise<void>;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'ar',
  changeLanguage: async () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('ar');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const lang = translationService.getCurrentLanguage();
    setCurrentLanguage(lang);
  };

  const changeLanguage = async (lang: string) => {
    await translationService.changeLanguage(lang);
    setCurrentLanguage(lang);
  };

  const t = (key: string, params?: Record<string, string>) => {
    return translationService.t(key, params);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

 * RARE 4N - Language Context
 * Context للغة الحالية
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translationService } from '../services/translationService';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => Promise<void>;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'ar',
  changeLanguage: async () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('ar');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const lang = translationService.getCurrentLanguage();
    setCurrentLanguage(lang);
  };

  const changeLanguage = async (lang: string) => {
    await translationService.changeLanguage(lang);
    setCurrentLanguage(lang);
  };

  const t = (key: string, params?: Record<string, string>) => {
    return translationService.t(key, params);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}


