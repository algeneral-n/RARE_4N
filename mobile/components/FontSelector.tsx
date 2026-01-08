/**
 * RARE 4N - Font Selector Component
 * مكون لاختيار الخط
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
import { FONTS_LIBRARY, Font } from '../libraries/fonts';

interface FontSelectorProps {
  selectedFont: string;
  onSelect: (fontId: string) => void;
}

export default function FontSelector({
  selectedFont,
  onSelect,
}: FontSelectorProps) {
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
        {isArabic ? 'مكتبة الخطوط' : 'Fonts Library'}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FONTS_LIBRARY.map((font: Font) => {
          const isSelected = selectedFont === font.id;
          return (
            <TouchableOpacity
              key={font.id}
              style={[
                styles.fontCard,
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
              onPress={() => onSelect(font.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.fontPreview,
                  {
                    fontFamily: font.family,
                    color: isSelected
                      ? colors.primary || '#00EAFF'
                      : colors.text || '#ffffff',
                  },
                ]}
              >
                Aa
              </Text>
              <Text
                style={[
                  styles.fontName,
                  {
                    color: isSelected
                      ? colors.primary || '#00EAFF'
                      : colors.text || '#ffffff',
                    fontFamily,
                  },
                ]}
              >
                {isArabic ? font.nameAr : font.name}
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
  fontCard: {
    width: 100,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    marginRight: 12,
  },
  fontPreview: {
    fontSize: 32,
    fontWeight: '600',
  },
  fontName: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});

 * RARE 4N - Font Selector Component
 * مكون لاختيار الخط
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
import { FONTS_LIBRARY, Font } from '../libraries/fonts';

interface FontSelectorProps {
  selectedFont: string;
  onSelect: (fontId: string) => void;
}

export default function FontSelector({
  selectedFont,
  onSelect,
}: FontSelectorProps) {
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
        {isArabic ? 'مكتبة الخطوط' : 'Fonts Library'}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FONTS_LIBRARY.map((font: Font) => {
          const isSelected = selectedFont === font.id;
          return (
            <TouchableOpacity
              key={font.id}
              style={[
                styles.fontCard,
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
              onPress={() => onSelect(font.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.fontPreview,
                  {
                    fontFamily: font.family,
                    color: isSelected
                      ? colors.primary || '#00EAFF'
                      : colors.text || '#ffffff',
                  },
                ]}
              >
                Aa
              </Text>
              <Text
                style={[
                  styles.fontName,
                  {
                    color: isSelected
                      ? colors.primary || '#00EAFF'
                      : colors.text || '#ffffff',
                    fontFamily,
                  },
                ]}
              >
                {isArabic ? font.nameAr : font.name}
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
  fontCard: {
    width: 100,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    marginRight: 12,
  },
  fontPreview: {
    fontSize: 32,
    fontWeight: '600',
  },
  fontName: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});


