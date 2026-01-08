/**
 * RARE 4N - Loading States Component
 * Loading indicators and skeleton screens
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useFont } from '../hooks/useFont';

export interface LoadingStatesProps {
  type?: 'spinner' | 'skeleton' | 'pulse';
  message?: string;
  size?: 'small' | 'large';
}

export default function LoadingStates({
  type = 'spinner',
  message,
  size = 'large',
}: LoadingStatesProps) {
  const { colors } = useTheme();
  const { fontFamily } = useFont();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (type === 'pulse') {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [type]);

  if (type === 'spinner') {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size={size}
          color={colors.primary || '#00EAFF'}
        />
        {message && (
          <Text style={[styles.message, { color: colors.text || '#ffffff', fontFamily }]}>
            {message}
          </Text>
        )}
      </View>
    );
  }

  if (type === 'skeleton') {
    return (
      <View style={styles.skeletonContainer}>
        <View style={[styles.skeletonLine, { backgroundColor: colors.surface || '#0a0e14' }]} />
        <View style={[styles.skeletonLine, { backgroundColor: colors.surface || '#0a0e14', width: '80%' }]} />
        <View style={[styles.skeletonLine, { backgroundColor: colors.surface || '#0a0e14', width: '60%' }]} />
      </View>
    );
  }

  if (type === 'pulse') {
    return (
      <Animated.View
        style={[
          styles.pulseContainer,
          {
            opacity: pulseAnim,
            backgroundColor: colors.primary || '#00EAFF',
          },
        ]}
      >
        {message && (
          <Text style={[styles.message, { color: colors.text || '#ffffff', fontFamily }]}>
            {message}
          </Text>
        )}
      </Animated.View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
  },
  skeletonContainer: {
    padding: 16,
  },
  skeletonLine: {
    height: 16,
    borderRadius: 4,
    marginBottom: 12,
    width: '100%',
  },
  pulseContainer: {
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

