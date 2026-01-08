/**
 * RARE 4N - Code Generator Screen
 * مولد الكود - يكتب ويفهم ويحلل 12 امتداد للكود
 */

import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RAREKernel } from '../core/RAREKernel';
import { CognitiveLoop } from '../core/CognitiveLoop';
import { useTheme } from '../hooks/useTheme';
import { getSafeColor, getSafeColors } from '../utils/safeTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import Icon from '../components/Icon';
import { API_URL } from '../services/config';
import { useVoice } from '../contexts/VoiceContext';

const CODE_EXTENSIONS = [
  { ext: 'js', name: 'JavaScript', icon: 'code', supportsCarPlay: false },
  { ext: 'ts', name: 'TypeScript', icon: 'code', supportsCarPlay: false },
  { ext: 'jsx', name: 'React JSX', icon: 'code', supportsCarPlay: false },
  { ext: 'tsx', name: 'React TSX', icon: 'code', supportsCarPlay: false },
  { ext: 'py', name: 'Python', icon: 'code', supportsCarPlay: false },
  { ext: 'java', name: 'Java', icon: 'code', supportsCarPlay: false },
  { ext: 'cpp', name: 'C++', icon: 'code', supportsCarPlay: false },
  { ext: 'c', name: 'C', icon: 'code', supportsCarPlay: false },
  { ext: 'cs', name: 'C#', icon: 'code', supportsCarPlay: false },
  { ext: 'go', name: 'Go', icon: 'code', supportsCarPlay: false },
  { ext: 'rs', name: 'Rust', icon: 'code', supportsCarPlay: false },
  { ext: 'swift', name: 'Swift', icon: 'code', supportsCarPlay: false },
  { ext: 'kt', name: 'Kotlin', icon: 'code', supportsCarPlay: false },
  { ext: 'php', name: 'PHP', icon: 'code', supportsCarPlay: false },
  { ext: 'rb', name: 'Ruby', icon: 'code', supportsCarPlay: false },
  { ext: 'html', name: 'HTML', icon: 'code', supportsCarPlay: true },
  { ext: 'css', name: 'CSS', icon: 'code', supportsCarPlay: false },
];

export default function CodeGenerator() {
  const [codePrompt, setCodePrompt] = useState('');
  const [selectedExtension, setSelectedExtension] = useState('ts');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCarPlay, setIsCarPlay] = useState(false);
  
  const themeHook = useTheme();
  const colors = getSafeColors(themeHook?.colors);
  const { t } = useTranslation();
  const { t: tLang } = useLanguage();
  const { isVoiceEnabled = false } = useVoice();
  const kernel = RAREKernel.getInstance();
  const cognitiveLoop = CognitiveLoop.getInstance();

  useEffect(() => {
    // ربط Cognitive Loop
    cognitiveLoop.init(kernel).catch(console.error);
    
    // إرسال حدث فتح الشاشة
    kernel.emit({ 
      type: 'screen:opened', 
      data: { screen: 'code-generator' } 
    });
    
    // إرسال للكور
    kernel.emit({
      type: 'user:input',
      data: { text: 'open code generator', type: 'navigation', screen: 'code-generator' }
    });

    // تفعيل Real-time Voice إذا كان مفعّل في Home
    if (isVoiceEnabled) {
      kernel.emit({
        type: 'voice:screen:active',
        data: { screen: 'code-generator', voiceEnabled: true }
      });
    }
  }, [isVoiceEnabled]);

  const handleGenerate = async () => {
    if (!codePrompt.trim()) {
      Alert.alert(tLang('error') || 'خطأ', tLang('enterCodeDescription') || 'يرجى إدخال وصف للكود');
      return;
    }

    setIsGenerating(true);
    setGeneratedCode('');

    // إرسال للكور
    kernel.emit({
      type: 'user:input',
      data: { text: `generate ${selectedExtension} code: ${codePrompt}`, type: 'code-generator', language: selectedExtension, prompt: codePrompt }
    });

    try {
      const language = CODE_EXTENSIONS.find(e => e.ext === selectedExtension)?.name || 'TypeScript';
      // استخدام file-generator service لدعم HTML CarPlay
      const endpoint = (selectedExtension === 'html' && isCarPlay) 
        ? '/api/file-generator/generate' 
        : '/api/codegen';
      
      const payload = (selectedExtension === 'html' && isCarPlay)
        ? {
            type: 'html',
            prompt: codePrompt,
            options: { carplay: true }
          }
        : {
            prompt: `Write ${language} code: ${codePrompt}`,
            language: language,
            extension: selectedExtension,
          };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.code || data.html || data.content) {
        setGeneratedCode(data.code || data.html || data.content);
        
        // إرسال للكور
        kernel.emit({
          type: 'user:input',
          data: { text: 'code generated successfully', type: 'code-generator', success: true, language: selectedExtension }
        });
      } else if (data.error) {
        Alert.alert(tLang('error') || 'خطأ', data.error);
        kernel.emit({
          type: 'user:input',
          data: { text: `code generation failed: ${data.error}`, type: 'code-generator', success: false, error: data.error }
        });
      } else {
        Alert.alert(tLang('error') || 'خطأ', tLang('codeNotGenerated') || 'لم يتم توليد الكود');
      }
    } catch (error: any) {
      console.error('Code generation error:', error);
      Alert.alert(tLang('error') || 'خطأ', tLang('serverConnectionFailed') || 'فشل الاتصال بالخادم');
      kernel.emit({
        type: 'user:input',
        data: { text: `code generation error: ${error.message}`, type: 'code-generator', success: false, error: error.message }
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      // Try to use Clipboard if available
      try {
        const Clipboard = await import('@react-native-clipboard/clipboard');
        await Clipboard.default.setString(generatedCode);
        Alert.alert('نجح', 'تم نسخ الكود');
      } catch (clipboardError) {
        // Fallback: Copy to AsyncStorage as backup
        await AsyncStorage.setItem('copied_code', generatedCode);
        Alert.alert('نجح', 'تم حفظ الكود (استخدم Ctrl+V للصق)');
      }
      
      kernel.emit({
        type: 'user:input',
        data: { text: 'code copied to clipboard', type: 'code-generator', action: 'copy' }
      });
    } catch (error: any) {
      Alert.alert('خطأ', 'فشل نسخ الكود');
    }
  };

  const handleSaveCode = async () => {
    if (!generatedCode) {
      Alert.alert('تنبيه', 'لا يوجد كود لحفظه');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/files/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: `code_${Date.now()}.${selectedExtension}`,
          content: generatedCode,
          mimeType: `text/${selectedExtension}`,
          category: 'code',
        }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('نجح', 'تم حفظ الكود بنجاح');
        kernel.emit({
          type: 'user:input',
          data: { text: 'code saved successfully', type: 'code-generator', action: 'save', fileId: data.fileId }
        });
      } else {
        Alert.alert('خطأ', data.error || 'فشل حفظ الكود');
      }
    } catch (error: any) {
      Alert.alert('خطأ', 'فشل حفظ الكود');
    }
  };

  return (
    <LinearGradient
      colors={theme.background as [string, string, ...string[]]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Pressable 
          onPress={() => {
            kernel.emit({ type: 'user:input', data: { text: 'go back', type: 'navigation' } });
            router.back();
          }} 
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={20} color={getSafeColor(colors, 'primary')} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: getSafeColor(colors, 'primary') }]}>
          {tLang('codeGenerator') || 'مولد الكود'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.section, { borderColor: getSafeColor(colors, 'primary') }]}>
          <Text style={[styles.sectionTitle, { color: getSafeColor(colors, 'primary') }]}>
            {tLang('selectProgrammingLanguage') || 'اختر لغة البرمجة'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.extensionsScroll}>
            {CODE_EXTENSIONS.map((ext) => (
              <Pressable
                key={ext.ext}
                style={[
                  styles.extensionButton,
                  {
                    backgroundColor: selectedExtension === ext.ext ? getSafeColor(colors, 'primary') : `${getSafeColor(colors, 'primary')}20`,
                    borderColor: getSafeColor(colors, 'primary'),
                  },
                ]}
                onPress={() => setSelectedExtension(ext.ext)}
              >
                <Text style={[
                  styles.extensionText,
                  { color: selectedExtension === ext.ext ? '#000' : colors.text }
                ]}>
                  {ext.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.section, { borderColor: getSafeColor(colors, 'primary') }]}>
          <Text style={[styles.sectionTitle, { color: getSafeColor(colors, 'primary') }]}>
            {tLang('codeDescription') || 'وصف الكود'}
          </Text>
          <TextInput
            style={[styles.promptInput, { borderColor: getSafeColor(colors, 'primary'), color: colors.text }]}
            placeholder={tLang('codeDescriptionExample') || 'مثال: دالة لحساب مجموع الأرقام في مصفوفة'}
            placeholderTextColor={getSafeColor(colors, 'primary') + '50'}
            value={codePrompt}
            onChangeText={setCodePrompt}
            multiline
            numberOfLines={4}
          />
          {CODE_EXTENSIONS.find(e => e.ext === selectedExtension)?.supportsCarPlay && (
            <Pressable
              style={[
                styles.carplayToggle,
                { 
                  backgroundColor: isCarPlay ? getSafeColor(colors, 'primary') + '30' : 'transparent',
                  borderColor: getSafeColor(colors, 'primary')
                }
              ]}
              onPress={() => setIsCarPlay(!isCarPlay)}
            >
              <Icon name="car" size={18} color={isCarPlay ? getSafeColor(colors, 'primary') : getSafeColor(colors, 'primary') + '70'} />
              <Text style={[styles.carplayText, { color: isCarPlay ? getSafeColor(colors, 'primary') : getSafeColor(colors, 'primary') + '70' }]}>
                {isCarPlay ? 'CarPlay مفعل' : 'تفعيل CarPlay'}
              </Text>
            </Pressable>
          )}
          <Pressable
            style={[
              styles.generateButton,
              { backgroundColor: getSafeColor(colors, 'primary'), opacity: isGenerating ? 0.6 : 1 }
            ]}
            onPress={handleGenerate}
            disabled={isGenerating}
          >
            <Text style={styles.generateButtonText}>
              {isGenerating ? 'جاري التوليد...' : 'توليد الكود'}
            </Text>
          </Pressable>
        </View>

        {generatedCode ? (
          <View style={[styles.section, { borderColor: getSafeColor(colors, 'primary') }]}>
            <View style={styles.codeHeader}>
              <Text style={[styles.sectionTitle, { color: getSafeColor(colors, 'primary') }]}>الكود المولّد</Text>
              <View style={styles.codeActions}>
                <Pressable onPress={handleCopyCode} style={styles.actionButton}>
                  <Icon name="copy" size={18} color={getSafeColor(colors, 'primary')} />
                  <Text style={[styles.actionText, { color: getSafeColor(colors, 'primary') }]}>نسخ</Text>
                </Pressable>
                <Pressable onPress={handleSaveCode} style={styles.actionButton}>
                  <Icon name="save" size={18} color={getSafeColor(colors, 'primary')} />
                  <Text style={[styles.actionText, { color: getSafeColor(colors, 'primary') }]}>حفظ</Text>
                </Pressable>
              </View>
            </View>
            <ScrollView 
              style={styles.codeContainer} 
              horizontal
              showsHorizontalScrollIndicator={true}
            >
              <ScrollView nestedScrollEnabled>
                <Text style={[styles.codeText, { color: colors.text }]}>{generatedCode}</Text>
              </ScrollView>
            </ScrollView>
            <View style={styles.codeStats}>
              <Text style={[styles.statText, { color: colors.text + '70' }]}>
                السطور: {generatedCode.split('\n').length} | الأحرف: {generatedCode.length}
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'right',
  },
  extensionsScroll: {
    flexDirection: 'row',
  },
  extensionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  extensionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  promptInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    textAlign: 'right',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  generateButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  codeActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  codeContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    padding: 12,
    maxHeight: 400,
    minHeight: 200,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 22,
  },
  codeStats: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  statText: {
    fontSize: 10,
    textAlign: 'right',
  },
  carplayToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  carplayText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
