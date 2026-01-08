/**
 * RARE 4N - Font Hook
 * Hook للوصول إلى الخط المختار
 */

import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { fontManager } from '../utils/fontManager';

export function useFont() {
  const [fontFamily, setFontFamily] = useState<string>('System');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFont();
  }, []);

  const loadFont = async () => {
    try {
      const savedFont = await fontManager.getSelectedFont();
      if (savedFont) {
        setFontFamily(savedFont.family);
      }
    } catch (error) {
      console.error('Error loading font:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fontFamily,
    isLoading,
    setFont: async (fontFamily: string) => {
      setFontFamily(fontFamily);
      await fontManager.setSelectedFont(fontFamily);
    },
  };
}

 * RARE 4N - Font Hook
 * Hook للوصول إلى الخط المختار
 */

import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { fontManager } from '../utils/fontManager';

export function useFont() {
  const [fontFamily, setFontFamily] = useState<string>('System');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFont();
  }, []);

  const loadFont = async () => {
    try {
      const savedFont = await fontManager.getSelectedFont();
      if (savedFont) {
        setFontFamily(savedFont.family);
      }
    } catch (error) {
      console.error('Error loading font:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fontFamily,
    isLoading,
    setFont: async (fontFamily: string) => {
      setFontFamily(fontFamily);
      await fontManager.setSelectedFont(fontFamily);
    },
  };
}


