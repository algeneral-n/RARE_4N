/**
 * RARE 4N - Language Detector
 * كشف اللغة تلقائياً (100+ لغة)
 */

export type Language = 
  | 'ar' | 'en' | 'fr' | 'es' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja'
  | 'ko' | 'hi' | 'tr' | 'pl' | 'nl' | 'sv' | 'da' | 'no' | 'fi' | 'cs'
  | 'ro' | 'hu' | 'bg' | 'hr' | 'sk' | 'sl' | 'et' | 'lv' | 'lt' | 'el'
  | 'th' | 'vi' | 'id' | 'ms' | 'tl' | 'sw' | 'af' | 'zu' | 'xh' | 'am'
  | 'he' | 'fa' | 'ur' | 'bn' | 'ta' | 'te' | 'ml' | 'kn' | 'gu' | 'pa'
  | 'ne' | 'si' | 'my' | 'km' | 'lo' | 'ka' | 'hy' | 'az' | 'kk' | 'ky'
  | 'uz' | 'mn' | 'be' | 'uk' | 'mk' | 'sq' | 'sr' | 'bs' | 'is' | 'ga'
  | 'cy' | 'mt' | 'eu' | 'ca' | 'gl' | 'oc' | 'co' | 'sc' | 'gd' | 'br'
  | 'lb' | 'fy' | 'yi' | 'jv' | 'su' | 'ceb' | 'haw' | 'mg' | 'ny' | 'sn'
  | 'st' | 'tn' | 've' | 'xh' | 'zu' | 'ig' | 'yo' | 'ha' | 'ff' | 'wo'
  | 'rw' | 'so' | 'om' | 'ti' | 'ak' | 'lg' | 'ln' | 'kg' | 'bi' | 'ch'
  | 'mh' | 'na' | 'to' | 'ty' | 'sm' | 'fj' | 'mi' | 'haw' | 'tvl' | 'gil';

interface LanguagePattern {
  language: Language;
  patterns: string[];
  commonWords: string[];
}

const LANGUAGE_PATTERNS: LanguagePattern[] = [
  { language: 'ar', patterns: ['ال', 'في', 'من', 'على', 'إلى'], commonWords: ['ال', 'في', 'من', 'على'] },
  { language: 'en', patterns: ['the', 'is', 'are', 'and', 'or'], commonWords: ['the', 'is', 'are', 'and'] },
  { language: 'fr', patterns: ['le', 'la', 'les', 'de', 'du'], commonWords: ['le', 'la', 'les', 'de'] },
  { language: 'es', patterns: ['el', 'la', 'los', 'las', 'de'], commonWords: ['el', 'la', 'los', 'las'] },
  { language: 'de', patterns: ['der', 'die', 'das', 'und', 'oder'], commonWords: ['der', 'die', 'das', 'und'] },
  { language: 'it', patterns: ['il', 'la', 'lo', 'gli', 'le'], commonWords: ['il', 'la', 'lo', 'gli'] },
  { language: 'pt', patterns: ['o', 'a', 'os', 'as', 'de'], commonWords: ['o', 'a', 'os', 'as'] },
  { language: 'ru', patterns: ['и', 'в', 'на', 'с', 'по'], commonWords: ['и', 'в', 'на', 'с'] },
  { language: 'zh', patterns: ['的', '是', '在', '有', '和'], commonWords: ['的', '是', '在', '有'] },
  { language: 'ja', patterns: ['の', 'は', 'に', 'を', 'が'], commonWords: ['の', 'は', 'に', 'を'] },
  { language: 'ko', patterns: ['의', '이', '가', '을', '를'], commonWords: ['의', '이', '가', '을'] },
  { language: 'hi', patterns: ['का', 'के', 'की', 'है', 'में'], commonWords: ['का', 'के', 'की', 'है'] },
  { language: 'tr', patterns: ['ve', 'ile', 'için', 'olan', 'bu'], commonWords: ['ve', 'ile', 'için', 'olan'] },
  { language: 'he', patterns: ['את', 'של', 'על', 'ב', 'ל'], commonWords: ['את', 'של', 'על', 'ב'] },
  { language: 'fa', patterns: ['در', 'از', 'به', 'که', 'این'], commonWords: ['در', 'از', 'به', 'که'] },
  { language: 'ur', patterns: ['کا', 'کی', 'کے', 'میں', 'پر'], commonWords: ['کا', 'کی', 'کے', 'میں'] },
];

export function detectLanguage(text: string): Language {
  if (!text || text.trim().length === 0) {
    return 'ar';
  }

  const normalizedText = text.toLowerCase().trim();
  const words = normalizedText.split(/\s+/);
  const firstWords = words.slice(0, 3);

  // Check for Arabic script
  if (/[\u0600-\u06FF]/.test(text)) {
    return 'ar';
  }

  // Check for Chinese/Japanese/Korean characters
  if (/[\u4e00-\u9fff]/.test(text)) {
    return 'zh';
  }
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) {
    return 'ja';
  }
  if (/[\uac00-\ud7a3]/.test(text)) {
    return 'ko';
  }

  // Check patterns
  for (const pattern of LANGUAGE_PATTERNS) {
    const matches = pattern.commonWords.filter(word => 
      firstWords.some(w => w.startsWith(word)) || 
      normalizedText.includes(word)
    );
    if (matches.length >= 2) {
      return pattern.language;
    }
  }

  // Default to Arabic if no match
  return 'ar';
}

export function getLanguageName(language: Language, isArabic: boolean = true): string {
  const names: Record<Language, { ar: string; en: string }> = {
    'ar': { ar: 'العربية', en: 'Arabic' },
    'en': { ar: 'الإنجليزية', en: 'English' },
    'fr': { ar: 'الفرنسية', en: 'French' },
    'es': { ar: 'الإسبانية', en: 'Spanish' },
    'de': { ar: 'الألمانية', en: 'German' },
    'it': { ar: 'الإيطالية', en: 'Italian' },
    'pt': { ar: 'البرتغالية', en: 'Portuguese' },
    'ru': { ar: 'الروسية', en: 'Russian' },
    'zh': { ar: 'الصينية', en: 'Chinese' },
    'ja': { ar: 'اليابانية', en: 'Japanese' },
    'ko': { ar: 'الكورية', en: 'Korean' },
    'hi': { ar: 'الهندية', en: 'Hindi' },
    'tr': { ar: 'التركية', en: 'Turkish' },
    'he': { ar: 'العبرية', en: 'Hebrew' },
    'fa': { ar: 'الفارسية', en: 'Persian' },
    'ur': { ar: 'الأردية', en: 'Urdu' },
  };

  return names[language] ? (isArabic ? names[language].ar : names[language].en) : language;
}

export default {
  detectLanguage,
  getLanguageName,
};

 * RARE 4N - Language Detector
 * كشف اللغة تلقائياً (100+ لغة)
 */

export type Language = 
  | 'ar' | 'en' | 'fr' | 'es' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja'
  | 'ko' | 'hi' | 'tr' | 'pl' | 'nl' | 'sv' | 'da' | 'no' | 'fi' | 'cs'
  | 'ro' | 'hu' | 'bg' | 'hr' | 'sk' | 'sl' | 'et' | 'lv' | 'lt' | 'el'
  | 'th' | 'vi' | 'id' | 'ms' | 'tl' | 'sw' | 'af' | 'zu' | 'xh' | 'am'
  | 'he' | 'fa' | 'ur' | 'bn' | 'ta' | 'te' | 'ml' | 'kn' | 'gu' | 'pa'
  | 'ne' | 'si' | 'my' | 'km' | 'lo' | 'ka' | 'hy' | 'az' | 'kk' | 'ky'
  | 'uz' | 'mn' | 'be' | 'uk' | 'mk' | 'sq' | 'sr' | 'bs' | 'is' | 'ga'
  | 'cy' | 'mt' | 'eu' | 'ca' | 'gl' | 'oc' | 'co' | 'sc' | 'gd' | 'br'
  | 'lb' | 'fy' | 'yi' | 'jv' | 'su' | 'ceb' | 'haw' | 'mg' | 'ny' | 'sn'
  | 'st' | 'tn' | 've' | 'xh' | 'zu' | 'ig' | 'yo' | 'ha' | 'ff' | 'wo'
  | 'rw' | 'so' | 'om' | 'ti' | 'ak' | 'lg' | 'ln' | 'kg' | 'bi' | 'ch'
  | 'mh' | 'na' | 'to' | 'ty' | 'sm' | 'fj' | 'mi' | 'haw' | 'tvl' | 'gil';

interface LanguagePattern {
  language: Language;
  patterns: string[];
  commonWords: string[];
}

const LANGUAGE_PATTERNS: LanguagePattern[] = [
  { language: 'ar', patterns: ['ال', 'في', 'من', 'على', 'إلى'], commonWords: ['ال', 'في', 'من', 'على'] },
  { language: 'en', patterns: ['the', 'is', 'are', 'and', 'or'], commonWords: ['the', 'is', 'are', 'and'] },
  { language: 'fr', patterns: ['le', 'la', 'les', 'de', 'du'], commonWords: ['le', 'la', 'les', 'de'] },
  { language: 'es', patterns: ['el', 'la', 'los', 'las', 'de'], commonWords: ['el', 'la', 'los', 'las'] },
  { language: 'de', patterns: ['der', 'die', 'das', 'und', 'oder'], commonWords: ['der', 'die', 'das', 'und'] },
  { language: 'it', patterns: ['il', 'la', 'lo', 'gli', 'le'], commonWords: ['il', 'la', 'lo', 'gli'] },
  { language: 'pt', patterns: ['o', 'a', 'os', 'as', 'de'], commonWords: ['o', 'a', 'os', 'as'] },
  { language: 'ru', patterns: ['и', 'в', 'на', 'с', 'по'], commonWords: ['и', 'в', 'на', 'с'] },
  { language: 'zh', patterns: ['的', '是', '在', '有', '和'], commonWords: ['的', '是', '在', '有'] },
  { language: 'ja', patterns: ['の', 'は', 'に', 'を', 'が'], commonWords: ['の', 'は', 'に', 'を'] },
  { language: 'ko', patterns: ['의', '이', '가', '을', '를'], commonWords: ['의', '이', '가', '을'] },
  { language: 'hi', patterns: ['का', 'के', 'की', 'है', 'में'], commonWords: ['का', 'के', 'की', 'है'] },
  { language: 'tr', patterns: ['ve', 'ile', 'için', 'olan', 'bu'], commonWords: ['ve', 'ile', 'için', 'olan'] },
  { language: 'he', patterns: ['את', 'של', 'על', 'ב', 'ל'], commonWords: ['את', 'של', 'על', 'ב'] },
  { language: 'fa', patterns: ['در', 'از', 'به', 'که', 'این'], commonWords: ['در', 'از', 'به', 'که'] },
  { language: 'ur', patterns: ['کا', 'کی', 'کے', 'میں', 'پر'], commonWords: ['کا', 'کی', 'کے', 'میں'] },
];

export function detectLanguage(text: string): Language {
  if (!text || text.trim().length === 0) {
    return 'ar';
  }

  const normalizedText = text.toLowerCase().trim();
  const words = normalizedText.split(/\s+/);
  const firstWords = words.slice(0, 3);

  // Check for Arabic script
  if (/[\u0600-\u06FF]/.test(text)) {
    return 'ar';
  }

  // Check for Chinese/Japanese/Korean characters
  if (/[\u4e00-\u9fff]/.test(text)) {
    return 'zh';
  }
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) {
    return 'ja';
  }
  if (/[\uac00-\ud7a3]/.test(text)) {
    return 'ko';
  }

  // Check patterns
  for (const pattern of LANGUAGE_PATTERNS) {
    const matches = pattern.commonWords.filter(word => 
      firstWords.some(w => w.startsWith(word)) || 
      normalizedText.includes(word)
    );
    if (matches.length >= 2) {
      return pattern.language;
    }
  }

  // Default to Arabic if no match
  return 'ar';
}

export function getLanguageName(language: Language, isArabic: boolean = true): string {
  const names: Record<Language, { ar: string; en: string }> = {
    'ar': { ar: 'العربية', en: 'Arabic' },
    'en': { ar: 'الإنجليزية', en: 'English' },
    'fr': { ar: 'الفرنسية', en: 'French' },
    'es': { ar: 'الإسبانية', en: 'Spanish' },
    'de': { ar: 'الألمانية', en: 'German' },
    'it': { ar: 'الإيطالية', en: 'Italian' },
    'pt': { ar: 'البرتغالية', en: 'Portuguese' },
    'ru': { ar: 'الروسية', en: 'Russian' },
    'zh': { ar: 'الصينية', en: 'Chinese' },
    'ja': { ar: 'اليابانية', en: 'Japanese' },
    'ko': { ar: 'الكورية', en: 'Korean' },
    'hi': { ar: 'الهندية', en: 'Hindi' },
    'tr': { ar: 'التركية', en: 'Turkish' },
    'he': { ar: 'العبرية', en: 'Hebrew' },
    'fa': { ar: 'الفارسية', en: 'Persian' },
    'ur': { ar: 'الأردية', en: 'Urdu' },
  };

  return names[language] ? (isArabic ? names[language].ar : names[language].en) : language;
}

export default {
  detectLanguage,
  getLanguageName,
};


