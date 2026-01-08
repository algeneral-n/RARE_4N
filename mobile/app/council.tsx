import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Pressable, TextInput, 
  ActivityIndicator, Animated, KeyboardAvoidingView, Platform, Alert, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import { RAREKernel } from '../core/RAREKernel';
import { CognitiveLoop } from '../core/CognitiveLoop';
import { PermissionManager } from '../core/services/PermissionManager';
import { useTheme } from '../hooks/useTheme'
import { getSafeColor, getSafeColors } from '../utils/safeTheme';;
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import Icon from '../components/Icon';
import RARECharacter from '../components/RARECharacter';
import NamesTunnel from '../components/NamesTunnel';
import { API_URL } from '../services/config';

const { width, height } = Dimensions.get('window');

export default function Council() {
  const [activeSystem, setActiveSystem] = useState<'VOICE' | 'GPT' | 'COUNCIL'>('COUNCIL');
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const { theme, colors = { primary: '#00EAFF', text: '#fff', background: '#000408', surface: '#0a0e14', border: '#1a1f2e' } } = useTheme();
  const { t } = useTranslation();
  const { t: tLang } = useLanguage();
  const kernel = RAREKernel.getInstance();
  const cognitiveLoop = CognitiveLoop.getInstance();
  const permissionManager = PermissionManager.getInstance();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ربط Cognitive Loop
    cognitiveLoop.init(kernel).catch(console.error);
    
    // إرسال حدث فتح الشاشة
    kernel.emit({ 
      type: 'screen:opened', 
      data: { screen: 'council' } 
    });
    
    // إرسال للكور
    kernel.emit({
      type: 'user:input',
      data: { text: 'open council', type: 'navigation', screen: 'council' }
    });
  }, []);

  // تأثير الدوران المستمر للحلقات حول الكراكتر
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 10000, useNativeDriver: true })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // 📤 إرسال رسالة نصية
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = { role: 'user', content: inputText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    
    try {
      // إرسال للكور
      try {
        kernel.emit({
          type: 'user:input',
          data: { text: currentInput, type: 'council', system: activeSystem }
        });
      } catch (emitError) {
        console.error('Kernel emit error:', emitError);
      }
      
      // إرسال للـ Backend مع تحسينات
      const response = await fetch(`${API_URL}/api/council/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          system: activeSystem,
          context: messages.slice(-5).map(m => ({
            role: m.role,
            content: m.content
          })),
          language: 'ar',
        }),
      });
      
      const data = await response.json();
      
      if (data.response || data.text || data.reply) {
        const assistantMessage = { 
          role: 'assistant', 
          content: data.response || data.text || data.reply,
          timestamp: Date.now(),
          system: activeSystem,
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        // إرسال للكور
        kernel.emit({
          type: 'council:response',
          data: { 
            system: activeSystem, 
            response: assistantMessage.content,
            timestamp: assistantMessage.timestamp
          }
        });
      } else if (data.error) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `خطأ: ${data.error}`,
          timestamp: Date.now(),
        }]);
      }
    } catch (error: any) {
      console.error('Send message error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        timestamp: Date.now(),
      }]);
    }
  };

  // تفعيل الربط العصبي الصوتي (ElevenLabs) - فقط عند تفعيل المستخدم
  const toggleNeuralLink = async () => {
    if (isListening) {
      setIsListening(false);
      kernel.emit({
        type: 'user:input',
        data: { text: 'stop voice listening', type: 'council', action: 'stop_voice' }
      });
    } else {
      // فحص الصلاحية أولاً
      const permissionStatus = await permissionManager.checkPermission('audio');
      
      if (!permissionStatus.granted) {
        // فحص الصلاحية فقط - لا طلب تلقائي
        Alert.alert(
          tLang('permissionRequired') || 'تنبيه',
          tLang('audioAccessRequired') || 'يجب السماح بالوصول للميكروفون من إعدادات التطبيق'
        );
        return;
      }
      
      setIsListening(true);
      
      // إرسال للكور
      kernel.emit({
        type: 'user:input',
        data: { text: 'start voice listening', type: 'council', action: 'start_voice' }
      });
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 400, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    }
  };

  return (
    <View style={styles.container}>
      <NamesTunnel />
      <LinearGradient colors={['rgba(0,0,0,0.9)', 'transparent', '#000']} style={StyleSheet.absoluteFill} />

      {/* 🔝 الهيدر: اختيار الأجنت بنمط عسكري */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.exitBtn}>
          <Icon name="close" size={24} color={getSafeColor(colors, 'primary')} />
        </Pressable>
        <View style={styles.protocolBadge}>
          <Text style={[styles.protocolText, { color: getSafeColor(colors, 'primary') }]}>PROTOCOL: RARE_COUNCIL_V4</Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.chamberScroll}>
          
          {/* 🔘 منطقة المفاعل (Reactor Area) */}
          <View style={styles.reactorContainer}>
            {/* حلقات الطاقة الخلفية */}
            <Animated.View style={[styles.energyRing, { borderColor: getSafeColor(colors, 'primary') + '30', transform: [{ rotate: spin }] }]} />
            <Animated.View style={[styles.energyRingInner, { borderColor: getSafeColor(colors, 'primary') + '50', transform: [{ rotate: spin }] }]} />
            
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <RARECharacter size={260} />
            </Animated.View>

            <View style={[styles.statusBox, { backgroundColor: isListening ? '#FF3B3020' : getSafeColor(colors, 'primary') + '10' }]}>
              <View style={[styles.pulseDot, { backgroundColor: isListening ? '#FF3B30' : getSafeColor(colors, 'primary') }]} />
              <Text style={[styles.statusLabel, { color: isListening ? '#FF3B30' : getSafeColor(colors, 'primary') }]}>
                {isListening ? 'NEURAL LINK ACTIVE' : `SYSTEM ${activeSystem} STANDBY`}
              </Text>
            </View>
          </View>

          {/* منطقة الأنظمة الجانبية (Side Systems) */}
          <View style={styles.systemGrid}>
            {['VOICE', 'GPT', 'COUNCIL'].map((sys: any) => (
              <Pressable 
                key={sys} 
                onPress={() => setActiveSystem(sys)}
                style={[styles.sysCard, activeSystem === sys && { borderColor: getSafeColor(colors, 'primary'), backgroundColor: getSafeColor(colors, 'primary') + '10' }]}
              >
                <Icon name={sys === 'VOICE' ? 'mic' : sys === 'GPT' ? 'psychology' : 'groups'} size={20} color={activeSystem === sys ? getSafeColor(colors, 'primary') : '#444'} />
                <Text style={[styles.sysText, { color: activeSystem === sys ? '#fff' : '#444' }]}>{sys}</Text>
              </Pressable>
            ))}
          </View>

          {/* 💬 الرسائل بنمط الـ Logs (سجلات النظام) */}
          <View style={styles.logContainer}>
            {messages.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="chat-bubble-outline" size={48} color="#444" />
                <Text style={styles.emptyText}>ابدأ المحادثة مع المجلس</Text>
                <Text style={styles.emptySubtext}>اختر النظام واكتب رسالتك</Text>
              </View>
            ) : (
              messages.map((m, i) => (
                <View key={i} style={[styles.logEntry, m.role === 'assistant' && styles.assistantEntry]}>
                  <View style={styles.logHeader}>
                    <Text style={[styles.logRole, { color: m.role === 'user' ? '#fff' : getSafeColor(colors, 'primary') }]}>
                      [{m.role === 'user' ? 'USER_ID_01' : `RARE_${activeSystem}`}]:
                    </Text>
                    {m.timestamp && (
                      <Text style={styles.logTime}>
                        {new Date(m.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.logContent, m.role === 'assistant' && { color: getSafeColor(colors, 'primary') + 'DD' }]}>
                    {m.content}
                  </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* ⌨️ لوحة التحكم الهولوجرام (Holographic Input) */}
        <View style={styles.inputConsole}>
          <Pressable style={styles.mediaBtn} onPress={() => {/* رفع ملفات */}}>
            <Icon name="add-circle-outline" size={28} color={getSafeColor(colors, 'primary')} />
          </Pressable>
          
          <TextInput
            style={[styles.consoleInput, { color: colors.text }]}
            placeholder="أدخل الأمر البرمجي..."
            placeholderTextColor="#333"
            value={inputText}
            onChangeText={setInputText}
          />

          <Pressable 
            onPress={activeSystem === 'VOICE' ? toggleNeuralLink : handleSendMessage} 
            style={[styles.launchBtn, { backgroundColor: isListening ? '#FF3B30' : getSafeColor(colors, 'primary') }]}
          >
            <Icon name={activeSystem === 'VOICE' ? (isListening ? 'stop' : 'mic') : 'bolt'} size={24} color="#000" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { paddingTop: 60, paddingHorizontal: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exitBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  protocolBadge: { paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  protocolText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
  
  chamberScroll: { paddingBottom: 150 },
  reactorContainer: { height: height * 0.5, justifyContent: 'center', alignItems: 'center' },
  energyRing: { position: 'absolute', width: 320, height: 320, borderRadius: 160, borderWidth: 1, borderStyle: 'dashed' },
  energyRingInner: { position: 'absolute', width: 280, height: 280, borderRadius: 140, borderWidth: 1 },
  
  statusBox: { flexDirection: 'row', alignItems: 'center', marginTop: 30, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 50, borderWidth: 1 },
  pulseDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  statusLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 2 },

  systemGrid: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 30 },
  sysCard: { flex: 1, height: 60, borderRadius: 15, borderWidth: 1, borderColor: '#222', alignItems: 'center', justifyContent: 'center', gap: 5 },
  sysText: { fontSize: 10, fontWeight: 'bold' },

  logContainer: { paddingHorizontal: 25, minHeight: 200 },
  logEntry: { 
    marginBottom: 15, 
    padding: 15, 
    backgroundColor: 'rgba(255,255,255,0.02)', 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#111',
  },
  assistantEntry: {
    backgroundColor: 'rgba(0,234,255,0.05)',
    borderColor: getSafeColor({ primary: '#00EAFF' }, 'primary') + '30',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logRole: { fontSize: 11, fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: 1 },
  logTime: { fontSize: 9, color: '#444', fontFamily: 'monospace' },
  logContent: { flex: 1, color: '#aaa', fontSize: 13, lineHeight: 20, textAlign: 'right' },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#555',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 15,
  },
  emptySubtext: {
    color: '#333',
    fontSize: 11,
    marginTop: 5,
  },

  inputConsole: { 
    position: 'absolute', bottom: 0, width: '100%', padding: 25, paddingBottom: 45, 
    backgroundColor: 'rgba(0,0,0,0.95)', borderTopWidth: 2, borderTopColor: '#111', flexDirection: 'row', alignItems: 'center', gap: 15 
  },
  mediaBtn: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  consoleInput: { flex: 1, height: 50, fontSize: 16, fontFamily: 'monospace' },
  launchBtn: { width: 55, height: 55, borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowColor: '#00EAFF', shadowOpacity: 0.5, shadowRadius: 15 }
});