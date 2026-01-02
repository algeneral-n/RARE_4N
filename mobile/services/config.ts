/**
 * RARE 4N - Configuration
 * يستخدم المفاتيح من .env و EAS Secrets
 */

// الـ Backend URL من Environment Variables
const getApiUrl = () => {
  // أولوية: EXPO_PUBLIC_API_URL من EAS Secrets أو .env
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // في بيئة الويب (proxy)
  if (typeof window !== 'undefined' && window.location) {
    return window.location.origin;
  }
  
  // Fallback: Production API
  return 'https://api.zien-ai.app';
};

export const API_URL = getApiUrl();

// WebSocket Base URL
export const WS_BASE = API_URL;

// Other config constants
export const CONFIG = {
  apiUrl: API_URL,
  wsBase: WS_BASE,
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};

export default {
  API_URL,
  WS_BASE,
  CONFIG,
};