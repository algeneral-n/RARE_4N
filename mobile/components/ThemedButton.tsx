import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme'
import { getSafeColor, getSafeColors } from '../utils/safeTheme';;

interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export default function ThemedButton({ title, onPress, variant = 'primary', style, textStyle, disabled = false }: ThemedButtonProps) {
  const { theme, colors = { primary: '#00EAFF', text: '#fff', background: '#000408', surface: '#0a0e14', border: '#1a1f2e' }, styles: themeStyles = {} } = useTheme() || {};

  const isGlass = theme.cardStyle === 'glass';
  const isNeumorphic = theme.buttonStyle === 'neumorphic';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.baseButton,
        isNeumorphic && {
          backgroundColor: variant === 'primary' ? getSafeColor(colors, 'primary') : colors.surface,
          shadowOffset: { width: 3, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 6,
        },
        isGlass && {
          backgroundColor: variant === 'primary' ? getSafeColor(colors, 'primary') + '40' : 'transparent',
          borderColor: colors.border,
          borderWidth: 1,
        },
        !isNeumorphic && !isGlass && {
          backgroundColor: variant === 'primary' ? getSafeColor(colors, 'primary') : 'transparent',
          borderColor: colors.border,
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.buttonText, { color: variant === 'primary' ? '#FFFFFF' : colors.text }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: { borderRadius: 25, paddingVertical: 14, paddingHorizontal: 28, alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontSize: 16, fontWeight: '600' },
  disabled: { opacity: 0.5 },
});