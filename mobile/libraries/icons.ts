/**
 * RARE 4N - Icons Library
 * مكتبة الأيقونات (100+ أيقونة)
 */

export interface Icon {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  description: string;
  descriptionAr: string;
}

export const ICONS_LIBRARY: Icon[] = [
  // Navigation
  { id: 'home', name: 'Home', nameAr: 'الرئيسية', category: 'navigation', description: 'Home icon', descriptionAr: 'أيقونة الرئيسية' },
  { id: 'menu', name: 'Menu', nameAr: 'القائمة', category: 'navigation', description: 'Menu icon', descriptionAr: 'أيقونة القائمة' },
  { id: 'back', name: 'Back', nameAr: 'رجوع', category: 'navigation', description: 'Back arrow', descriptionAr: 'سهم الرجوع' },
  { id: 'forward', name: 'Forward', nameAr: 'تقدم', category: 'navigation', description: 'Forward arrow', descriptionAr: 'سهم التقدم' },
  { id: 'close', name: 'Close', nameAr: 'إغلاق', category: 'navigation', description: 'Close icon', descriptionAr: 'أيقونة الإغلاق' },
  { id: 'settings', name: 'Settings', nameAr: 'الإعدادات', category: 'navigation', description: 'Settings gear', descriptionAr: 'ترس الإعدادات' },
  
  // Actions
  { id: 'add', name: 'Add', nameAr: 'إضافة', category: 'actions', description: 'Add icon', descriptionAr: 'أيقونة الإضافة' },
  { id: 'remove', name: 'Remove', nameAr: 'إزالة', category: 'actions', description: 'Remove icon', descriptionAr: 'أيقونة الإزالة' },
  { id: 'edit', name: 'Edit', nameAr: 'تعديل', category: 'actions', description: 'Edit icon', descriptionAr: 'أيقونة التعديل' },
  { id: 'delete', name: 'Delete', nameAr: 'حذف', category: 'actions', description: 'Delete icon', descriptionAr: 'أيقونة الحذف' },
  { id: 'save', name: 'Save', nameAr: 'حفظ', category: 'actions', description: 'Save icon', descriptionAr: 'أيقونة الحفظ' },
  { id: 'send', name: 'Send', nameAr: 'إرسال', category: 'actions', description: 'Send icon', descriptionAr: 'أيقونة الإرسال' },
  { id: 'search', name: 'Search', nameAr: 'بحث', category: 'actions', description: 'Search icon', descriptionAr: 'أيقونة البحث' },
  { id: 'filter', name: 'Filter', nameAr: 'تصفية', category: 'actions', description: 'Filter icon', descriptionAr: 'أيقونة التصفية' },
  
  // Communication
  { id: 'mic', name: 'Microphone', nameAr: 'ميكروفون', category: 'communication', description: 'Microphone icon', descriptionAr: 'أيقونة الميكروفون' },
  { id: 'mic-off', name: 'Mic Off', nameAr: 'ميكروفون معطل', category: 'communication', description: 'Microphone off', descriptionAr: 'ميكروفون معطل' },
  { id: 'call', name: 'Call', nameAr: 'مكالمة', category: 'communication', description: 'Phone call', descriptionAr: 'مكالمة هاتفية' },
  { id: 'message', name: 'Message', nameAr: 'رسالة', category: 'communication', description: 'Message icon', descriptionAr: 'أيقونة الرسالة' },
  { id: 'mail', name: 'Mail', nameAr: 'بريد', category: 'communication', description: 'Email icon', descriptionAr: 'أيقونة البريد' },
  { id: 'whatsapp', name: 'WhatsApp', nameAr: 'واتساب', category: 'communication', description: 'WhatsApp icon', descriptionAr: 'أيقونة واتساب' },
  
  // Apps
  { id: 'builder', name: 'Builder', nameAr: 'البناء', category: 'apps', description: 'App builder', descriptionAr: 'بناء التطبيقات' },
  { id: 'generator', name: 'Generator', nameAr: 'المولد', category: 'apps', description: 'File generator', descriptionAr: 'مولد الملفات' },
  { id: 'code', name: 'Code', nameAr: 'الكود', category: 'apps', description: 'Code icon', descriptionAr: 'أيقونة الكود' },
  { id: 'vault', name: 'Vault', nameAr: 'القبو', category: 'apps', description: 'Secure vault', descriptionAr: 'القبو الآمن' },
  { id: 'council', name: 'Council', nameAr: 'المجلس', category: 'apps', description: 'AI Council', descriptionAr: 'المجلس الذكي' },
  { id: 'assistant', name: 'Assistant', nameAr: 'المساعد', category: 'apps', description: 'AI Assistant', descriptionAr: 'المساعد الذكي' },
  { id: 'sos', name: 'SOS', nameAr: 'طوارئ', category: 'apps', description: 'Emergency SOS', descriptionAr: 'طوارئ' },
  { id: 'maps', name: 'Maps', nameAr: 'الخرائط', category: 'apps', description: 'Maps icon', descriptionAr: 'أيقونة الخرائط' },
  { id: 'carplay', name: 'CarPlay', nameAr: 'كاربلاي', category: 'apps', description: 'CarPlay mode', descriptionAr: 'وضع كاربلاي' },
  { id: 'control', name: 'Control', nameAr: 'التحكم', category: 'apps', description: 'Control room', descriptionAr: 'غرفة التحكم' },
  
  // Status
  { id: 'check', name: 'Check', nameAr: 'صح', category: 'status', description: 'Check mark', descriptionAr: 'علامة صح' },
  { id: 'error', name: 'Error', nameAr: 'خطأ', category: 'status', description: 'Error icon', descriptionAr: 'أيقونة الخطأ' },
  { id: 'warning', name: 'Warning', nameAr: 'تحذير', category: 'status', description: 'Warning icon', descriptionAr: 'أيقونة التحذير' },
  { id: 'info', name: 'Info', nameAr: 'معلومات', category: 'status', description: 'Info icon', descriptionAr: 'أيقونة المعلومات' },
  { id: 'success', name: 'Success', nameAr: 'نجاح', category: 'status', description: 'Success icon', descriptionAr: 'أيقونة النجاح' },
  
  // Media
  { id: 'play', name: 'Play', nameAr: 'تشغيل', category: 'media', description: 'Play icon', descriptionAr: 'أيقونة التشغيل' },
  { id: 'pause', name: 'Pause', nameAr: 'إيقاف', category: 'media', description: 'Pause icon', descriptionAr: 'أيقونة الإيقاف' },
  { id: 'stop', name: 'Stop', nameAr: 'توقف', category: 'media', description: 'Stop icon', descriptionAr: 'أيقونة التوقف' },
  { id: 'volume', name: 'Volume', nameAr: 'الصوت', category: 'media', description: 'Volume icon', descriptionAr: 'أيقونة الصوت' },
  { id: 'image', name: 'Image', nameAr: 'صورة', category: 'media', description: 'Image icon', descriptionAr: 'أيقونة الصورة' },
  { id: 'video', name: 'Video', nameAr: 'فيديو', category: 'media', description: 'Video icon', descriptionAr: 'أيقونة الفيديو' },
  
  // UI Elements
  { id: 'arrow-drop-down', name: 'Dropdown', nameAr: 'قائمة منسدلة', category: 'ui', description: 'Dropdown arrow', descriptionAr: 'سهم القائمة المنسدلة' },
  { id: 'arrow-drop-up', name: 'Drop Up', nameAr: 'قائمة علوية', category: 'ui', description: 'Drop up arrow', descriptionAr: 'سهم القائمة العلوية' },
  { id: 'expand-more', name: 'Expand', nameAr: 'توسيع', category: 'ui', description: 'Expand icon', descriptionAr: 'أيقونة التوسيع' },
  { id: 'expand-less', name: 'Collapse', nameAr: 'طي', category: 'ui', description: 'Collapse icon', descriptionAr: 'أيقونة الطي' },
  { id: 'more-vert', name: 'More', nameAr: 'المزيد', category: 'ui', description: 'More options', descriptionAr: 'خيارات أكثر' },
  { id: 'refresh', name: 'Refresh', nameAr: 'تحديث', category: 'ui', description: 'Refresh icon', descriptionAr: 'أيقونة التحديث' },
  { id: 'download', name: 'Download', nameAr: 'تحميل', category: 'ui', description: 'Download icon', descriptionAr: 'أيقونة التحميل' },
  { id: 'upload', name: 'Upload', nameAr: 'رفع', category: 'ui', description: 'Upload icon', descriptionAr: 'أيقونة الرفع' },
  
  // Security
  { id: 'lock', name: 'Lock', nameAr: 'قفل', category: 'security', description: 'Lock icon', descriptionAr: 'أيقونة القفل' },
  { id: 'unlock', name: 'Unlock', nameAr: 'فتح', category: 'security', description: 'Unlock icon', descriptionAr: 'أيقونة الفتح' },
  { id: 'security', name: 'Security', nameAr: 'أمان', category: 'security', description: 'Security icon', descriptionAr: 'أيقونة الأمان' },
  { id: 'shield', name: 'Shield', nameAr: 'درع', category: 'security', description: 'Shield icon', descriptionAr: 'أيقونة الدرع' },
  { id: 'key', name: 'Key', nameAr: 'مفتاح', category: 'security', description: 'Key icon', descriptionAr: 'أيقونة المفتاح' },
  
  // System
  { id: 'apps', name: 'Apps', nameAr: 'التطبيقات', category: 'system', description: 'Apps grid', descriptionAr: 'شبكة التطبيقات' },
  { id: 'dashboard', name: 'Dashboard', nameAr: 'لوحة التحكم', category: 'system', description: 'Dashboard icon', descriptionAr: 'أيقونة لوحة التحكم' },
  { id: 'terminal', name: 'Terminal', nameAr: 'الطرفية', category: 'system', description: 'Terminal icon', descriptionAr: 'أيقونة الطرفية' },
  { id: 'server', name: 'Server', nameAr: 'الخادم', category: 'system', description: 'Server icon', descriptionAr: 'أيقونة الخادم' },
  { id: 'database', name: 'Database', nameAr: 'قاعدة البيانات', category: 'system', description: 'Database icon', descriptionAr: 'أيقونة قاعدة البيانات' },
  
  // Social
  { id: 'person', name: 'Person', nameAr: 'شخص', category: 'social', description: 'Person icon', descriptionAr: 'أيقونة الشخص' },
  { id: 'account-circle', name: 'Account', nameAr: 'حساب', category: 'social', description: 'Account icon', descriptionAr: 'أيقونة الحساب' },
  { id: 'group', name: 'Group', nameAr: 'مجموعة', category: 'social', description: 'Group icon', descriptionAr: 'أيقونة المجموعة' },
  { id: 'groups', name: 'Groups', nameAr: 'المجموعات', category: 'social', description: 'Groups icon', descriptionAr: 'أيقونة المجموعات' },
  
  // Payment
  { id: 'payment', name: 'Payment', nameAr: 'دفع', category: 'payment', description: 'Payment icon', descriptionAr: 'أيقونة الدفع' },
  { id: 'credit-card', name: 'Credit Card', nameAr: 'بطاقة ائتمان', category: 'payment', description: 'Credit card', descriptionAr: 'بطاقة ائتمان' },
  { id: 'wallet', name: 'Wallet', nameAr: 'محفظة', category: 'payment', description: 'Wallet icon', descriptionAr: 'أيقونة المحفظة' },
  
  // More icons...
  { id: 'star', name: 'Star', nameAr: 'نجمة', category: 'ui', description: 'Star icon', descriptionAr: 'أيقونة النجمة' },
  { id: 'favorite', name: 'Favorite', nameAr: 'مفضل', category: 'ui', description: 'Favorite icon', descriptionAr: 'أيقونة المفضل' },
  { id: 'share', name: 'Share', nameAr: 'مشاركة', category: 'ui', description: 'Share icon', descriptionAr: 'أيقونة المشاركة' },
  { id: 'copy', name: 'Copy', nameAr: 'نسخ', category: 'ui', description: 'Copy icon', descriptionAr: 'أيقونة النسخ' },
  { id: 'cut', name: 'Cut', nameAr: 'قص', category: 'ui', description: 'Cut icon', descriptionAr: 'أيقونة القص' },
  { id: 'paste', name: 'Paste', nameAr: 'لصق', category: 'ui', description: 'Paste icon', descriptionAr: 'أيقونة اللصق' },
  { id: 'undo', name: 'Undo', nameAr: 'تراجع', category: 'ui', description: 'Undo icon', descriptionAr: 'أيقونة التراجع' },
  { id: 'redo', name: 'Redo', nameAr: 'إعادة', category: 'ui', description: 'Redo icon', descriptionAr: 'أيقونة الإعادة' },
  { id: 'zoom-in', name: 'Zoom In', nameAr: 'تكبير', category: 'ui', description: 'Zoom in', descriptionAr: 'تكبير' },
  { id: 'zoom-out', name: 'Zoom Out', nameAr: 'تصغير', category: 'ui', description: 'Zoom out', descriptionAr: 'تصغير' },
  { id: 'fullscreen', name: 'Fullscreen', nameAr: 'ملء الشاشة', category: 'ui', description: 'Fullscreen icon', descriptionAr: 'أيقونة ملء الشاشة' },
  { id: 'grid-view', name: 'Grid View', nameAr: 'عرض شبكي', category: 'ui', description: 'Grid view', descriptionAr: 'عرض شبكي' },
  { id: 'list-view', name: 'List View', nameAr: 'عرض قائمة', category: 'ui', description: 'List view', descriptionAr: 'عرض قائمة' },
  { id: 'tab', name: 'Tab', nameAr: 'تبويب', category: 'ui', description: 'Tab icon', descriptionAr: 'أيقونة التبويب' },
  { id: 'tunnel', name: 'Tunnel', nameAr: 'النفق', category: 'ui', description: 'Tunnel icon', descriptionAr: 'أيقونة النفق' },
  { id: 'emergency', name: 'Emergency', nameAr: 'طوارئ', category: 'apps', description: 'Emergency icon', descriptionAr: 'أيقونة الطوارئ' },
  { id: 'boot', name: 'Boot', nameAr: 'التهيئة', category: 'system', description: 'Boot icon', descriptionAr: 'أيقونة التهيئة' },
  { id: 'auto-awesome-mosaic', name: 'Mosaic', nameAr: 'فسيفساء', category: 'ui', description: 'Mosaic pattern', descriptionAr: 'نمط الفسيفساء' },
  { id: 'settings-input-component', name: 'Input', nameAr: 'إدخال', category: 'ui', description: 'Input component', descriptionAr: 'مكون الإدخال' },
  { id: 'keyboard-arrow-up', name: 'Arrow Up', nameAr: 'سهم علوي', category: 'ui', description: 'Arrow up', descriptionAr: 'سهم علوي' },
  { id: 'sparkles', name: 'Sparkles', nameAr: 'بريق', category: 'ui', description: 'Sparkles icon', descriptionAr: 'أيقونة البريق' },
  { id: 'car', name: 'Car', nameAr: 'سيارة', category: 'apps', description: 'Car icon', descriptionAr: 'أيقونة السيارة' },
  { id: 'map', name: 'Map', nameAr: 'خريطة', category: 'apps', description: 'Map icon', descriptionAr: 'أيقونة الخريطة' },
];

export const DEFAULT_ICON = ICONS_LIBRARY[0];

export default ICONS_LIBRARY;

 * RARE 4N - Icons Library
 * مكتبة الأيقونات (100+ أيقونة)
 */

export interface Icon {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  description: string;
  descriptionAr: string;
}

export const ICONS_LIBRARY: Icon[] = [
  // Navigation
  { id: 'home', name: 'Home', nameAr: 'الرئيسية', category: 'navigation', description: 'Home icon', descriptionAr: 'أيقونة الرئيسية' },
  { id: 'menu', name: 'Menu', nameAr: 'القائمة', category: 'navigation', description: 'Menu icon', descriptionAr: 'أيقونة القائمة' },
  { id: 'back', name: 'Back', nameAr: 'رجوع', category: 'navigation', description: 'Back arrow', descriptionAr: 'سهم الرجوع' },
  { id: 'forward', name: 'Forward', nameAr: 'تقدم', category: 'navigation', description: 'Forward arrow', descriptionAr: 'سهم التقدم' },
  { id: 'close', name: 'Close', nameAr: 'إغلاق', category: 'navigation', description: 'Close icon', descriptionAr: 'أيقونة الإغلاق' },
  { id: 'settings', name: 'Settings', nameAr: 'الإعدادات', category: 'navigation', description: 'Settings gear', descriptionAr: 'ترس الإعدادات' },
  
  // Actions
  { id: 'add', name: 'Add', nameAr: 'إضافة', category: 'actions', description: 'Add icon', descriptionAr: 'أيقونة الإضافة' },
  { id: 'remove', name: 'Remove', nameAr: 'إزالة', category: 'actions', description: 'Remove icon', descriptionAr: 'أيقونة الإزالة' },
  { id: 'edit', name: 'Edit', nameAr: 'تعديل', category: 'actions', description: 'Edit icon', descriptionAr: 'أيقونة التعديل' },
  { id: 'delete', name: 'Delete', nameAr: 'حذف', category: 'actions', description: 'Delete icon', descriptionAr: 'أيقونة الحذف' },
  { id: 'save', name: 'Save', nameAr: 'حفظ', category: 'actions', description: 'Save icon', descriptionAr: 'أيقونة الحفظ' },
  { id: 'send', name: 'Send', nameAr: 'إرسال', category: 'actions', description: 'Send icon', descriptionAr: 'أيقونة الإرسال' },
  { id: 'search', name: 'Search', nameAr: 'بحث', category: 'actions', description: 'Search icon', descriptionAr: 'أيقونة البحث' },
  { id: 'filter', name: 'Filter', nameAr: 'تصفية', category: 'actions', description: 'Filter icon', descriptionAr: 'أيقونة التصفية' },
  
  // Communication
  { id: 'mic', name: 'Microphone', nameAr: 'ميكروفون', category: 'communication', description: 'Microphone icon', descriptionAr: 'أيقونة الميكروفون' },
  { id: 'mic-off', name: 'Mic Off', nameAr: 'ميكروفون معطل', category: 'communication', description: 'Microphone off', descriptionAr: 'ميكروفون معطل' },
  { id: 'call', name: 'Call', nameAr: 'مكالمة', category: 'communication', description: 'Phone call', descriptionAr: 'مكالمة هاتفية' },
  { id: 'message', name: 'Message', nameAr: 'رسالة', category: 'communication', description: 'Message icon', descriptionAr: 'أيقونة الرسالة' },
  { id: 'mail', name: 'Mail', nameAr: 'بريد', category: 'communication', description: 'Email icon', descriptionAr: 'أيقونة البريد' },
  { id: 'whatsapp', name: 'WhatsApp', nameAr: 'واتساب', category: 'communication', description: 'WhatsApp icon', descriptionAr: 'أيقونة واتساب' },
  
  // Apps
  { id: 'builder', name: 'Builder', nameAr: 'البناء', category: 'apps', description: 'App builder', descriptionAr: 'بناء التطبيقات' },
  { id: 'generator', name: 'Generator', nameAr: 'المولد', category: 'apps', description: 'File generator', descriptionAr: 'مولد الملفات' },
  { id: 'code', name: 'Code', nameAr: 'الكود', category: 'apps', description: 'Code icon', descriptionAr: 'أيقونة الكود' },
  { id: 'vault', name: 'Vault', nameAr: 'القبو', category: 'apps', description: 'Secure vault', descriptionAr: 'القبو الآمن' },
  { id: 'council', name: 'Council', nameAr: 'المجلس', category: 'apps', description: 'AI Council', descriptionAr: 'المجلس الذكي' },
  { id: 'assistant', name: 'Assistant', nameAr: 'المساعد', category: 'apps', description: 'AI Assistant', descriptionAr: 'المساعد الذكي' },
  { id: 'sos', name: 'SOS', nameAr: 'طوارئ', category: 'apps', description: 'Emergency SOS', descriptionAr: 'طوارئ' },
  { id: 'maps', name: 'Maps', nameAr: 'الخرائط', category: 'apps', description: 'Maps icon', descriptionAr: 'أيقونة الخرائط' },
  { id: 'carplay', name: 'CarPlay', nameAr: 'كاربلاي', category: 'apps', description: 'CarPlay mode', descriptionAr: 'وضع كاربلاي' },
  { id: 'control', name: 'Control', nameAr: 'التحكم', category: 'apps', description: 'Control room', descriptionAr: 'غرفة التحكم' },
  
  // Status
  { id: 'check', name: 'Check', nameAr: 'صح', category: 'status', description: 'Check mark', descriptionAr: 'علامة صح' },
  { id: 'error', name: 'Error', nameAr: 'خطأ', category: 'status', description: 'Error icon', descriptionAr: 'أيقونة الخطأ' },
  { id: 'warning', name: 'Warning', nameAr: 'تحذير', category: 'status', description: 'Warning icon', descriptionAr: 'أيقونة التحذير' },
  { id: 'info', name: 'Info', nameAr: 'معلومات', category: 'status', description: 'Info icon', descriptionAr: 'أيقونة المعلومات' },
  { id: 'success', name: 'Success', nameAr: 'نجاح', category: 'status', description: 'Success icon', descriptionAr: 'أيقونة النجاح' },
  
  // Media
  { id: 'play', name: 'Play', nameAr: 'تشغيل', category: 'media', description: 'Play icon', descriptionAr: 'أيقونة التشغيل' },
  { id: 'pause', name: 'Pause', nameAr: 'إيقاف', category: 'media', description: 'Pause icon', descriptionAr: 'أيقونة الإيقاف' },
  { id: 'stop', name: 'Stop', nameAr: 'توقف', category: 'media', description: 'Stop icon', descriptionAr: 'أيقونة التوقف' },
  { id: 'volume', name: 'Volume', nameAr: 'الصوت', category: 'media', description: 'Volume icon', descriptionAr: 'أيقونة الصوت' },
  { id: 'image', name: 'Image', nameAr: 'صورة', category: 'media', description: 'Image icon', descriptionAr: 'أيقونة الصورة' },
  { id: 'video', name: 'Video', nameAr: 'فيديو', category: 'media', description: 'Video icon', descriptionAr: 'أيقونة الفيديو' },
  
  // UI Elements
  { id: 'arrow-drop-down', name: 'Dropdown', nameAr: 'قائمة منسدلة', category: 'ui', description: 'Dropdown arrow', descriptionAr: 'سهم القائمة المنسدلة' },
  { id: 'arrow-drop-up', name: 'Drop Up', nameAr: 'قائمة علوية', category: 'ui', description: 'Drop up arrow', descriptionAr: 'سهم القائمة العلوية' },
  { id: 'expand-more', name: 'Expand', nameAr: 'توسيع', category: 'ui', description: 'Expand icon', descriptionAr: 'أيقونة التوسيع' },
  { id: 'expand-less', name: 'Collapse', nameAr: 'طي', category: 'ui', description: 'Collapse icon', descriptionAr: 'أيقونة الطي' },
  { id: 'more-vert', name: 'More', nameAr: 'المزيد', category: 'ui', description: 'More options', descriptionAr: 'خيارات أكثر' },
  { id: 'refresh', name: 'Refresh', nameAr: 'تحديث', category: 'ui', description: 'Refresh icon', descriptionAr: 'أيقونة التحديث' },
  { id: 'download', name: 'Download', nameAr: 'تحميل', category: 'ui', description: 'Download icon', descriptionAr: 'أيقونة التحميل' },
  { id: 'upload', name: 'Upload', nameAr: 'رفع', category: 'ui', description: 'Upload icon', descriptionAr: 'أيقونة الرفع' },
  
  // Security
  { id: 'lock', name: 'Lock', nameAr: 'قفل', category: 'security', description: 'Lock icon', descriptionAr: 'أيقونة القفل' },
  { id: 'unlock', name: 'Unlock', nameAr: 'فتح', category: 'security', description: 'Unlock icon', descriptionAr: 'أيقونة الفتح' },
  { id: 'security', name: 'Security', nameAr: 'أمان', category: 'security', description: 'Security icon', descriptionAr: 'أيقونة الأمان' },
  { id: 'shield', name: 'Shield', nameAr: 'درع', category: 'security', description: 'Shield icon', descriptionAr: 'أيقونة الدرع' },
  { id: 'key', name: 'Key', nameAr: 'مفتاح', category: 'security', description: 'Key icon', descriptionAr: 'أيقونة المفتاح' },
  
  // System
  { id: 'apps', name: 'Apps', nameAr: 'التطبيقات', category: 'system', description: 'Apps grid', descriptionAr: 'شبكة التطبيقات' },
  { id: 'dashboard', name: 'Dashboard', nameAr: 'لوحة التحكم', category: 'system', description: 'Dashboard icon', descriptionAr: 'أيقونة لوحة التحكم' },
  { id: 'terminal', name: 'Terminal', nameAr: 'الطرفية', category: 'system', description: 'Terminal icon', descriptionAr: 'أيقونة الطرفية' },
  { id: 'server', name: 'Server', nameAr: 'الخادم', category: 'system', description: 'Server icon', descriptionAr: 'أيقونة الخادم' },
  { id: 'database', name: 'Database', nameAr: 'قاعدة البيانات', category: 'system', description: 'Database icon', descriptionAr: 'أيقونة قاعدة البيانات' },
  
  // Social
  { id: 'person', name: 'Person', nameAr: 'شخص', category: 'social', description: 'Person icon', descriptionAr: 'أيقونة الشخص' },
  { id: 'account-circle', name: 'Account', nameAr: 'حساب', category: 'social', description: 'Account icon', descriptionAr: 'أيقونة الحساب' },
  { id: 'group', name: 'Group', nameAr: 'مجموعة', category: 'social', description: 'Group icon', descriptionAr: 'أيقونة المجموعة' },
  { id: 'groups', name: 'Groups', nameAr: 'المجموعات', category: 'social', description: 'Groups icon', descriptionAr: 'أيقونة المجموعات' },
  
  // Payment
  { id: 'payment', name: 'Payment', nameAr: 'دفع', category: 'payment', description: 'Payment icon', descriptionAr: 'أيقونة الدفع' },
  { id: 'credit-card', name: 'Credit Card', nameAr: 'بطاقة ائتمان', category: 'payment', description: 'Credit card', descriptionAr: 'بطاقة ائتمان' },
  { id: 'wallet', name: 'Wallet', nameAr: 'محفظة', category: 'payment', description: 'Wallet icon', descriptionAr: 'أيقونة المحفظة' },
  
  // More icons...
  { id: 'star', name: 'Star', nameAr: 'نجمة', category: 'ui', description: 'Star icon', descriptionAr: 'أيقونة النجمة' },
  { id: 'favorite', name: 'Favorite', nameAr: 'مفضل', category: 'ui', description: 'Favorite icon', descriptionAr: 'أيقونة المفضل' },
  { id: 'share', name: 'Share', nameAr: 'مشاركة', category: 'ui', description: 'Share icon', descriptionAr: 'أيقونة المشاركة' },
  { id: 'copy', name: 'Copy', nameAr: 'نسخ', category: 'ui', description: 'Copy icon', descriptionAr: 'أيقونة النسخ' },
  { id: 'cut', name: 'Cut', nameAr: 'قص', category: 'ui', description: 'Cut icon', descriptionAr: 'أيقونة القص' },
  { id: 'paste', name: 'Paste', nameAr: 'لصق', category: 'ui', description: 'Paste icon', descriptionAr: 'أيقونة اللصق' },
  { id: 'undo', name: 'Undo', nameAr: 'تراجع', category: 'ui', description: 'Undo icon', descriptionAr: 'أيقونة التراجع' },
  { id: 'redo', name: 'Redo', nameAr: 'إعادة', category: 'ui', description: 'Redo icon', descriptionAr: 'أيقونة الإعادة' },
  { id: 'zoom-in', name: 'Zoom In', nameAr: 'تكبير', category: 'ui', description: 'Zoom in', descriptionAr: 'تكبير' },
  { id: 'zoom-out', name: 'Zoom Out', nameAr: 'تصغير', category: 'ui', description: 'Zoom out', descriptionAr: 'تصغير' },
  { id: 'fullscreen', name: 'Fullscreen', nameAr: 'ملء الشاشة', category: 'ui', description: 'Fullscreen icon', descriptionAr: 'أيقونة ملء الشاشة' },
  { id: 'grid-view', name: 'Grid View', nameAr: 'عرض شبكي', category: 'ui', description: 'Grid view', descriptionAr: 'عرض شبكي' },
  { id: 'list-view', name: 'List View', nameAr: 'عرض قائمة', category: 'ui', description: 'List view', descriptionAr: 'عرض قائمة' },
  { id: 'tab', name: 'Tab', nameAr: 'تبويب', category: 'ui', description: 'Tab icon', descriptionAr: 'أيقونة التبويب' },
  { id: 'tunnel', name: 'Tunnel', nameAr: 'النفق', category: 'ui', description: 'Tunnel icon', descriptionAr: 'أيقونة النفق' },
  { id: 'emergency', name: 'Emergency', nameAr: 'طوارئ', category: 'apps', description: 'Emergency icon', descriptionAr: 'أيقونة الطوارئ' },
  { id: 'boot', name: 'Boot', nameAr: 'التهيئة', category: 'system', description: 'Boot icon', descriptionAr: 'أيقونة التهيئة' },
  { id: 'auto-awesome-mosaic', name: 'Mosaic', nameAr: 'فسيفساء', category: 'ui', description: 'Mosaic pattern', descriptionAr: 'نمط الفسيفساء' },
  { id: 'settings-input-component', name: 'Input', nameAr: 'إدخال', category: 'ui', description: 'Input component', descriptionAr: 'مكون الإدخال' },
  { id: 'keyboard-arrow-up', name: 'Arrow Up', nameAr: 'سهم علوي', category: 'ui', description: 'Arrow up', descriptionAr: 'سهم علوي' },
  { id: 'sparkles', name: 'Sparkles', nameAr: 'بريق', category: 'ui', description: 'Sparkles icon', descriptionAr: 'أيقونة البريق' },
  { id: 'car', name: 'Car', nameAr: 'سيارة', category: 'apps', description: 'Car icon', descriptionAr: 'أيقونة السيارة' },
  { id: 'map', name: 'Map', nameAr: 'خريطة', category: 'apps', description: 'Map icon', descriptionAr: 'أيقونة الخريطة' },
];

export const DEFAULT_ICON = ICONS_LIBRARY[0];

export default ICONS_LIBRARY;


