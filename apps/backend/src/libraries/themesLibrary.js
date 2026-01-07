/**
 * RARE 4N - Themes Library (v2)
 *
 * فكرة الـ Theme هنا: Tokens (ألوان/خطوط/ظلال/زجاج) + إعدادات UI جاهزة للويب.
 * تقدر تستخدمه:
 * - في الـ Portal (React)
 * - أو توليد CSS Variables
 */

export const LIBRARY_SCHEMA_VERSION = '2.0.0';

/**
 * ملاحظة مهمة:
 * fontFamily هنا "أسماء"... تفعيل الخط نفسه يكون عن طريق تحميله في CSS/HTML.
 */
export const THEMES_LIBRARY = Object.freeze([
  {
    id: 'rare-cinematic-glass',
    name: 'RARE Cinematic Glass',
    mode: 'dark',
    preview: {
      background: 'radial-gradient(1200px circle at 20% 10%, rgba(59,130,246,0.35), transparent 55%), radial-gradient(900px circle at 80% 20%, rgba(168,85,247,0.25), transparent 50%), linear-gradient(180deg, #0B1220 0%, #070A12 100%)',
      card: 'rgba(255,255,255,0.08)',
      accent: '#60A5FA',
    },
    typography: {
      fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial',
      headingWeight: 800,
      bodyWeight: 500,
    },
    radius: { sm: 12, md: 16, lg: 24, xl: 32 },
    shadow: {
      sm: '0 10px 30px rgba(0,0,0,0.25)',
      md: '0 20px 60px rgba(0,0,0,0.35)',
    },
    glass: {
      border: '1px solid rgba(255,255,255,0.14)',
      blur: 18,
      highlight: 'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))',
    },
    palette: {
      bg0: '#070A12',
      bg1: '#0B1220',
      surface0: 'rgba(255,255,255,0.06)',
      surface1: 'rgba(255,255,255,0.10)',
      border: 'rgba(255,255,255,0.14)',
      text0: '#F8FAFC',
      text1: 'rgba(248,250,252,0.78)',
      muted: 'rgba(248,250,252,0.55)',
      primary: '#60A5FA',
      secondary: '#A78BFA',
      success: '#34D399',
      warning: '#FBBF24',
      danger: '#FB7185',
    },
    components: {
      button: {
        primary: {
          background: 'linear-gradient(135deg, rgba(96,165,250,0.95), rgba(167,139,250,0.90))',
          text: '#071021',
        },
        ghost: { background: 'rgba(255,255,255,0.06)', text: 'rgba(248,250,252,0.86)' },
      },
      card: { background: 'rgba(255,255,255,0.07)', border: 'rgba(255,255,255,0.12)' },
      input: { background: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.14)' },
    },
    tags: ['cinematic', 'glass', 'dark', 'rare'],
  },
  {
    id: 'rare-ocean-blue',
    name: 'Ocean Blue',
    mode: 'dark',
    preview: { background: 'linear-gradient(180deg, #0B2A4A, #071628)', card: 'rgba(255,255,255,0.08)', accent: '#38BDF8' },
    typography: { fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial', headingWeight: 800, bodyWeight: 500 },
    radius: { sm: 10, md: 14, lg: 22, xl: 30 },
    shadow: { sm: '0 10px 30px rgba(0,0,0,0.20)', md: '0 18px 55px rgba(0,0,0,0.30)' },
    glass: { border: '1px solid rgba(255,255,255,0.14)', blur: 16, highlight: 'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))' },
    palette: {
      bg0: '#071628',
      bg1: '#0B2A4A',
      surface0: 'rgba(255,255,255,0.06)',
      surface1: 'rgba(255,255,255,0.10)',
      border: 'rgba(255,255,255,0.14)',
      text0: '#F8FAFC',
      text1: 'rgba(248,250,252,0.78)',
      muted: 'rgba(248,250,252,0.55)',
      primary: '#38BDF8',
      secondary: '#60A5FA',
      success: '#34D399',
      warning: '#FBBF24',
      danger: '#F97316',
    },
    components: {
      button: { primary: { background: 'linear-gradient(135deg, rgba(56,189,248,0.95), rgba(96,165,250,0.90))', text: '#071021' } },
      card: { background: 'rgba(255,255,255,0.07)', border: 'rgba(255,255,255,0.12)' },
      input: { background: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.14)' },
    },
    tags: ['blue', 'glass', 'dark'],
  },
  {
    id: 'rare-arctic-light',
    name: 'Arctic Light',
    mode: 'light',
    preview: { background: 'linear-gradient(180deg, #F8FAFC, #E5E7EB)', card: 'rgba(255,255,255,0.75)', accent: '#2563EB' },
    typography: { fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial', headingWeight: 800, bodyWeight: 500 },
    radius: { sm: 10, md: 14, lg: 22, xl: 30 },
    shadow: { sm: '0 10px 30px rgba(15,23,42,0.12)', md: '0 18px 55px rgba(15,23,42,0.16)' },
    glass: { border: '1px solid rgba(15,23,42,0.10)', blur: 12, highlight: 'linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.55))' },
    palette: {
      bg0: '#E5E7EB',
      bg1: '#F8FAFC',
      surface0: 'rgba(255,255,255,0.65)',
      surface1: 'rgba(255,255,255,0.85)',
      border: 'rgba(15,23,42,0.10)',
      text0: '#0F172A',
      text1: 'rgba(15,23,42,0.78)',
      muted: 'rgba(15,23,42,0.55)',
      primary: '#2563EB',
      secondary: '#0EA5E9',
      success: '#16A34A',
      warning: '#D97706',
      danger: '#DC2626',
    },
    components: {
      button: { primary: { background: 'linear-gradient(135deg, rgba(37,99,235,0.95), rgba(14,165,233,0.90))', text: '#FFFFFF' } },
      card: { background: 'rgba(255,255,255,0.78)', border: 'rgba(15,23,42,0.10)' },
      input: { background: 'rgba(255,255,255,0.85)', border: 'rgba(15,23,42,0.12)' },
    },
    tags: ['light', 'clean', 'arctic'],
  },
  {
    id: 'rare-emerald-night',
    name: 'Emerald Night',
    mode: 'dark',
    preview: { background: 'linear-gradient(180deg, #061316, #030A0C)', card: 'rgba(255,255,255,0.07)', accent: '#34D399' },
    typography: { fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial', headingWeight: 800, bodyWeight: 500 },
    radius: { sm: 12, md: 16, lg: 24, xl: 32 },
    shadow: { sm: '0 10px 30px rgba(0,0,0,0.25)', md: '0 20px 60px rgba(0,0,0,0.35)' },
    glass: { border: '1px solid rgba(255,255,255,0.12)', blur: 18, highlight: 'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.03))' },
    palette: {
      bg0: '#030A0C',
      bg1: '#061316',
      surface0: 'rgba(255,255,255,0.06)',
      surface1: 'rgba(255,255,255,0.10)',
      border: 'rgba(255,255,255,0.12)',
      text0: '#ECFEFF',
      text1: 'rgba(236,254,255,0.78)',
      muted: 'rgba(236,254,255,0.55)',
      primary: '#34D399',
      secondary: '#2DD4BF',
      success: '#22C55E',
      warning: '#FBBF24',
      danger: '#FB7185',
    },
    components: {
      button: { primary: { background: 'linear-gradient(135deg, rgba(52,211,153,0.95), rgba(45,212,191,0.90))', text: '#071021' } },
      card: { background: 'rgba(255,255,255,0.07)', border: 'rgba(255,255,255,0.12)' },
      input: { background: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)' },
    },
    tags: ['green', 'dark', 'glass'],
  },
  {
    id: 'rare-sunset',
    name: 'Sunset Studio',
    mode: 'dark',
    preview: { background: 'radial-gradient(900px circle at 15% 15%, rgba(251,146,60,0.35), transparent 55%), radial-gradient(900px circle at 80% 25%, rgba(236,72,153,0.25), transparent 55%), linear-gradient(180deg, #0D0B14, #070610)', card: 'rgba(255,255,255,0.07)', accent: '#FB923C' },
    typography: { fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial', headingWeight: 800, bodyWeight: 500 },
    radius: { sm: 12, md: 16, lg: 24, xl: 32 },
    shadow: { sm: '0 10px 30px rgba(0,0,0,0.25)', md: '0 20px 60px rgba(0,0,0,0.35)' },
    glass: { border: '1px solid rgba(255,255,255,0.12)', blur: 18, highlight: 'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.03))' },
    palette: {
      bg0: '#070610',
      bg1: '#0D0B14',
      surface0: 'rgba(255,255,255,0.06)',
      surface1: 'rgba(255,255,255,0.10)',
      border: 'rgba(255,255,255,0.12)',
      text0: '#FDF2F8',
      text1: 'rgba(253,242,248,0.78)',
      muted: 'rgba(253,242,248,0.55)',
      primary: '#FB923C',
      secondary: '#EC4899',
      success: '#34D399',
      warning: '#FBBF24',
      danger: '#FB7185',
    },
    components: {
      button: { primary: { background: 'linear-gradient(135deg, rgba(251,146,60,0.95), rgba(236,72,153,0.90))', text: '#071021' } },
      card: { background: 'rgba(255,255,255,0.07)', border: 'rgba(255,255,255,0.12)' },
      input: { background: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)' },
    },
    tags: ['orange', 'pink', 'dark', 'glass'],
  },
]);

export const THEMES_BY_ID = Object.freeze(Object.fromEntries(THEMES_LIBRARY.map((t) => [t.id, t])));

export function getThemeById(themeId) {
  return THEMES_BY_ID[themeId] || null;
}

/**
 * تحويل Theme إلى CSS Variables (string) — سهل تحطه داخل <style>
 */
export function themeToCSSVariables(theme) {
  const t = typeof theme === 'string' ? getThemeById(theme) : theme;
  if (!t) return '';

  const { palette, radius, glass, shadow, typography } = t;
  const vars = {
    '--rare-bg0': palette.bg0,
    '--rare-bg1': palette.bg1,
    '--rare-surface0': palette.surface0,
    '--rare-surface1': palette.surface1,
    '--rare-border': palette.border,
    '--rare-text0': palette.text0,
    '--rare-text1': palette.text1,
    '--rare-muted': palette.muted,
    '--rare-primary': palette.primary,
    '--rare-secondary': palette.secondary,
    '--rare-success': palette.success,
    '--rare-warning': palette.warning,
    '--rare-danger': palette.danger,
    '--rare-radius-sm': `${radius.sm}px`,
    '--rare-radius-md': `${radius.md}px`,
    '--rare-radius-lg': `${radius.lg}px`,
    '--rare-radius-xl': `${radius.xl}px`,
    '--rare-glass-border': glass.border,
    '--rare-glass-blur': `${glass.blur}px`,
    '--rare-shadow-sm': shadow.sm,
    '--rare-shadow-md': shadow.md,
    '--rare-font-family': typography.fontFamily,
  };

  return `:root{${Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(';')}}`;
}

export function listThemes({ mode } = {}) {
  return THEMES_LIBRARY.filter((t) => (mode ? t.mode === mode : true));
}

export default THEMES_LIBRARY;
