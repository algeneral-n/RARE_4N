import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import RARECharacter from '../components/RARECharacter';
import { verifyStoredPassword, authenticateWithBiometrics, setAuthToken, isAuthenticated } from '../utils/secureAuth';
import Icon from '../components/Icon';
import { getSafeColor } from '../utils/safeTheme';

const DEFAULT_PASSWORD = '263688';

export default function Boot() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    // Check if already authenticated
    checkAuth();
    
    // Try biometric authentication on mount
    tryBiometricAuth();
    
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // Lock mechanism
    if (isLocked && lockTime > 0) {
      const timer = setInterval(() => {
        setLockTime(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLocked, lockTime]);

  const checkAuth = async () => {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      router.replace('/home');
    }
  };

  const tryBiometricAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (hasHardware && isEnrolled) {
        const success = await authenticateWithBiometrics();
        if (success) {
          await setAuthToken('rare4n_authenticated');
          router.replace('/home');
        }
      }
    } catch (error) {
      // Biometric auth not available or failed - continue with password
    }
  };

  const handleLogin = async () => {
    if (isLocked) {
      setError(`تم حظر الدخول. انتظر ${lockTime} ثانية`);
      return;
    }

    if (!password.trim()) {
      setError('يرجى إدخال كلمة المرور');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Verify password securely
      const isValid = await verifyStoredPassword(password.trim());
      
      if (isValid || password.trim() === DEFAULT_PASSWORD) {
        // First time login - initialize secure password
        if (password.trim() === DEFAULT_PASSWORD) {
          const { initializePassword } = await import('../utils/secureAuth');
          await initializePassword(DEFAULT_PASSWORD);
        }
        
        await setAuthToken('rare4n_authenticated');
        await AsyncStorage.setItem('authToken', 'rare4n_authenticated');
        setAttempts(0);
        router.replace('/home');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockTime(60); // Lock for 60 seconds
          setError('تم حظر الدخول بعد 5 محاولات فاشلة. انتظر دقيقة واحدة');
        } else {
          setError(`كلمة المرور غير صحيحة. المحاولات المتبقية: ${5 - newAttempts}`);
        }
      }
    } catch (error: any) {
      setError('حدث خطأ في التحقق. يرجى المحاولة مرة أخرى');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    try {
      const success = await authenticateWithBiometrics();
      if (success) {
        await setAuthToken('rare4n_authenticated');
        await AsyncStorage.setItem('authToken', 'rare4n_authenticated');
        router.replace('/home');
      } else {
        setError('فشل التحقق البيومتري');
      }
    } catch (error: any) {
      setError('التحقق البيومتري غير متاح');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#000408', '#001820', '#000408']} style={styles.background}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <RARECharacter size={200} animation="idle" />
          </Animated.View>
          <Text style={styles.title}>RARE 4N</Text>
          <Text style={styles.subtitle}>مرحباً بك في رير</Text>
          <Text style={styles.welcome}>مرحباً بك</Text>
          <Text style={styles.hint}>سجل دخولك للوصول إلى رير</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, isLocked && styles.inputDisabled]}
              placeholder="كلمة المرور"
              placeholderTextColor="#00eaff50"
              value={password}
              onChangeText={(text) => { setPassword(text); setError(''); }}
              secureTextEntry
              onSubmitEditing={handleLogin}
              editable={!isLocked}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {isLoading && (
              <ActivityIndicator 
                size="small" 
                color="#00eaff" 
                style={styles.loader}
              />
            )}
          </View>
          
          <TouchableOpacity 
            style={[styles.button, (isLoading || isLocked) && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading || isLocked}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>
                {isLocked ? `انتظر ${lockTime} ثانية` : 'تسجيل الدخول'}
              </Text>
            )}
          </TouchableOpacity>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Icon name="error" size={16} color="#ff4444" />
              <Text style={styles.error}>{error}</Text>
            </View>
          ) : null}
          
          {/* Biometric Login Button */}
          <TouchableOpacity 
            style={styles.biometricButton}
            onPress={handleBiometricLogin}
          >
            <Icon name="face" size={24} color="#00eaff" />
            <Text style={styles.biometricText}>استخدم Face ID / Touch ID</Text>
          </TouchableOpacity>
          
          {attempts > 0 && attempts < 5 && (
            <Text style={styles.attemptsWarning}>
              تحذير: {5 - attempts} محاولات متبقية قبل الحظر
            </Text>
          )}
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#00eaff', marginTop: 20, letterSpacing: 2 },
  subtitle: { fontSize: 16, color: '#888', marginTop: 8 },
  welcome: { fontSize: 28, fontWeight: 'bold', color: '#00eaff', marginTop: 40 },
  hint: { fontSize: 14, color: '#666', marginTop: 8, marginBottom: 20 },
  inputContainer: { width: '80%', maxWidth: 300, position: 'relative', marginBottom: 16 },
  input: { 
    width: '100%', 
    height: 50, 
    borderWidth: 1, 
    borderColor: '#00eaff', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingRight: 45,
    color: '#fff', 
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  inputDisabled: {
    opacity: 0.5,
    borderColor: '#666',
  },
  loader: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  button: { 
    width: '80%', 
    maxWidth: 300, 
    height: 50, 
    backgroundColor: '#00eaff', 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#00eaff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  error: { color: '#ff4444', fontSize: 14, flex: 1 },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00eaff',
    backgroundColor: 'rgba(0, 234, 255, 0.1)',
  },
  biometricText: {
    color: '#00eaff',
    fontSize: 14,
    fontWeight: '600',
  },
  attemptsWarning: {
    color: '#ffaa00',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
});
