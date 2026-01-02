/**
 * RARE 4N - Ultimate Settings Screen
 * شاشة الإعدادات المحسّنة بالكامل
 */

import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, Alert, ActivityIndicator, Switch, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { RAREKernel } from '../core/RAREKernel';
import { CognitiveLoop } from '../core/CognitiveLoop';
import { useTheme } from '../hooks/useTheme';
import { getSafeColor } from '../utils/safeTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { ALL_THEMES } from '../config/themes';
import Icon from '../components/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import customizationManager from '../utils/customizationManager';
import listLayoutManager from '../utils/listLayoutManager';
import fontManager from '../utils/fontManager';
import voiceLibraryManager from '../utils/voiceLibraryManager';
import passwordManager from '../utils/passwordManager';
import rareDialectEngine from '../core/engines/RAREDialectEngine';
import { AVAILABLE_FONTS } from '../utils/fontManager';

const MOODS = [
  { id: 'professional', name: 'إمبراطوري', desc: 'لغة رسمية وجادة', nameEn: 'Imperial', descEn: 'Formal and serious language' },
  { id: 'friendly', name: 'ودود', desc: 'لغة قريبة ودافئة', nameEn: 'Friendly', descEn: 'Warm and close language' },
  { id: 'cyber', name: 'سيبراني', desc: 'لغة تقنية بحتة', nameEn: 'Cyber', descEn: 'Pure technical language' },
  { id: 'assistant', name: 'مساعد', desc: 'لغة مساعدة ومفيدة', nameEn: 'Assistant', descEn: 'Helpful and supportive language' },
  { id: 'neutral', name: 'محايد', desc: 'لغة متوازنة', nameEn: 'Neutral', descEn: 'Balanced language' },
];

export default function Settings() {
  const { theme, colors = { primary: '#00EAFF', text: '#fff', background: '#000408', surface: '#0a0e14', border: '#1a1f2e' }, updateTheme } = useTheme();
  const { t } = useTranslation();
  const { t: tLang, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [mainPassword, setMainPassword] = useState('');
  const [vaultPassword, setVaultPassword] = useState('');
  const [confirmMainPassword, setConfirmMainPassword] = useState('');
  const [confirmVaultPassword, setConfirmVaultPassword] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<any>(null);
  const [voices, setVoices] = useState<any[]>([]);
  const [selectedDialect, setSelectedDialect] = useState<string>('auto');
  const [selectedLayout, setSelectedLayout] = useState<string>('grid');
  const [selectedFont, setSelectedFont] = useState<string>('System');
  const [fontSize, setFontSize] = useState(14);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showDialectModal, setShowDialectModal] = useState(false);
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [showFontModal, setShowFontModal] = useState(false);
  const [dragEnabled, setDragEnabled] = useState(true);
  const [ultimateAssistant, setUltimateAssistant] = useState(false);
  const [secureIntegration, setSecureIntegration] = useState(false);
  const [consciousness, setConsciousness] = useState(false);
  const [sosEnabled, setSosEnabled] = useState(false);
  
  const kernel = RAREKernel.getInstance();
  const cognitiveLoop = CognitiveLoop.getInstance();

  useEffect(() => {
    cognitiveLoop.init(kernel).catch(console.error);
    kernel.emit({ type: 'screen:opened', data: { screen: 'settings' } });
    kernel.emit({ type: 'user:input', data: { text: 'open settings', type: 'navigation', screen: 'settings' } });
    
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load voice library
      const allVoices = voiceLibraryManager.getAllVoices();
      setVoices(allVoices);
      const currentVoice = await voiceLibraryManager.getSelectedVoice();
      setSelectedVoice(currentVoice);
      
      // Load dialect
      const currentDialect = rareDialectEngine.getCurrentDialect();
      setSelectedDialect(currentDialect);
      
      // Load layout
      const currentLayout = listLayoutManager.getCurrentLayout();
      setSelectedLayout(currentLayout);
      
      // Load font
      const fontConfig = fontManager.getConfig();
      setSelectedFont(fontConfig.family);
      setFontSize(fontConfig.sizes.base);
      
      // Load customization
      const customConfig = customizationManager.getConfig();
      setDragEnabled(customConfig.dragEnabled);
      
      // Load RARE settings
      const ultimate = await AsyncStorage.getItem('rare_ultimate_assistant');
      const secure = await AsyncStorage.getItem('rare_secure_integration');
      const conscious = await AsyncStorage.getItem('rare_consciousness');
      const sos = await AsyncStorage.getItem('rare_sos_enabled');
      
      setUltimateAssistant(ultimate === 'true');
      setSecureIntegration(secure === 'true');
      setConsciousness(conscious === 'true');
      setSosEnabled(sos === 'true');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleThemeChange = async (newTheme: any) => {
    await updateTheme(newTheme);
    await customizationManager.setColors({
      primary: newTheme.primary,
      secondary: newTheme.secondary,
      accent: newTheme.accent,
      background: newTheme.background,
      surface: newTheme.surface,
      text: newTheme.text,
      textSecondary: newTheme.textSecondary,
      border: newTheme.border,
    });
    kernel.emit({ type: 'theme:changed', data: { themeId: newTheme.id } });
    kernel.emit({ type: 'user:input', data: { text: `change theme to ${newTheme.nameAr}`, type: 'settings', action: 'theme_change', themeId: newTheme.id } });
  };

  const handleMoodChange = async (moodId: string) => {
    await AsyncStorage.setItem('RARE_MOOD', moodId);
    kernel.emit({ type: 'agent:mood_update', data: { mood: moodId } });
    kernel.emit({ type: 'user:input', data: { text: `change mood to ${moodId}`, type: 'settings', action: 'mood_change', mood: moodId } });
    Alert.alert(tLang('success') || 'نجاح', tLang('moodUpdated') || 'تم تغيير مزاج رير بنجاح.');
  };

  const handleMainPasswordChange = async () => {
    if (!mainPassword || mainPassword !== confirmMainPassword) {
      Alert.alert('خطأ', 'كلمات المرور غير متطابقة');
      return;
    }
    try {
      await passwordManager.setMainPassword(mainPassword);
      Alert.alert('نجح', 'تم تحديث كلمة المرور الرئيسية بنجاح');
      setMainPassword('');
      setConfirmMainPassword('');
    } catch (error) {
      Alert.alert('خطأ', 'فشل تحديث كلمة المرور');
    }
  };

  const handleVaultPasswordChange = async () => {
    if (!vaultPassword || vaultPassword !== confirmVaultPassword) {
      Alert.alert('خطأ', 'كلمات المرور غير متطابقة');
      return;
    }
    try {
      await passwordManager.setVaultPassword(vaultPassword);
      Alert.alert('نجح', 'تم تحديث كلمة مرور Vault بنجاح');
      setVaultPassword('');
      setConfirmVaultPassword('');
    } catch (error) {
      Alert.alert('خطأ', 'فشل تحديث كلمة المرور');
    }
  };

  const handleVoiceSelect = async (voice: any) => {
    await voiceLibraryManager.setSelectedVoice(voice.id);
    setSelectedVoice(voice);
    setShowVoiceModal(false);
    Alert.alert('نجح', `تم اختيار الصوت: ${voice.nameAr || voice.name}`);
  };

  const handleDialectSelect = async (dialect: string) => {
    await rareDialectEngine.setDialect(dialect as any);
    setSelectedDialect(dialect);
    setShowDialectModal(false);
    Alert.alert('نجح', `تم اختيار اللهجة: ${rareDialectEngine.getDialectName(dialect as any)}`);
  };

  const handleLayoutSelect = async (layout: string) => {
    await listLayoutManager.setLayoutType(layout as any);
    setSelectedLayout(layout);
    setShowLayoutModal(false);
    Alert.alert('نجح', `تم اختيار التخطيط: ${listLayoutManager.getLayoutDisplayName(layout as any)}`);
  };

  const handleFontSelect = async (fontFamily: string) => {
    await fontManager.setFontFamily(fontFamily);
    setSelectedFont(fontFamily);
    setShowFontModal(false);
    Alert.alert('نجح', `تم اختيار الخط: ${fontFamily}`);
  };

  const handleFontSizeChange = async (size: number) => {
    await fontManager.setFontSizes({ base: size });
    setFontSize(size);
  };

  const handleDragToggle = async (enabled: boolean) => {
    await customizationManager.setDragEnabled(enabled);
    setDragEnabled(enabled);
  };

  const handleUltimateAssistantToggle = async (enabled: boolean) => {
    await AsyncStorage.setItem('rare_ultimate_assistant', enabled.toString());
    setUltimateAssistant(enabled);
    kernel.emit({ type: 'rare:ultimate_assistant', data: { enabled } });
  };

  const handleSecureIntegrationToggle = async (enabled: boolean) => {
    await AsyncStorage.setItem('rare_secure_integration', enabled.toString());
    setSecureIntegration(enabled);
    kernel.emit({ type: 'rare:secure_integration', data: { enabled } });
  };

  const handleConsciousnessToggle = async (enabled: boolean) => {
    await AsyncStorage.setItem('rare_consciousness', enabled.toString());
    setConsciousness(enabled);
    kernel.emit({ type: 'rare:consciousness', data: { enabled } });
  };

  const handleSosToggle = async (enabled: boolean) => {
    await AsyncStorage.setItem('rare_sos_enabled', enabled.toString());
    setSosEnabled(enabled);
    kernel.emit({ type: 'rare:sos', data: { enabled } });
  };

  const handleLogout = async () => {
    Alert.alert(
      tLang('confirm') || 'تأكيد',
      tLang('logoutConfirm') || 'هل تريد قطع الاتصال بنظام رير؟',
      [
        { text: tLang('cancel') || 'إلغاء', style: 'cancel' },
        {
          text: tLang('logout') || 'خروج',
          style: 'destructive',
          onPress: async () => {
            try {
              kernel.emit({ type: 'user:input', data: { text: 'logout', type: 'settings', action: 'logout' } });
              
              // Clear secure auth
              const { clearAuth } = await import('../utils/secureAuth');
              await clearAuth();
              
              // Clear all storage
              await AsyncStorage.clear();
              
              // Navigate to boot screen
              router.replace('/boot');
            } catch (error: any) {
              console.error('Logout error:', error);
              Alert.alert('خطأ', 'حدث خطأ أثناء تسجيل الخروج');
            }
          }
        }
      ]
    );
  };

  return (
    <LinearGradient colors={theme.background} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => {
          kernel.emit({ type: 'user:input', data: { text: 'go back', type: 'navigation' } });
          router.back();
        }}>
          <Icon name="arrow-back" size={24} color={getSafeColor(colors, 'primary')} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: getSafeColor(colors, 'primary') }]}>
          {tLang('settings') || 'إعدادات النظام'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1️⃣ اختيار الثيم */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: getSafeColor(colors, 'primary') }]}>
            {tLang('imperialAppearance') || 'المظهر الإمبراطوري'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.themeScroll}>
            {ALL_THEMES.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => handleThemeChange(t)}
                style={[styles.themeCard, theme.id === t.id && { borderColor: getSafeColor(colors, 'primary'), backgroundColor: getSafeColor(colors, 'primary') + '15' }]}
              >
                <View style={[styles.colorCircle, { backgroundColor: t.primary }]} />
                <Text style={styles.themeName}>{t.nameAr}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* 2️⃣ مزاج الأجنت */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: getSafeColor(colors, 'primary') }]}>
            {tLang('consciousnessProtocol') || 'بروتوكول الوعي (المزاج)'}
          </Text>
          {MOODS.map((m) => (
            <Pressable key={m.id} onPress={() => handleMoodChange(m.id)} style={styles.moodItem}>
              <View style={styles.moodInfo}>
                <Text style={styles.moodName}>{language === 'ar' ? m.name : m.nameEn}</Text>
                <Text style={styles.moodDesc}>{language === 'ar' ? m.desc : m.descEn}</Text>
              </View>
              <Icon name="psychology" size={24} color={getSafeColor(colors, 'primary') + '50'} />
            </Pressable>
          ))}
        </View>

        {/* 3️⃣ مكتبة الأصوات */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: getSafeColor(colors, 'primary') }]}>
            مكتبة الأصوات
          </Text>
          <Pressable onPress={() => setShowVoiceModal(true)} style={styles.selectBtn}>
            <Text style={styles.selectBtnText}>
              {selectedVoice ? (selectedVoice.nameAr || selectedVoice.name) : 'اختر صوتاً'}
            </Text>
            <Icon name="arrow-forward-ios" size={20} color={getSafeColor(colors, 'primary')} />
          </Pressable>
        </View>

        {/* 4️⃣ اللهجات */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: getSafeColor(colors, 'primary') }]}>
            اللهجات واللغات
          </Text>
          <Pressable onPress={() => setShowDialectModal(true)} style={styles.selectBtn}>
            <Text style={styles.selectBtnText}>
              {rareDialectEngine.getDialectName(selectedDialect as any)}
            </Text>
            <Icon name="arrow-forward-ios" size={20} color={getSafeColor(colors, 'primary')} />
          </Pressable>
        </View>

        {/* 5️⃣ أشكال القوائم */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: getSafeColor(colors, 'primary') }]}>
            أشكال القوائم
          </Text>
          <Pressable onPress={() => setShowLayoutModal(true)} style={styles.selectBtn}>
            <Text style={styles.selectBtnText}>
              {listLayoutManager.getLayoutDisplayName(selectedLayout as any)}
            </Text>
            <Icon name="arrow-forward-ios" size={20} color={getSafeColor(colors, 'primary')} />
          </Pressable>
        </View>

        {/* 6️⃣ الخطوط */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: getSafeColor(colors, 'primary') }]}>
            الخطوط
          </Text>
          <Pressable onPress={() => setShowFontModal(true)} style={styles.selectBtn}>
            <Text style={styles.selectBtnText}>{selectedFont}</Text>
            <Icon name="arrow-forward-ios" size={20} color={getSafeColor(colors, 'primary')} />
          </Pressable>
          <View style={styles.fontSizeContainer}>
            <Text style={styles.fontSizeLabel}>حجم الخط: {fontSize}</Text>
            <View style={styles.fontSizeControls}>
              <Pressable onPress={() => handleFontSizeChange(Math.max(10, fontSize - 1))} style={styles.fontSizeBtn}>
                <Icon name="remove" size={20} color={getSafeColor(colors, 'primary')} />
              </Pressable>
              <Text style={styles.fontSizeValue}>{fontSize}</Text>
              <Pressable onPress={() => handleFontSizeChange(Math.min(32, fontSize + 1))} style={styles.fontSizeBtn}>
                <Icon name="add" size={20} color={getSafeColor(colors, 'primary')} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* 7️⃣ Drag & Drop */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>تفعيل السحب والإفلات</Text>
              <Text style={styles.switchSubLabel}>إمكانية تحريك ونقل أجزاء التطبيق</Text>
            </View>
            <Switch value={dragEnabled} onValueChange={handleDragToggle} trackColor={{ true: getSafeColor(colors, 'primary') }} />
          </View>
        </View>

        {/* 8️⃣ كلمات المرور */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: getSafeColor(colors, 'primary') }]}>
            كلمات المرور
          </Text>
          <TextInput
            style={[styles.input, { borderColor: getSafeColor(colors, 'primary') + '20' }]}
            placeholder="كلمة المرور الرئيسية الجديدة"
            placeholderTextColor="#444"
            secureTextEntry
            value={mainPassword}
            onChangeText={setMainPassword}
          />
          <TextInput
            style={[styles.input, { borderColor: getSafeColor(colors, 'primary') + '20' }]}
            placeholder="تأكيد كلمة المرور الرئيسية"
            placeholderTextColor="#444"
            secureTextEntry
            value={confirmMainPassword}
            onChangeText={setConfirmMainPassword}
          />
          <Pressable style={[styles.saveBtn, { backgroundColor: getSafeColor(colors, 'primary') }]} onPress={handleMainPasswordChange}>
            <Text style={styles.saveBtnText}>تحديث كلمة المرور الرئيسية</Text>
          </Pressable>
          
          <TextInput
            style={[styles.input, { borderColor: getSafeColor(colors, 'primary') + '20', marginTop: 15 }]}
            placeholder="كلمة مرور Vault الجديدة"
            placeholderTextColor="#444"
            secureTextEntry
            value={vaultPassword}
            onChangeText={setVaultPassword}
          />
          <TextInput
            style={[styles.input, { borderColor: getSafeColor(colors, 'primary') + '20' }]}
            placeholder="تأكيد كلمة مرور Vault"
            placeholderTextColor="#444"
            secureTextEntry
            value={confirmVaultPassword}
            onChangeText={setConfirmVaultPassword}
          />
          <Pressable style={[styles.saveBtn, { backgroundColor: getSafeColor(colors, 'primary') }]} onPress={handleVaultPasswordChange}>
            <Text style={styles.saveBtnText}>تحديث كلمة مرور Vault</Text>
          </Pressable>
        </View>

        {/* 9️⃣ إعدادات RARE */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: getSafeColor(colors, 'primary') }]}>
            إعدادات RARE المتقدمة
          </Text>
          
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Ultimate Assistant</Text>
              <Text style={styles.switchSubLabel}>الترابط الكامل مع الهاتف (إيميل، واتساب، إنستجرام)</Text>
            </View>
            <Switch value={ultimateAssistant} onValueChange={handleUltimateAssistantToggle} trackColor={{ true: getSafeColor(colors, 'primary') }} />
          </View>

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Secure Integration</Text>
              <Text style={styles.switchSubLabel}>التكامل الآمن مع الهاتف</Text>
            </View>
            <Switch value={secureIntegration} onValueChange={handleSecureIntegrationToggle} trackColor={{ true: getSafeColor(colors, 'primary') }} />
          </View>

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Consciousness</Text>
              <Text style={styles.switchSubLabel}>الوعي المحيطي والاستشعار</Text>
            </View>
            <Switch value={consciousness} onValueChange={handleConsciousnessToggle} trackColor={{ true: getSafeColor(colors, 'primary') }} />
          </View>

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>SOS System</Text>
              <Text style={styles.switchSubLabel}>نظام الطوارئ والحماية</Text>
            </View>
            <Switch value={sosEnabled} onValueChange={handleSosToggle} trackColor={{ true: getSafeColor(colors, 'primary') }} />
          </View>
        </View>

        {/* 🔟 معلومات النظام */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: getSafeColor(colors, 'primary') }]}>
            معلومات النظام
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>الإصدار:</Text>
            <Text style={styles.infoValue}>RARE 4N v1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>الحالة:</Text>
            <Text style={[styles.infoValue, { color: '#00ff88' }]}>● نشط</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>البيئة:</Text>
            <Text style={styles.infoValue}>{process.env.NODE_ENV || 'production'}</Text>
          </View>
        </View>

        {/* 🔟 الخروج */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#ff4444" />
          <Text style={styles.logoutText}>{tLang('logoutFromSystem') || 'تسجيل الخروج من النظام'}</Text>
        </Pressable>

      </ScrollView>

      {/* Voice Selection Modal */}
      <Modal visible={showVoiceModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>اختر الصوت</Text>
              <Pressable onPress={() => setShowVoiceModal(false)}>
                <Icon name="close" size={24} color={getSafeColor(colors, 'primary')} />
              </Pressable>
            </View>
            <ScrollView>
              {voices.map((voice) => (
                <Pressable key={voice.id} onPress={() => handleVoiceSelect(voice)} style={styles.modalItem}>
                  <Text style={styles.modalItemText}>{voice.nameAr || voice.name}</Text>
                  {selectedVoice?.id === voice.id && <Icon name="check" size={20} color={getSafeColor(colors, 'primary')} />}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Dialect Selection Modal */}
      <Modal visible={showDialectModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>اختر اللهجة</Text>
              <Pressable onPress={() => setShowDialectModal(false)}>
                <Icon name="close" size={24} color={getSafeColor(colors, 'primary')} />
              </Pressable>
            </View>
            <ScrollView>
              {rareDialectEngine.getAllDialects().map((dialect) => (
                <Pressable key={dialect} onPress={() => handleDialectSelect(dialect)} style={styles.modalItem}>
                  <Text style={styles.modalItemText}>{rareDialectEngine.getDialectName(dialect as any)}</Text>
                  {selectedDialect === dialect && <Icon name="check" size={20} color={getSafeColor(colors, 'primary')} />}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Layout Selection Modal */}
      <Modal visible={showLayoutModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>اختر شكل القائمة</Text>
              <Pressable onPress={() => setShowLayoutModal(false)}>
                <Icon name="close" size={24} color={getSafeColor(colors, 'primary')} />
              </Pressable>
            </View>
            <ScrollView>
              {listLayoutManager.getAllLayouts().map((layout) => (
                <Pressable key={layout} onPress={() => handleLayoutSelect(layout)} style={styles.modalItem}>
                  <Text style={styles.modalItemText}>{listLayoutManager.getLayoutDisplayName(layout as any)}</Text>
                  {selectedLayout === layout && <Icon name="check" size={20} color={getSafeColor(colors, 'primary')} />}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Font Selection Modal */}
      <Modal visible={showFontModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>اختر الخط</Text>
              <Pressable onPress={() => setShowFontModal(false)}>
                <Icon name="close" size={24} color={getSafeColor(colors, 'primary')} />
              </Pressable>
            </View>
            <ScrollView>
              {AVAILABLE_FONTS.map((font) => (
                <Pressable key={font.id} onPress={() => handleFontSelect(font.id)} style={styles.modalItem}>
                  <Text style={styles.modalItemText}>{language === 'ar' ? font.nameAr : font.name}</Text>
                  {selectedFont === font.id && <Icon name="check" size={20} color={getSafeColor(colors, 'primary')} />}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  section: { marginBottom: 35 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 20, letterSpacing: 1, textAlign: 'right' },
  themeScroll: { flexDirection: 'row' },
  themeCard: { width: 100, padding: 15, borderRadius: 20, borderWidth: 1, borderColor: '#222', alignItems: 'center', marginRight: 15 },
  colorCircle: { width: 35, height: 35, borderRadius: 18, marginBottom: 10 },
  themeName: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  moodItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, marginBottom: 10, borderWidth: 1, borderColor: '#111' },
  moodInfo: { flex: 1 },
  moodName: { color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'right' },
  moodDesc: { color: '#555', fontSize: 10, marginTop: 4, textAlign: 'right' },
  selectBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 15, borderWidth: 1, borderColor: '#111' },
  selectBtnText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  fontSizeContainer: { marginTop: 15, padding: 15, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 15, borderWidth: 1, borderColor: '#111' },
  fontSizeLabel: { color: '#fff', fontSize: 12, marginBottom: 10, textAlign: 'right' },
  fontSizeControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  fontSizeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  fontSizeValue: { color: '#fff', fontSize: 16, fontWeight: 'bold', minWidth: 30, textAlign: 'center' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 15, borderWidth: 1, borderColor: '#111', marginBottom: 10 },
  switchLabel: { color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'right' },
  switchSubLabel: { color: '#555', fontSize: 10, marginTop: 4, textAlign: 'right' },
  input: { height: 55, backgroundColor: '#000', borderRadius: 15, borderWidth: 1, paddingHorizontal: 20, color: '#fff', marginBottom: 15, textAlign: 'right' },
  saveBtn: { height: 55, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  saveBtnText: { color: '#000', fontWeight: 'bold' },
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 10, 
    marginTop: 20, 
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ff444430',
  },
  logoutText: { color: '#ff4444', fontWeight: 'bold', fontSize: 14 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#111',
  },
  infoLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },
  infoValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0a0e14', borderTopLeftRadius: 25, borderTopRightRadius: 25, maxHeight: '80%', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 15, marginBottom: 10 },
  modalItemText: { color: '#fff', fontSize: 14, fontWeight: '500' },
});
