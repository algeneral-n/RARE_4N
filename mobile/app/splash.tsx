/**
 * RARE 4N - Secure Splash Screen
 * Secure first entry point
 * Authentication check
 * Smooth transition
 */

import { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Animated, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import RARECharacter from '../components/RARECharacter';
import { isAuthenticated } from '../utils/secureAuth';
import NamesTunnel from '../components/NamesTunnel';

export default function Splash() {
  const [status, setStatus] = useState<'loading' | 'checking' | 'ready'>('loading');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ),
    ]).start();

    // Initialize app
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setStatus('checking');
      
      // Check authentication
      const authenticated = await isAuthenticated();
      const authToken = await AsyncStorage.getItem('authToken');
      
      // Small delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus('ready');
      
      // Navigate based on authentication
      if (authenticated || authToken === 'rare4n_authenticated') {
        // Check biometric availability
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        
        if (hasHardware && isEnrolled) {
          // Try quick biometric check
          try {
            const biometricResult = await LocalAuthentication.authenticateAsync({
              promptMessage: 'تأكيد سريع',
              disableDeviceFallback: true,
              cancelLabel: 'إلغاء',
            });
            
            if (biometricResult.success) {
              router.replace('/home');
              return;
            }
          } catch (e) {
            // Biometric failed, continue to home
          }
        }
        
        router.replace('/home');
      } else {
        router.replace('/boot');
      }
    } catch (error) {
      console.error('Splash initialization error:', error);
      // On error, go to boot screen
      router.replace('/boot');
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#000408', '#001820', '#000408']} 
        style={StyleSheet.absoluteFill} 
      />
      
      {/* Names Tunnel Background */}
      <View style={StyleSheet.absoluteFill}>
        <NamesTunnel />
      </View>
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <View style={styles.ring} />
        </Animated.View>
        
        <RARECharacter size={180} animation="idle" />
        
        <Text style={styles.title}>RARE 4N</Text>
        <Text style={styles.subtitle}>Cognitive Operating System</Text>
        
        {status === 'checking' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#00eaff" />
            <Text style={styles.loadingText}>جارٍ التحقق من الأمان...</Text>
          </View>
        )}
      </Animated.View>
      
      {/* Security Badge */}
      <View style={styles.securityBadge}>
        <Text style={styles.securityText}>Secure Entry</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: '#00eaff30',
    borderStyle: 'dashed',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#00eaff',
    marginTop: 30,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#888',
    marginTop: 8,
    letterSpacing: 2,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 30,
  },
  loadingText: {
    color: '#00eaff',
    fontSize: 10,
  },
  securityBadge: {
    position: 'absolute',
    bottom: 50,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 234, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00eaff30',
  },
  securityText: {
    color: '#00eaff',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
});


























