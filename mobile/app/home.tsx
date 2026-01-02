import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Dimensions, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { RAREKernel } from '../core/RAREKernel';
import { CognitiveLoop } from '../core/CognitiveLoop';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { useVoice } from '../contexts/VoiceContext';
import { voiceConsciousness } from '../core/services/VoiceConsciousness';
import NamesTunnel from '../components/NamesTunnel';
import RARECharacter from '../components/RARECharacter';
import Icon from '../components/Icon';

const { width } = Dimensions.get('window');

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  
  // ✅ استخدام hooks بشكل صحيح (خارج try-catch)
  const { colors = { primary: '#00EAFF', text: '#fff' } } = useTheme();
  const { t = (key: string) => key } = useTranslation();
  const { t: tLang = (key: string) => key } = useLanguage();
  const { 
    isVoiceEnabled = false, 
    isListening = false, 
    isSpeaking = false, 
    toggleVoice = async () => {} 
  } = useVoice();
  
  const kernel = RAREKernel.getInstance();
  const cognitiveLoop = CognitiveLoop.getInstance();
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    
    const init = async () => {
      try {
        // ✅ Initialize Voice Consciousness System
        try {
          await voiceConsciousness.init();
          voiceConsciousness.updateScreenContext('home');
        } catch (consciousnessError) {
          console.error('Voice Consciousness init error:', consciousnessError);
        }
        
        // إشارة تفعيل الأنظمة المدمجة
        try {
          if (kernel && typeof kernel.emit === 'function') {
            kernel.emit({ type: 'system:sync', data: { status: 'FULL_ECOSYSTEM_READY' } });
          }
        } catch (emitError) {
          console.error('Kernel emit error:', emitError);
        }
        
        // ربط Cognitive Loop
        try {
          await cognitiveLoop.init(kernel).catch((err) => {
            console.error('Cognitive Loop init error:', err);
          });
        } catch (loopError) {
          console.error('Cognitive Loop error:', loopError);
        }

        // أنيميشن للصوت النشط
        if (isVoiceEnabled) {
          try {
            animation = Animated.loop(
              Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
              ])
            );
            animation.start();
          } catch (animError) {
            console.error('Animation error:', animError);
          }
        }
        
        // تأكيد أن كل شيء جاهز
        setIsReady(true);
        
      } catch (error: any) {
        console.error('Home screen error:', error);
        // حتى لو حدث خطأ، نعرض الشاشة
        setIsReady(true);
      }
    };
    
    init();
    
    // Cleanup animation on unmount
    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [isVoiceEnabled]);

  // ✅ الأقسام المربوطة حصرياً بالملفات الـ 16 الموجودة عندك
  const appSections = [
    {
      title: tLang('systemsAndIntelligence') || "الأنظمة والذكاء",
      data: [
        { id: 'builder', title: tLang('appBuilder'), icon: 'apps', route: '/app-builder', color: '#00EAFF', description: 'بناء التطبيقات' },
        { id: 'generator', title: tLang('fileGenerator'), icon: 'sparkles', route: '/generator', color: '#10A37F', description: 'مولد الملفات' },
        { id: 'rarevault', title: tLang('vault'), icon: 'lock', route: '/rarevault', color: '#D4AF37', description: 'القبو الآمن' },
        { id: 'council', title: tLang('council') || 'The Council', icon: 'groups', route: '/council', color: '#AF52DE', description: 'المجلس الذكي' },
      ]
    },
    {
      title: tLang('controlAndEnvironment') || "التحكم والبيئة",
      data: [
        { id: 'carplay', title: tLang('driveMode') || 'Drive Mode', icon: 'car', route: '/carplayscreen', color: '#5856D6', description: 'وضع القيادة' },
        { id: 'maps', title: tLang('maps'), icon: 'map', route: '/maps', color: '#FFCC00', description: 'الخرائط' },
        { id: 'ultimate', title: tLang('ultimateAI') || 'Ultimate AI', icon: 'security', route: '/ultimate assisstant', color: '#FF3B30', description: 'المساعد المتقدم' },
        { id: 'control', title: tLang('controlRoom'), icon: 'settings', route: '/control-room', color: '#8E8E93', description: 'غرفة التحكم' },
      ]
    },
    {
      title: tLang('securityAndSystem') || "الأمان والنظام",
      data: [
        { id: 'sos', title: tLang('emergency') || 'EMERGENCY', icon: 'emergency', route: '/sos', color: '#FF0000', description: 'الطوارئ' },
        { id: 'codegen', title: tLang('codeGenerator'), icon: 'terminal', route: '/code-generator', color: '#FFFFFF', description: 'مولد الكود' },
        { id: 'settings', title: tLang('settings'), icon: 'person', route: '/settings', color: '#555', description: 'الإعدادات' },
      ]
    }
  ];

  // ✅ Fallback للتأكد من أن colors موجود
  const safeColors = colors || { primary: '#00EAFF', text: '#fff', background: '#000408' };

  // Loading state - عرض شاشة بسيطة حتى يتم التهيئة
  if (!isReady) {
    return (
      <View style={[styles.container, { backgroundColor: safeColors.background || '#000408', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: safeColors.primary, fontSize: 18 }}>RARE 4N</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: safeColors.background || '#000408' }]}>
      {/* 🌌 نفق الأسماء - الهوية البصرية لرير */}
      <View style={StyleSheet.absoluteFill}>
        <NamesTunnel />
        <LinearGradient 
          colors={['rgba(0,4,8,0.85)', 'rgba(0,4,8,0.5)', 'rgba(0,4,8,0.95)']} 
          style={StyleSheet.absoluteFill} 
        />
      </View>
      
      <View style={styles.header}>
        <Text style={[styles.logoText, { color: safeColors.primary }]}>RARE 4N OS</Text>
        <View style={styles.headerActions}>
          {/* زر تفعيل/إلغاء الصوت التلقائي */}
          <Pressable 
            style={[
              styles.voiceToggleBtn, 
              { 
                backgroundColor: isVoiceEnabled ? safeColors.primary + '30' : 'transparent',
                borderColor: isVoiceEnabled ? safeColors.primary : safeColors.primary + '50'
              }
            ]}
            onPress={toggleVoice}
          >
            <Animated.View style={{ transform: [{ scale: isVoiceEnabled ? pulseAnim : 1 }] }}>
              <Icon 
                name={isVoiceEnabled ? 'mic' : 'mic-off'} 
                size={24} 
                color={isVoiceEnabled ? safeColors.primary : safeColors.primary + '70'} 
              />
            </Animated.View>
            {isListening && (
              <View style={[styles.listeningIndicator, { backgroundColor: safeColors.primary }]} />
            )}
          </Pressable>
          <Pressable style={styles.profileBtn} onPress={() => {
            try {
              kernel.emit({ type: 'user:input', data: { text: 'open settings', type: 'navigation' } });
            } catch (e) {
              console.error('Kernel emit error:', e);
            }
            router.push('/settings');
          }}>
            <Icon name="account-circle" size={26} color={safeColors.primary} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* الكراكتر الضخم (Size 250) للهيبة القصوى */}
        <View style={styles.characterContainer}>
          <RARECharacter size={250} />
          <View style={[styles.statusBadge, { borderColor: safeColors.primary }]}>
            <Text style={[styles.statusText, { color: safeColors.primary }]}>CORE ENGINE ACTIVE</Text>
          </View>
        </View>

        {/* ✅ زر التفعيل الصوتي الذكي (Real-time Consciousness) - في المنتصف */}
        <View style={styles.voiceActivationContainer}>
          <Pressable 
            style={[
              styles.voiceActivationBtn,
              {
                backgroundColor: isVoiceEnabled ? safeColors.primary : 'transparent',
                borderColor: isVoiceEnabled ? safeColors.primary : safeColors.primary + '50',
                borderWidth: 2,
              }
            ]}
            onPress={async () => {
              try {
                const newState = !isVoiceEnabled;
                await toggleVoice();
                
                // ✅ Activate/Deactivate Voice Consciousness
                if (newState) {
                  await voiceConsciousness.activate();
                  kernel.emit({
                    type: 'user:input',
                    data: { 
                      text: 'voice enabled - real-time consciousness activated globally',
                      type: 'voice',
                      action: 'enable',
                      consciousness: true
                    }
                  });
                } else {
                  await voiceConsciousness.deactivate();
                  kernel.emit({
                    type: 'user:input',
                    data: { 
                      text: 'voice disabled - consciousness deactivated',
                      type: 'voice',
                      action: 'disable'
                    }
                  });
                }
              } catch (error) {
                console.error('Voice toggle error:', error);
              }
            }}
          >
            <Animated.View style={{ transform: [{ scale: isVoiceEnabled ? pulseAnim : 1 }] }}>
              <Icon 
                name={isVoiceEnabled ? 'mic' : 'mic-off'} 
                size={40} 
                color={isVoiceEnabled ? '#000' : safeColors.primary} 
              />
            </Animated.View>
            {isListening && (
              <View style={[styles.listeningPulse, { backgroundColor: safeColors.primary }]} />
            )}
          </Pressable>
          <Text style={[styles.voiceActivationLabel, { color: isVoiceEnabled ? safeColors.primary : safeColors.primary + '70' }]}>
            {isVoiceEnabled ? 'Real-time Consciousness Active' : 'Tap to Activate Voice'}
          </Text>
          {isVoiceEnabled && (
            <Text style={[styles.voiceActivationSubLabel, { color: safeColors.primary + '70' }]}>
              RARE is listening and responding across all screens
            </Text>
          )}
        </View>

        {/* شبكة التطبيقات المحدثة */}
        {appSections.map((section, sIdx) => (
          <View key={sIdx} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: safeColors.primary + '70' }]}>{section.title}</Text>
            <View style={styles.appGrid}>
              {section.data.map((app) => (
                <Pressable 
                  key={app.id} 
                  style={styles.appItem}
                  onPress={() => {
                    try {
                      kernel.emit({ 
                        type: 'user:input', 
                        data: { text: `open ${app.title}`, type: 'navigation', route: app.route } 
                      });
                    } catch (e) {
                      console.error('Kernel emit error:', e);
                    }
                    router.push(app.route as any);
                  }}
                  onLongPress={() => {
                    // Long press for quick info
                    Alert.alert(app.title, app.description || '');
                  }}
                >
                  <View style={[styles.iconCircle, { borderColor: app.color + '40', backgroundColor: app.color + '10' }]}>
                    <Icon name={app.icon} size={28} color={app.color} />
                  </View>
                  <Text style={[styles.appLabel, { color: '#fff' }]} numberOfLines={1}>
                    {app.title}
                  </Text>
                  {app.description && (
                    <Text style={[styles.appDescription, { color: '#555' }]} numberOfLines={1}>
                      {app.description}
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 25 },
  logoText: { fontSize: 22, fontWeight: '900', letterSpacing: 4 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  voiceToggleBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    borderWidth: 1.5, 
    alignItems: 'center', 
    justifyContent: 'center',
    position: 'relative'
  },
  listeningIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#000'
  },
  profileBtn: { padding: 5 },
  scrollContent: { paddingBottom: 120 },
  
  characterContainer: { alignItems: 'center', marginVertical: 35, zIndex: 10 },
  statusBadge: { marginTop: 15, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  statusText: { fontSize: 9, fontWeight: 'bold', letterSpacing: 2 },

  section: { paddingHorizontal: 20, marginBottom: 35 },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', marginBottom: 20, textAlign: 'left', textTransform: 'uppercase', letterSpacing: 2 },
  
  appGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 15 },
  appItem: { 
    width: (width - 80) / 4, 
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconCircle: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    borderWidth: 2, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  appLabel: { fontSize: 10, fontWeight: '700', textAlign: 'center', marginBottom: 2 },
  appDescription: { fontSize: 7, textAlign: 'center', opacity: 0.7 },
  
  // Voice Activation Button (في المنتصف)
  voiceActivationContainer: {
    alignItems: 'center',
    marginVertical: 30,
    paddingVertical: 20,
  },
  voiceActivationBtn: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#00EAFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  listeningPulse: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.3,
    zIndex: -1,
  },
  voiceActivationLabel: {
    marginTop: 15,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  voiceActivationSubLabel: {
    marginTop: 5,
    fontSize: 9,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});