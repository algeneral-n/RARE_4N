import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme'
import { getSafeColor, getSafeColors } from '../utils/safeTheme';;

interface ThemedCardProps { children: React.ReactNode; style?: ViewStyle; variant?: 'default' | 'elevated' | 'outlined'; }

export default function ThemedCard({ children, style, variant = 'default' }: ThemedCardProps) {
  const { theme, colors = { primary: '#00EAFF', text: '#fff', background: '#000408', surface: '#0a0e14', border: '#1a1f2e' }, styles: themeStyles = {} } = useTheme() || {};

  return (
    <View
      style={[
        styles.baseCard,
        theme.cardStyle === 'glass' && { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, opacity: 0.9 },
        theme.cardStyle === 'neumorphic' && { backgroundColor: colors.surface, shadowOpacity: 0.1, shadowRadius: 8, elevation: 8 },
        theme.cardStyle === 'solid' && { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: variant === 'outlined' ? 1 : 0 },
        themeStyles.borderGlow && { shadowColor: getSafeColor(colors, 'primary'), shadowOpacity: 0.5, shadowRadius: 10, elevation: 10 },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  baseCard: { borderRadius: 20, padding: 16, marginVertical: 8 },
});