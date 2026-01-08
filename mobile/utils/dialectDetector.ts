/**
 * RARE 4N - Arabic Dialect Detector
 * كشف اللهجات العربية من أول كلمة
 */

export type ArabicDialect = 
  | 'ar-EG'  // المصرية
  | 'ar-AE'  // الخليجية
  | 'ar-SY'  // الشامية
  | 'ar-MA'  // المغربية
  | 'ar-SD'  // السودانية
  | 'ar-IQ'  // العراقية
  | 'ar-YE'  // اليمنية
  | 'ar-TN'  // التونسية
  | 'ar-DZ'  // الجزائرية
  | 'ar-LB'  // اللبنانية
  | 'ar-SA'; // السعودية (افتراضي)

interface DialectPattern {
  dialect: ArabicDialect;
  patterns: string[];
  firstWords: string[];
}

const DIALECT_PATTERNS: DialectPattern[] = [
  {
    dialect: 'ar-EG',
    patterns: ['ازيك', 'ازاي', 'ايه', 'عايز', 'عندك', 'عندي', 'عشان', 'يعني', 'كده', 'كدا'],
    firstWords: ['ازيك', 'ازاي', 'ايه', 'عايز', 'عندك'],
  },
  {
    dialect: 'ar-AE',
    patterns: ['شلونك', 'شحالك', 'شو', 'وين', 'ليش', 'شلون', 'شحال', 'وينك'],
    firstWords: ['شلونك', 'شحالك', 'شو', 'وين'],
  },
  {
    dialect: 'ar-SY',
    patterns: ['كيفك', 'شو', 'وين', 'ليش', 'كيف', 'شلون', 'وينك'],
    firstWords: ['كيفك', 'شو', 'وين', 'ليش'],
  },
  {
    dialect: 'ar-MA',
    patterns: ['كيفاش', 'واش', 'فين', 'علاش', 'كيف', 'واش'],
    firstWords: ['كيفاش', 'واش', 'فين', 'علاش'],
  },
  {
    dialect: 'ar-SD',
    patterns: ['كيفك', 'شنو', 'وين', 'ليش', 'شنو', 'وينك'],
    firstWords: ['كيفك', 'شنو', 'وين', 'ليش'],
  },
  {
    dialect: 'ar-IQ',
    patterns: ['شلونك', 'شلون', 'وين', 'ليش', 'شلونك', 'وينك'],
    firstWords: ['شلونك', 'شلون', 'وين', 'ليش'],
  },
  {
    dialect: 'ar-YE',
    patterns: ['كيفك', 'شو', 'وين', 'ليش', 'كيف', 'وينك'],
    firstWords: ['كيفك', 'شو', 'وين', 'ليش'],
  },
  {
    dialect: 'ar-TN',
    patterns: ['كيفاش', 'واش', 'فين', 'علاش', 'كيف', 'واش'],
    firstWords: ['كيفاش', 'واش', 'فين', 'علاش'],
  },
  {
    dialect: 'ar-DZ',
    patterns: ['كيفاش', 'واش', 'فين', 'علاش', 'كيف', 'واش'],
    firstWords: ['كيفاش', 'واش', 'فين', 'علاش'],
  },
  {
    dialect: 'ar-LB',
    patterns: ['كيفك', 'شو', 'وين', 'ليش', 'كيف', 'وينك'],
    firstWords: ['كيفك', 'شو', 'وين', 'ليش'],
  },
];

export function detectDialect(text: string): ArabicDialect {
  if (!text || text.trim().length === 0) {
    return 'ar-SA';
  }

  const normalizedText = text.toLowerCase().trim();
  const firstWord = normalizedText.split(/\s+/)[0];

  // Check first word patterns
  for (const pattern of DIALECT_PATTERNS) {
    if (pattern.firstWords.some(word => firstWord.startsWith(word))) {
      return pattern.dialect;
    }
  }

  // Check full text patterns
  for (const pattern of DIALECT_PATTERNS) {
    if (pattern.patterns.some(word => normalizedText.includes(word))) {
      return pattern.dialect;
    }
  }

  return 'ar-SA';
}

export function getDialectName(dialect: ArabicDialect, isArabic: boolean = true): string {
  const names: Record<ArabicDialect, { ar: string; en: string }> = {
    'ar-EG': { ar: 'المصرية', en: 'Egyptian' },
    'ar-AE': { ar: 'الخليجية', en: 'Gulf' },
    'ar-SY': { ar: 'الشامية', en: 'Levantine' },
    'ar-MA': { ar: 'المغربية', en: 'Moroccan' },
    'ar-SD': { ar: 'السودانية', en: 'Sudanese' },
    'ar-IQ': { ar: 'العراقية', en: 'Iraqi' },
    'ar-YE': { ar: 'اليمنية', en: 'Yemeni' },
    'ar-TN': { ar: 'التونسية', en: 'Tunisian' },
    'ar-DZ': { ar: 'الجزائرية', en: 'Algerian' },
    'ar-LB': { ar: 'اللبنانية', en: 'Lebanese' },
    'ar-SA': { ar: 'السعودية', en: 'Saudi' },
  };

  return isArabic ? names[dialect].ar : names[dialect].en;
}

export default {
  detectDialect,
  getDialectName,
};

 * RARE 4N - Arabic Dialect Detector
 * كشف اللهجات العربية من أول كلمة
 */

export type ArabicDialect = 
  | 'ar-EG'  // المصرية
  | 'ar-AE'  // الخليجية
  | 'ar-SY'  // الشامية
  | 'ar-MA'  // المغربية
  | 'ar-SD'  // السودانية
  | 'ar-IQ'  // العراقية
  | 'ar-YE'  // اليمنية
  | 'ar-TN'  // التونسية
  | 'ar-DZ'  // الجزائرية
  | 'ar-LB'  // اللبنانية
  | 'ar-SA'; // السعودية (افتراضي)

interface DialectPattern {
  dialect: ArabicDialect;
  patterns: string[];
  firstWords: string[];
}

const DIALECT_PATTERNS: DialectPattern[] = [
  {
    dialect: 'ar-EG',
    patterns: ['ازيك', 'ازاي', 'ايه', 'عايز', 'عندك', 'عندي', 'عشان', 'يعني', 'كده', 'كدا'],
    firstWords: ['ازيك', 'ازاي', 'ايه', 'عايز', 'عندك'],
  },
  {
    dialect: 'ar-AE',
    patterns: ['شلونك', 'شحالك', 'شو', 'وين', 'ليش', 'شلون', 'شحال', 'وينك'],
    firstWords: ['شلونك', 'شحالك', 'شو', 'وين'],
  },
  {
    dialect: 'ar-SY',
    patterns: ['كيفك', 'شو', 'وين', 'ليش', 'كيف', 'شلون', 'وينك'],
    firstWords: ['كيفك', 'شو', 'وين', 'ليش'],
  },
  {
    dialect: 'ar-MA',
    patterns: ['كيفاش', 'واش', 'فين', 'علاش', 'كيف', 'واش'],
    firstWords: ['كيفاش', 'واش', 'فين', 'علاش'],
  },
  {
    dialect: 'ar-SD',
    patterns: ['كيفك', 'شنو', 'وين', 'ليش', 'شنو', 'وينك'],
    firstWords: ['كيفك', 'شنو', 'وين', 'ليش'],
  },
  {
    dialect: 'ar-IQ',
    patterns: ['شلونك', 'شلون', 'وين', 'ليش', 'شلونك', 'وينك'],
    firstWords: ['شلونك', 'شلون', 'وين', 'ليش'],
  },
  {
    dialect: 'ar-YE',
    patterns: ['كيفك', 'شو', 'وين', 'ليش', 'كيف', 'وينك'],
    firstWords: ['كيفك', 'شو', 'وين', 'ليش'],
  },
  {
    dialect: 'ar-TN',
    patterns: ['كيفاش', 'واش', 'فين', 'علاش', 'كيف', 'واش'],
    firstWords: ['كيفاش', 'واش', 'فين', 'علاش'],
  },
  {
    dialect: 'ar-DZ',
    patterns: ['كيفاش', 'واش', 'فين', 'علاش', 'كيف', 'واش'],
    firstWords: ['كيفاش', 'واش', 'فين', 'علاش'],
  },
  {
    dialect: 'ar-LB',
    patterns: ['كيفك', 'شو', 'وين', 'ليش', 'كيف', 'وينك'],
    firstWords: ['كيفك', 'شو', 'وين', 'ليش'],
  },
];

export function detectDialect(text: string): ArabicDialect {
  if (!text || text.trim().length === 0) {
    return 'ar-SA';
  }

  const normalizedText = text.toLowerCase().trim();
  const firstWord = normalizedText.split(/\s+/)[0];

  // Check first word patterns
  for (const pattern of DIALECT_PATTERNS) {
    if (pattern.firstWords.some(word => firstWord.startsWith(word))) {
      return pattern.dialect;
    }
  }

  // Check full text patterns
  for (const pattern of DIALECT_PATTERNS) {
    if (pattern.patterns.some(word => normalizedText.includes(word))) {
      return pattern.dialect;
    }
  }

  return 'ar-SA';
}

export function getDialectName(dialect: ArabicDialect, isArabic: boolean = true): string {
  const names: Record<ArabicDialect, { ar: string; en: string }> = {
    'ar-EG': { ar: 'المصرية', en: 'Egyptian' },
    'ar-AE': { ar: 'الخليجية', en: 'Gulf' },
    'ar-SY': { ar: 'الشامية', en: 'Levantine' },
    'ar-MA': { ar: 'المغربية', en: 'Moroccan' },
    'ar-SD': { ar: 'السودانية', en: 'Sudanese' },
    'ar-IQ': { ar: 'العراقية', en: 'Iraqi' },
    'ar-YE': { ar: 'اليمنية', en: 'Yemeni' },
    'ar-TN': { ar: 'التونسية', en: 'Tunisian' },
    'ar-DZ': { ar: 'الجزائرية', en: 'Algerian' },
    'ar-LB': { ar: 'اللبنانية', en: 'Lebanese' },
    'ar-SA': { ar: 'السعودية', en: 'Saudi' },
  };

  return isArabic ? names[dialect].ar : names[dialect].en;
}

export default {
  detectDialect,
  getDialectName,
};


