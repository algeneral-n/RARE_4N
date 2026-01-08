import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { RAREKernel } from '../core/RAREKernel';
import { CognitiveLoop } from '../core/CognitiveLoop';
import { PermissionManager } from '../core/services/PermissionManager';
import { useTheme } from '../hooks/useTheme'
import { getSafeColor, getSafeColors } from '../utils/safeTheme';;
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import Icon from '../components/Icon';
import io from 'socket.io-client';
import { API_URL } from '../services/config';
import { useVoice } from '../contexts/VoiceContext';
import { validateCommand, getCommandHelp, ValidationResult } from '../utils/commandValidator';
import { buildHistoryManager, BuildHistoryItem } from '../utils/buildHistory';

const { width, height } = Dimensions.get('window');

interface ClientRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  type: 'template' | 'system' | 'theme';
  selectedItem: any;
  description: string;
  files?: any[];
  status: 'pending' | 'approved' | 'modified' | 'building' | 'completed';
  paymentStatus: 'pending' | 'completed';
  createdAt: string;
}

export default function AppBuilder() {
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['RARE 4N Kernel Initialized...', 'Waiting for commands...']);
  const [terminalInput, setTerminalInput] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('expo');
  const [isBuilding, setIsBuilding] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [clientRequests, setClientRequests] = useState<ClientRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ClientRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showBuildPlanModal, setShowBuildPlanModal] = useState(false);
  const [buildPlan, setBuildPlan] = useState<any>(null);
  const [servicesStatus, setServicesStatus] = useState({
    backend: { status: 'stopped', pid: null },
    cloudflare: { status: 'stopped', pid: null },
  });
  const [isLoadingService, setIsLoadingService] = useState<string | null>(null);
  const [commandError, setCommandError] = useState<string | null>(null);
  const [buildHistory, setBuildHistory] = useState<BuildHistoryItem[]>([]);
  const [showBuildHistory, setShowBuildHistory] = useState(false);
  
  const { theme, colors = { primary: '#00EAFF', text: '#fff', background: '#000408', surface: '#0a0e14', border: '#1a1f2e' } } = useTheme();
  const { t } = useTranslation();
  const { t: tLang } = useLanguage();
  const { isVoiceEnabled, isListening, startListening, stopListening, speak } = useVoice();
  const kernel = RAREKernel.getInstance();
  const cognitiveLoop = CognitiveLoop.getInstance();
  const permissionManager = PermissionManager.getInstance();
  const scrollViewRef = useRef<ScrollView>(null);
  const socketRef = useRef<any>(null);

  // 1️⃣ القسم الأول: الخدمات (Services)
  const SERVICES = [
    { id: 'ios', name: 'iOS Build', icon: 'phone-iphone', color: '#00EAFF', command: 'eas build --platform ios --profile production' },
    { id: 'android', name: 'Android', icon: 'phone-android', color: '#A4C639', command: 'eas build --platform android --profile production' },
    { id: 'expo', name: 'Expo/EAS', icon: 'rocket-launch', color: '#FFFFFF', command: 'eas build --platform all --profile production' },
    { id: 'web', name: 'Web/Cloud', icon: 'globe', color: '#007AFF', command: 'npm run build:web' },
  ];

  // أزرار أوامر سريعة
  const QUICK_COMMANDS = [
    { id: 'analyze', name: 'تحليل وصف', icon: 'auto-awesome', command: 'analyze', color: '#10A37F' },
    { id: 'build-all', name: 'بناء الكل', icon: 'rocket-launch', command: 'eas build --platform all', color: '#00EAFF' },
    { id: 'build-ios', name: 'iOS Build', icon: 'phone-iphone', command: 'eas build --platform ios', color: '#00EAFF' },
    { id: 'build-android', name: 'Android Build', icon: 'phone-android', command: 'eas build --platform android', color: '#A4C639' },
    { id: 'github-push', name: 'رفع GitHub', icon: 'code', command: 'github push', color: '#FFFFFF' },
    { id: 'status', name: 'حالة البناء', icon: 'info', command: 'eas build:list', color: '#FFCC00' },
    { id: 'history', name: 'تاريخ البناء', icon: 'history', command: 'history', color: '#9B59B6' },
    { id: 'clear', name: 'مسح', icon: 'clear', command: 'clear', color: '#FF3B30' },
  ];

  // 2️⃣ القسم الثالث: المكتبات والطلبات (Libraries & Portal)
  const [libraries] = useState([
    { id: 'sys-1', name: 'RARE Core System', type: 'System' },
    { id: 'theme-1', name: 'Dark Neon Theme', type: 'Theme' },
    { id: 'lib-1', name: 'Cognitive Audio Lib', type: 'Library' },
  ]);

  const [portalRequests] = useState([
    { id: 'req-1', client: 'Nader', status: 'In Progress', progress: 0.65 },
    { id: 'req-2', client: 'Zien', status: 'Pending', progress: 0 },
  ]);

  useEffect(() => {
    // ربط Cognitive Loop
    cognitiveLoop.init(kernel).catch(console.error);
    
    // إرسال حدث فتح الشاشة
    kernel.emit({ 
      type: 'screen:opened', 
      data: { screen: 'app-builder' } 
    });
    
    // إرسال للكور
    kernel.emit({
      type: 'user:input',
      data: { text: 'open app builder', type: 'navigation', screen: 'app-builder' }
    });

    // ربط Socket.IO مع Auto Builder
    socketRef.current = io(`${API_URL}/auto-builder`, {
      transports: ['websocket'],
      reconnection: true,
    });

    socketRef.current.on('connect', () => {
      setTerminalOutput(prev => [...prev, '[CONNECTED] RARE Terminal']);
      kernel.emit({
        type: 'user:input',
        data: { text: 'terminal connected', type: 'app-builder', connected: true }
      });
    });

    socketRef.current.on('disconnect', () => {
      setTerminalOutput(prev => [...prev, '[DISCONNECTED] RARE Terminal']);
    });

    socketRef.current.on('error', (error: any) => {
      setTerminalOutput(prev => [...prev, `[ERROR] Socket error: ${error.message || 'Unknown error'}`]);
      setCommandError(error.message || 'Connection error');
    });

    // Listen for service status updates
    socketRef.current.on('services:status', (data: any) => {
      if (data && typeof data === 'object') {
        setServicesStatus(data);
      }
    });

    socketRef.current.on('service:status', (data: any) => {
      if (data && data.service) {
        setServicesStatus(prev => ({
          ...prev,
          [data.service]: { status: data.status, pid: data.pid || prev[data.service]?.pid || null }
        }));
      }
    });

    // Fetch services status on mount and setup auto-refresh
    fetchServicesStatus();
    const statusInterval = setInterval(fetchServicesStatus, 5000);
    
    // Load build history
    const loadBuildHistory = () => {
      const history = buildHistoryManager.getHistory(20);
      setBuildHistory(history);
    };
    loadBuildHistory();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      clearInterval(statusInterval);
    };

    socketRef.current.on('terminal:output', (data: any) => {
      setTerminalOutput(prev => [...prev, data.output || data]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });

    socketRef.current.on('build:progress', (data: any) => {
      setTerminalOutput(prev => [...prev, `[BUILD] Build Progress: ${data.progress}%`]);
      setIsBuilding(data.progress < 100);
      
      // Update build history if buildId exists
      if (data.buildId) {
        buildHistoryManager.updateBuild(data.buildId, {
          status: data.progress < 100 ? 'building' : 'completed',
        });
        setBuildHistory(buildHistoryManager.getHistory(20));
      }
    });

    socketRef.current.on('build:completed', (data: any) => {
      setTerminalOutput(prev => [...prev, `[SUCCESS] Build Completed: ${data.projectName}`]);
      if (data.builds && data.builds.length > 0) {
        data.builds.forEach((build: any) => {
          setTerminalOutput(prev => [...prev, `[BUILD] ${build.platform}: ${build.filename} (${formatSize(build.size)})`]);
          if (build.downloadUrl) {
            setTerminalOutput(prev => [...prev, `🔗 Download: ${build.downloadUrl}`]);
          }
        });
      }
      setTerminalOutput(prev => [...prev, `📧 Build files sent to email: ${data.ownerEmail || 'GM@ZIEN-AI.APP'}`]);
      if (data.clientEmail) {
        setTerminalOutput(prev => [...prev, `📧 Client email: ${data.clientEmail}`]);
      }
      setIsBuilding(false);
      
      // ✅ Add to build history
      const buildItem: BuildHistoryItem = {
        buildId: data.buildId || `build_${Date.now()}`,
        projectName: data.projectName || 'Unknown',
        platform: data.platform || 'all',
        profile: data.profile || 'production',
        status: 'completed',
        builds: data.builds || [],
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
      buildHistoryManager.addBuild(buildItem);
      setBuildHistory(buildHistoryManager.getHistory(20));
      
      kernel.emit({
        type: 'user:input',
        data: { text: `build completed: ${data.projectName}`, type: 'app-builder', buildId: data.buildId, builds: data.builds }
      });
    });

    socketRef.current.on('build:files', (data: any) => {
      if (data.files && data.files.length > 0) {
        setTerminalOutput(prev => [...prev, `[BUILD] Build Files Available:`]);
        data.files.forEach((file: any) => {
          setTerminalOutput(prev => [...prev, `  - ${file.filename} (${formatSize(file.size)})`]);
          if (file.downloadUrl) {
            setTerminalOutput(prev => [...prev, `    🔗 ${file.downloadUrl}`]);
          }
        });
      }
    });

    // استقبال طلبات العملاء من Agent
    socketRef.current.on('client:request', (request: ClientRequest) => {
      try {
        setTerminalOutput(prev => [...prev, `📨 New client request: ${request.clientName} - ${request.type}`]);
        setClientRequests(prev => {
          const exists = prev.find(r => r.id === request.id);
          if (exists) return prev;
          return [...prev, { ...request, status: 'pending' }];
        });
        // عرض إشعار
        Alert.alert(
          'طلب جديد من العميل',
          `${request.clientName} يريد بناء ${request.type === 'template' ? 'تطبيق' : request.type === 'system' ? 'نظام' : 'ثيم'}`,
          [
            { text: 'عرض', onPress: () => handleViewRequest(request) },
            { text: 'لاحقاً', style: 'cancel' },
          ]
        );
      } catch (error: any) {
        console.error('Error handling client request:', error);
      }
    });

    // استقبال ملفات العملاء
    socketRef.current.on('client:files-uploaded', (data: any) => {
      try {
        setTerminalOutput(prev => [...prev, `📎 Files uploaded by client: ${data.clientName}`]);
        setClientRequests(prev => prev.map(req => 
          req.clientId === data.clientId 
            ? { ...req, files: data.files || [] }
            : req
        ));
      } catch (error: any) {
        console.error('Error handling client files:', error);
      }
    });

    // استقبال إشعار اكتمال الدفع
    socketRef.current.on('payment:completed', (data: any) => {
      try {
        setTerminalOutput(prev => [...prev, `💳 Payment completed for request: ${data.requestId}`]);
        setClientRequests(prev => prev.map(req => 
          req.id === data.requestId 
            ? { ...req, paymentStatus: 'completed', status: 'approved' }
            : req
        ));
      } catch (error: any) {
        console.error('Error handling payment completion:', error);
      }
    });

    // الاستماع لمخرجات الترمينال من Kernel
    const unsub = kernel.on('builder:terminal:output', (event) => {
      setTerminalOutput(prev => [...prev, event.data.output]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });

    return () => {
      unsub();
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleTerminalSubmit = () => {
    if (!terminalInput.trim()) return;
    
    const command = terminalInput.trim();
    
    // SECURITY: Validate command before execution
    const validation = validateCommand(command, false);
    if (!validation.valid) {
      setCommandError(validation.error || 'Invalid command');
      setTerminalOutput(prev => [...prev, `[ERROR] ${validation.error}`]);
      setTerminalInput('');
      return;
    }
    
    // Clear previous error
    setCommandError(null);
    
    // Use sanitized command if available
    const sanitizedCommand = validation.sanitized || command;
    setTerminalOutput(prev => [...prev, `> ${sanitizedCommand}`]);
    
    // Handle help command
    if (sanitizedCommand === 'help' || sanitizedCommand === '?') {
      const helpText = getCommandHelp();
      setTerminalOutput(prev => [...prev, helpText]);
      setTerminalInput('');
      return;
    }
    
    // إرسال للكور
    kernel.emit({
      type: 'user:input',
      data: { text: `terminal command: ${sanitizedCommand}`, type: 'app-builder', command: sanitizedCommand }
    });
    
    // معالجة أوامر البناء الخاصة
    if (sanitizedCommand.startsWith('eas build') || sanitizedCommand.startsWith('build')) {
      handleBuildCommand(command);
    } else if (command.startsWith('github')) {
      handleGitHubCommand(command);
    } else if (sanitizedCommand === 'analyze') {
      handleAnalyzeCommand();
    } else if (sanitizedCommand.startsWith('analyze ')) {
      const description = sanitizedCommand.replace('analyze ', '');
      handleAnalyzeCommand(description);
    } else if (sanitizedCommand === 'clear') {
      setTerminalOutput(['RARE 4N Kernel Initialized...', 'Waiting for commands...']);
    } else if (sanitizedCommand === 'history' || sanitizedCommand === 'build:history') {
      handleBuildHistoryCommand();
    } else if (sanitizedCommand.startsWith('build:list')) {
      handleBuildListCommand();
    } else {
      // إرسال الأمر للباك إند عبر Socket.IO
      if (socketRef.current?.connected) {
        socketRef.current.emit('terminal:command', {
          command: sanitizedCommand,
          clientId: 'owner',
          requestId: `req_${Date.now()}`,
        });
      } else {
        // Fallback إلى Kernel event
        kernel.emit({ type: 'builder:execute', data: { command: sanitizedCommand } });
      }
    }
    
    setTerminalInput('');
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  // معالجة أمر التحليل
  const handleAnalyzeCommand = async (description?: string) => {
    if (!description) {
      setTerminalOutput(prev => [...prev, '[ERROR] يرجى إدخال وصف المشروع: analyze "وصف المشروع"']);
      return;
    }

      setTerminalOutput(prev => [...prev, '[ANALYZE] جاري تحليل الوصف...']);

    try {
      const response = await fetch(`${API_URL}/api/auto-builder/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          clientName: 'Owner',
          clientEmail: 'GM@ZIEN-AI.APP',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTerminalOutput(prev => [...prev, `[SUCCESS] تم التحليل بنجاح!`]);
        setTerminalOutput(prev => [...prev, `[INFO] نوع النظام: ${data.analysis.systemType}`]);
        setTerminalOutput(prev => [...prev, `[INFO] المكونات: ${data.analysis.components.map((c: any) => c.name).join(', ')}`]);
        setTerminalOutput(prev => [...prev, `[INFO] اسم المشروع: ${data.project.projectName}`]);
        setTerminalOutput(prev => [...prev, `[INFO] المسار: ${data.project.projectPath}`]);
        setTerminalOutput(prev => [...prev, '[TIP] استخدم: eas build --platform all لبناء المشروع']);
      } else {
        setTerminalOutput(prev => [...prev, `[ERROR] فشل التحليل: ${data.error}`]);
      }
    } catch (error: any) {
      setTerminalOutput(prev => [...prev, `[ERROR] خطأ: ${error.message}`]);
    }
  };

  // معالجة أوامر البناء
  const handleBuildCommand = async (command: string) => {
    setIsBuilding(true);
    setTerminalOutput(prev => [...prev, '[BUILD] Starting build process...']);
    
    try {
      // استخراج المعاملات من الأمر
      const platformMatch = command.match(/--platform\s+(\w+)/);
      const profileMatch = command.match(/--profile\s+(\w+)/);
      const projectMatch = command.match(/--project\s+(\w+)/);
      
      const platform = platformMatch ? platformMatch[1] : 'all';
      const profile = profileMatch ? profileMatch[1] : 'production';
      const projectName = projectMatch ? projectMatch[1] : 'default-project';
      
      setTerminalOutput(prev => [...prev, `[BUILD] Platform: ${platform}, Profile: ${profile}, Project: ${projectName}`]);
      
      // إرسال طلب البناء للباك إند
      const response = await fetch(`${API_URL}/api/auto-builder/expo/build`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          platform,
          profile,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTerminalOutput(prev => [...prev, `[SUCCESS] Build started successfully`]);
        if (data.builds) {
          data.builds.forEach((build: any) => {
            setTerminalOutput(prev => [...prev, `  - ${build.platform}: Build ID ${build.buildId}`]);
            if (build.url) {
              setTerminalOutput(prev => [...prev, `    🔗 ${build.url}`]);
            }
          });
        }
        setTerminalOutput(prev => [...prev, '📧 Build files will be sent to email when completed']);
        
        // Add to build history
        const buildItem: BuildHistoryItem = {
          buildId: data.buildId || `build_${Date.now()}`,
          projectName,
          platform,
          profile,
          status: 'building',
          createdAt: new Date().toISOString(),
        };
        buildHistoryManager.addBuild(buildItem);
        setBuildHistory(buildHistoryManager.getHistory(20));
      } else {
        setTerminalOutput(prev => [...prev, `[ERROR] Build failed: ${data.error || 'Unknown error'}`]);
        setIsBuilding(false);
        
        // Add failed build to history
        const buildItem: BuildHistoryItem = {
          buildId: `build_${Date.now()}`,
          projectName,
          platform,
          profile,
          status: 'failed',
          error: data.error || 'Unknown error',
          createdAt: new Date().toISOString(),
        };
        buildHistoryManager.addBuild(buildItem);
        setBuildHistory(buildHistoryManager.getHistory(20));
      }
    } catch (error: any) {
      setTerminalOutput(prev => [...prev, `[ERROR] Build error: ${error.message}`]);
      setIsBuilding(false);
    }
  };

  // معالجة أوامر GitHub
  const handleGitHubCommand = async (command: string) => {
    try {
      if (command.includes('create')) {
        const repoMatch = command.match(/create\s+(\w+)/);
        if (repoMatch) {
          const repoName = repoMatch[1];
          setTerminalOutput(prev => [...prev, `🔗 Creating GitHub repository: ${repoName}...`]);
          
          const response = await fetch(`${API_URL}/api/auto-builder/github/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectName: repoName,
              projectPath: `/server/projects/${repoName}`,
            }),
          });
          
          const data = await response.json();
          if (data.success) {
            setTerminalOutput(prev => [...prev, `[SUCCESS] Repository created: ${data.repoUrl}`]);
          } else {
            setTerminalOutput(prev => [...prev, `[ERROR] Failed: ${data.error}`]);
          }
        }
      } else if (command.includes('trigger')) {
        const repoMatch = command.match(/trigger\s+(\w+)/);
        if (repoMatch) {
          const repoName = repoMatch[1];
          setTerminalOutput(prev => [...prev, `[GITHUB] Triggering GitHub Actions for: ${repoName}...`]);
          
          const response = await fetch(`${API_URL}/api/auto-builder/github/trigger`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              repoName,
              workflowFile: 'eas-build.yml',
              inputs: {
                platform: 'all',
                profile: 'production',
              },
            }),
          });
          
          const data = await response.json();
          if (data.success) {
            setTerminalOutput(prev => [...prev, `[SUCCESS] Workflow triggered successfully`]);
          } else {
            setTerminalOutput(prev => [...prev, `[ERROR] Failed: ${data.error}`]);
          }
        }
      }
    } catch (error: any) {
      setTerminalOutput(prev => [...prev, `[ERROR] GitHub command error: ${error.message}`]);
    }
  };

  // تنسيق حجم الملف
  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  // معالجة طلبات العملاء
  const handleViewRequest = (request: ClientRequest) => {
    try {
      setSelectedRequest(request);
      setShowRequestModal(true);
    } catch (error: any) {
      console.error('Error viewing request:', error);
      Alert.alert('خطأ', 'فشل عرض الطلب');
    }
  };

  const handleApproveRequest = async (request: ClientRequest) => {
    try {
      setTerminalOutput(prev => [...prev, `[SUCCESS] Approving request: ${request.id}`]);
      setClientRequests(prev => prev.map(req => 
        req.id === request.id ? { ...req, status: 'approved' } : req
      ));
      
      // إرسال موافقة للـ Agent
      if (socketRef.current?.connected) {
        socketRef.current.emit('request:approved', {
          requestId: request.id,
          clientId: request.clientId,
        });
      }
      
      setShowRequestModal(false);
      Alert.alert('تمت الموافقة', 'تمت الموافقة على الطلب بنجاح');
    } catch (error: any) {
      console.error('Error approving request:', error);
      Alert.alert('خطأ', 'فشل الموافقة على الطلب');
    }
  };

  const handleModifyRequest = async (request: ClientRequest, modifications: any) => {
    try {
      setTerminalOutput(prev => [...prev, `[MODIFY] Modifying request: ${request.id}`]);
      setClientRequests(prev => prev.map(req => 
        req.id === request.id ? { ...req, status: 'modified', ...modifications } : req
      ));
      
      // إرسال التعديلات للـ Agent
      if (socketRef.current?.connected) {
        socketRef.current.emit('request:modified', {
          requestId: request.id,
          clientId: request.clientId,
          modifications,
        });
      }
      
      setShowRequestModal(false);
      Alert.alert('تم التعديل', 'تم تعديل الطلب بنجاح');
    } catch (error: any) {
      console.error('Error modifying request:', error);
      Alert.alert('خطأ', 'فشل تعديل الطلب');
    }
  };

  const handleShowBuildPlan = async (request: ClientRequest) => {
    try {
      setTerminalOutput(prev => [...prev, `📋 Generating build plan for: ${request.id}`]);
      
      // جلب خطة البناء من Backend
      const response = await fetch(`${API_URL}/api/auto-builder/build-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: request.id,
          type: request.type,
          selectedItem: request.selectedItem,
          description: request.description,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setBuildPlan(data.plan);
        setShowBuildPlanModal(true);
      } else {
        Alert.alert('خطأ', data.error || 'فشل إنشاء خطة البناء');
      }
    } catch (error: any) {
      console.error('Error showing build plan:', error);
      Alert.alert('خطأ', 'فشل إنشاء خطة البناء');
    }
  };

  const handleApproveBuildPlan = async (request: ClientRequest) => {
    try {
      setTerminalOutput(prev => [...prev, `[SUCCESS] Approving build plan for: ${request.id}`]);
      setClientRequests(prev => prev.map(req => 
        req.id === request.id ? { ...req, status: 'building' } : req
      ));
      
      // بدء البناء
      const response = await fetch(`${API_URL}/api/auto-builder/build`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: request.id,
          clientId: request.clientId,
          projectName: request.selectedItem?.name || `project-${request.id}`,
          platforms: ['ios', 'android'],
          projectType: request.type,
          clientEmail: request.clientEmail,
          paymentStatus: request.paymentStatus,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setTerminalOutput(prev => [...prev, `[BUILD] Build started: ${data.buildId}`]);
        setIsBuilding(true);
        setShowBuildPlanModal(false);
      } else {
        Alert.alert('خطأ', data.error || 'فشل بدء البناء');
      }
    } catch (error: any) {
      console.error('Error approving build plan:', error);
      Alert.alert('خطأ', 'فشل بدء البناء');
    }
  };

  // التحكم في الخدمات
  // Fetch services status from API
  const fetchServicesStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/service-control/status`);
      const data = await res.json();
      if (data.success && data.services) {
        setServicesStatus(data.services);
      }
    } catch (err: any) {
      console.error('[AppBuilder] Fetch services status error:', err);
    }
  };

  // Handle service control action
  const handleServiceControl = async (service: 'backend' | 'cloudflare', action: 'start' | 'stop' | 'restart') => {
    setIsLoadingService(`${service}-${action}`);
    setCommandError(null);
    
    try {
      setTerminalOutput(prev => [...prev, `${action === 'start' ? '▶️' : action === 'stop' ? '⏹️' : '🔄'} ${action} ${service}...`]);
      
      const response = await fetch(`${API_URL}/api/service-control/${service}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.success) {
        // Refresh status after action
        await fetchServicesStatus();
        setTerminalOutput(prev => [...prev, `[SUCCESS] ${service} ${action}ed successfully`]);
        
        // Emit to kernel
        kernel.emit({
          type: 'service:action',
          data: { service, action, success: true }
        });
      } else {
        const errorMsg = data.message || data.error || `فشل ${action} ${service}`;
        setCommandError(errorMsg);
        setTerminalOutput(prev => [...prev, `[ERROR] Failed: ${errorMsg}`]);
        Alert.alert('خطأ', errorMsg);
      }
    } catch (error: any) {
      console.error(`Error ${action}ing ${service}:`, error);
      const errorMsg = error.message || `فشل ${action} ${service}`;
      setCommandError(errorMsg);
      setTerminalOutput(prev => [...prev, `[ERROR] Error: ${errorMsg}`]);
      Alert.alert('خطأ', errorMsg);
    } finally {
      setIsLoadingService(null);
    }
  };

  // الأوامر الصوتية للـ Builder
  const handleVoiceCommand = async (command: string) => {
    try {
      setTerminalOutput(prev => [...prev, `[VOICE] Voice command: ${command}`]);
      
      // استخدام GPT API لتحليل الأمر الصوتي
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `As a builder assistant, execute this command: ${command}. Return only the actual command to execute, nothing else.`,
          model: 'gpt-4o-mini',
        }),
      });
      
      const data = await response.json();
      if (data.reply) {
        const actualCommand = data.reply.trim();
        setTerminalInput(actualCommand);
        handleTerminalSubmit();
      }
    } catch (error: any) {
      console.error('Error processing voice command:', error);
      Alert.alert('خطأ', 'فشل معالجة الأمر الصوتي');
    }
  };

  // طلب الصلاحيات فقط عند تفعيل المستخدم
  const handleFileUpload = async (type: 'image' | 'file') => {
    // فحص الصلاحية أولاً
    if (type === 'image') {
      const permissionStatus = await permissionManager.checkPermission('camera');
      if (!permissionStatus.granted) {
        // فحص الصلاحية فقط - لا طلب تلقائي
        Alert.alert(
          tLang('permissionRequired') || 'تنبيه',
          tLang('imageAccessRequired') || 'يجب السماح بالوصول للصور من إعدادات التطبيق'
        );
        return;
      }
    }

    let result;
    if (type === 'image') {
      result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
    } else {
      result = await DocumentPicker.getDocumentAsync({});
    }
    
    if (!result.canceled) {
      setUploadedFiles(prev => [...prev, result.assets[0]]);
      const fileName = result.assets[0].name || 'Media File';
      setTerminalOutput(prev => [...prev, `[SYSTEM] Uploaded: ${fileName}`]);
      
      // إرسال للكور
      kernel.emit({
        type: 'user:input',
        data: { text: `file uploaded: ${fileName}`, type: 'app-builder', action: 'file_upload', fileName }
      });
      
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  // Ensure colors is a valid tuple for LinearGradient
  const gradientColors = Array.isArray(theme.background) && theme.background.length >= 2
    ? theme.background as [string, string, ...string[]]
    : ['#000408', '#001820', '#000408'] as [string, string, string];

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      {/* الشاشة الأولى: الخدمات (بالطول) */}
      <View style={styles.mainLayout}>
        
        {/* Panel 1: Services & Quick Commands */}
        <View style={[styles.panel, { borderRightWidth: 1, borderColor: getSafeColor(colors, 'primary') + '30' }]}>
          <Text style={[styles.panelTitle, { color: getSafeColor(colors, 'primary') }]}>
            {tLang('services') || 'الخدمات'}
          </Text>
          <ScrollView>
            {SERVICES.map(s => (
              <Pressable 
                key={s.id} 
                style={styles.serviceItem} 
                onPress={() => {
                  setSelectedGroup(s.id);
                  if (s.command) {
                    setTerminalInput(s.command);
                    handleTerminalSubmit();
                  }
                }}
              >
                <Icon name={s.icon} size={24} color={selectedGroup === s.id ? s.color : '#555'} />
                <Text style={[styles.serviceText, { color: selectedGroup === s.id ? '#fff' : '#555' }]}>{s.name}</Text>
              </Pressable>
            ))}
            
            <View style={styles.divider} />
            <Text style={[styles.panelTitle, { color: getSafeColor(colors, 'primary'), fontSize: 12, marginTop: 10 }]}>
              {tLang('quickCommands') || 'أوامر سريعة'}
            </Text>
            {QUICK_COMMANDS.map(cmd => (
              <Pressable
                key={cmd.id}
                style={[
                  styles.quickCommandBtn,
                  { borderColor: cmd.color + '50' }
                ]}
                onPress={() => {
                  if (cmd.command === 'clear') {
                    setTerminalOutput(['RARE 4N Kernel Initialized...', 'Waiting for commands...']);
                  } else {
                    setTerminalInput(cmd.command);
                    handleTerminalSubmit();
                  }
                }}
              >
                <Icon name={cmd.icon} size={18} color={cmd.color} />
                <Text style={[styles.quickCommandText, { color: cmd.color }]}>{cmd.name}</Text>
              </Pressable>
            ))}
            
            <View style={styles.uploadBox}>
              <Text style={styles.subTitle}>{tLang('upload') || 'الرفع'}</Text>
              <Pressable style={styles.uploadBtn} onPress={() => handleFileUpload('image')}>
                <Icon name="image" size={20} color={getSafeColor(colors, 'primary')} />
              </Pressable>
              <Pressable style={styles.uploadBtn} onPress={() => handleFileUpload('file')}>
                <Icon name="file-present" size={20} color={getSafeColor(colors, 'primary')} />
              </Pressable>
            </View>
          </ScrollView>
        </View>

        {/* Panel 2: Real Terminal */}
        <View style={[styles.panel, styles.terminalPanel]}>
          <View style={styles.panelHeader}>
            <Text style={[styles.panelTitle, { color: getSafeColor(colors, 'primary') }]}>RARE Terminal</Text>
            {isBuilding && <ActivityIndicator size="small" color={getSafeColor(colors, 'primary')} />}
          </View>
          {/* Error Display */}
          {commandError && (
            <View style={[styles.errorBanner, { backgroundColor: '#FF3B3020', borderColor: '#FF3B30' }]}>
              <Icon name="error" size={16} color="#FF3B30" />
              <Text style={[styles.errorText, { color: '#FF3B30' }]}>{commandError}</Text>
              <Pressable onPress={() => setCommandError(null)}>
                <Icon name="close" size={16} color="#FF3B30" />
              </Pressable>
            </View>
          )}
          
          <ScrollView 
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            style={styles.terminalScroll}
            contentContainerStyle={styles.terminalContent}
          >
            {terminalOutput.length === 0 ? (
              <Text style={[styles.terminalText, { opacity: 0.5 }]}>
                RARE 4N Terminal Ready...
              </Text>
            ) : (
              terminalOutput.map((line, i) => {
                // Color coding for different output types
                let textStyle = styles.terminalText;
                if (line.includes('[ERROR]') || line.includes('Error') || line.includes('Failed')) {
                  textStyle = [styles.terminalText, { color: '#FF3B30' }];
                } else if (line.includes('[SUCCESS]') || line.includes('Success')) {
                  textStyle = [styles.terminalText, { color: '#10A37F' }];
                } else if (line.includes('[WARNING]') || line.includes('Warning')) {
                  textStyle = [styles.terminalText, { color: '#FFCC00' }];
                } else if (line.startsWith('>')) {
                  textStyle = [styles.terminalText, { color: getSafeColor(colors, 'primary'), fontWeight: 'bold' }];
                } else if (line.includes('[BUILD]') || line.includes('Build')) {
                  textStyle = [styles.terminalText, { color: '#00EAFF' }];
                }
                
                return (
                  <Text key={i} style={textStyle}>
                    {line}
                  </Text>
                );
              })
            )}
          </ScrollView>
          <View style={styles.inputArea}>
            <Text style={{ color: getSafeColor(colors, 'primary'), fontSize: 14 }}>$ </Text>
            <TextInput
              style={[styles.input, commandError && { borderColor: '#FF3B30' }]}
              value={terminalInput}
              onChangeText={(text) => {
                setTerminalInput(text);
                setCommandError(null); // Clear error when typing
              }}
              onSubmitEditing={handleTerminalSubmit}
              placeholder={tLang('enterCommand') || 'Enter command...'}
              placeholderTextColor="#666"
              editable={!isBuilding && !isLoadingService}
            />
            {isLoadingService && (
              <ActivityIndicator size="small" color={getSafeColor(colors, 'primary')} style={{ marginLeft: 10 }} />
            )}
          </View>
        </View>

        {/* Panel 3: Libraries & Requests */}
        <View style={[styles.panel, { borderLeftWidth: 1, borderColor: getSafeColor(colors, 'primary') + '30' }]}>
          <Text style={[styles.panelTitle, { color: getSafeColor(colors, 'primary') }]}>
            {tLang('librariesAndRequests') || 'المكتبات والطلبات'}
          </Text>
          <ScrollView>
            <Text style={styles.groupLabel}>
              {tLang('activeLibraries') || 'المكتبات النشطة'}
            </Text>
            {libraries.map(lib => (
              <View key={lib.id} style={styles.libCard}>
                <Text style={styles.libName}>{lib.name}</Text>
                <Text style={styles.libType}>{lib.type}</Text>
              </View>
            ))}
            
            <Text style={[styles.groupLabel, { marginTop: 20 }]}>
              {tLang('clientRequests') || 'طلبات الكلاينت'}
            </Text>
            {clientRequests.length === 0 ? (
              <Text style={styles.emptyText}>لا توجد طلبات</Text>
            ) : (
              clientRequests.map(req => (
                <Pressable 
                  key={req.id} 
                  style={[styles.reqCard, req.status === 'pending' && { borderColor: getSafeColor(colors, 'primary'), borderWidth: 2 }]}
                  onPress={() => handleViewRequest(req)}
                >
                  <Text style={styles.reqClient}>{req.clientName || req.clientId}</Text>
                  <Text style={styles.reqType}>{req.type === 'template' ? 'تطبيق' : req.type === 'system' ? 'نظام' : 'ثيم'}</Text>
                  <View style={styles.reqActions}>
                    {req.status === 'pending' && (
                      <>
                        <Pressable 
                          style={[styles.actionBtn, { backgroundColor: getSafeColor(colors, 'primary') }]}
                          onPress={() => handleApproveRequest(req)}
                        >
                          <Text style={styles.actionBtnText}>موافقة</Text>
                        </Pressable>
                        <Pressable 
                          style={[styles.actionBtn, { backgroundColor: '#FFCC00' }]}
                          onPress={() => handleShowBuildPlan(req)}
                        >
                          <Text style={styles.actionBtnText}>خطة</Text>
                        </Pressable>
                      </>
                    )}
                    {req.status === 'approved' && (
                      <Pressable 
                        style={[styles.actionBtn, { backgroundColor: '#10A37F' }]}
                        onPress={() => handleShowBuildPlan(req)}
                      >
                        <Text style={styles.actionBtnText}>عرض خطة</Text>
                      </Pressable>
                    )}
                    {req.status === 'building' && (
                      <ActivityIndicator size="small" color={getSafeColor(colors, 'primary')} />
                    )}
                  </View>
                  <Text style={styles.reqStatus}>{req.status === 'pending' ? 'في الانتظار' : req.status === 'approved' ? 'موافق عليه' : req.status === 'building' ? 'قيد البناء' : 'مكتمل'}</Text>
                </Pressable>
              ))
            )}
            
            {/* أزرار التحكم في الخدمات */}
            <View style={styles.divider} />
            <Text style={[styles.groupLabel, { marginTop: 10 }]}>التحكم في الخدمات</Text>
            {(['backend', 'cloudflare'] as const).map(service => {
              const status = servicesStatus[service];
              const isRunning = status?.status === 'running' || status?.status === 'online';
              return (
                <View key={service} style={styles.serviceControlCard}>
                  <Text style={styles.serviceName}>
                    {service === 'backend' ? 'Backend' : 'Cloudflare Tunnel'}
                  </Text>
                  {status?.pid && (
                    <Text style={[styles.servicePid, { color: colors.text + '80' }]}>
                      PID: {status.pid}
                    </Text>
                  )}
                  <View style={styles.serviceControlActions}>
                    <Pressable 
                      style={[styles.controlBtn, { backgroundColor: isRunning ? '#FF3B30' : '#10A37F' }]}
                      onPress={() => handleServiceControl(service, isRunning ? 'stop' : 'start')}
                    >
                      <Icon name={isRunning ? 'stop' : 'play-arrow'} size={16} color="#fff" />
                    </Pressable>
                    <Pressable 
                      style={[styles.controlBtn, { backgroundColor: getSafeColor(colors, 'primary') }]}
                      onPress={() => handleServiceControl(service, 'restart')}
                      disabled={!isRunning}
                    >
                      <Icon name="refresh" size={16} color="#fff" />
                    </Pressable>
                  </View>
                  <Text style={[styles.serviceStatus, { color: isRunning ? '#10A37F' : '#FF3B30' }]}>
                    {isRunning ? '● تشغيل' : '○ متوقف'}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

      </View>

      {/* Modal: عرض طلب العميل */}
      {showRequestModal && selectedRequest && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: getSafeColor(colors, 'primary') }]}>
              طلب من: {selectedRequest.clientName}
            </Text>
            <Text style={styles.modalText}>النوع: {selectedRequest.type === 'template' ? 'تطبيق' : selectedRequest.type === 'system' ? 'نظام' : 'ثيم'}</Text>
            <Text style={styles.modalText}>الوصف: {selectedRequest.description}</Text>
            {selectedRequest.files && selectedRequest.files.length > 0 && (
              <View>
                <Text style={styles.modalText}>الملفات: {selectedRequest.files.length}</Text>
              </View>
            )}
            <View style={styles.modalActions}>
              <Pressable 
                style={[styles.modalBtn, { backgroundColor: getSafeColor(colors, 'primary') }]}
                onPress={() => handleApproveRequest(selectedRequest)}
              >
                <Text style={styles.modalBtnText}>موافقة</Text>
              </Pressable>
              <Pressable 
                style={[styles.modalBtn, { backgroundColor: '#FFCC00' }]}
                onPress={() => {
                  setShowRequestModal(false);
                  handleShowBuildPlan(selectedRequest);
                }}
              >
                <Text style={styles.modalBtnText}>عرض خطة</Text>
              </Pressable>
              <Pressable 
                style={[styles.modalBtn, { backgroundColor: '#FF3B30' }]}
                onPress={() => setShowRequestModal(false)}
              >
                <Text style={styles.modalBtnText}>إغلاق</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Modal: خطة البناء */}
      {showBuildPlanModal && buildPlan && selectedRequest && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: getSafeColor(colors, 'primary') }]}>
              خطة البناء
            </Text>
            <ScrollView style={styles.buildPlanScroll}>
              <Text style={styles.modalText}>اسم المشروع: {buildPlan.projectName}</Text>
              <Text style={styles.modalText}>المنصات: {buildPlan.platforms?.join(', ')}</Text>
              <Text style={styles.modalText}>المكونات: {buildPlan.components?.length || 0}</Text>
              {buildPlan.estimatedTime && (
                <Text style={styles.modalText}>الوقت المقدر: {buildPlan.estimatedTime}</Text>
              )}
            </ScrollView>
            <View style={styles.modalActions}>
              <Pressable 
                style={[styles.modalBtn, { backgroundColor: '#10A37F' }]}
                onPress={() => handleApproveBuildPlan(selectedRequest)}
              >
                <Text style={styles.modalBtnText}>موافقة وبناء</Text>
              </Pressable>
              <Pressable 
                style={[styles.modalBtn, { backgroundColor: '#FF3B30' }]}
                onPress={() => setShowBuildPlanModal(false)}
              >
                <Text style={styles.modalBtnText}>إلغاء</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainLayout: { flexDirection: 'row', height: '100%', paddingTop: 50 },
  panel: { flex: 1, padding: 10, backgroundColor: 'rgba(0,0,0,0.2)' },
  terminalPanel: { flex: 2, backgroundColor: '#000' },
  panelTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', letterSpacing: 1 },
  
  // Services Styles
  serviceItem: { alignItems: 'center', marginBottom: 20, padding: 10, borderRadius: 10 },
  serviceText: { fontSize: 9, marginTop: 5, fontWeight: 'bold' },
  uploadBox: { marginTop: 30, alignItems: 'center', borderTopWidth: 1, borderColor: '#222', paddingTop: 10 },
  subTitle: { color: '#555', fontSize: 10, marginBottom: 10 },
  uploadBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },

  // Terminal Styles
  terminalScroll: { flex: 1, backgroundColor: '#000' },
  terminalContent: { padding: 10, paddingBottom: 20 },
  terminalText: { color: '#00FF00', fontFamily: 'monospace', fontSize: 11, marginBottom: 2, lineHeight: 16 },
  inputArea: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderColor: '#222', 
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: '#0a0a0a',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 4,
    margin: 10,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
  },
  input: { flex: 1, color: '#fff', fontSize: 12, fontFamily: 'monospace' },
  panelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  // Lib & Req Styles
  groupLabel: { fontSize: 10, color: '#777', marginBottom: 10, textTransform: 'uppercase' },
  libCard: { backgroundColor: '#111', padding: 10, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#222' },
  libName: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  libType: { color: '#555', fontSize: 8 },
  reqCard: { backgroundColor: '#0a0a0a', padding: 10, borderRadius: 8, marginBottom: 10 },
  reqClient: { color: '#00EAFF', fontSize: 10, marginBottom: 5 },
  progressBg: { height: 4, backgroundColor: '#222', borderRadius: 2, marginBottom: 5 },
  progressFill: { height: '100%', borderRadius: 2 },
  reqStatus: { color: '#777', fontSize: 8, textAlign: 'right' },
  emptyText: { color: '#555', fontSize: 10, textAlign: 'center', marginTop: 20 },
  reqType: { color: '#888', fontSize: 8, marginTop: 2 },
  reqActions: { flexDirection: 'row', gap: 5, marginTop: 5 },
  actionBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  actionBtnText: { color: '#fff', fontSize: 8, fontWeight: 'bold' },
  serviceControlCard: { backgroundColor: '#111', padding: 12, borderRadius: 8, marginBottom: 10 },
  serviceHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  serviceName: { color: '#fff', fontSize: 11, fontWeight: 'bold', flex: 1 },
  servicePid: { fontSize: 9, fontFamily: 'monospace', marginBottom: 8, opacity: 0.7 },
  serviceControlActions: { flexDirection: 'row', gap: 8 },
  controlBtn: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  controlBtnDisabled: { opacity: 0.5 },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  serviceStatus: { fontSize: 9, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#222', marginVertical: 15 },
  quickCommandBtn: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    gap: 8,
  },
  quickCommandText: {
    fontSize: 10,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#0a0e14',
    padding: 20,
    borderRadius: 15,
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderWidth: 1,
    borderColor: '#1a1f2e',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    justifyContent: 'center',
  },
  modalBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buildPlanScroll: {
    maxHeight: height * 0.4,
  },
});