import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, Alert, ActivityIndicator, Image, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { RAREKernel } from '../core/RAREKernel';
import { CognitiveLoop } from '../core/CognitiveLoop';
import { PermissionManager } from '../core/services/PermissionManager';
import { useTheme } from '../hooks/useTheme'
import { getSafeColor, getSafeColors } from '../utils/safeTheme';;
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import Icon from '../components/Icon';
import { API_URL } from '../services/config';
import { useVoice } from '../contexts/VoiceContext';

const { width } = Dimensions.get('window');

const GENERATION_MODES = [
  { id: 'image', name: 'DALL-E 3', nameAr: 'دال إي 3', icon: 'image', color: '#10A37F', agent: 'Visual Agent', supportsAnalysis: false },
  { id: 'audio', name: 'ElevenLabs', nameAr: 'إليفن لابس', icon: 'mic', color: '#FF6600', agent: 'Voice Agent', supportsAnalysis: false },
  { id: 'vision', name: 'Vision AI', nameAr: 'رؤية ذكية', icon: 'eye', color: '#4285F4', agent: 'Analytical Agent', supportsAnalysis: true },
  { id: 'video', name: 'Video AI', nameAr: 'فيديو ذكي', icon: 'videocam', color: '#E91E63', agent: 'Video Agent', supportsAnalysis: true },
  { id: 'file', name: 'Document', nameAr: 'مستند', icon: 'description', color: '#2B579A', agent: 'Structure Agent', supportsAnalysis: false },
  { id: 'code', name: 'Dev Ops', nameAr: 'ديف أوبس', icon: 'terminal', color: '#FFFFFF', agent: 'Kernel Agent', supportsAnalysis: false },
];

export default function Generator() {
  const [mode, setMode] = useState('image');
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [voiceType, setVoiceType] = useState('Bella');
  const [analysisEngine, setAnalysisEngine] = useState<'gpt' | 'gemini' | 'claude'>('gpt');

  const { theme, colors = { primary: '#00EAFF', text: '#fff', background: '#000408', surface: '#0a0e14', border: '#1a1f2e' } } = useTheme();
  const { t } = useTranslation();
  const { t: tLang, language } = useLanguage();
  const { isVoiceEnabled, isListening, startListening, stopListening, speak } = useVoice();
  const kernel = RAREKernel.getInstance();
  const cognitiveLoop = CognitiveLoop.getInstance();
  const permissionManager = PermissionManager.getInstance();

  useEffect(() => {
    // ربط Cognitive Loop
    cognitiveLoop.init(kernel).catch(console.error);
    
    // إرسال حدث فتح الشاشة
    kernel.emit({ 
      type: 'screen:opened', 
      data: { screen: 'generator' } 
    });
    
    // تفعيل الأجنت فور اختيار الوضع
    kernel.emit({ type: 'agent:sync', data: { activeMode: mode, status: 'READY' } });
    
    // إرسال للكور
    kernel.emit({
      type: 'user:input',
      data: { text: 'open generator', type: 'navigation', screen: 'generator' }
    });
  }, []);

  useEffect(() => {
    // تحديث عند تغيير الوضع
    kernel.emit({ type: 'agent:sync', data: { activeMode: mode, status: 'READY' } });
    
    // إرسال للكور
    kernel.emit({
      type: 'user:input',
      data: { text: `switch to ${mode} mode`, type: 'generator', mode }
    });
  }, [mode]);

  // طلب الصلاحيات فقط عند تفعيل المستخدم
  const handlePickImage = async () => {
    // فحص الصلاحية أولاً
    const permissionStatus = await permissionManager.checkPermission('camera');
    
    if (!permissionStatus.granted) {
      // فحص الصلاحية فقط - لا طلب تلقائي
      Alert.alert(
        tLang('permissionRequired') || 'تنبيه', 
        tLang('imageAccessRequired') || 'يجب السماح بالوصول للصور من إعدادات التطبيق'
      );
      return;
    }
    
    // إرسال للكور
    kernel.emit({
      type: 'user:input',
      data: { text: 'pick image for analysis', type: 'generator', action: 'pick_image' }
    });
    
    const result = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7, 
      base64: true,
      allowsMultipleSelection: false
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      kernel.emit({
        type: 'user:input',
        data: { text: 'image selected', type: 'generator', action: 'image_selected' }
      });
    }
  };

  // اختيار فيديو للتحليل
  const handlePickVideo = async () => {
    const permissionStatus = await permissionManager.checkPermission('camera');
    
    if (!permissionStatus.granted) {
      // فحص الصلاحية فقط - لا طلب تلقائي
      Alert.alert(
        tLang('permissionRequired') || 'تنبيه',
        tLang('videoAccessRequired') || 'يجب السماح بالوصول للفيديوهات من إعدادات التطبيق'
      );
      return;
    }
    
    kernel.emit({
      type: 'user:input',
      data: { text: 'pick video for analysis', type: 'generator', action: 'pick_video' }
    });
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.7,
      allowsMultipleSelection: false
    });
    if (!result.canceled) {
      setSelectedVideo(result.assets[0].uri);
      kernel.emit({
        type: 'user:input',
        data: { text: 'video selected', type: 'generator', action: 'video_selected' }
      });
    }
  };

  // تحميل النتيجة
  const handleDownloadResult = async (result: any) => {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'mobile/app/generator.tsx:handleDownloadResult',message:'Download result started',data:{hasDownloadUrl:!!result.downloadUrl},timestamp:Date.now(),sessionId:'generator-test',runId:'run1',hypothesisId:'DOWNLOAD_RESULT_START'})}).catch(()=>{});
      // #endregion

      if (result.downloadUrl) {
        const response = await fetch(`${API_URL}${result.downloadUrl}`);
        if (response.ok) {
          // #region agent log
          fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'mobile/app/generator.tsx:handleDownloadResult',message:'Download result success',data:{status:response.status},timestamp:Date.now(),sessionId:'generator-test',runId:'run1',hypothesisId:'DOWNLOAD_RESULT_SUCCESS'})}).catch(()=>{});
          // #endregion
          Alert.alert('تم التحميل', 'تم حفظ الملف بنجاح');
        } else {
          // #region agent log
          fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'mobile/app/generator.tsx:handleDownloadResult',message:'Download result failed',data:{status:response.status},timestamp:Date.now(),sessionId:'generator-test',runId:'run1',hypothesisId:'DOWNLOAD_RESULT_FAILED'})}).catch(()=>{});
          // #endregion
        }
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'mobile/app/generator.tsx:handleDownloadResult',message:'Download result no URL',data:{},timestamp:Date.now(),sessionId:'generator-test',runId:'run1',hypothesisId:'DOWNLOAD_RESULT_NO_URL'})}).catch(()=>{});
        // #endregion
        Alert.alert('خطأ', 'رابط التحميل غير متاح');
      }
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'mobile/app/generator.tsx:handleDownloadResult',message:'Download result error',data:{error:error.message},timestamp:Date.now(),sessionId:'generator-test',runId:'run1',hypothesisId:'DOWNLOAD_RESULT_ERROR'})}).catch(()=>{});
      // #endregion
      Alert.alert('خطأ', error.message);
    }
  };

  // مشاركة النتيجة
  const handleShareResult = async (result: any) => {
    try {
      const { Share } = await import('react-native');
      if (result.shareableLink || result.downloadUrl || result.previewUrl) {
        const shareUrl = result.shareableLink || `${API_URL}${result.downloadUrl || result.previewUrl}`;
        await Share.share({
          message: `RARE 4N Generated Content: ${shareUrl}`,
          url: shareUrl,
          title: result.filename || 'RARE Generated',
        });
        
        kernel.emit({
          type: 'user:input',
          data: { text: 'shared generated content', type: 'generator', mode, action: 'share' }
        });
      } else {
        Alert.alert('خطأ', 'رابط المشاركة غير متاح');
      }
    } catch (error: any) {
      Alert.alert('خطأ', error.message);
    }
  };

  // إرسال النتيجة إلى Vault
  const handleSendToVault = async (result: any) => {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'mobile/app/generator.tsx:handleSendToVault',message:'Send to vault started',data:{hasResult:!!result,fileId:result.fileId},timestamp:Date.now(),sessionId:'generator-test',runId:'run1',hypothesisId:'SEND_TO_VAULT_START'})}).catch(()=>{});
      // #endregion

      const response = await fetch(`${API_URL}/api/vault/save-from-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result }),
      });
      const data = await response.json();
      
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'mobile/app/generator.tsx:handleSendToVault',message:'Send to vault response',data:{success:data.success,status:response.status},timestamp:Date.now(),sessionId:'generator-test',runId:'run1',hypothesisId:'SEND_TO_VAULT_RESPONSE'})}).catch(()=>{});
      // #endregion

      if (data.success) {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'mobile/app/generator.tsx:handleSendToVault',message:'Send to vault success',data:{fileId:data.file?.id},timestamp:Date.now(),sessionId:'generator-test',runId:'run1',hypothesisId:'SEND_TO_VAULT_SUCCESS'})}).catch(()=>{});
        // #endregion
        Alert.alert('تم الحفظ', 'تم حفظ الملف في القبو بنجاح');
        router.push('/rarevault');
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'mobile/app/generator.tsx:handleSendToVault',message:'Send to vault failed',data:{error:data.error},timestamp:Date.now(),sessionId:'generator-test',runId:'run1',hypothesisId:'SEND_TO_VAULT_FAILED'})}).catch(()=>{});
        // #endregion
        Alert.alert('خطأ', data.error || 'فشل الحفظ');
      }
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'mobile/app/generator.tsx:handleSendToVault',message:'Send to vault error',data:{error:error.message},timestamp:Date.now(),sessionId:'generator-test',runId:'run1',hypothesisId:'SEND_TO_VAULT_ERROR'})}).catch(()=>{});
      // #endregion
      Alert.alert('خطأ', error.message);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && mode !== 'vision') {
      Alert.alert(tLang('error') || 'خطأ', tLang('enterDescription') || 'أدخل الوصف أولاً');
      return;
    }

    setIsProcessing(true);
    setProgress(0.2);

    // إرسال للكور
    kernel.emit({
      type: 'user:input',
      data: { text: `generate ${mode} with prompt: ${prompt}`, type: 'generator', mode, prompt }
    });

    try {
      let endpoint = '';
      let payload: any = { prompt, vaultSave: true };

      switch (mode) {
        case 'image': 
          endpoint = '/api/file-generator/image'; 
          payload = { prompt, size: '1024x1024', quality: 'hd', style: 'vivid', vaultSave: true };
          break;
        case 'audio': 
          endpoint = '/api/file-generator/audio'; 
          payload = { text: prompt, voiceId: voiceType, vaultSave: true }; 
          break;
        case 'vision':
          if (!selectedImage) {
            Alert.alert(tLang('error') || 'خطأ', tLang('selectImageFirst') || 'يجب اختيار صورة أولاً');
            setIsProcessing(false);
            return;
          }
          endpoint = '/api/vision-ai/analyze';
          const base64 = await FileSystem.readAsStringAsync(selectedImage!, { encoding: 'base64' });
          payload = { 
            imageBase64: base64, 
            features: ['all'],
            engine: analysisEngine, // GPT-4, Gemini, Claude
            vaultSave: true
          };
          break;
        case 'video':
          // Generate video (not analyze)
          endpoint = '/api/file-generator/video';
          payload = { prompt, duration: 5, resolution: '1024x1024', vaultSave: true };
          break;
        case 'file': 
          endpoint = '/api/file-generator/generate'; 
          payload.type = 'docx';
          payload.vaultSave = true;
          break;
        case 'code': 
          endpoint = '/api/file-generator/code'; 
          payload.language = 'typescript';
          payload.vaultSave = true;
          break;
      }

      setProgress(0.6);

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        setProgress(1);
        setResult(data);
        
        // إخطار الكيرنل بالنجاح
        kernel.emit({ type: 'vault:new_item', data: { fileId: data.fileId, type: mode } });
        
        // إرسال للكور
        kernel.emit({
          type: 'user:input',
          data: { text: `generation successful: ${mode}`, type: 'generator', mode, success: true, fileId: data.fileId }
        });
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (error: any) {
      kernel.emit({
        type: 'user:input',
        data: { text: `generation failed: ${error.message}`, type: 'generator', mode, success: false, error: error.message }
      });
      Alert.alert(tLang('generationFailed') || 'فشل النظام', error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <LinearGradient colors={theme.background} style={styles.container}>
      {/* Header محسّن */}
      <View style={styles.header}>
        <Pressable 
          onPress={() => {
            kernel.emit({ type: 'user:input', data: { text: 'go back', type: 'navigation' } });
            router.back();
          }} 
          style={styles.iconBtn}
        >
          <Icon name="close" size={24} color="#fff" />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>RARE GENERATOR</Text>
          <Text style={[styles.agentStatus, { color: getSafeColor(colors, 'primary') }]}>
            ● {GENERATION_MODES.find(m => m.id === mode)?.agent} Active
          </Text>
        </View>
        <Pressable style={styles.iconBtn}>
          <Icon name="history" size={24} color="#fff" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Selector دائرى للأوضاع */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modesContainer}>
          {GENERATION_MODES.map((m) => (
            <Pressable 
              key={m.id} 
              style={[styles.modeCircle, mode === m.id && { borderColor: m.color, backgroundColor: m.color + '20' }]}
              onPress={() => { setMode(m.id); setResult(null); }}
            >
              <Icon name={m.icon} size={26} color={mode === m.id ? m.color : '#444'} />
              <Text style={[styles.modeLabel, { color: mode === m.id ? '#fff' : '#444' }]}>
                {language === 'ar' ? m.nameAr : m.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* منطقة العمل الذكية */}
        <View style={styles.workspace}>
          {mode === 'vision' && (
            <>
              <Pressable style={styles.visionPicker} onPress={handlePickImage}>
                {selectedImage ? <Image source={{ uri: selectedImage }} style={styles.fullImg} /> : (
                  <View style={styles.pickerContent}>
                    <Icon name="add-a-photo" size={40} color={getSafeColor(colors, 'primary')} />
                    <Text style={styles.pickerText}>
                      {tLang('uploadImageForAnalysis') || 'ارفع صورة للتحليل العميق'}
                    </Text>
                  </View>
                )}
              </Pressable>
              <View style={styles.engineSelect}>
                <Text style={styles.subLabel}>محرك التحليل:</Text>
                <View style={styles.engineRow}>
                  {[
                    { id: 'gpt', name: 'GPT-4 Vision', icon: 'auto-awesome' },
                    { id: 'gemini', name: 'Gemini Pro', icon: 'psychology' },
                    { id: 'claude', name: 'Claude Sonnet', icon: 'lightbulb' }
                  ].map(eng => (
                    <Pressable 
                      key={eng.id} 
                      onPress={() => setAnalysisEngine(eng.id as any)} 
                      style={[styles.engineChip, analysisEngine === eng.id && { backgroundColor: getSafeColor(colors, 'primary') + '30', borderColor: getSafeColor(colors, 'primary') }]}
                    >
                      <Icon name={eng.icon} size={16} color={analysisEngine === eng.id ? getSafeColor(colors, 'primary') : '#555'} />
                      <Text style={[styles.engineText, { color: analysisEngine === eng.id ? getSafeColor(colors, 'primary') : '#555' }]}>
                        {eng.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </>
          )}

          {mode === 'video' && (
            <>
              <Pressable style={styles.visionPicker} onPress={handlePickVideo}>
                {selectedVideo ? (
                  <View style={styles.pickerContent}>
                    <Icon name="videocam" size={40} color={getSafeColor(colors, 'primary')} />
                    <Text style={styles.pickerText}>فيديو محدد</Text>
                  </View>
                ) : (
                  <View style={styles.pickerContent}>
                    <Icon name="videocam" size={40} color={getSafeColor(colors, 'primary')} />
                    <Text style={styles.pickerText}>
                      {tLang('uploadVideoForAnalysis') || 'ارفع فيديو للتحليل العميق'}
                    </Text>
                  </View>
                )}
              </Pressable>
              <View style={styles.engineSelect}>
                <Text style={styles.subLabel}>محرك التحليل:</Text>
                <View style={styles.engineRow}>
                  {[
                    { id: 'gpt', name: 'GPT-4', icon: 'auto-awesome' },
                    { id: 'gemini', name: 'Gemini Pro', icon: 'psychology' },
                    { id: 'claude', name: 'Claude', icon: 'lightbulb' }
                  ].map(eng => (
                    <Pressable 
                      key={eng.id} 
                      onPress={() => setAnalysisEngine(eng.id as any)} 
                      style={[styles.engineChip, analysisEngine === eng.id && { backgroundColor: getSafeColor(colors, 'primary') + '30', borderColor: getSafeColor(colors, 'primary') }]}
                    >
                      <Icon name={eng.icon} size={16} color={analysisEngine === eng.id ? getSafeColor(colors, 'primary') : '#555'} />
                      <Text style={[styles.engineText, { color: analysisEngine === eng.id ? getSafeColor(colors, 'primary') : '#555' }]}>
                        {eng.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </>
          )}

          {mode === 'audio' && (
            <View style={styles.voiceSelect}>
              <Text style={styles.subLabel}>اختر نبرة الصوت:</Text>
              <View style={styles.voiceRow}>
                {['Bella', 'Antoni', 'Arnold'].map(v => (
                  <Pressable key={v} onPress={() => setVoiceType(v)} style={[styles.vChip, voiceType === v && { backgroundColor: '#FF6600' }]}>
                    <Text style={{ color: '#fff', fontSize: 10 }}>{v}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <TextInput
            style={[styles.input, { borderColor: getSafeColor(colors, 'primary') + '20' }]}
            placeholder={tLang('enterCommandsForRare') || 'اكتب أوامرك لـ رير هنا...'}
            placeholderTextColor="#333"
            multiline
            value={prompt}
            onChangeText={(text) => {
              setPrompt(text);
              // إرسال للكور عند الكتابة
              if (text.length > 0) {
                kernel.emit({
                  type: 'user:input',
                  data: { text: `typing in generator: ${text}`, type: 'generator', mode, partial: true }
                });
              }
            }}
          />

          {isProcessing && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: getSafeColor(colors, 'primary') }]} />
            </View>
          )}

          <Pressable 
            style={[styles.generateBtn, { backgroundColor: isProcessing ? '#111' : getSafeColor(colors, 'primary') }]} 
            onPress={handleGenerate}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.btnText}>
                {tLang('activateAI') || 'تفعيل الذكاء الاصطناعي'}
              </Text>
            )}
          </Pressable>
        </View>

        {/* عرض النتائج الفورية */}
        {result && (
          <View style={styles.resultView}>
            <LinearGradient colors={['rgba(255,255,255,0.05)', 'transparent']} style={styles.resultCard}>
              <Text style={styles.resultTitle}>
                {tLang('generationSuccessful') || 'تم الإنتاج بنجاح'}
              </Text>
              {result.previewUrl && <Image source={{ uri: `${API_URL}${result.previewUrl}` }} style={styles.resultMedia} resizeMode="contain" />}
              {result.content && <Text style={styles.resultCode}>{result.content.substring(0, 300)}...</Text>}
              
              <View style={styles.resultActions}>
                <Pressable 
                  style={styles.action} 
                  onPress={() => handleDownloadResult(result)}
                >
                  <Icon name="download" size={20} color={getSafeColor(colors, 'primary')} />
                  <Text style={styles.actionLabel}>تحميل</Text>
                </Pressable>
                <Pressable 
                  style={styles.action} 
                  onPress={() => handleShareResult(result)}
                >
                  <Icon name="share" size={20} color={getSafeColor(colors, 'primary')} />
                  <Text style={styles.actionLabel}>مشاركة</Text>
                </Pressable>
                <Pressable 
                  style={styles.action} 
                  onPress={() => handleSendToVault(result)}
                >
                  <Icon name="lock" size={20} color={getSafeColor(colors, 'primary')} />
                  <Text style={styles.actionLabel}>حفظ</Text>
                </Pressable>
                <Pressable 
                  style={styles.action} 
                  onPress={() => {
                    setResult(null);
                    setPrompt('');
                    setSelectedImage(null);
                    setSelectedVideo(null);
                  }}
                >
                  <Icon name="refresh" size={20} color={getSafeColor(colors, 'primary')} />
                  <Text style={styles.actionLabel}>جديد</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 20, marginBottom: 20 },
  headerInfo: { alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  agentStatus: { fontSize: 9, fontWeight: 'bold', marginTop: 4, textTransform: 'uppercase' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingBottom: 100 },
  modesContainer: { paddingLeft: 20, marginBottom: 30 },
  modeCircle: { width: 85, height: 85, borderRadius: 42, borderWidth: 1, borderColor: '#222', alignItems: 'center', justifyContent: 'center', marginRight: 15, gap: 5 },
  modeLabel: { fontSize: 9, fontWeight: '800' },
  workspace: { marginHorizontal: 20, padding: 20, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: '#111' },
  visionPicker: { height: 180, borderRadius: 20, backgroundColor: '#000', marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#222' },
  pickerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  pickerText: { color: '#555', fontSize: 12 },
  fullImg: { width: '100%', height: '100%' },
  input: { minHeight: 100, textAlignVertical: 'top', color: '#fff', fontSize: 14, marginBottom: 20 },
  generateBtn: { height: 55, borderRadius: 15, alignItems: 'center', justifyContent: 'center', shadowColor: '#00EAFF', shadowOpacity: 0.2, shadowRadius: 10 },
  btnText: { color: '#000', fontWeight: '900', fontSize: 14, letterSpacing: 1 },
  progressContainer: { height: 2, backgroundColor: '#111', marginBottom: 20, borderRadius: 1 },
  progressBar: { height: '100%', borderRadius: 1 },
  resultView: { marginTop: 30, paddingHorizontal: 20 },
  resultCard: { padding: 20, borderRadius: 25, borderWidth: 1, borderColor: '#222' },
  resultTitle: { color: '#00ff88', fontSize: 12, fontWeight: 'bold', marginBottom: 15 },
  resultMedia: { width: '100%', height: 250, borderRadius: 15, backgroundColor: '#000' },
  resultCode: { color: '#aaa', fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginTop: 15 },
  resultActions: { flexDirection: 'row', justifyContent: 'space-around', gap: 10, marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#222' },
  action: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12, 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    borderWidth: 1, 
    borderColor: '#222',
    minWidth: 70,
  },
  actionLabel: {
    color: '#888',
    fontSize: 9,
    marginTop: 4,
    fontWeight: '600',
  },
  voiceSelect: { marginBottom: 15 },
  subLabel: { color: '#555', fontSize: 10, marginBottom: 8 },
  voiceRow: { flexDirection: 'row', gap: 10 },
  vChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  engineSelect: { marginBottom: 15 },
  engineRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  engineChip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#333',
    backgroundColor: '#111'
  },
  engineText: { fontSize: 10, fontWeight: '600' }
});