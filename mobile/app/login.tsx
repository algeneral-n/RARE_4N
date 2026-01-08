import { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, ScrollView, Platform, KeyboardAvoidingView, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTheme } from '../hooks/useTheme'
import { getSafeColor, getSafeColors } from '../utils/safeTheme';;
import NamesTunnel from '../components/NamesTunnel';
import RARECharacter from '../components/RARECharacter';
import Icon from '../components/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const FAMILY_PASSWORD = '263688';

export default function Login() {
  const [password, setPassword] = useState('');
  const { theme, colors = { primary: '#00EAFF', text: '#fff', background: '#000408', surface: '#0a0e14', border: '#1a1f2e' } } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const checkAndTryFaceID = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (hasHardware && isEnrolled) {
        setTimeout(() => handleFaceAuth(), 1000);
      }
    } catch (error) {
      console.log('Face ID check failed:', error);
    }
  };

  const handleFaceAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) return;

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'الدخول إلى نظام رير الآمن',
        fallbackLabel: 'استخدم كلمة المرور',
        disableDeviceFallback: false,
      });

      if (result.success) {
        enterSystem();
      }
    } catch (error) {
      console.error('Face ID error:', error);
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 20, useNativeDriver: true }),
    ]).start();
    checkAndTryFaceID();
  }, []);

  const enterSystem = async () => {
    await AsyncStorage.setItem('authToken', 'rare4n_authenticated');
    router.replace('/home');
  };

  const checkPassword = () => {
    if (password === FAMILY_PASSWORD) {
      enterSystem();
    } else {
      Alert.alert('خطأ', 'كلمة المرور غير صحيحة');
      setPassword('');
    }
  };

  return (
    <View style={styles.container}>
      {/* خلفية نفق الأسماء المتحركة */}
      <View style={StyleSheet.absoluteFill}>
        <NamesTunnel />
        <LinearGradient 
          colors={['rgba(0,4,8,0.9)', 'transparent', 'rgba(0,4,8,0.9)']} 
          style={StyleSheet.absoluteFill} 
        />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          <Animated.View style={[styles.main, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {/* الكراكتر المركزي */}
            <View style={styles.characterBox}>
              <RARECharacter size={220} animation="idle" />
              <View style={[styles.glowRing, { borderColor: getSafeColor(colors, 'primary') + '50' }]} />
            </View>

            <Text style={[styles.title, { color: getSafeColor(colors, 'primary') }]}>RARE 4N ACCESS</Text>

            {/* 💬 صندوق الحوار الزجاجي */}
            <View style={styles.glassBox}>
              <Text style={styles.chatText}>نظام رير 4N بانتظار المصادقة...</Text>
            </View>

            {/* مدخل كلمة المرور */}
            <View style={[styles.inputWrapper, { borderColor: getSafeColor(colors, 'primary') + '30' }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="أدخل بروتوكول الدخول..."
                placeholderTextColor="#444"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                keyboardType="numeric"
                onSubmitEditing={checkPassword}
              />
              <TouchableOpacity 
                onPress={checkPassword} 
                style={[styles.loginBtn, { backgroundColor: getSafeColor(colors, 'primary') }]}
              >
                <Icon name="arrow-forward" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* 🧬 أزرار الدخول البديلة */}
            <View style={styles.altAuth}>
              <TouchableOpacity style={styles.faceIdBtn} onPress={handleFaceAuth}>
                <Icon name="faceid" type="material-community" size={40} color={getSafeColor(colors, 'primary')} />
                <Text style={{ color: getSafeColor(colors, 'primary'), fontSize: 10, marginTop: 5 }}>FACE ID</Text>
              </TouchableOpacity>
            </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { flexGrow: 1, justifyContent: 'center', padding: 30 },
  main: { alignItems: 'center' },
  characterBox: { marginBottom: 30, alignItems: 'center', justifyContent: 'center' },
  glowRing: { position: 'absolute', width: 250, height: 250, borderRadius: 125, borderWidth: 1, borderStyle: 'dashed' },
  title: { fontSize: 18, fontWeight: '900', letterSpacing: 5, marginBottom: 20 },
  glassBox: { padding: 20, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', width: '100%', marginBottom: 30 },
  chatText: { color: '#fff', textAlign: 'center', fontSize: 14, lineHeight: 22 },
  inputWrapper: { width: '100%', height: 60, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 15, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 20, overflow: 'hidden' },
  input: { flex: 1, fontSize: 16, letterSpacing: 5 },
  loginBtn: { width: 60, height: '100%', alignItems: 'center', justifyContent: 'center' },
  altAuth: { marginTop: 40, alignItems: 'center' },
  faceIdBtn: { alignItems: 'center', padding: 15, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 20, borderWidth: 1, borderColor: '#111' }
});