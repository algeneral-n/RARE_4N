/**
 * RARE 4N - Typography System
 * Defines font sizes, weights, and predefined text styles for the application.
 */

export const typography = {
  fontSize: {
    xs: 10, base: 14, md: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 32,
  },
  fontWeight: {
    regular: '400' as '400',
    medium: '500' as '500',
    semibold: '600' as '600',
    bold: '700' as '700',
  },
  lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.75 },
  fontFamily: { default: 'System', mono: 'monospace' },
};

export const textStyles = {
  h1: { fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, lineHeight: typography.lineHeight.tight },
  h2: { fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, lineHeight: typography.lineHeight.tight },
  body: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.regular, lineHeight: typography.lineHeight.normal },
  button: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semibold },
  code: { fontSize: typography.fontSize.base, fontFamily: typography.fontFamily.mono, lineHeight: typography.lineHeight.relaxed },
};

export const getTextStyle = (style: keyof typeof textStyles) => textStyles[style];

export default { typography, textStyles, getTextStyle };