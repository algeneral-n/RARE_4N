/**
 * RARE 4N - Theme Selector Component
 * مكون لاختيار الثيم
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
import { ALL_THEMES, Theme } from '../config/themes';
import Icon from './Icon';

interface ThemeSelectorProps {
  selectedTheme: string;
  onSelect: (themeId: string) => void;
}

export default function ThemeSelector({
  selectedTheme,
  onSelect,
}: ThemeSelectorProps) {
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
        {isArabic ? 'مكتبة الثيمات' : 'Themes Library'}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ALL_THEMES.map((theme: Theme) => {
          const isSelected = selectedTheme === theme.id;
          return (
            <TouchableOpacity
              key={theme.id}
              style={[
                styles.themeCard,
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
              onPress={() => onSelect(theme.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.colorPreview,
                  {
                    backgroundColor: theme.primary,
                    borderColor: theme.secondary,
                  },
                ]}
              >
                <View
                  style={[
                    styles.colorAccent,
                    { backgroundColor: theme.accent },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.themeName,
                  {
                    color: isSelected
                      ? colors.primary || '#00EAFF'
                      : colors.text || '#ffffff',
                    fontFamily,
                  },
                ]}
              >
                {isArabic ? theme.nameAr : theme.name}
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
  themeCard: {
    width: 120,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
    marginRight: 12,
  },
  colorPreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorAccent: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  themeName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

 * RARE 4N - Theme Selector Component
 * مكون لاختيار الثيم
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
import { ALL_THEMES, Theme } from '../config/themes';
import Icon from './Icon';

interface ThemeSelectorProps {
  selectedTheme: string;
  onSelect: (themeId: string) => void;
}

export default function ThemeSelector({
  selectedTheme,
  onSelect,
}: ThemeSelectorProps) {
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
        {isArabic ? 'مكتبة الثيمات' : 'Themes Library'}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ALL_THEMES.map((theme: Theme) => {
          const isSelected = selectedTheme === theme.id;
          return (
            <TouchableOpacity
              key={theme.id}
              style={[
                styles.themeCard,
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
              onPress={() => onSelect(theme.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.colorPreview,
                  {
                    backgroundColor: theme.primary,
                    borderColor: theme.secondary,
                  },
                ]}
              >
                <View
                  style={[
                    styles.colorAccent,
                    { backgroundColor: theme.accent },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.themeName,
                  {
                    color: isSelected
                      ? colors.primary || '#00EAFF'
                      : colors.text || '#ffffff',
                    fontFamily,
                  },
                ]}
              >
                {isArabic ? theme.nameAr : theme.name}
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
  themeCard: {
    width: 120,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
    marginRight: 12,
  },
  colorPreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorAccent: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  themeName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});


