/**
 * RARE 4N - Cinematic Card Component
 * بطاقة سينمائية احترافية مع تأثيرات متقدمة
 */

import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';
import { useFont } from '../hooks/useFont';
import Icon from './Icon';

const { width } = Dimensions.get('window');

export interface CinematicCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  gradient?: string[];
  onPress?: () => void;
  children?: React.ReactNode;
  style?: any;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'elevated' | 'outlined';
}

export default function CinematicCard({
  title,
  subtitle,
  icon,
  gradient,
  onPress,
  children,
  style,
  size = 'medium',
  variant = 'default',
}: CinematicCardProps) {
  const { colors } = useTheme();
  const { fontFamily } = useFont();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
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

  const cardGradient = gradient || [
    colors.primary || '#00EAFF',
    colors.secondary || '#10A37F',
  ];

  const sizeStyles = {
    small: { padding: 12, minHeight: 80 },
    medium: { padding: 16, minHeight: 120 },
    large: { padding: 20, minHeight: 160 },
  };

  const variantStyles = {
    default: {
      borderRadius: 16,
      borderWidth: 0,
    },
    elevated: {
      borderRadius: 20,
      borderWidth: 0,
      shadowColor: colors.primary || '#00EAFF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    outlined: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border || '#1a1f2e',
    },
  };

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const CardContent = (
    <Animated.View
      style={[
        styles.container,
        sizeStyles[size],
        variantStyles[variant],
        {
          backgroundColor: colors.surface || '#0a0e14',
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { opacity: 0.1, borderRadius: variantStyles[variant].borderRadius }]}
      />
      
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: shimmerAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0.1, 0],
            }),
            transform: [{ translateX: shimmerTranslate }],
          },
        ]}
      >
        <LinearGradient
          colors={['transparent', colors.primary || '#00EAFF', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <View style={styles.content}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: cardGradient[0] + '20' }]}>
            <Icon name={icon} size={size === 'small' ? 20 : size === 'large' ? 32 : 24} color={cardGradient[0]} />
          </View>
        )}
        
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text || '#ffffff',
                fontFamily,
                fontSize: size === 'small' ? 12 : size === 'large' ? 18 : 14,
              },
            ]}
            numberOfLines={2}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.textSecondary || '#888888',
                  fontFamily,
                  fontSize: size === 'small' ? 10 : size === 'large' ? 14 : 12,
                },
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {children && <View style={styles.childrenContainer}>{children}</View>}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    marginVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.7,
  },
  childrenContainer: {
    marginTop: 12,
  },
});

