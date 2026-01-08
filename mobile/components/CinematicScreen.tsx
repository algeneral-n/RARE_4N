/**
 * RARE 4N - Cinematic Screen Component
 * شاشة سينمائية احترافية مع تأثيرات متقدمة
 */

import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';
import { useFont } from '../hooks/useFont';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export interface CinematicScreenProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  gradient?: string[];
  blur?: boolean;
  animated?: boolean;
}

export default function CinematicScreen({
  title,
  subtitle,
  children,
  header,
  footer,
  gradient,
  blur = false,
  animated = true,
}: CinematicScreenProps) {
  const { colors } = useTheme();
  const { fontFamily } = useFont();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const parallaxAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, []);

  const screenGradient = gradient || [
    colors.background || '#000408',
    colors.surface || '#0a0e14',
    colors.background || '#000408',
  ];

  const Content = (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <LinearGradient
        colors={screenGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {blur && (
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />
      )}

      {header && (
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {header}
        </Animated.View>
      )}

      {(title || subtitle) && (
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {title && (
            <Text
              style={[
                styles.title,
                {
                  color: colors.text || '#ffffff',
                  fontFamily,
                },
              ]}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.textSecondary || '#888888',
                  fontFamily,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </Animated.View>
      )}

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {children}
      </Animated.View>

      {footer && (
        <Animated.View
          style={[
            styles.footer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          {footer}
        </Animated.View>
      )}
    </View>
  );

  return Content;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});

