/**
 * RARE 4N - Translation Hook
 * Hook للوصول إلى خدمة الترجمة
 */

import { useMemo } from 'react';
import { translationService } from '../services/translationService';

export function useTranslation() {
  const t = useMemo(() => {
    return (key: string, params?: Record<string, string>) => {
      return translationService.t(key, params);
    };
  }, []);

  return {
    t,
    currentLanguage: translationService.getCurrentLanguage(),
    changeLanguage: (lang: string) => translationService.changeLanguage(lang),
  };
}

 * RARE 4N - Translation Hook
 * Hook للوصول إلى خدمة الترجمة
 */

import { useMemo } from 'react';
import { translationService } from '../services/translationService';

export function useTranslation() {
  const t = useMemo(() => {
    return (key: string, params?: Record<string, string>) => {
      return translationService.t(key, params);
    };
  }, []);

  return {
    t,
    currentLanguage: translationService.getCurrentLanguage(),
    changeLanguage: (lang: string) => translationService.changeLanguage(lang),
  };
}


