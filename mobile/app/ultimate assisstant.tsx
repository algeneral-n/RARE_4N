import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Switch, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { RAREKernel } from '../core/RAREKernel';
import { CognitiveLoop } from '../core/CognitiveLoop';
import { PermissionManager } from '../core/services/PermissionManager';
import { CommunicationAgent } from '../core/agents/CommunicationAgent';
import Icon from '../components/Icon';
import RARECharacter from '../components/RARECharacter';
import { useTheme } from '../hooks/useTheme'
import { getSafeColor, getSafeColors } from '../utils/safeTheme';;
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { API_URL } from '../services/config';

const { width, height } = Dimensions.get('window');

export default function UltimateAssistant() {
  const { colors = { primary: '#00EAFF', text: '#fff', background: '#000408', surface: '#0a0e14', border: '#1a1f2e' } } = useTheme();
  const { t } = useTranslation();
  const { t: tLang } = useLanguage();
  const kernel = RAREKernel.getInstance();
  const cognitiveLoop = CognitiveLoop.getInstance();
  const permissionManager = PermissionManager.getInstance();
  const communicationAgent = new CommunicationAgent();
  const [ambientActive, setAmbientActive] = useState(false);
  const [neuralLink, setNeuralLink] = useState(false);
  
  // أنيميشن حلقات الطاقة (عشان الشكل يبقى صايع)
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ربط Cognitive Loop
    cognitiveLoop.init(kernel).catch(console.error);
    
    // إرسال حدث فتح الشاشة
    kernel.emit({ 
      type: 'screen:opened', 
      data: { screen: 'ultimate-assistant' } 
    });
    
    // إرسال للكور
    kernel.emit({
      type: 'user:input',
      data: { text: 'open ultimate assistant', type: 'navigation', screen: 'ultimate-assistant' }
    });
    
    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 8000, useNativeDriver: true })
    ).start();
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const float = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });

  return (
    <View style={styles.container}>
      {/* خلفية كونية عميقة */}
      <LinearGradient colors={['#000814', '#001d3d', '#000814']} style={StyleSheet.absoluteFill} />
      
      {/* الهيدر الهولوجرامي */}
      <View style={styles.glassHeader}>
        <Text style={[styles.headerText, { color: getSafeColor(colors, 'primary') }]}>RARE ULTIMATE SYSTEMS</Text>
        <View style={styles.pulseDot} />
      </View>

      {/* منطقة الـ Reactor (المفاعل المركزي) */}
      <View style={styles.reactor}>
        <Animated.View style={[styles.outerRing, { borderColor: getSafeColor(colors, 'primary') + '40', transform: [{ rotate: spin }] }]} />
        <Animated.View style={[styles.innerRing, { borderColor: getSafeColor(colors, 'primary'), transform: [{ rotate: spin }] }]} />
        
        <Animated.View style={{ transform: [{ translateY: float }] }}>
          <RARECharacter size={240} animation={neuralLink ? "speaking" : "idle"} />
        </Animated.View>
      </View>

      {/* لوحة التحكم الذكية (Smart Console) */}
      <View style={styles.console}>
        <View style={styles.controlBox}>
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Ambient Sensing</Text>
              <Text style={styles.subLabel}>
                {tLang('activePeripheralSensing') || 'الاحساس المحيطي النشط'}
              </Text>
            </View>
            <Switch 
              value={ambientActive} 
              onValueChange={(value) => {
                setAmbientActive(value);
                kernel.emit({
                  type: 'user:input',
                  data: { text: `toggle ambient sensing: ${value}`, type: 'ultimate-assistant', ambientActive: value }
                });
              }} 
              thumbColor={ambientActive ? getSafeColor(colors, 'primary') : '#444'}
              trackColor={{ true: getSafeColor(colors, 'primary') + '50', false: '#222' }}
            />
          </View>

          <View style={[styles.row, { marginTop: 20 }]}>
            <View>
              <Text style={styles.label}>Neural Voice Link</Text>
              <Text style={styles.subLabel}>
                {tLang('enableAutoVoice') || 'تفعيل الصوت التلقائي'}
              </Text>
            </View>
            <Switch 
              value={neuralLink} 
              onValueChange={async (value) => {
                if (value) {
                  // فحص الصلاحية فقط - لا طلب تلقائي
                  const permissionStatus = await permissionManager.checkPermission('audio');
                  if (!permissionStatus.granted) {
                    Alert.alert(
                      tLang('permissionRequired') || 'تنبيه',
                      tLang('audioAccessRequired') || 'يجب السماح بالوصول للميكروفون من إعدادات التطبيق'
                    );
                    return;
                  }
                }
                setNeuralLink(value);
                kernel.emit({
                  type: 'user:input',
                  data: { text: `toggle neural voice link: ${value}`, type: 'ultimate-assistant', neuralLink: value }
                });
              }} 
              thumbColor={neuralLink ? '#00FFCC' : '#444'}
              trackColor={{ true: '#00FFCC50', false: '#222' }}
            />
          </View>
        </View>

        {/* أزرار الانتجريشن (الواتس، الإيميل، التليفون) */}
        <View style={styles.integrationRow}>
          <Pressable 
            style={styles.integCircle}
            onPress={async () => {
              try {
                kernel.emit({
                  type: 'user:input',
                  data: { text: 'open whatsapp communication', type: 'ultimate-assistant', action: 'whatsapp' }
                });
                
                const result = await communicationAgent.execute('send_whatsapp', {
                  phone: '+971529211077',
                  message: 'Hello from RARE 4N Ultimate Assistant'
                });
                
                if (!result.success) {
                  const whatsappUrl = `https://wa.me/971529211077`;
                  if (await Linking.canOpenURL(whatsappUrl)) {
                    await Linking.openURL(whatsappUrl);
                  }
                }
              } catch (error: any) {
                Alert.alert('WhatsApp', error.message || 'Cannot open WhatsApp');
              }
            }}
          >
            <Icon name="whatsapp" type="font-awesome" size={24} color="#25D366" />
            <Text style={styles.integText}>WHATSAPP</Text>
          </Pressable>
          <Pressable 
            style={styles.integCircle}
            onPress={async () => {
              try {
                kernel.emit({
                  type: 'user:input',
                  data: { text: 'open email communication', type: 'ultimate-assistant', action: 'email' }
                });
                
                const emailUrl = `mailto:GM@ZIEN-AI.APP?subject=RARE%204N%20Message&body=Hello%20from%20RARE%204N%20Ultimate%20Assistant`;
                if (await Linking.canOpenURL(emailUrl)) {
                  await Linking.openURL(emailUrl);
                } else {
                  Alert.alert('Email', 'Cannot open email client');
                }
              } catch (error: any) {
                Alert.alert('Email', error.message || 'Cannot open email');
              }
            }}
          >
            <Icon name="mail" size={24} color="#EA4335" />
            <Text style={styles.integText}>EMAIL</Text>
          </Pressable>
          <Pressable 
            style={styles.integCircle}
            onPress={async () => {
              try {
                kernel.emit({
                  type: 'user:input',
                  data: { text: 'open voice call', type: 'ultimate-assistant', action: 'voice_call' }
                });
                
                const result = await communicationAgent.execute('make_phone_call', {
                  phone: '+971529211077'
                });
                
                if (!result.success) {
                  const phoneUrl = `tel:+971529211077`;
                  if (await Linking.canOpenURL(phoneUrl)) {
                    await Linking.openURL(phoneUrl);
                  }
                }
              } catch (error: any) {
                Alert.alert('Voice Call', error.message || 'Cannot make call');
              }
            }}
          >
            <Icon name="phone-in-talk" size={24} color="#00EAFF" />
            <Text style={styles.integText}>VOICE CALL</Text>
          </Pressable>
        </View>
      </View>

      {/* بار الحالة السفلي */}
      <View style={[styles.bottomBar, { borderTopColor: getSafeColor(colors, 'primary') + '30' }]}>
        <Text style={styles.statusText}>ALL SYSTEMS OPERATIONAL // LEVEL 5 ACCESS GRANTED</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  glassHeader: { marginTop: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 },
  headerText: { fontSize: 14, fontWeight: 'bold', letterSpacing: 3 },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00FFCC' },
  
  reactor: { height: height * 0.45, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  outerRing: { position: 'absolute', width: 320, height: 320, borderRadius: 160, borderWidth: 1, borderStyle: 'dashed' },
  innerRing: { position: 'absolute', width: 280, height: 280, borderRadius: 140, borderWidth: 2, borderLeftWidth: 0, borderRightWidth: 0 },
  
  console: { flex: 1, paddingHorizontal: 25 },
  controlBox: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 25, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  subLabel: { color: '#555', fontSize: 10, marginTop: 2 },
  
  integrationRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  integCircle: { width: (width - 80) / 3, height: 100, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 20, justifyContent: 'center', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#111' },
  integText: { color: '#888', fontSize: 9, fontWeight: 'bold' },
  
  bottomBar: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center', borderTopWidth: 1, paddingTop: 20 },
  statusText: { color: '#444', fontSize: 9, letterSpacing: 1.5 }
});