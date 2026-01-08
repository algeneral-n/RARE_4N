import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Animated, Dimensions, TextInput, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RAREKernel } from '../core/RAREKernel';
import { CognitiveLoop } from '../core/CognitiveLoop';
import { useTheme } from '../hooks/useTheme'
import { getSafeColor, getSafeColors } from '../utils/safeTheme';
import { ALL_THEMES } from '../config/themes';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import Icon from '../components/Icon';
import { API_URL } from '../services/config';
import serviceStatusManager from '../utils/serviceStatusManager';
import ListTypeSelector, { ListType } from '../components/ListTypeSelector';
import BackgroundSelector from '../components/BackgroundSelector';
import backgroundManager from '../utils/backgroundManager';
import ThemeSelector from '../components/ThemeSelector';
import FontSelector from '../components/FontSelector';
import { fontManager } from '../utils/fontManager';
import IconSelector from '../components/IconSelector';

const { width, height } = Dimensions.get('window');
const kernel = RAREKernel.getInstance();
const cognitiveLoop = CognitiveLoop.getInstance();

export default function ControlRoom() {
  const router = useRouter();
  const { theme, updateTheme, colors = { primary: '#00EAFF', text: '#fff', background: '#000408', surface: '#0a0e14', border: '#1a1f2e' } } = useTheme();
  const { t } = useTranslation();
  const { t: tLang } = useLanguage();
  
  // حالات الأنظمة المتقدمة
  const [uiMode, setUiMode] = useState('CYBER');
  const [tunnelSpeed, setTunnelSpeed] = useState(1.0);
  const [isConscious, setIsConscious] = useState(true);
  const [systemHealth, setSystemHealth] = useState(98);
  const [agentCommand, setAgentCommand] = useState('');
  const [servicesStatus, setServicesStatus] = useState<Map<string, any>>(new Map());
  const [builderStatus, setBuilderStatus] = useState<any>({ isBuilding: false });
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [showServiceStatus, setShowServiceStatus] = useState(false);
  const [listType, setListType] = useState<string>('google-style');
  const [background, setBackground] = useState<string>('names-tunnel');
  const [selectedTheme, setSelectedTheme] = useState<string>('rare-cyan');
  const [selectedFont, setSelectedFont] = useState<string>('system');
  const [selectedIcon, setSelectedIcon] = useState<string>('home');

  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ربط Cognitive Loop
    cognitiveLoop.init(kernel).catch(console.error);
    
    // إرسال حدث فتح الشاشة
    kernel.emit({ 
      type: 'screen:opened', 
      data: { screen: 'control-room' } 
    });
    
    // إرسال للكور
    kernel.emit({
      type: 'user:input',
      data: { text: 'open control room', type: 'navigation', screen: 'control-room' }
    });
    
    // أنيميشن الـ Scanning اللي شغال في الخلفية للهيبة
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 3000, useNativeDriver: true }),
      ])
    ).start();

    // تحميل حالة الخدمات
    loadServicesStatus();
    
    // تحميل نوع القائمة المحفوظ
    loadListType();
    
    // تحميل الخلفية المحفوظة
    loadBackground();
    
    // تحميل الثيم المحفوظ
    loadTheme();
    
    // تحميل الخط المحفوظ
    loadFont();
    
    // تحميل الأيقونة المحفوظة
    loadIcon();
    
    // بدء المراقبة التلقائية
    serviceStatusManager.startAutoCheck(30000);

    return () => {
      serviceStatusManager.stopAutoCheck();
    };
  }, []);

  const loadListType = async () => {
    try {
      const savedType = await AsyncStorage.getItem('listType:selected');
      if (savedType) {
        setListType(savedType);
      }
    } catch (error) {
      console.error('Error loading list type:', error);
    }
  };

  const loadBackground = async () => {
    try {
      const bg = await backgroundManager.getBackground();
      setBackground(bg);
    } catch (error) {
      console.error('Error loading background:', error);
    }
  };

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme:id');
      if (savedTheme) {
        setSelectedTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const loadFont = async () => {
    try {
      const font = await fontManager.getSelectedFont();
      if (font) {
        setSelectedFont(font.id);
      }
    } catch (error) {
      console.error('Error loading font:', error);
    }
  };

  const loadIcon = async () => {
    try {
      const savedIcon = await AsyncStorage.getItem('icon:selected');
      if (savedIcon) {
        setSelectedIcon(savedIcon);
      }
    } catch (error) {
      console.error('Error loading icon:', error);
    }
  };

  const handleIconChange = async (iconId: string) => {
    try {
      setSelectedIcon(iconId);
      await AsyncStorage.setItem('icon:selected', iconId);
      
      kernel.emit({
        type: 'control-room:icon-changed',
        data: { icon: iconId },
      });
      
      Alert.alert('تم', 'تم تغيير الأيقونة بنجاح');
    } catch (error) {
      console.error('Error saving icon:', error);
    }
  };

  const handleFontChange = async (fontId: string) => {
    try {
      setSelectedFont(fontId);
      await fontManager.setSelectedFont(fontId);
      
      kernel.emit({
        type: 'control-room:font-changed',
        data: { font: fontId },
      });
      
      Alert.alert('تم', 'تم تغيير الخط بنجاح');
    } catch (error) {
      console.error('Error saving font:', error);
    }
  };

  const handleThemeChange = async (themeId: string) => {
    try {
      setSelectedTheme(themeId);
      await AsyncStorage.setItem('theme:id', themeId);
      
      if (updateTheme) {
        const theme = ALL_THEMES.find(t => t.id === themeId);
        if (theme) {
          await updateTheme(theme);
        }
      }
      
      kernel.emit({
        type: 'control-room:theme-changed',
        data: { theme: themeId },
      });
      
      Alert.alert('تم', 'تم تغيير الثيم بنجاح');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const handleBackgroundChange = async (bgId: string) => {
    try {
      setBackground(bgId);
      await backgroundManager.setBackground(bgId);
      
      kernel.emit({
        type: 'control-room:background-changed',
        data: { background: bgId },
      });
      
      Alert.alert('تم', 'تم تغيير الخلفية بنجاح');
    } catch (error) {
      console.error('Error saving background:', error);
    }
  };

  const handleListTypeChange = async (type: ListType) => {
    try {
      setListType(type);
      await AsyncStorage.setItem('listType:selected', type);
      
      kernel.emit({
        type: 'control-room:list-type-changed',
        data: { listType: type },
      });
      
      Alert.alert('تم', `تم تغيير نوع القائمة إلى: ${type}`);
    } catch (error) {
      console.error('Error saving list type:', error);
    }
  };

  const loadServicesStatus = async () => {
    setLoadingStatus(true);
    try {
      const services = await serviceStatusManager.checkAllServices();
      const builder = await serviceStatusManager.getBuilderStatus();
      setServicesStatus(services);
      setBuilderStatus(builder);
      
      // Update system health based on services
      const runningServices = Array.from(services.values()).filter(s => s.status === 'running').length;
      const totalServices = services.size;
      const healthPercent = totalServices > 0 ? Math.round((runningServices / totalServices) * 100) : 98;
      setSystemHealth(healthPercent);
      
      kernel.emit({
        type: 'control-room:status-update',
        data: { services, builder, health: healthPercent }
      });
    } catch (error) {
      console.error('Error loading services status:', error);
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleServiceControl = async (service: string, action: 'start' | 'stop' | 'restart') => {
    try {
      // Use correct endpoint
      const endpoint = `${API_URL}/api/service-control/${service}/${action}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      
      if (data.success) {
        const actionText = action === 'start' ? 'تم التشغيل' : action === 'stop' ? 'تم الإيقاف' : 'تم إعادة التشغيل';
        Alert.alert('نجح', `${service}: ${actionText}`);
        
        kernel.emit({
          type: 'control-room:service-action',
          data: { service, action, success: true }
        });
        
        await loadServicesStatus();
      } else {
        Alert.alert('خطأ', data.error || data.message || 'فشل التحكم في الخدمة');
      }
    } catch (error: any) {
      console.error('Error controlling service:', error);
      Alert.alert('خطأ', `فشل التحكم في الخدمة: ${error.message}`);
    }
  };

  const scanLineTranslate = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height * 0.7]
  });

  const handleEngineSwap = async (mode: string) => {
    try {
      setUiMode(mode);
      await AsyncStorage.setItem('RARE_ENGINE_MODE', mode);
      kernel.emit({ type: 'system:reboot_ui', data: { mode } });
      Alert.alert('SYSTEM UPDATE', `تم تفعيل بروتوكول واجهة ${mode} بنجاح.`);
    } catch (error: any) {
      console.error('Error swapping engine:', error);
      Alert.alert('خطأ', 'فشل تبديل الواجهة');
    }
  };

  // إرسال أمر للـ Agent
  const handleSendAgentCommand = async () => {
    try {
      if (!agentCommand.trim()) {
        Alert.alert('تنبيه', 'يرجى إدخال أمر للـ Agent');
        return;
      }

      // إرسال الأمر للـ Backend
      const response = await fetch(`${API_URL}/api/agent/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: agentCommand,
          type: 'owner_instruction',
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        Alert.alert('نجح', 'تم إرسال الأمر للـ Agent بنجاح');
        setAgentCommand('');
        
        // إرسال للكور
        kernel.emit({
          type: 'user:input',
          data: { text: `agent command sent: ${agentCommand}`, type: 'control-room', action: 'agent_command' }
        });
      } else {
        Alert.alert('خطأ', data.error || 'فشل إرسال الأمر');
      }
    } catch (error: any) {
      console.error('Error sending agent command:', error);
      Alert.alert('خطأ', 'فشل إرسال الأمر للـ Agent');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#000', '#001a2c', '#000']} style={StyleSheet.absoluteFill} />
      
      {/* خط المسح اللي بيتحرك فوق الشاشة (Cyber Effect) */}
      <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanLineTranslate }], backgroundColor: getSafeColor(colors, 'primary') + '20' }]} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={getSafeColor(colors, 'primary')} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[styles.headerTitle, { color: getSafeColor(colors, 'primary') }]}>CONTROL CENTER v6.0</Text>
          <Text style={styles.uptime}>UPTIME: 142:55:04</Text>
        </View>
        <Icon name="settings-input-component" size={24} color={getSafeColor(colors, 'primary')} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* 1️⃣ لوحة مراقبة الأداء (System Performance) */}
        <View style={styles.perfCard}>
          <View style={styles.perfHeader}>
            <Text style={styles.perfTitle}>AGENT CORE LOAD</Text>
            <Text style={[styles.perfValue, { color: getSafeColor(colors, 'primary') }]}>{systemHealth}%</Text>
          </View>
          <View style={styles.barContainer}>
            <View style={[styles.barFill, { width: `${systemHealth}%`, backgroundColor: getSafeColor(colors, 'primary') }]} />
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>MEMORY: 420MB</Text>
            <Text style={styles.statText}>LATENCY: 12ms</Text>
            <Text style={styles.statText}>THREADS: ACTIVE</Text>
          </View>
        </View>

        {/* 1.3️⃣ مكتبة الخلفيات (Backgrounds Library) */}
        <BackgroundSelector
          selectedBackground={background}
          onSelect={handleBackgroundChange}
        />

        {/* 1.4️⃣ مكتبة الثيمات (Themes Library) */}
        <ThemeSelector
          selectedTheme={selectedTheme}
          onSelect={handleThemeChange}
        />

        {/* 1.5️⃣ مكتبة الخطوط (Fonts Library) */}
        <FontSelector
          selectedFont={selectedFont}
          onSelect={handleFontChange}
        />

        {/* 1.6️⃣ مكتبة الأيقونات (Icons Library) */}
        <IconSelector
          selectedIcon={selectedIcon}
          onSelect={handleIconChange}
        />

        {/* 1.5️⃣ نوع القائمة (List Type Selection) */}
        <ListTypeSelector
          selectedType={listType as ListType}
          onSelect={handleListTypeChange}
        />

        {/* 2️⃣ تبديل الواجهات (Hot Swap Engine) */}
        <Text style={styles.sectionLabel}>UI ENGINE ARCHITECTURE</Text>
        <View style={styles.engineGrid}>
          {[
            { id: 'CYBER', name: 'الواجهة السيبرانية', icon: 'security' },
            { id: 'MINIMAL', name: 'نمط جوجل الهادئ', icon: 'auto-awesome-mosaic' },
            { id: 'TERMINAL', name: 'نمط الكود المباشر', icon: 'terminal' }
          ].map((engine) => (
            <TouchableOpacity 
              key={engine.id} 
              style={[styles.engineBtn, uiMode === engine.id && { borderColor: getSafeColor(colors, 'primary'), backgroundColor: getSafeColor(colors, 'primary') + '15' }]}
              onPress={() => handleEngineSwap(engine.id)}
            >
              <Icon name={engine.icon} size={28} color={uiMode === engine.id ? getSafeColor(colors, 'primary') : '#444'} />
              <Text style={[styles.engineLabel, { color: uiMode === engine.id ? '#fff' : '#444' }]}>{engine.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3️⃣ تحكم نفق الأسماء (Tunnel Data Control) */}
        <View style={styles.controlSection}>
          <Text style={styles.sectionLabel}>TUNNEL PARAMETERS</Text>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Data Flow Speed</Text>
              <Text style={styles.settingSub}>التحكم في سرعة معالجة نفق الأسماء</Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity onPress={() => setTunnelSpeed(s => Math.max(0.5, s - 0.1))}><Icon name="remove" size={20} color={getSafeColor(colors, 'primary')} /></TouchableOpacity>
              <Text style={styles.stepperVal}>{tunnelSpeed.toFixed(1)}x</Text>
              <TouchableOpacity onPress={() => setTunnelSpeed(s => Math.min(3.0, s + 0.1))}><Icon name="add" size={20} color={getSafeColor(colors, 'primary')} /></TouchableOpacity>
            </View>
          </View>

          <View style={[styles.settingRow, { marginTop: 20 }]}>
            <View>
              <Text style={styles.settingTitle}>Autonomous Awareness</Text>
              <Text style={styles.settingSub}>تفعيل الوعي الذاتي للأجنت (رير)</Text>
            </View>
            <Switch value={isConscious} onValueChange={setIsConscious} trackColor={{ true: getSafeColor(colors, 'primary') }} />
          </View>
        </View>

        {/* 4️⃣ Agent Commands - تسجيل أوامر للـ Agent */}
        <Text style={styles.sectionLabel}>AGENT COMMANDS</Text>
        <View style={styles.agentCommandsCard}>
          <TextInput
            style={[styles.agentCommandInput, { borderColor: getSafeColor(colors, 'primary'), color: colors.text }]}
            placeholder="مثال: عميل اسمه أحمد سيأتي، قل له مرحباً بك في رير 4N..."
            placeholderTextColor="#555"
            multiline
            numberOfLines={4}
            value={agentCommand}
            onChangeText={setAgentCommand}
          />
          <TouchableOpacity 
            style={[styles.agentCommandBtn, { backgroundColor: getSafeColor(colors, 'primary') }]}
            onPress={handleSendAgentCommand}
          >
            <Icon name="send" size={20} color="#000" />
            <Text style={styles.agentCommandBtnText}>إرسال أمر للـ Agent</Text>
          </TouchableOpacity>
        </View>

        {/* 5️⃣ شاشة حالة الخدمات (Service Status) */}
        <Text style={styles.sectionLabel}>SERVICE STATUS</Text>
        <TouchableOpacity 
          style={styles.serviceStatusCard}
          onPress={() => setShowServiceStatus(!showServiceStatus)}
        >
          <View style={styles.serviceStatusHeader}>
            <Text style={styles.serviceStatusTitle}>System Services</Text>
            <Icon 
              name={showServiceStatus ? 'expand-less' : 'expand-more'} 
              size={24} 
              color={getSafeColor(colors, 'primary')} 
            />
          </View>
        </TouchableOpacity>

        {showServiceStatus && (
          <View style={styles.servicesList}>
            {loadingStatus ? (
              <ActivityIndicator size="small" color={getSafeColor(colors, 'primary')} />
            ) : (
              <>
                {['backend', 'cloudflare', 'clientPortal', 'builder'].map((service) => {
                  const status = servicesStatus.get(service);
                  const isRunning = status?.status === 'running';
                  return (
                    <View key={service} style={styles.serviceItem}>
                      <View style={styles.serviceInfo}>
                        <Text style={styles.serviceName}>{status?.name || service.toUpperCase()}</Text>
                        <View style={styles.serviceStatusRow}>
                          <View style={[styles.statusDot, { backgroundColor: isRunning ? '#00FF41' : '#FF3B30' }]} />
                          <Text style={[styles.serviceStatusText, { color: isRunning ? '#00FF41' : '#FF3B30' }]}>
                            {status?.status?.toUpperCase() || 'UNKNOWN'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.serviceActions}>
                        <TouchableOpacity
                          style={[styles.serviceBtn, { backgroundColor: isRunning ? '#FF3B30' : '#00FF41' }]}
                          onPress={() => handleServiceControl(service, isRunning ? 'stop' : 'start')}
                        >
                          <Text style={styles.serviceBtnText}>{isRunning ? 'STOP' : 'START'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.serviceBtn, { backgroundColor: getSafeColor(colors, 'primary') }]}
                          onPress={() => handleServiceControl(service, 'restart')}
                        >
                          <Text style={styles.serviceBtnText}>RESTART</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
                {builderStatus.isBuilding && (
                  <View style={styles.builderStatusCard}>
                    <Text style={styles.builderStatusTitle}>BUILD IN PROGRESS</Text>
                    <Text style={styles.builderStatusText}>
                      Platform: {builderStatus.currentBuild?.platform || 'N/A'}
                    </Text>
                    <Text style={styles.builderStatusText}>
                      Status: {builderStatus.currentBuild?.status || 'N/A'}
                    </Text>
                    {builderStatus.currentBuild?.progress && (
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { width: `${builderStatus.currentBuild.progress}%`, backgroundColor: getSafeColor(colors, 'primary') }
                          ]} 
                        />
                      </View>
                    )}
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* 6️⃣ الربط الخارجي (External Protocols) */}
        <Text style={styles.sectionLabel}>COMMUNICATION BRIDGES</Text>
        <View style={styles.commGrid}>
          <TouchableOpacity style={styles.commCard}><Icon name="whatsapp" type="font-awesome" size={24} color="#25D366" /><Text style={styles.commText}>WHATSAPP</Text></TouchableOpacity>
          <TouchableOpacity style={styles.commCard}><Icon name="mail" size={24} color="#EA4335" /><Text style={styles.commText}>EMAIL</Text></TouchableOpacity>
          <TouchableOpacity style={styles.commCard}><Icon name="call" size={24} color="#4285F4" /><Text style={styles.commText}>CELLULAR</Text></TouchableOpacity>
        </View>

      </ScrollView>

      {/* بار الحالة السفلي */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>SYSTEM STATUS: ALL ANOMALIES CLEARED // SECURE CONNECTION</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scanLine: { position: 'absolute', width: '100%', height: 2, zIndex: 99 },
  header: { paddingTop: 60, paddingHorizontal: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 45, height: 45, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  titleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 14, fontWeight: 'bold', letterSpacing: 2 },
  uptime: { fontSize: 8, color: '#444', marginTop: 4, fontFamily: 'monospace' },
  
  scroll: { paddingHorizontal: 20, paddingBottom: 120 },
  perfCard: { padding: 20, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, borderWidth: 1, borderColor: '#111', marginBottom: 30 },
  perfHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  perfTitle: { color: '#555', fontSize: 10, fontWeight: 'bold' },
  perfValue: { fontWeight: '900', fontSize: 16 },
  barContainer: { height: 4, backgroundColor: '#000', borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  statText: { fontSize: 8, color: '#444', fontWeight: 'bold' },

  sectionLabel: { fontSize: 10, fontWeight: '900', color: '#333', letterSpacing: 2, marginBottom: 20, marginLeft: 5 },
  engineGrid: { flexDirection: 'row', gap: 10, marginBottom: 35 },
  engineBtn: { flex: 1, height: 100, borderRadius: 20, borderWidth: 1, borderColor: '#111', alignItems: 'center', justifyContent: 'center', gap: 10 },
  engineLabel: { fontSize: 8, fontWeight: 'bold', textAlign: 'center' },

  controlSection: { padding: 25, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 25, borderWidth: 1, borderColor: '#111', marginBottom: 35 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  settingSub: { color: '#444', fontSize: 9, marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  stepperVal: { color: '#fff', fontSize: 14, fontWeight: 'bold', width: 30, textAlign: 'center' },

  commGrid: { flexDirection: 'row', gap: 10 },
  commCard: { flex: 1, height: 80, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 15, alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#111' },
  commText: { color: '#555', fontSize: 8, fontWeight: 'bold' },
  
  agentCommandsCard: { padding: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 20, borderWidth: 1, borderColor: '#111', marginBottom: 30 },
  agentCommandInput: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: 15, borderWidth: 1, minHeight: 100, textAlignVertical: 'top', fontSize: 12, marginBottom: 15 },
  agentCommandBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10, gap: 10 },
  agentCommandBtnText: { color: '#000', fontSize: 12, fontWeight: 'bold' },

  footer: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
  footerText: { color: '#222', fontSize: 8, letterSpacing: 1 },
  
  serviceStatusCard: { padding: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 20, borderWidth: 1, borderColor: '#111', marginBottom: 15 },
  serviceStatusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  serviceStatusTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  servicesList: { marginBottom: 30 },
  serviceItem: { padding: 15, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 15, borderWidth: 1, borderColor: '#111', marginBottom: 10 },
  serviceInfo: { marginBottom: 10 },
  serviceName: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  serviceStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  serviceStatusText: { fontSize: 10, fontWeight: 'bold' },
  serviceActions: { flexDirection: 'row', gap: 8 },
  serviceBtn: { flex: 1, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignItems: 'center' },
  serviceBtnText: { color: '#000', fontSize: 10, fontWeight: 'bold' },
  builderStatusCard: { padding: 15, backgroundColor: 'rgba(0,234,255,0.1)', borderRadius: 15, borderWidth: 1, borderColor: '#00EAFF', marginTop: 10 },
  builderStatusTitle: { color: '#00EAFF', fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  builderStatusText: { color: '#fff', fontSize: 10, marginBottom: 4 },
  progressBar: { height: 4, backgroundColor: '#000', borderRadius: 2, overflow: 'hidden', marginTop: 8 },
  progressFill: { height: '100%' }
});
    } catch (error) {
      console.error('Error saving font:', error);
    }
  };

  const handleThemeChange = async (themeId: string) => {
    try {
      setSelectedTheme(themeId);
      await AsyncStorage.setItem('theme:id', themeId);
      
      if (updateTheme) {
        const theme = ALL_THEMES.find(t => t.id === themeId);
        if (theme) {
          await updateTheme(theme);
        }
      }
      
      kernel.emit({
        type: 'control-room:theme-changed',
        data: { theme: themeId },
      });
      
      Alert.alert('تم', 'تم تغيير الثيم بنجاح');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const handleBackgroundChange = async (bgId: string) => {
    try {
      setBackground(bgId);
      await backgroundManager.setBackground(bgId);
      
      kernel.emit({
        type: 'control-room:background-changed',
        data: { background: bgId },
      });
      
      Alert.alert('تم', 'تم تغيير الخلفية بنجاح');
    } catch (error) {
      console.error('Error saving background:', error);
    }
  };

  const handleListTypeChange = async (type: ListType) => {
    try {
      setListType(type);
      await AsyncStorage.setItem('listType:selected', type);
      
      kernel.emit({
        type: 'control-room:list-type-changed',
        data: { listType: type },
      });
      
      Alert.alert('تم', `تم تغيير نوع القائمة إلى: ${type}`);
    } catch (error) {
      console.error('Error saving list type:', error);
    }
  };

  const loadServicesStatus = async () => {
    setLoadingStatus(true);
    try {
      const services = await serviceStatusManager.checkAllServices();
      const builder = await serviceStatusManager.getBuilderStatus();
      setServicesStatus(services);
      setBuilderStatus(builder);
      
      // Update system health based on services
      const runningServices = Array.from(services.values()).filter(s => s.status === 'running').length;
      const totalServices = services.size;
      const healthPercent = totalServices > 0 ? Math.round((runningServices / totalServices) * 100) : 98;
      setSystemHealth(healthPercent);
      
      kernel.emit({
        type: 'control-room:status-update',
        data: { services, builder, health: healthPercent }
      });
    } catch (error) {
      console.error('Error loading services status:', error);
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleServiceControl = async (service: string, action: 'start' | 'stop' | 'restart') => {
    try {
      // Use correct endpoint
      const endpoint = `${API_URL}/api/service-control/${service}/${action}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      
      if (data.success) {
        const actionText = action === 'start' ? 'تم التشغيل' : action === 'stop' ? 'تم الإيقاف' : 'تم إعادة التشغيل';
        Alert.alert('نجح', `${service}: ${actionText}`);
        
        kernel.emit({
          type: 'control-room:service-action',
          data: { service, action, success: true }
        });
        
        await loadServicesStatus();
      } else {
        Alert.alert('خطأ', data.error || data.message || 'فشل التحكم في الخدمة');
      }
    } catch (error: any) {
      console.error('Error controlling service:', error);
      Alert.alert('خطأ', `فشل التحكم في الخدمة: ${error.message}`);
    }
  };

  const scanLineTranslate = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height * 0.7]
  });

  const handleEngineSwap = async (mode: string) => {
    try {
      setUiMode(mode);
      await AsyncStorage.setItem('RARE_ENGINE_MODE', mode);
      kernel.emit({ type: 'system:reboot_ui', data: { mode } });
      Alert.alert('SYSTEM UPDATE', `تم تفعيل بروتوكول واجهة ${mode} بنجاح.`);
    } catch (error: any) {
      console.error('Error swapping engine:', error);
      Alert.alert('خطأ', 'فشل تبديل الواجهة');
    }
  };

  // إرسال أمر للـ Agent
  const handleSendAgentCommand = async () => {
    try {
      if (!agentCommand.trim()) {
        Alert.alert('تنبيه', 'يرجى إدخال أمر للـ Agent');
        return;
      }

      // إرسال الأمر للـ Backend
      const response = await fetch(`${API_URL}/api/agent/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: agentCommand,
          type: 'owner_instruction',
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        Alert.alert('نجح', 'تم إرسال الأمر للـ Agent بنجاح');
        setAgentCommand('');
        
        // إرسال للكور
        kernel.emit({
          type: 'user:input',
          data: { text: `agent command sent: ${agentCommand}`, type: 'control-room', action: 'agent_command' }
        });
      } else {
        Alert.alert('خطأ', data.error || 'فشل إرسال الأمر');
      }
    } catch (error: any) {
      console.error('Error sending agent command:', error);
      Alert.alert('خطأ', 'فشل إرسال الأمر للـ Agent');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#000', '#001a2c', '#000']} style={StyleSheet.absoluteFill} />
      
      {/* خط المسح اللي بيتحرك فوق الشاشة (Cyber Effect) */}
      <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanLineTranslate }], backgroundColor: getSafeColor(colors, 'primary') + '20' }]} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={getSafeColor(colors, 'primary')} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[styles.headerTitle, { color: getSafeColor(colors, 'primary') }]}>CONTROL CENTER v6.0</Text>
          <Text style={styles.uptime}>UPTIME: 142:55:04</Text>
        </View>
        <Icon name="settings-input-component" size={24} color={getSafeColor(colors, 'primary')} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* 1️⃣ لوحة مراقبة الأداء (System Performance) */}
        <View style={styles.perfCard}>
          <View style={styles.perfHeader}>
            <Text style={styles.perfTitle}>AGENT CORE LOAD</Text>
            <Text style={[styles.perfValue, { color: getSafeColor(colors, 'primary') }]}>{systemHealth}%</Text>
          </View>
          <View style={styles.barContainer}>
            <View style={[styles.barFill, { width: `${systemHealth}%`, backgroundColor: getSafeColor(colors, 'primary') }]} />
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>MEMORY: 420MB</Text>
            <Text style={styles.statText}>LATENCY: 12ms</Text>
            <Text style={styles.statText}>THREADS: ACTIVE</Text>
          </View>
        </View>

        {/* 1.3️⃣ مكتبة الخلفيات (Backgrounds Library) */}
        <BackgroundSelector
          selectedBackground={background}
          onSelect={handleBackgroundChange}
        />

        {/* 1.4️⃣ مكتبة الثيمات (Themes Library) */}
        <ThemeSelector
          selectedTheme={selectedTheme}
          onSelect={handleThemeChange}
        />

        {/* 1.5️⃣ مكتبة الخطوط (Fonts Library) */}
        <FontSelector
          selectedFont={selectedFont}
          onSelect={handleFontChange}
        />

        {/* 1.6️⃣ مكتبة الأيقونات (Icons Library) */}
        <IconSelector
          selectedIcon={selectedIcon}
          onSelect={handleIconChange}
        />

        {/* 1.5️⃣ نوع القائمة (List Type Selection) */}
        <ListTypeSelector
          selectedType={listType as ListType}
          onSelect={handleListTypeChange}
        />

        {/* 2️⃣ تبديل الواجهات (Hot Swap Engine) */}
        <Text style={styles.sectionLabel}>UI ENGINE ARCHITECTURE</Text>
        <View style={styles.engineGrid}>
          {[
            { id: 'CYBER', name: 'الواجهة السيبرانية', icon: 'security' },
            { id: 'MINIMAL', name: 'نمط جوجل الهادئ', icon: 'auto-awesome-mosaic' },
            { id: 'TERMINAL', name: 'نمط الكود المباشر', icon: 'terminal' }
          ].map((engine) => (
            <TouchableOpacity 
              key={engine.id} 
              style={[styles.engineBtn, uiMode === engine.id && { borderColor: getSafeColor(colors, 'primary'), backgroundColor: getSafeColor(colors, 'primary') + '15' }]}
              onPress={() => handleEngineSwap(engine.id)}
            >
              <Icon name={engine.icon} size={28} color={uiMode === engine.id ? getSafeColor(colors, 'primary') : '#444'} />
              <Text style={[styles.engineLabel, { color: uiMode === engine.id ? '#fff' : '#444' }]}>{engine.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3️⃣ تحكم نفق الأسماء (Tunnel Data Control) */}
        <View style={styles.controlSection}>
          <Text style={styles.sectionLabel}>TUNNEL PARAMETERS</Text>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Data Flow Speed</Text>
              <Text style={styles.settingSub}>التحكم في سرعة معالجة نفق الأسماء</Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity onPress={() => setTunnelSpeed(s => Math.max(0.5, s - 0.1))}><Icon name="remove" size={20} color={getSafeColor(colors, 'primary')} /></TouchableOpacity>
              <Text style={styles.stepperVal}>{tunnelSpeed.toFixed(1)}x</Text>
              <TouchableOpacity onPress={() => setTunnelSpeed(s => Math.min(3.0, s + 0.1))}><Icon name="add" size={20} color={getSafeColor(colors, 'primary')} /></TouchableOpacity>
            </View>
          </View>

          <View style={[styles.settingRow, { marginTop: 20 }]}>
            <View>
              <Text style={styles.settingTitle}>Autonomous Awareness</Text>
              <Text style={styles.settingSub}>تفعيل الوعي الذاتي للأجنت (رير)</Text>
            </View>
            <Switch value={isConscious} onValueChange={setIsConscious} trackColor={{ true: getSafeColor(colors, 'primary') }} />
          </View>
        </View>

        {/* 4️⃣ Agent Commands - تسجيل أوامر للـ Agent */}
        <Text style={styles.sectionLabel}>AGENT COMMANDS</Text>
        <View style={styles.agentCommandsCard}>
          <TextInput
            style={[styles.agentCommandInput, { borderColor: getSafeColor(colors, 'primary'), color: colors.text }]}
            placeholder="مثال: عميل اسمه أحمد سيأتي، قل له مرحباً بك في رير 4N..."
            placeholderTextColor="#555"
            multiline
            numberOfLines={4}
            value={agentCommand}
            onChangeText={setAgentCommand}
          />
          <TouchableOpacity 
            style={[styles.agentCommandBtn, { backgroundColor: getSafeColor(colors, 'primary') }]}
            onPress={handleSendAgentCommand}
          >
            <Icon name="send" size={20} color="#000" />
            <Text style={styles.agentCommandBtnText}>إرسال أمر للـ Agent</Text>
          </TouchableOpacity>
        </View>

        {/* 5️⃣ شاشة حالة الخدمات (Service Status) */}
        <Text style={styles.sectionLabel}>SERVICE STATUS</Text>
        <TouchableOpacity 
          style={styles.serviceStatusCard}
          onPress={() => setShowServiceStatus(!showServiceStatus)}
        >
          <View style={styles.serviceStatusHeader}>
            <Text style={styles.serviceStatusTitle}>System Services</Text>
            <Icon 
              name={showServiceStatus ? 'expand-less' : 'expand-more'} 
              size={24} 
              color={getSafeColor(colors, 'primary')} 
            />
          </View>
        </TouchableOpacity>

        {showServiceStatus && (
          <View style={styles.servicesList}>
            {loadingStatus ? (
              <ActivityIndicator size="small" color={getSafeColor(colors, 'primary')} />
            ) : (
              <>
                {['backend', 'cloudflare', 'clientPortal', 'builder'].map((service) => {
                  const status = servicesStatus.get(service);
                  const isRunning = status?.status === 'running';
                  return (
                    <View key={service} style={styles.serviceItem}>
                      <View style={styles.serviceInfo}>
                        <Text style={styles.serviceName}>{status?.name || service.toUpperCase()}</Text>
                        <View style={styles.serviceStatusRow}>
                          <View style={[styles.statusDot, { backgroundColor: isRunning ? '#00FF41' : '#FF3B30' }]} />
                          <Text style={[styles.serviceStatusText, { color: isRunning ? '#00FF41' : '#FF3B30' }]}>
                            {status?.status?.toUpperCase() || 'UNKNOWN'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.serviceActions}>
                        <TouchableOpacity
                          style={[styles.serviceBtn, { backgroundColor: isRunning ? '#FF3B30' : '#00FF41' }]}
                          onPress={() => handleServiceControl(service, isRunning ? 'stop' : 'start')}
                        >
                          <Text style={styles.serviceBtnText}>{isRunning ? 'STOP' : 'START'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.serviceBtn, { backgroundColor: getSafeColor(colors, 'primary') }]}
                          onPress={() => handleServiceControl(service, 'restart')}
                        >
                          <Text style={styles.serviceBtnText}>RESTART</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
                {builderStatus.isBuilding && (
                  <View style={styles.builderStatusCard}>
                    <Text style={styles.builderStatusTitle}>BUILD IN PROGRESS</Text>
                    <Text style={styles.builderStatusText}>
                      Platform: {builderStatus.currentBuild?.platform || 'N/A'}
                    </Text>
                    <Text style={styles.builderStatusText}>
                      Status: {builderStatus.currentBuild?.status || 'N/A'}
                    </Text>
                    {builderStatus.currentBuild?.progress && (
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { width: `${builderStatus.currentBuild.progress}%`, backgroundColor: getSafeColor(colors, 'primary') }
                          ]} 
                        />
                      </View>
                    )}
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* 6️⃣ الربط الخارجي (External Protocols) */}
        <Text style={styles.sectionLabel}>COMMUNICATION BRIDGES</Text>
        <View style={styles.commGrid}>
          <TouchableOpacity style={styles.commCard}><Icon name="whatsapp" type="font-awesome" size={24} color="#25D366" /><Text style={styles.commText}>WHATSAPP</Text></TouchableOpacity>
          <TouchableOpacity style={styles.commCard}><Icon name="mail" size={24} color="#EA4335" /><Text style={styles.commText}>EMAIL</Text></TouchableOpacity>
          <TouchableOpacity style={styles.commCard}><Icon name="call" size={24} color="#4285F4" /><Text style={styles.commText}>CELLULAR</Text></TouchableOpacity>
        </View>

      </ScrollView>

      {/* بار الحالة السفلي */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>SYSTEM STATUS: ALL ANOMALIES CLEARED // SECURE CONNECTION</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scanLine: { position: 'absolute', width: '100%', height: 2, zIndex: 99 },
  header: { paddingTop: 60, paddingHorizontal: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 45, height: 45, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  titleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 14, fontWeight: 'bold', letterSpacing: 2 },
  uptime: { fontSize: 8, color: '#444', marginTop: 4, fontFamily: 'monospace' },
  
  scroll: { paddingHorizontal: 20, paddingBottom: 120 },
  perfCard: { padding: 20, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, borderWidth: 1, borderColor: '#111', marginBottom: 30 },
  perfHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  perfTitle: { color: '#555', fontSize: 10, fontWeight: 'bold' },
  perfValue: { fontWeight: '900', fontSize: 16 },
  barContainer: { height: 4, backgroundColor: '#000', borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  statText: { fontSize: 8, color: '#444', fontWeight: 'bold' },

  sectionLabel: { fontSize: 10, fontWeight: '900', color: '#333', letterSpacing: 2, marginBottom: 20, marginLeft: 5 },
  engineGrid: { flexDirection: 'row', gap: 10, marginBottom: 35 },
  engineBtn: { flex: 1, height: 100, borderRadius: 20, borderWidth: 1, borderColor: '#111', alignItems: 'center', justifyContent: 'center', gap: 10 },
  engineLabel: { fontSize: 8, fontWeight: 'bold', textAlign: 'center' },

  controlSection: { padding: 25, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 25, borderWidth: 1, borderColor: '#111', marginBottom: 35 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  settingSub: { color: '#444', fontSize: 9, marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  stepperVal: { color: '#fff', fontSize: 14, fontWeight: 'bold', width: 30, textAlign: 'center' },

  commGrid: { flexDirection: 'row', gap: 10 },
  commCard: { flex: 1, height: 80, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 15, alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#111' },
  commText: { color: '#555', fontSize: 8, fontWeight: 'bold' },
  
  agentCommandsCard: { padding: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 20, borderWidth: 1, borderColor: '#111', marginBottom: 30 },
  agentCommandInput: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: 15, borderWidth: 1, minHeight: 100, textAlignVertical: 'top', fontSize: 12, marginBottom: 15 },
  agentCommandBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10, gap: 10 },
  agentCommandBtnText: { color: '#000', fontSize: 12, fontWeight: 'bold' },

  footer: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
  footerText: { color: '#222', fontSize: 8, letterSpacing: 1 },
  
  serviceStatusCard: { padding: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 20, borderWidth: 1, borderColor: '#111', marginBottom: 15 },
  serviceStatusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  serviceStatusTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  servicesList: { marginBottom: 30 },
  serviceItem: { padding: 15, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 15, borderWidth: 1, borderColor: '#111', marginBottom: 10 },
  serviceInfo: { marginBottom: 10 },
  serviceName: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  serviceStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  serviceStatusText: { fontSize: 10, fontWeight: 'bold' },
  serviceActions: { flexDirection: 'row', gap: 8 },
  serviceBtn: { flex: 1, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignItems: 'center' },
  serviceBtnText: { color: '#000', fontSize: 10, fontWeight: 'bold' },
  builderStatusCard: { padding: 15, backgroundColor: 'rgba(0,234,255,0.1)', borderRadius: 15, borderWidth: 1, borderColor: '#00EAFF', marginTop: 10 },
  builderStatusTitle: { color: '#00EAFF', fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  builderStatusText: { color: '#fff', fontSize: 10, marginBottom: 4 },
  progressBar: { height: 4, backgroundColor: '#000', borderRadius: 2, overflow: 'hidden', marginTop: 8 },
  progressFill: { height: '100%' }
});