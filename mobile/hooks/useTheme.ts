/**
 * RARE 4N - Theme Hook
 * Hook للوصول إلى الثيم الحالي
 */

import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { ALL_THEMES, DEFAULT_THEME, Theme } from '../config/themes';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedThemeId = await storage.get<string>('theme:id');
      if (savedThemeId) {
        const savedTheme = ALL_THEMES.find(t => t.id === savedThemeId);
        if (savedTheme) {
          setTheme(savedTheme);
        }
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const colors = {
    primary: theme.primary,
    secondary: theme.secondary,
    accent: theme.accent,
    background: theme.background,
    surface: theme.surface,
    text: theme.text,
    textSecondary: theme.textSecondary,
    border: theme.border,
  };

  return {
    theme,
    colors,
    isLoading,
    setTheme: async (newTheme: Theme) => {
      setTheme(newTheme);
      await storage.set('theme:id', newTheme.id);
    },
  };
}

 * RARE 4N - Theme Hook
 * Hook للوصول إلى الثيم الحالي
 */

import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { ALL_THEMES, DEFAULT_THEME, Theme } from '../config/themes';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedThemeId = await storage.get<string>('theme:id');
      if (savedThemeId) {
        const savedTheme = ALL_THEMES.find(t => t.id === savedThemeId);
        if (savedTheme) {
          setTheme(savedTheme);
        }
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const colors = {
    primary: theme.primary,
    secondary: theme.secondary,
    accent: theme.accent,
    background: theme.background,
    surface: theme.surface,
    text: theme.text,
    textSecondary: theme.textSecondary,
    border: theme.border,
  };

  return {
    theme,
    colors,
    isLoading,
    setTheme: async (newTheme: Theme) => {
      setTheme(newTheme);
      await storage.set('theme:id', newTheme.id);
    },
  };
}


