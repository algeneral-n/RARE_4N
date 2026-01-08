/**
 * RARE 4N - Background Selector Component
 * مكون لاختيار الخلفية
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
import { Background } from '../libraries/backgrounds';
import Icon from './Icon';

interface BackgroundSelectorProps {
  selectedBackground: string;
  onSelect: (backgroundId: string) => void;
}

export default function BackgroundSelector({
  selectedBackground,
  onSelect,
}: BackgroundSelectorProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { fontFamily } = useFont();
  const { BACKGROUNDS_LIBRARY } = require('../libraries/backgrounds');
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
        {isArabic ? 'مكتبة الخلفيات' : 'Backgrounds Library'}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {BACKGROUNDS_LIBRARY.map((bg: Background) => {
          const isSelected = selectedBackground === bg.id;
          return (
            <TouchableOpacity
              key={bg.id}
              style={[
                styles.backgroundCard,
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
              onPress={() => onSelect(bg.id)}
              activeOpacity={0.7}
            >
              {bg.colors && (
                <View style={styles.colorPreview}>
                  {bg.colors.slice(0, 3).map((color, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.colorDot,
                        { backgroundColor: color },
                      ]}
                    />
                  ))}
                </View>
              )}
              {!bg.colors && (
                <Icon
                  name={bg.type === 'tunnel' ? 'tunnel' : bg.type === 'character' ? 'person' : 'image'}
                  size={32}
                  color={isSelected ? colors.primary || '#00EAFF' : colors.textSecondary || '#888888'}
                />
              )}
              <Text
                style={[
                  styles.backgroundName,
                  {
                    color: isSelected
                      ? colors.primary || '#00EAFF'
                      : colors.text || '#ffffff',
                    fontFamily,
                  },
                ]}
              >
                {isArabic ? bg.nameAr : bg.name}
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
  backgroundCard: {
    width: 140,
    height: 120,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginRight: 12,
  },
  colorPreview: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  backgroundName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

 * RARE 4N - Background Selector Component
 * مكون لاختيار الخلفية
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
import { Background } from '../libraries/backgrounds';
import Icon from './Icon';

interface BackgroundSelectorProps {
  selectedBackground: string;
  onSelect: (backgroundId: string) => void;
}

export default function BackgroundSelector({
  selectedBackground,
  onSelect,
}: BackgroundSelectorProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { fontFamily } = useFont();
  const { BACKGROUNDS_LIBRARY } = require('../libraries/backgrounds');
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
        {isArabic ? 'مكتبة الخلفيات' : 'Backgrounds Library'}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {BACKGROUNDS_LIBRARY.map((bg: Background) => {
          const isSelected = selectedBackground === bg.id;
          return (
            <TouchableOpacity
              key={bg.id}
              style={[
                styles.backgroundCard,
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
              onPress={() => onSelect(bg.id)}
              activeOpacity={0.7}
            >
              {bg.colors && (
                <View style={styles.colorPreview}>
                  {bg.colors.slice(0, 3).map((color, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.colorDot,
                        { backgroundColor: color },
                      ]}
                    />
                  ))}
                </View>
              )}
              {!bg.colors && (
                <Icon
                  name={bg.type === 'tunnel' ? 'tunnel' : bg.type === 'character' ? 'person' : 'image'}
                  size={32}
                  color={isSelected ? colors.primary || '#00EAFF' : colors.textSecondary || '#888888'}
                />
              )}
              <Text
                style={[
                  styles.backgroundName,
                  {
                    color: isSelected
                      ? colors.primary || '#00EAFF'
                      : colors.text || '#ffffff',
                    fontFamily,
                  },
                ]}
              >
                {isArabic ? bg.nameAr : bg.name}
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
  backgroundCard: {
    width: 140,
    height: 120,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginRight: 12,
  },
  colorPreview: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  backgroundName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});


