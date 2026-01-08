/**
 * RARE 4N - Icon Selector Component
 * مكون لاختيار الأيقونة
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useFont } from '../hooks/useFont';
import { ICONS_LIBRARY, Icon } from '../libraries/icons';
import IconComponent from './Icon';

interface IconSelectorProps {
  selectedIcon: string;
  onSelect: (iconId: string) => void;
}

export default function IconSelector({
  selectedIcon,
  onSelect,
}: IconSelectorProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { fontFamily } = useFont();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const currentLang = t('language') || 'ar';
  const isArabic = currentLang === 'ar' || !currentLang.includes('en');

  const categories = Array.from(new Set(ICONS_LIBRARY.map(icon => icon.category)));

  const filteredIcons = ICONS_LIBRARY.filter(icon => {
    const matchesSearch = searchQuery === '' || 
      icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      icon.nameAr.includes(searchQuery);
    const matchesCategory = !selectedCategory || icon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        {isArabic ? 'مكتبة الأيقونات' : 'Icons Library'}
      </Text>

      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: colors.surface || 'rgba(0, 234, 255, 0.1)',
            borderColor: colors.border || 'rgba(0, 234, 255, 0.3)',
            color: colors.text || '#ffffff',
            fontFamily,
          },
        ]}
        placeholder={isArabic ? 'بحث عن أيقونة...' : 'Search icon...'}
        placeholderTextColor={colors.textSecondary || '#888888'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            !selectedCategory && styles.activeCategoryChip,
            {
              backgroundColor: !selectedCategory
                ? (colors.primary || '#00EAFF') + '20'
                : colors.surface || 'rgba(0, 234, 255, 0.1)',
              borderColor: !selectedCategory
                ? colors.primary || '#00EAFF'
                : colors.border || 'rgba(0, 234, 255, 0.3)',
            },
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text
            style={[
              styles.categoryText,
              {
                color: !selectedCategory
                  ? colors.primary || '#00EAFF'
                  : colors.text || '#ffffff',
                fontFamily,
              },
            ]}
          >
            {isArabic ? 'الكل' : 'All'}
          </Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.activeCategoryChip,
              {
                backgroundColor: selectedCategory === category
                  ? (colors.primary || '#00EAFF') + '20'
                  : colors.surface || 'rgba(0, 234, 255, 0.1)',
                borderColor: selectedCategory === category
                  ? colors.primary || '#00EAFF'
                  : colors.border || 'rgba(0, 234, 255, 0.3)',
              },
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                {
                  color: selectedCategory === category
                    ? colors.primary || '#00EAFF'
                    : colors.text || '#ffffff',
                  fontFamily,
                },
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.iconsContainer}
        contentContainerStyle={styles.iconsContent}
      >
        {filteredIcons.map((icon: Icon) => {
          const isSelected = selectedIcon === icon.id;
          return (
            <TouchableOpacity
              key={icon.id}
              style={[
                styles.iconCard,
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
              onPress={() => onSelect(icon.id)}
              activeOpacity={0.7}
            >
              <IconComponent
                name={icon.id}
                size={32}
                color={isSelected ? colors.primary || '#00EAFF' : colors.text || '#ffffff'}
              />
              <Text
                style={[
                  styles.iconName,
                  {
                    color: isSelected
                      ? colors.primary || '#00EAFF'
                      : colors.text || '#ffffff',
                    fontFamily,
                  },
                ]}
                numberOfLines={1}
              >
                {isArabic ? icon.nameAr : icon.name}
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
  searchInput: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
    fontSize: 14,
  },
  categoriesContainer: {
    marginBottom: 15,
  },
  categoriesContent: {
    paddingHorizontal: 5,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  activeCategoryChip: {
    borderWidth: 2,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  iconsContainer: {
    maxHeight: 400,
  },
  iconsContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 5,
  },
  iconCard: {
    width: 100,
    height: 100,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconName: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
});

 * RARE 4N - Icon Selector Component
 * مكون لاختيار الأيقونة
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useFont } from '../hooks/useFont';
import { ICONS_LIBRARY, Icon } from '../libraries/icons';
import IconComponent from './Icon';

interface IconSelectorProps {
  selectedIcon: string;
  onSelect: (iconId: string) => void;
}

export default function IconSelector({
  selectedIcon,
  onSelect,
}: IconSelectorProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { fontFamily } = useFont();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const currentLang = t('language') || 'ar';
  const isArabic = currentLang === 'ar' || !currentLang.includes('en');

  const categories = Array.from(new Set(ICONS_LIBRARY.map(icon => icon.category)));

  const filteredIcons = ICONS_LIBRARY.filter(icon => {
    const matchesSearch = searchQuery === '' || 
      icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      icon.nameAr.includes(searchQuery);
    const matchesCategory = !selectedCategory || icon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        {isArabic ? 'مكتبة الأيقونات' : 'Icons Library'}
      </Text>

      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: colors.surface || 'rgba(0, 234, 255, 0.1)',
            borderColor: colors.border || 'rgba(0, 234, 255, 0.3)',
            color: colors.text || '#ffffff',
            fontFamily,
          },
        ]}
        placeholder={isArabic ? 'بحث عن أيقونة...' : 'Search icon...'}
        placeholderTextColor={colors.textSecondary || '#888888'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            !selectedCategory && styles.activeCategoryChip,
            {
              backgroundColor: !selectedCategory
                ? (colors.primary || '#00EAFF') + '20'
                : colors.surface || 'rgba(0, 234, 255, 0.1)',
              borderColor: !selectedCategory
                ? colors.primary || '#00EAFF'
                : colors.border || 'rgba(0, 234, 255, 0.3)',
            },
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text
            style={[
              styles.categoryText,
              {
                color: !selectedCategory
                  ? colors.primary || '#00EAFF'
                  : colors.text || '#ffffff',
                fontFamily,
              },
            ]}
          >
            {isArabic ? 'الكل' : 'All'}
          </Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.activeCategoryChip,
              {
                backgroundColor: selectedCategory === category
                  ? (colors.primary || '#00EAFF') + '20'
                  : colors.surface || 'rgba(0, 234, 255, 0.1)',
                borderColor: selectedCategory === category
                  ? colors.primary || '#00EAFF'
                  : colors.border || 'rgba(0, 234, 255, 0.3)',
              },
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                {
                  color: selectedCategory === category
                    ? colors.primary || '#00EAFF'
                    : colors.text || '#ffffff',
                  fontFamily,
                },
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.iconsContainer}
        contentContainerStyle={styles.iconsContent}
      >
        {filteredIcons.map((icon: Icon) => {
          const isSelected = selectedIcon === icon.id;
          return (
            <TouchableOpacity
              key={icon.id}
              style={[
                styles.iconCard,
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
              onPress={() => onSelect(icon.id)}
              activeOpacity={0.7}
            >
              <IconComponent
                name={icon.id}
                size={32}
                color={isSelected ? colors.primary || '#00EAFF' : colors.text || '#ffffff'}
              />
              <Text
                style={[
                  styles.iconName,
                  {
                    color: isSelected
                      ? colors.primary || '#00EAFF'
                      : colors.text || '#ffffff',
                    fontFamily,
                  },
                ]}
                numberOfLines={1}
              >
                {isArabic ? icon.nameAr : icon.name}
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
  searchInput: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
    fontSize: 14,
  },
  categoriesContainer: {
    marginBottom: 15,
  },
  categoriesContent: {
    paddingHorizontal: 5,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  activeCategoryChip: {
    borderWidth: 2,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  iconsContainer: {
    maxHeight: 400,
  },
  iconsContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 5,
  },
  iconCard: {
    width: 100,
    height: 100,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconName: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
});


