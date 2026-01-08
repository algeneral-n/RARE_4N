import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, Alert, Animated, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';
import { RAREKernel } from '../core/RAREKernel';
import { CognitiveLoop } from '../core/CognitiveLoop';
import { PermissionManager } from '../core/services/PermissionManager';
import { guardianProtocol } from '../core/protocols/guardian-protocol';
import { useTheme } from '../hooks/useTheme'
import { getSafeColor, getSafeColors } from '../utils/safeTheme';;
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import Icon from '../components/Icon';
import RARECharacter from '../components/RARECharacter';
import { API_URL } from '../services/config';

export default function SOS() {
  const [isActive, setIsActive] = useState(false);
  const [threatLevel, setThreatLevel] = useState<'LOW' | 'HIGH' | 'CRITICAL'>('LOW');
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  
  const { theme, colors = { primary: '#00EAFF', text: '#fff', background: '#000408', surface: '#0a0e14', border: '#1a1f2e' } } = useTheme();
  const { t } = useTranslation();
  const { t: tLang } = useLanguage();
  const kernel = RAREKernel.getInstance();
  const cognitiveLoop = CognitiveLoop.getInstance();
  const permissionManager = PermissionManager.getInstance();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // تفعيل الوعي (Consciousness) عند دخول الشاشة
  useEffect(() => {
    // ربط Cognitive Loop
    cognitiveLoop.init(kernel).catch(console.error);
    
    // إرسال حدث فتح الشاشة
    kernel.emit({ 
      type: 'screen:opened', 
      data: { screen: 'sos' } 
    });
    
    kernel.emit({ 
      type: 'agent:sync', 
      data: { system: 'SOS_PROTOCOL', status: 'CONSCIOUS_ACTIVE', mode: 'SENTINEL' } 
    });
    
    // إرسال للكور
    kernel.emit({
      type: 'user:input',
      data: { text: 'open sos', type: 'navigation', screen: 'sos' }
    });

    // الاستماع لاستجابة الأجنت الصوتية التلقائية عند الخطر
    const unsubscribe = kernel.on('agent:sos:voice_command', (event) => {
      if (event.data.action === 'SPEAK') {
        setIsAgentSpeaking(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // تفعيل بروتوكول الطوارئ (التصرف عند المخاطر) - فقط عند تفعيل المستخدم
  const handleActivateSOS = async () => {
    try {
      // فحص الصلاحية أولاً
      const permissionStatus = await permissionManager.checkPermission('location');
      
      if (!permissionStatus.granted) {
        // فحص الصلاحية فقط - لا طلب تلقائي
        Alert.alert(
          tLang('securityError') || 'خطأ أمني',
          tLang('locationRequiredForSOS') || 'يجب السماح بالوصول للموقع من إعدادات التطبيق لإرسال إشارات الاستغاثة'
        );
        return;
      }

      setIsActive(true);
      setThreatLevel('CRITICAL');
      startCriticalPulse();
      
      // استخدام Guardian Protocol
      const sosResponse = await guardianProtocol.activateSOS('Manual SOS button pressed');
      
      // إرسال للكور
      kernel.emit({
        type: 'user:input',
        data: { text: 'activate sos emergency', type: 'sos', action: 'activate', threatLevel: 'CRITICAL' }
      });
      
      // إرسال طلب SOS للباك إند
      try {
        const response = await fetch(`${API_URL}/api/guardian/sos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reason: 'Manual SOS activation',
            userId: 'nader',
            location: sosResponse.locationCaptured ? {
              latitude: 0, // سيتم ملؤه من Guardian Protocol
              longitude: 0
            } : undefined
          }),
        });
        const data = await response.json();
        if (data.success) {
          kernel.emit({
            type: 'user:input',
            data: { text: 'sos emergency sent', type: 'sos', success: true }
          });
        }
      } catch (error: any) {
        console.error('SOS backend error:', error);
      }

      // إرسال أمر الاستنفار للـ Kernel
      kernel.emit({
        type: 'user:input',
        data: {
          action: 'EMERGENCY_START',
          type: 'sos',
          ambient_sensing: true, // تفعيل الإحساس المحيطي
          auto_voice: true       // تفعيل الصوت التلقائي لرير
        }
      });

      // Show detailed alert
      const alertMessage = `تم تفعيل نظام SOS بنجاح.\n\n` +
        `📍 الموقع: ${sosResponse.locationCaptured ? '✅ تم التقاطه' : '❌ غير متاح'}\n` +
        `🎤 التسجيل: ${sosResponse.recordingStarted ? '✅ نشط' : '❌ غير نشط'}\n` +
        `🔒 الخزنة: ${sosResponse.vaultLocked ? '✅ مقفلة' : '❌ غير مقفلة'}\n\n` +
        `رير الآن في وضع الحارس النشط وسيراقب البيئة المحيطة.`;
      
      Alert.alert('🚨 بروتوكول الحارس نشط', alertMessage, [
        { text: 'فهمت', style: 'default' },
        { 
          text: 'إلغاء التنبيه', 
          style: 'cancel',
          onPress: () => {
            setIsActive(false);
            setThreatLevel('LOW');
            pulseAnim.stopAnimation();
          }
        }
      ]);
    } catch (error: any) {
      console.error('SOS activation error:', error);
      Alert.alert('خطأ', 'فشل تفعيل نظام SOS. يرجى المحاولة مرة أخرى.');
      setIsActive(false);
      setThreatLevel('LOW');
    }
  };

  const startCriticalPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.5, duration: 400, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    ).start();
  };

  return (
    <LinearGradient colors={isActive ? ['#200000', '#000'] : theme.background} style={styles.container}>
      {/* هيدر النظام */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={isActive ? '#ff4444' : getSafeColor(colors, 'primary')} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: isActive ? '#ff4444' : getSafeColor(colors, 'primary') }]}>
          {isActive ? 'SENTINEL ACTIVE' : 'SOS PROTOCOL'}
        </Text>
        <View style={styles.pulseContainer}>
           <View style={[styles.statusDot, { backgroundColor: isActive ? '#ff4444' : '#00ff88' }]} />
        </View>
      </View>

      <View style={styles.content}>
        {/* رير بوضعية "الحارس" (Conscious Agent) */}
        <View style={styles.agentContainer}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <RARECharacter size={isActive ? 220 : 180} animation={isActive ? "speaking" : "idle"} />
          </Animated.View>
          {isActive && (
            <View style={styles.threatBadge}>
              <Text style={styles.threatText}>ANALYZING AMBIENT THREATS...</Text>
            </View>
          )}
        </View>

        {/* زر الطوارئ المركزي */}
        <View style={styles.actionArea}>
          {!isActive ? (
            <Pressable style={styles.sosCircle} onPress={handleActivateSOS}>
              <LinearGradient colors={['#ff0000', '#800000']} style={styles.sosGradient}>
                <Icon name="emergency" size={60} color="#fff" />
                <Text style={styles.sosMainText}>SOS</Text>
              </LinearGradient>
            </Pressable>
          ) : (
            <Pressable style={styles.deactivateBtn} onPress={() => setIsActive(false)}>
              <Text style={styles.deactivateText}>إلغاء الاستنفار</Text>
            </Pressable>
          )}
        </View>

        {/* معلومات التصرف التلقائي */}
        <View style={[styles.infoCard, { borderColor: isActive ? '#ff4444' : getSafeColor(colors, 'primary') + '40' }]}>
          <Text style={[styles.infoTitle, { color: isActive ? '#ff4444' : getSafeColor(colors, 'primary') }]}>
            {isActive ? 'بروتوكول التصرف' : 'الحماية الذكية'}
          </Text>
          <Text style={[styles.infoText, { color: colors.text }]}>
            {isActive 
              ? 'رير يقوم الآن بفتح بث صوتي مخفي، تسجيل المحيط، وتنبيه جهات الاتصال الموثوقة.'
              : 'عند التفعيل، سيقوم الأجنت "رير" صوتياً بتهدئة الموقف أو طلب المساعدة بناءً على نبرة الصوت المحيطة.'}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 25 },
  headerTitle: { fontSize: 14, fontWeight: '700', letterSpacing: 2 },
  pulseContainer: { width: 40, alignItems: 'center' },
  statusDot: { width: 10, height: 10, borderRadius: 5, shadowOpacity: 0.5, shadowRadius: 5 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'space-around', paddingBottom: 50 },
  agentContainer: { alignItems: 'center' },
  threatBadge: { marginTop: 20, backgroundColor: 'rgba(255,0,0,0.1)', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: '#ff4444' },
  threatText: { color: '#ff4444', fontSize: 9, fontWeight: '600' },
  actionArea: { height: 250, justifyContent: 'center' },
  sosCircle: { width: 180, height: 180, borderRadius: 90, elevation: 20, shadowColor: '#ff0000', shadowOpacity: 0.8, shadowRadius: 20 },
  sosGradient: { flex: 1, borderRadius: 90, alignItems: 'center', justifyContent: 'center', gap: 5 },
  sosMainText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  deactivateBtn: { paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, borderWidth: 2, borderColor: '#ff4444' },
  deactivateText: { color: '#ff4444', fontWeight: 'bold' },
  infoCard: { width: '85%', padding: 20, borderRadius: 20, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.02)' },
  infoTitle: { fontSize: 12, fontWeight: '600', marginBottom: 8, textAlign: 'right' },
  infoText: { fontSize: 10, lineHeight: 16, textAlign: 'right', opacity: 0.8 },
  backBtn: { padding: 10 }
});