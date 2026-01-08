/**
 * RARE 4N - Themes System Interface
 * المرجع النهائي لجميع الأنماط البصرية للنظام
 */

export interface Theme {
  id: string;
  name: string;
  nameAr: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string[];
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  cardStyle: 'glass' | 'solid' | 'gradient' | 'neumorphic';
  buttonStyle: '3d-glow' | 'flat' | 'outline' | 'neumorphic';
  borderGlow: boolean;
  blur: number;
  iconStyle: 'filled' | 'outline' | 'gradient';
  iconColor: string;
  fontFamily: string;
  fontSize: any;
}

export const DEFAULT_FONT_SIZE = { xs: 10, sm: 12, base: 14, md: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 32 };

// DEFAULT_THEME - الثيم الافتراضي المستخدم كـ fallback
export const DEFAULT_THEME: Theme = {
  id: 'rare-cyan',
  name: 'RARE Cyan',
  nameAr: 'سيان رير',
  primary: '#00EAFF',
  secondary: '#10A37F',
  accent: '#AF52DE',
  background: ['#000408', '#001820', '#000408'],
  surface: '#0a0e14',
  text: '#ffffff',
  textSecondary: '#888888',
  border: '#1a1f2e',
  cardStyle: 'glass',
  buttonStyle: '3d-glow',
  borderGlow: true,
  blur: 20,
  iconStyle: 'filled',
  iconColor: '#00EAFF',
  fontFamily: 'System',
  fontSize: DEFAULT_FONT_SIZE,
};

export const ALL_THEMES: Theme[] = [
  // 1️⃣ ثيم السيان الأصلي (RARE Classic)
  {
    id: 'rare-cyan',
    name: 'RARE Cyan',
    nameAr: 'سيان رير',
    primary: '#00eaff',
    secondary: '#0099cc',
    accent: '#FF6600',
    background: ['#0a0a0f', '#0d1117', '#0a0a0f'],
    surface: 'rgba(0, 234, 255, 0.1)',
    text: '#ffffff',
    textSecondary: '#aaaaaa',
    border: 'rgba(0, 234, 255, 0.3)',
    cardStyle: 'glass',
    buttonStyle: '3d-glow',
    borderGlow: true,
    blur: 20,
    iconStyle: 'filled',
    iconColor: '#00eaff',
    fontFamily: 'System',
    fontSize: DEFAULT_FONT_SIZE,
  },

  // 2️⃣ ثيم الفخامة العسكرية (Stealth Gold) - جديد
  {
    id: 'stealth-gold',
    name: 'Stealth Gold',
    nameAr: 'الذهب الخفي',
    primary: '#D4AF37', // ذهبي ملكي
    secondary: '#8B6B1E',
    accent: '#FFFFFF',
    background: ['#050505', '#1a1400', '#050505'],
    surface: 'rgba(212, 175, 55, 0.1)',
    text: '#FFFFFF',
    textSecondary: '#C0C0C0',
    border: 'rgba(212, 175, 55, 0.4)',
    cardStyle: 'glass',
    buttonStyle: '3d-glow',
    borderGlow: true,
    blur: 25,
    iconStyle: 'gradient',
    iconColor: '#D4AF37',
    fontFamily: 'System',
    fontSize: DEFAULT_FONT_SIZE,
  },

  // 3️⃣ ثيم الياقوت القرمزي (Royal Crimson) - جديد
  {
    id: 'royal-crimson',
    name: 'Royal Crimson',
    nameAr: 'الياقوت الملكي',
    primary: '#FF3B30', 
    secondary: '#800000',
    accent: '#00EAFF',
    background: ['#0a0000', '#250000', '#0a0000'],
    surface: 'rgba(255, 59, 48, 0.1)',
    text: '#ffffff',
    textSecondary: '#ffcccc',
    border: 'rgba(255, 59, 48, 0.3)',
    cardStyle: 'glass',
    buttonStyle: '3d-glow',
    borderGlow: true,
    blur: 20,
    iconStyle: 'filled',
    iconColor: '#FF3B30',
    fontFamily: 'System',
    fontSize: DEFAULT_FONT_SIZE,
  },

  // 4️⃣ ثيم الفضاء العميق (Deep Nebula) - جديد
  {
    id: 'deep-nebula',
    name: 'Deep Nebula',
    nameAr: 'سديم الفضاء',
    primary: '#AF52DE', // بنفسجي سديمي
    secondary: '#5856D6',
    accent: '#14F195',
    background: ['#020005', '#120025', '#020005'],
    surface: 'rgba(175, 82, 222, 0.15)',
    text: '#ffffff',
    textSecondary: '#d6bcf5',
    border: 'rgba(175, 82, 222, 0.4)',
    cardStyle: 'glass',
    buttonStyle: '3d-glow',
    borderGlow: true,
    blur: 30,
    iconStyle: 'filled',
    iconColor: '#AF52DE',
    fontFamily: 'System',
    fontSize: DEFAULT_FONT_SIZE,
  },

  // 5️⃣ ثيم البلاتين الجليدي (Icy Platinum) - جديد
  {
    id: 'icy-platinum',
    name: 'Icy Platinum',
    nameAr: 'البلاتين الجليدي',
    primary: '#E5E5EA', // بلاتيني مشرق
    secondary: '#8E8E93',
    accent: '#00EAFF',
    background: ['#000000', '#1c1c1e', '#000000'],
    surface: 'rgba(229, 229, 234, 0.05)',
    text: '#ffffff',
    textSecondary: '#8E8E93',
    border: 'rgba(229, 229, 234, 0.2)',
    cardStyle: 'glass',
    buttonStyle: '3d-glow',
    borderGlow: false,
    blur: 25,
    iconStyle: 'outline',
    iconColor: '#E5E5EA',
    fontFamily: 'System',
    fontSize: DEFAULT_FONT_SIZE,
  },

  // 6️⃣ ثيم زمرد الهاكر (Cyber Emerald) - جديد (بديل الماتريكس)
  {
    id: 'cyber-emerald',
    name: 'Cyber Emerald',
    nameAr: 'الزمرد السيبراني',
    primary: '#00FF41',
    secondary: '#008F11',
    accent: '#D4AF37',
    background: ['#000500', '#001a05', '#000500'],
    surface: 'rgba(0, 255, 65, 0.1)',
    text: '#ffffff',
    textSecondary: '#00FF41',
    border: 'rgba(0, 255, 65, 0.5)',
    cardStyle: 'glass',
    buttonStyle: '3d-glow',
    borderGlow: true,
    blur: 15,
    iconStyle: 'filled',
    iconColor: '#00FF41',
    fontFamily: 'System',
    fontSize: DEFAULT_FONT_SIZE,
  },
];

export default ALL_THEMES;