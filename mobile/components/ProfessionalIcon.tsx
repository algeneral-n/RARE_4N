/**
 * RARE 4N - Professional Icon Component
 * أيقونة احترافية مع تأثيرات متقدمة
 */

import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from './Icon';
import { useTheme } from '../hooks/useTheme';

export interface ProfessionalIconProps {
  name: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  gradient?: string[];
  onPress?: () => void;
  variant?: 'default' | 'gradient' | 'outlined' | 'filled';
  animated?: boolean;
  badge?: number | string;
}

export default function ProfessionalIcon({
  name,
  size = 24,
  color,
  backgroundColor,
  gradient,
  onPress,
  variant = 'default',
  animated = false,
  badge,
}: ProfessionalIconProps) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const iconColor = color || colors.primary || '#00EAFF';
  const iconSize = size;
  const containerSize = size * 1.8;

  const variantStyles = {
    default: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    gradient: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: iconColor,
    },
    filled: {
      backgroundColor: iconColor + '20',
      borderWidth: 0,
    },
  };

  const IconContent = (
    <Animated.View
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          transform: [
            { scale: animated ? pulseAnim : scaleAnim },
            {
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        },
        variantStyles[variant],
      ]}
    >
      {variant === 'gradient' && gradient ? (
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: containerSize / 2 }]}
        />
      ) : null}
      
      <Icon name={name} size={iconSize} color={iconColor} />
      
      {badge && (
        <View style={[styles.badge, { backgroundColor: colors.primary || '#00EAFF' }]}>
          <Animated.Text style={styles.badgeText}>{badge}</Animated.Text>
        </View>
      )}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        {IconContent}
      </TouchableOpacity>
    );
  }

  return IconContent;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#000',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

