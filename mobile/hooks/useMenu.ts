/**
 * RARE 4N - Menu Hook
 * Hook لإدارة القائمة المنسدلة
 */

import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { translationService } from '../services/translationService';

export interface MenuItem {
  id: string;
  label: string;
  labelAr: string;
  route: string;
  icon?: string;
  group?: string;
}

export interface MenuGroup {
  id: string;
  label: string;
  labelAr: string;
  items: MenuItem[];
}

const MENU_GROUPS: MenuGroup[] = [
  {
    id: 'builder-group',
    label: 'Builder & Tools',
    labelAr: 'البناء والأدوات',
    items: [
      { id: 'app-builder', label: 'App Builder', labelAr: 'بناء التطبيقات', route: '/app-builder', icon: 'builder' },
      { id: 'generator', label: 'Generator', labelAr: 'المولد', route: '/generator', icon: 'generator' },
      { id: 'code-generator', label: 'Code Generator', labelAr: 'مولد الأكواد', route: '/code-generator', icon: 'code' },
      { id: 'control-room', label: 'Control Room', labelAr: 'غرفة التحكم', route: '/control-room', icon: 'control' },
    ],
  },
  {
    id: 'carplay-group',
    label: 'CarPlay & Maps',
    labelAr: 'كاربلاي والخرائط',
    items: [
      { id: 'carplay', label: 'CarPlay', labelAr: 'كاربلاي', route: '/carplayscreen', icon: 'carplay' },
      { id: 'maps', label: 'Maps', labelAr: 'الخرائط', route: '/maps', icon: 'maps' },
      { id: 'vault', label: 'RARE Vault', labelAr: 'القبو الآمن', route: '/rarevault', icon: 'vault' },
    ],
  },
  {
    id: 'assistant-group',
    label: 'Assistants & SOS',
    labelAr: 'المساعدون والطوارئ',
    items: [
      { id: 'council', label: 'Council', labelAr: 'المجلس', route: '/council', icon: 'council' },
      { id: 'ultimate-assistant', label: 'Ultimate Assistant', labelAr: 'المساعد المتقدم', route: '/ultimate assisstant', icon: 'assistant' },
      { id: 'sos', label: 'SOS', labelAr: 'طوارئ', route: '/sos', icon: 'sos' },
    ],
  },
  {
    id: 'system-group',
    label: 'System',
    labelAr: 'النظام',
    items: [
      { id: 'settings', label: 'Settings', labelAr: 'الإعدادات', route: '/settings', icon: 'settings' },
      { id: 'boot', label: 'Boot', labelAr: 'التهيئة', route: '/boot', icon: 'boot' },
    ],
  },
];

export function useMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>(MENU_GROUPS);

  useEffect(() => {
    loadMenuState();
  }, []);

  const loadMenuState = async () => {
    try {
      const savedState = await storage.get<boolean>('menu:isOpen');
      if (savedState !== null) {
        setIsOpen(savedState);
      }
    } catch (error) {
      console.error('Error loading menu state:', error);
    }
  };

  const toggleMenu = useCallback(async () => {
    const newState = !isOpen;
    setIsOpen(newState);
    try {
      await storage.set('menu:isOpen', newState);
    } catch (error) {
      console.error('Error saving menu state:', error);
    }
  }, [isOpen]);

  const closeMenu = useCallback(async () => {
    setIsOpen(false);
    try {
      await storage.set('menu:isOpen', false);
    } catch (error) {
      console.error('Error saving menu state:', error);
    }
  }, []);

  const openMenu = useCallback(async () => {
    setIsOpen(true);
    try {
      await storage.set('menu:isOpen', true);
    } catch (error) {
      console.error('Error saving menu state:', error);
    }
  }, []);

  const getTranslatedGroups = useCallback((): MenuGroup[] => {
    const currentLang = translationService.getCurrentLanguage();
    const isArabic = currentLang === 'ar';

    return menuGroups.map(group => ({
      ...group,
      label: isArabic ? group.labelAr : group.label,
      items: group.items.map(item => ({
        ...item,
        label: isArabic ? item.labelAr : item.label,
      })),
    }));
  }, [menuGroups]);

  return {
    isOpen,
    toggleMenu,
    closeMenu,
    openMenu,
    menuGroups: getTranslatedGroups(),
  };
}

 * RARE 4N - Menu Hook
 * Hook لإدارة القائمة المنسدلة
 */

import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { translationService } from '../services/translationService';

export interface MenuItem {
  id: string;
  label: string;
  labelAr: string;
  route: string;
  icon?: string;
  group?: string;
}

export interface MenuGroup {
  id: string;
  label: string;
  labelAr: string;
  items: MenuItem[];
}

const MENU_GROUPS: MenuGroup[] = [
  {
    id: 'builder-group',
    label: 'Builder & Tools',
    labelAr: 'البناء والأدوات',
    items: [
      { id: 'app-builder', label: 'App Builder', labelAr: 'بناء التطبيقات', route: '/app-builder', icon: 'builder' },
      { id: 'generator', label: 'Generator', labelAr: 'المولد', route: '/generator', icon: 'generator' },
      { id: 'code-generator', label: 'Code Generator', labelAr: 'مولد الأكواد', route: '/code-generator', icon: 'code' },
      { id: 'control-room', label: 'Control Room', labelAr: 'غرفة التحكم', route: '/control-room', icon: 'control' },
    ],
  },
  {
    id: 'carplay-group',
    label: 'CarPlay & Maps',
    labelAr: 'كاربلاي والخرائط',
    items: [
      { id: 'carplay', label: 'CarPlay', labelAr: 'كاربلاي', route: '/carplayscreen', icon: 'carplay' },
      { id: 'maps', label: 'Maps', labelAr: 'الخرائط', route: '/maps', icon: 'maps' },
      { id: 'vault', label: 'RARE Vault', labelAr: 'القبو الآمن', route: '/rarevault', icon: 'vault' },
    ],
  },
  {
    id: 'assistant-group',
    label: 'Assistants & SOS',
    labelAr: 'المساعدون والطوارئ',
    items: [
      { id: 'council', label: 'Council', labelAr: 'المجلس', route: '/council', icon: 'council' },
      { id: 'ultimate-assistant', label: 'Ultimate Assistant', labelAr: 'المساعد المتقدم', route: '/ultimate assisstant', icon: 'assistant' },
      { id: 'sos', label: 'SOS', labelAr: 'طوارئ', route: '/sos', icon: 'sos' },
    ],
  },
  {
    id: 'system-group',
    label: 'System',
    labelAr: 'النظام',
    items: [
      { id: 'settings', label: 'Settings', labelAr: 'الإعدادات', route: '/settings', icon: 'settings' },
      { id: 'boot', label: 'Boot', labelAr: 'التهيئة', route: '/boot', icon: 'boot' },
    ],
  },
];

export function useMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>(MENU_GROUPS);

  useEffect(() => {
    loadMenuState();
  }, []);

  const loadMenuState = async () => {
    try {
      const savedState = await storage.get<boolean>('menu:isOpen');
      if (savedState !== null) {
        setIsOpen(savedState);
      }
    } catch (error) {
      console.error('Error loading menu state:', error);
    }
  };

  const toggleMenu = useCallback(async () => {
    const newState = !isOpen;
    setIsOpen(newState);
    try {
      await storage.set('menu:isOpen', newState);
    } catch (error) {
      console.error('Error saving menu state:', error);
    }
  }, [isOpen]);

  const closeMenu = useCallback(async () => {
    setIsOpen(false);
    try {
      await storage.set('menu:isOpen', false);
    } catch (error) {
      console.error('Error saving menu state:', error);
    }
  }, []);

  const openMenu = useCallback(async () => {
    setIsOpen(true);
    try {
      await storage.set('menu:isOpen', true);
    } catch (error) {
      console.error('Error saving menu state:', error);
    }
  }, []);

  const getTranslatedGroups = useCallback((): MenuGroup[] => {
    const currentLang = translationService.getCurrentLanguage();
    const isArabic = currentLang === 'ar';

    return menuGroups.map(group => ({
      ...group,
      label: isArabic ? group.labelAr : group.label,
      items: group.items.map(item => ({
        ...item,
        label: isArabic ? item.labelAr : item.label,
      })),
    }));
  }, [menuGroups]);

  return {
    isOpen,
    toggleMenu,
    closeMenu,
    openMenu,
    menuGroups: getTranslatedGroups(),
  };
}


