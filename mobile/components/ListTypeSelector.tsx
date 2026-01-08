/**
 * RARE 4N - List Type Selector Component
 * مكون لاختيار نوع القائمة
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useFont } from '../hooks/useFont';
import Icon from './Icon';

export type ListType = 
  | 'dropdown'
  | 'google-style'
  | 'sidebar'
  | 'bottom-sheet'
  | 'grid'
  | 'tab';

export interface ListTypeOption {
  id: ListType;
  name: string;
  nameAr: string;
  icon: string;
  description: string;
  descriptionAr: string;
}

const LIST_TYPE_OPTIONS: ListTypeOption[] = [
  {
    id: 'dropdown',
    name: 'Dropdown',
    nameAr: 'قائمة منسدلة',
    icon: 'arrow-drop-down',
    description: 'Classic dropdown menu',
    descriptionAr: 'قائمة منسدلة كلاسيكية',
  },
  {
    id: 'google-style',
    name: 'Google Style',
    nameAr: 'نمط جوجل',
    icon: 'apps',
    description: 'Material Design list',
    descriptionAr: 'قائمة بتصميم Material',
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    nameAr: 'شريط جانبي',
    icon: 'menu',
    description: 'Side navigation panel',
    descriptionAr: 'لوحة تنقل جانبية',
  },
  {
    id: 'bottom-sheet',
    name: 'Bottom Sheet',
    nameAr: 'ورقة سفلية',
    icon: 'keyboard-arrow-up',
    description: 'Bottom sheet menu',
    descriptionAr: 'قائمة من الأسفل',
  },
  {
    id: 'grid',
    name: 'Grid',
    nameAr: 'شبكة',
    icon: 'grid-view',
    description: 'Grid layout',
    descriptionAr: 'تخطيط شبكي',
  },
  {
    id: 'tab',
    name: 'Tab',
    nameAr: 'تبويبات',
    icon: 'tab',
    description: 'Tab navigation',
    descriptionAr: 'تنقل بالتبويبات',
  },
];

interface ListTypeSelectorProps {
  selectedType: ListType;
  onSelect: (type: ListType) => void;
}

export default function ListTypeSelector({
  selectedType,
  onSelect,
}: ListTypeSelectorProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { fontFamily } = useFont();
  const currentLang = t('language') || 'ar';
  const isArabic = currentLang === 'ar' || !currentLang.includes('en');

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.textSecondary || '#888888',
            fontFamily,
          },
        ]}
      >
        {isArabic ? 'نوع القائمة' : 'List Type'}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {LIST_TYPE_OPTIONS.map((option) => {
          const isSelected = selectedType === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                {
                  backgroundColor: isSelected
                    ? (colors.primary || '#00EAFF') + '20'
                    : colors.surface || 'rgba(0, 234, 255, 0.1)',
                  borderColor: isSelected
                    ? colors.primary || '#00EAFF'
                    : colors.border || 'rgba(0, 234, 255, 0.3)',
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              onPress={() => onSelect(option.id)}
              activeOpacity={0.7}
            >
              <Icon
                name={option.icon}
                size={32}
                color={
                  isSelected
                    ? colors.primary || '#00EAFF'
                    : colors.textSecondary || '#888888'
                }
              />
              <Text
                style={[
                  styles.optionName,
                  {
                    color: isSelected
                      ? colors.primary || '#00EAFF'
                      : colors.text || '#ffffff',
                    fontFamily,
                  },
                ]}
              >
                {isArabic ? option.nameAr : option.name}
              </Text>
              <Text
                style={[
                  styles.optionDescription,
                  {
                    color: colors.textSecondary || '#888888',
                    fontFamily,
                  },
                ]}
              >
                {isArabic ? option.descriptionAr : option.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 5,
    gap: 12,
  },
  optionCard: {
    width: 120,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    marginRight: 12,
  },
  optionName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 9,
    textAlign: 'center',
    marginTop: 4,
  },
});

 * RARE 4N - List Type Selector Component
 * مكون لاختيار نوع القائمة
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useFont } from '../hooks/useFont';
import Icon from './Icon';

export type ListType = 
  | 'dropdown'
  | 'google-style'
  | 'sidebar'
  | 'bottom-sheet'
  | 'grid'
  | 'tab';

export interface ListTypeOption {
  id: ListType;
  name: string;
  nameAr: string;
  icon: string;
  description: string;
  descriptionAr: string;
}

const LIST_TYPE_OPTIONS: ListTypeOption[] = [
  {
    id: 'dropdown',
    name: 'Dropdown',
    nameAr: 'قائمة منسدلة',
    icon: 'arrow-drop-down',
    description: 'Classic dropdown menu',
    descriptionAr: 'قائمة منسدلة كلاسيكية',
  },
  {
    id: 'google-style',
    name: 'Google Style',
    nameAr: 'نمط جوجل',
    icon: 'apps',
    description: 'Material Design list',
    descriptionAr: 'قائمة بتصميم Material',
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    nameAr: 'شريط جانبي',
    icon: 'menu',
    description: 'Side navigation panel',
    descriptionAr: 'لوحة تنقل جانبية',
  },
  {
    id: 'bottom-sheet',
    name: 'Bottom Sheet',
    nameAr: 'ورقة سفلية',
    icon: 'keyboard-arrow-up',
    description: 'Bottom sheet menu',
    descriptionAr: 'قائمة من الأسفل',
  },
  {
    id: 'grid',
    name: 'Grid',
    nameAr: 'شبكة',
    icon: 'grid-view',
    description: 'Grid layout',
    descriptionAr: 'تخطيط شبكي',
  },
  {
    id: 'tab',
    name: 'Tab',
    nameAr: 'تبويبات',
    icon: 'tab',
    description: 'Tab navigation',
    descriptionAr: 'تنقل بالتبويبات',
  },
];

interface ListTypeSelectorProps {
  selectedType: ListType;
  onSelect: (type: ListType) => void;
}

export default function ListTypeSelector({
  selectedType,
  onSelect,
}: ListTypeSelectorProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { fontFamily } = useFont();
  const currentLang = t('language') || 'ar';
  const isArabic = currentLang === 'ar' || !currentLang.includes('en');

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.textSecondary || '#888888',
            fontFamily,
          },
        ]}
      >
        {isArabic ? 'نوع القائمة' : 'List Type'}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {LIST_TYPE_OPTIONS.map((option) => {
          const isSelected = selectedType === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                {
                  backgroundColor: isSelected
                    ? (colors.primary || '#00EAFF') + '20'
                    : colors.surface || 'rgba(0, 234, 255, 0.1)',
                  borderColor: isSelected
                    ? colors.primary || '#00EAFF'
                    : colors.border || 'rgba(0, 234, 255, 0.3)',
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              onPress={() => onSelect(option.id)}
              activeOpacity={0.7}
            >
              <Icon
                name={option.icon}
                size={32}
                color={
                  isSelected
                    ? colors.primary || '#00EAFF'
                    : colors.textSecondary || '#888888'
                }
              />
              <Text
                style={[
                  styles.optionName,
                  {
                    color: isSelected
                      ? colors.primary || '#00EAFF'
                      : colors.text || '#ffffff',
                    fontFamily,
                  },
                ]}
              >
                {isArabic ? option.nameAr : option.name}
              </Text>
              <Text
                style={[
                  styles.optionDescription,
                  {
                    color: colors.textSecondary || '#888888',
                    fontFamily,
                  },
                ]}
              >
                {isArabic ? option.descriptionAr : option.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 5,
    gap: 12,
  },
  optionCard: {
    width: 120,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    marginRight: 12,
  },
  optionName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 9,
    textAlign: 'center',
    marginTop: 4,
  },
});


