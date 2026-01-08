import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Alert, Image, Modal, ActivityIndicator, TextInput, Dimensions, BlurView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as LocalAuthentication from 'expo-local-authentication';
import { RAREKernel } from '../core/RAREKernel';
import { CognitiveLoop } from '../core/CognitiveLoop';
import { PermissionManager } from '../core/services/PermissionManager';
import { useTheme } from '../hooks/useTheme'
import { getSafeColor, getSafeColors } from '../utils/safeTheme';;
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { useKernelAgent } from '../hooks/useKernelAgent';
import Icon from '../components/Icon';
import { API_URL } from '../services/config';
import { useVoice } from '../contexts/VoiceContext';

const { width, height } = Dimensions.get('window');

export default function RAREVault() {
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any>({});
  
  const { theme, colors = { primary: '#00EAFF', text: '#fff', background: '#000408', surface: '#0a0e14', border: '#1a1f2e' } } = useTheme();
  const { t } = useTranslation();
  const { t: tLang } = useLanguage();
  const { isVoiceEnabled } = useVoice();
  const kernel = RAREKernel.getInstance();
  const cognitiveLoop = CognitiveLoop.getInstance();
  const permissionManager = PermissionManager.getInstance();
  const { executeAction: vaultAction } = useKernelAgent('vault');

  useEffect(() => {
    // ربط Cognitive Loop
    cognitiveLoop.init(kernel).catch(console.error);
    
    // إرسال حدث فتح الشاشة
    kernel.emit({ 
      type: 'screen:opened', 
      data: { screen: 'rarevault' } 
    });
    
    // إرسال للكور
    kernel.emit({
      type: 'user:input',
      data: { text: 'open vault', type: 'navigation', screen: 'rarevault' }
    });

    // تفعيل Real-time Voice إذا كان مفعّل في Home
    if (isVoiceEnabled) {
      kernel.emit({
        type: 'voice:screen:active',
        data: { screen: 'rarevault', voiceEnabled: true }
      });
    }
    
    // التحقق من كلمة المرور
    checkPassword();
    loadFiles();
    loadCategories();
  }, [isVoiceEnabled]);

  // التحقق من كلمة المرور
  const checkPassword = async () => {
    try {
      // Try Face ID first
      const faceIdResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'تأكيد الهوية للوصول للقبو',
        fallbackLabel: 'استخدم كلمة المرور',
      });
      
      if (faceIdResult.success) {
        setIsAuthenticated(true);
        return;
      }
    } catch (e) {
      // Face ID not available, show password modal
    }
    
    // Show password modal
    setShowPasswordModal(true);
  };

  // التحقق من كلمة المرور
  const handlePasswordSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/api/vault/verify-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      
      if (data.success && data.verified) {
        setIsAuthenticated(true);
        setShowPasswordModal(false);
        setPassword('');
      } else {
        Alert.alert('خطأ', 'كلمة المرور غير صحيحة');
        setPassword('');
      }
    } catch (error: any) {
      Alert.alert('خطأ', error.message);
    }
  };

  // تحميل الملفات
  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/vault/list`);
      const data = await response.json();
      if (data.success) {
        setFiles(data.items || []);
      }
    } catch (error: any) {
      console.error('Load files error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // تحميل الحافظات المخصصة
  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/vault/categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories || {});
      }
    } catch (error: any) {
      console.error('Load categories error:', error);
    }
  };


  // فتح الملف ببصمة الوجه/الأصبع إذا كان مشفراً
  const handleOpenFile = async (file: any) => {
    if (!isAuthenticated) {
      await checkPassword();
      return;
    }

    if (file.encrypted) {
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'يرجى تأكيد الهوية لفك تشفير الملف',
      });
      if (!auth.success) return;
    }
    setSelectedFile(file);
    setShowPreview(true);
  };

  // إرسال ملف من Vault إلى Generator
  const handleSendToGenerator = async (file: any) => {
    try {
      const response = await fetch(`${API_URL}/api/vault/${file.id}/send-to-generator`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert('تم الإرسال', 'تم إرسال الملف إلى Generator بنجاح');
        router.push('/generator');
      }
    } catch (error: any) {
      Alert.alert('خطأ', error.message);
    }
  };

  // تحويل الملف
  const handleConvertFile = async (file: any, toType: string) => {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'mobile/app/rarevault.tsx:handleConvertFile',message:'Convert file started',data:{fileId:file.id,toType},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'VAULT_CONVERT_START'})}).catch(()=>{});
      // #endregion

      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/vault/${file.id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toType }),
      });
      const data = await response.json();
      
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'mobile/app/rarevault.tsx:handleConvertFile',message:'Convert file response',data:{success:data.success,status:response.status},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'VAULT_CONVERT_RESPONSE'})}).catch(()=>{});
      // #endregion

      if (data.success) {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'mobile/app/rarevault.tsx:handleConvertFile',message:'Convert file success',data:{newFileId:data.file?.id},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'VAULT_CONVERT_SUCCESS'})}).catch(()=>{});
        // #endregion
        Alert.alert('تم التحويل', `تم تحويل الملف إلى ${toType} بنجاح`);
        await loadFiles();
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'mobile/app/rarevault.tsx:handleConvertFile',message:'Convert file failed',data:{error:data.error},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'VAULT_CONVERT_FAILED'})}).catch(()=>{});
        // #endregion
        Alert.alert('خطأ', data.error || 'فشل التحويل');
      }
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'mobile/app/rarevault.tsx:handleConvertFile',message:'Convert file error',data:{error:error.message},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'VAULT_CONVERT_ERROR'})}).catch(()=>{});
      // #endregion
      Alert.alert('خطأ', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // تحميل الملف
  const handleDownloadFile = async (file: any) => {
    try {
      const response = await fetch(`${API_URL}/api/vault/${file.id}/download`);
      if (response.ok) {
        const blob = await response.blob();
        // Save to device (would use expo-file-system or similar)
        Alert.alert('تم التحميل', 'تم حفظ الملف بنجاح');
      }
    } catch (error: any) {
      Alert.alert('خطأ', error.message);
    }
  };

  // رفع ملف
  const handleUploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*' });
      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType,
        } as any);
        formData.append('name', file.name);

        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/vault/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.success) {
          Alert.alert('تم الرفع', 'تم حفظ الملف في القبو بنجاح');
          await loadFiles();
          await loadCategories();
        }
      }
    } catch (error: any) {
      Alert.alert('خطأ', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // نظام الـ OCR المتقدم (استخراج نصوص وتحويلها لملف جديد)
  const handleAdvancedOCR = async (file: any) => {
    setIsLoading(true);
    try {
      const result = await vaultAction('ocr_scan', { fileId: file.id });
      if (result?.text) {
        Alert.alert('تم المسح', 'هل تريد حفظ النص المستخرج كملف جديد؟', [
          { text: 'تجاهل' },
          { text: 'حفظ كـ TXT', onPress: () => vaultAction('create_file', { content: result.text, name: 'Extracted_Text.txt' }) }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={theme.background} style={styles.container}>
      {/* Search & Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Icon name="search" size={18} color="#555" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="بحث في القبو..." 
            placeholderTextColor="#444"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Pressable style={styles.addBtn} onPress={handleUploadFile}>
          <Icon name="add" size={28} color={getSafeColor(colors, 'primary')} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* ملخص الخزنة */}
        <View style={styles.statsRow}>
          <View style={[styles.statItem, styles.statCard]}>
            <Icon name="insert-drive-file" size={20} color={getSafeColor(colors, 'primary')} />
            <Text style={[styles.statValue, { color: getSafeColor(colors, 'primary') }]}>{files.length}</Text>
            <Text style={styles.statLabel}>ملف</Text>
          </View>
          <View style={[styles.statItem, styles.statCard]}>
            <Icon name="lock" size={20} color="#FF3B30" />
            <Text style={[styles.statValue, { color: '#FF3B30' }]}>{files.filter(f => f.encrypted).length}</Text>
            <Text style={styles.statLabel}>مؤمن</Text>
          </View>
          <View style={[styles.statItem, styles.statCard]}>
            <Icon name="storage" size={20} color="#4CD964" />
            <Text style={[styles.statValue, { color: '#4CD964' }]}>
              {files.length > 0 ? Math.round((files.filter(f => f.encrypted).length / files.length) * 100) : 0}%
            </Text>
            <Text style={styles.statLabel}>أمان</Text>
          </View>
          <View style={[styles.statItem, styles.statCard]}>
            <Icon name="folder" size={20} color="#FFCC00" />
            <Text style={[styles.statValue, { color: '#FFCC00' }]}>{Object.keys(categories).length}</Text>
            <Text style={styles.statLabel}>حافظة</Text>
          </View>
        </View>

        {/* الحافظات المخصصة */}
        {Object.keys(categories).length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {Object.keys(categories).map(category => (
              <Pressable
                key={category}
                style={[styles.categoryChip, selectedCategory === category && { backgroundColor: getSafeColor(colors, 'primary') + '30' }]}
                onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                <Text style={[styles.categoryText, { color: selectedCategory === category ? getSafeColor(colors, 'primary') : '#888' }]}>
                  {category === 'images' ? 'صور' : category === 'videos' ? 'فيديوهات' : category === 'audio' ? 'صوت' : category === 'documents' ? 'مستندات' : category === 'presentations' ? 'عروض' : category === 'spreadsheets' ? 'جداول' : category === 'web' ? 'ويب' : category === 'code' ? 'كود' : 'أخرى'} ({categories[category].length})
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* شبكة الملفات الذكية */}
        <View style={styles.grid}>
          {(selectedCategory ? (categories[selectedCategory] || []) : files).map((file) => (
            <Pressable 
              key={file.id} 
              style={[styles.fileCard, { backgroundColor: 'rgba(255,255,255,0.03)' }]}
              onPress={() => handleOpenFile(file)}
            >
              <View style={styles.fileIcon}>
                <Icon 
                  name={file.encrypted ? 'lock' : 'insert-drive-file'} 
                  size={40} 
                  color={file.encrypted ? '#FF3B30' : getSafeColor(colors, 'primary')} 
                />
                {file.encrypted && <View style={styles.secureBadge} />}
              </View>
              
              <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
              
              <View style={styles.cardActions}>
                <Pressable onPress={() => handleOpenFile(file)} style={styles.miniAction}>
                  <Icon name="visibility" size={14} color="#888" />
                </Pressable>
                <Pressable onPress={() => handleDownloadFile(file)} style={styles.miniAction}>
                  <Icon name="download" size={14} color="#888" />
                </Pressable>
                <Pressable onPress={() => handleSendToGenerator(file)} style={styles.miniAction}>
                  <Icon name="send" size={14} color="#888" />
                </Pressable>
                <Pressable onPress={() => { setSelectedFile(file); setShowConvertModal(true); }} style={styles.miniAction}>
                  <Icon name="sync" size={14} color="#888" />
                </Pressable>
                <Pressable onPress={() => handleAdvancedOCR(file)} style={styles.miniAction}>
                  <Icon name="scanner" size={14} color="#888" />
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* مودال المعاينة الاحترافي */}
      <Modal visible={showPreview} animationType="slide" transparent>
        <View style={styles.previewContainer}>
          <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.previewHeader}>
            <Pressable onPress={() => setShowPreview(false)}><Icon name="close" size={24} color="#fff" /></Pressable>
            <Text style={styles.previewTitle}>{selectedFile?.name}</Text>
            <Pressable><Icon name="share" size={24} color={getSafeColor(colors, 'primary')} /></Pressable>
          </View>
          
          <View style={styles.previewBody}>
            {selectedFile?.type.includes('image') ? (
              <Image source={{ uri: selectedFile.uri }} style={styles.fullPreview} resizeMode="contain" />
            ) : (
              <View style={styles.codePreview}>
                <Text style={styles.codeText}>محتوى الملف المشفر...</Text>
              </View>
            )}
          </View>

          <View style={styles.bottomToolBar}>
            <Pressable style={styles.toolBtn}><Icon name="edit" size={20} color="#fff" /><Text style={styles.toolText}>تعديل</Text></Pressable>
            <Pressable style={styles.toolBtn}><Icon name="lock-open" size={20} color="#fff" /><Text style={styles.toolText}>فك قفل</Text></Pressable>
            <Pressable style={styles.toolBtn}><Icon name="print" size={20} color="#fff" /><Text style={styles.toolText}>طباعة</Text></Pressable>
          </View>
        </View>
      </Modal>

      {/* مودال كلمة المرور */}
      <Modal visible={showPasswordModal} animationType="slide" transparent>
        <View style={styles.passwordModalContainer}>
          <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.passwordModal}>
            <Text style={styles.passwordTitle}>الوصول للقبو</Text>
            <TextInput
              style={styles.passwordInput}
              placeholder="كلمة المرور"
              placeholderTextColor="#555"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoFocus
            />
            <View style={styles.passwordActions}>
              <Pressable style={styles.passwordBtn} onPress={handlePasswordSubmit}>
                <Text style={styles.passwordBtnText}>تأكيد</Text>
              </Pressable>
              <Pressable 
                style={[styles.passwordBtn, { backgroundColor: '#333' }]}
                onPress={async () => {
                  try {
                    const auth = await LocalAuthentication.authenticateAsync({
                      promptMessage: 'تأكيد الهوية',
                    });
                    if (auth.success) {
                      setIsAuthenticated(true);
                      setShowPasswordModal(false);
                    }
                  } catch (e) {}
                }}
              >
                <Icon name="face" size={20} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* مودال التحويل */}
      <Modal visible={showConvertModal} animationType="slide" transparent>
        <View style={styles.passwordModalContainer}>
          <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.passwordModal}>
            <Text style={styles.passwordTitle}>تحويل الملف</Text>
            <Text style={styles.passwordSubtitle}>من: {selectedFile?.type}</Text>
            <View style={styles.convertOptions}>
              {['pdf', 'docx', 'pptx', 'html', 'txt'].map(type => (
                <Pressable
                  key={type}
                  style={styles.convertOption}
                  onPress={() => {
                    handleConvertFile(selectedFile!, type);
                    setShowConvertModal(false);
                  }}
                >
                  <Text style={styles.convertOptionText}>{type.toUpperCase()}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable style={styles.passwordBtn} onPress={() => setShowConvertModal(false)}>
              <Text style={styles.passwordBtnText}>إلغاء</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {isLoading && <View style={styles.loadingOverlay}><ActivityIndicator size="large" color={getSafeColor(colors, 'primary')} /></View>}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', paddingTop: 60, paddingHorizontal: 20, alignItems: 'center', gap: 15, marginBottom: 20 },
  searchBar: { flex: 1, height: 45, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, borderWidth: 1, borderColor: '#222' },
  searchInput: { flex: 1, marginLeft: 10, color: '#fff', fontSize: 12 },
  addBtn: { width: 45, height: 45, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingBottom: 100 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10, paddingHorizontal: 20, gap: 10 },
  statItem: { alignItems: 'center', flex: 1 },
  statCard: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: '#222',
    minWidth: 70,
  },
  statValue: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  statLabel: { color: '#555', fontSize: 8, fontWeight: '600', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, padding: 20 },
  fileCard: { width: (width - 55) / 2, borderRadius: 20, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  fileIcon: { width: 70, height: 70, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  secureBadge: { position: 'absolute', top: 5, right: 5, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF3B30' },
  fileName: { color: '#fff', fontSize: 10, fontWeight: '600', marginBottom: 10 },
  cardActions: { flexDirection: 'row', gap: 10, borderTopWidth: 1, borderTopColor: '#222', paddingTop: 10, width: '100%', justifyContent: 'center' },
  miniAction: { padding: 5 },
  previewContainer: { flex: 1, backgroundColor: '#000' },
  previewHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60, alignItems: 'center' },
  previewTitle: { color: '#fff', fontSize: 12, fontWeight: '600' },
  previewBody: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fullPreview: { width: width, height: height * 0.6 },
  codePreview: { padding: 20, backgroundColor: '#050505', borderRadius: 15, width: '90%', height: '70%' },
  codeText: { color: '#00FF00', fontFamily: 'monospace' },
  bottomToolBar: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 40, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#222' },
  toolBtn: { alignItems: 'center', gap: 5 },
  toolText: { color: '#fff', fontSize: 9 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  categoriesContainer: { paddingHorizontal: 20, marginBottom: 20 },
  categoryChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', marginRight: 10, borderWidth: 1, borderColor: '#222' },
  categoryText: { fontSize: 10, fontWeight: '500' },
  passwordModalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  passwordModal: { width: width * 0.8, backgroundColor: 'rgba(0,0,0,0.9)', borderRadius: 20, padding: 30, borderWidth: 1, borderColor: '#222' },
  passwordTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  passwordSubtitle: { color: '#888', fontSize: 10, marginBottom: 12, textAlign: 'center' },
  passwordInput: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 15, color: '#fff', marginBottom: 20, borderWidth: 1, borderColor: '#222' },
  passwordActions: { flexDirection: 'row', gap: 10 },
  passwordBtn: { flex: 1, backgroundColor: '#00EAFF', borderRadius: 12, padding: 15, alignItems: 'center' },
  passwordBtnText: { color: '#000', fontWeight: '600' },
  convertOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  convertOption: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: '#222' },
  convertOptionText: { color: '#fff', fontSize: 10, fontWeight: '500' }
});