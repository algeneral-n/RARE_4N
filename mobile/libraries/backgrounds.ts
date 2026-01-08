/**
 * RARE 4N - Backgrounds Library
 * مكتبة الخلفيات - NamesTunnel, RARE Character, وغيرها
 */

export interface Background {
  id: string;
  name: string;
  nameAr: string;
  type: 'tunnel' | 'character' | 'gradient' | 'pattern' | 'image' | 'video';
  component?: string;
  colors?: string[];
  description: string;
  descriptionAr: string;
}

export const BACKGROUNDS_LIBRARY: Background[] = [
  {
    id: 'names-tunnel',
    name: 'Names Tunnel',
    nameAr: 'نفق الأسماء',
    type: 'tunnel',
    component: 'NamesTunnel',
    description: 'Classic RARE identity - flowing names tunnel',
    descriptionAr: 'هوية رير الكلاسيكية - نفق الأسماء المتدفق',
  },
  {
    id: 'rare-character',
    name: 'RARE Character',
    nameAr: 'شخصية رير',
    type: 'character',
    component: 'RARECharacter',
    description: 'RARE Character background',
    descriptionAr: 'خلفية شخصية رير',
  },
  {
    id: 'cyber-gradient',
    name: 'Cyber Gradient',
    nameAr: 'تدرج سيبراني',
    type: 'gradient',
    colors: ['#000408', '#001820', '#000408'],
    description: 'Dark cyber gradient',
    descriptionAr: 'تدرج سيبراني داكن',
  },
  {
    id: 'neon-mesh',
    name: 'Neon Mesh',
    nameAr: 'شبكة نيون',
    type: 'pattern',
    colors: ['#00EAFF', '#AF52DE'],
    description: 'Neon mesh pattern',
    descriptionAr: 'نمط شبكة نيون',
  },
  {
    id: 'deep-space',
    name: 'Deep Space',
    nameAr: 'الفضاء العميق',
    type: 'gradient',
    colors: ['#000000', '#1a0033', '#000000'],
    description: 'Deep space nebula',
    descriptionAr: 'سديم الفضاء العميق',
  },
  {
    id: 'matrix-rain',
    name: 'Matrix Rain',
    nameAr: 'مطر الماتريكس',
    type: 'pattern',
    colors: ['#00FF41', '#000000'],
    description: 'Matrix code rain effect',
    descriptionAr: 'تأثير مطر كود الماتريكس',
  },
  {
    id: 'holographic',
    name: 'Holographic',
    nameAr: 'هولوغرافي',
    type: 'gradient',
    colors: ['#000408', '#0a0e14', '#1a1f2e'],
    description: 'Holographic shimmer',
    descriptionAr: 'لمعان هولوغرافي',
  },
  {
    id: 'circuit-board',
    name: 'Circuit Board',
    nameAr: 'لوحة الدوائر',
    type: 'pattern',
    colors: ['#00EAFF', '#000000'],
    description: 'Circuit board pattern',
    descriptionAr: 'نمط لوحة الدوائر',
  },
  {
    id: 'particle-field',
    name: 'Particle Field',
    nameAr: 'حقل الجسيمات',
    type: 'pattern',
    colors: ['#00EAFF', '#AF52DE', '#10A37F'],
    description: 'Animated particle field',
    descriptionAr: 'حقل جسيمات متحرك',
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    nameAr: 'الشفق القطبي',
    type: 'gradient',
    colors: ['#000408', '#001a2c', '#003d5c'],
    description: 'Aurora borealis effect',
    descriptionAr: 'تأثير الشفق القطبي',
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    nameAr: 'داكن بسيط',
    type: 'gradient',
    colors: ['#000000', '#1c1c1e'],
    description: 'Minimal dark background',
    descriptionAr: 'خلفية داكنة بسيطة',
  },
  {
    id: 'glass-morphism',
    name: 'Glass Morphism',
    nameAr: 'زجاج مورفي',
    type: 'gradient',
    colors: ['rgba(0,4,8,0.95)', 'rgba(0,24,32,0.9)', 'rgba(0,4,8,0.95)'],
    description: 'Glass morphism effect',
    descriptionAr: 'تأثير الزجاج المورفي',
  },
];

export const DEFAULT_BACKGROUND = BACKGROUNDS_LIBRARY[0];

export default BACKGROUNDS_LIBRARY;

 * RARE 4N - Backgrounds Library
 * مكتبة الخلفيات - NamesTunnel, RARE Character, وغيرها
 */

export interface Background {
  id: string;
  name: string;
  nameAr: string;
  type: 'tunnel' | 'character' | 'gradient' | 'pattern' | 'image' | 'video';
  component?: string;
  colors?: string[];
  description: string;
  descriptionAr: string;
}

export const BACKGROUNDS_LIBRARY: Background[] = [
  {
    id: 'names-tunnel',
    name: 'Names Tunnel',
    nameAr: 'نفق الأسماء',
    type: 'tunnel',
    component: 'NamesTunnel',
    description: 'Classic RARE identity - flowing names tunnel',
    descriptionAr: 'هوية رير الكلاسيكية - نفق الأسماء المتدفق',
  },
  {
    id: 'rare-character',
    name: 'RARE Character',
    nameAr: 'شخصية رير',
    type: 'character',
    component: 'RARECharacter',
    description: 'RARE Character background',
    descriptionAr: 'خلفية شخصية رير',
  },
  {
    id: 'cyber-gradient',
    name: 'Cyber Gradient',
    nameAr: 'تدرج سيبراني',
    type: 'gradient',
    colors: ['#000408', '#001820', '#000408'],
    description: 'Dark cyber gradient',
    descriptionAr: 'تدرج سيبراني داكن',
  },
  {
    id: 'neon-mesh',
    name: 'Neon Mesh',
    nameAr: 'شبكة نيون',
    type: 'pattern',
    colors: ['#00EAFF', '#AF52DE'],
    description: 'Neon mesh pattern',
    descriptionAr: 'نمط شبكة نيون',
  },
  {
    id: 'deep-space',
    name: 'Deep Space',
    nameAr: 'الفضاء العميق',
    type: 'gradient',
    colors: ['#000000', '#1a0033', '#000000'],
    description: 'Deep space nebula',
    descriptionAr: 'سديم الفضاء العميق',
  },
  {
    id: 'matrix-rain',
    name: 'Matrix Rain',
    nameAr: 'مطر الماتريكس',
    type: 'pattern',
    colors: ['#00FF41', '#000000'],
    description: 'Matrix code rain effect',
    descriptionAr: 'تأثير مطر كود الماتريكس',
  },
  {
    id: 'holographic',
    name: 'Holographic',
    nameAr: 'هولوغرافي',
    type: 'gradient',
    colors: ['#000408', '#0a0e14', '#1a1f2e'],
    description: 'Holographic shimmer',
    descriptionAr: 'لمعان هولوغرافي',
  },
  {
    id: 'circuit-board',
    name: 'Circuit Board',
    nameAr: 'لوحة الدوائر',
    type: 'pattern',
    colors: ['#00EAFF', '#000000'],
    description: 'Circuit board pattern',
    descriptionAr: 'نمط لوحة الدوائر',
  },
  {
    id: 'particle-field',
    name: 'Particle Field',
    nameAr: 'حقل الجسيمات',
    type: 'pattern',
    colors: ['#00EAFF', '#AF52DE', '#10A37F'],
    description: 'Animated particle field',
    descriptionAr: 'حقل جسيمات متحرك',
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    nameAr: 'الشفق القطبي',
    type: 'gradient',
    colors: ['#000408', '#001a2c', '#003d5c'],
    description: 'Aurora borealis effect',
    descriptionAr: 'تأثير الشفق القطبي',
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    nameAr: 'داكن بسيط',
    type: 'gradient',
    colors: ['#000000', '#1c1c1e'],
    description: 'Minimal dark background',
    descriptionAr: 'خلفية داكنة بسيطة',
  },
  {
    id: 'glass-morphism',
    name: 'Glass Morphism',
    nameAr: 'زجاج مورفي',
    type: 'gradient',
    colors: ['rgba(0,4,8,0.95)', 'rgba(0,24,32,0.9)', 'rgba(0,4,8,0.95)'],
    description: 'Glass morphism effect',
    descriptionAr: 'تأثير الزجاج المورفي',
  },
];

export const DEFAULT_BACKGROUND = BACKGROUNDS_LIBRARY[0];

export default BACKGROUNDS_LIBRARY;


