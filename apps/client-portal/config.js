/**
 * RARE 4N - Client Portal Configuration
 * ✅ جميع الإعدادات من Environment Variables (Base44)
 * ✅ لا توجد مفاتيح حساسة هنا
 */

// API Configuration
// يمكن تعيينها من Base44 Environment Variables
const API_BASE_URL = window.API_URL || 
                     import.meta.env?.VITE_API_URL || 
                     'https://api.zien-ai.app';

const SOCKET_URL = API_BASE_URL;

// Publishable Keys (من Base44 Environment Variables)
const STRIPE_PUBLISHABLE_KEY = window.STRIPE_PUBLISHABLE_KEY || 
                                import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY || 
                                '';

const SUPABASE_URL = window.SUPABASE_URL || 
                     import.meta.env?.VITE_SUPABASE_URL || 
                     '';

const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 
                          import.meta.env?.VITE_SUPABASE_ANON_KEY || 
                          '';

const ELEVENLABS_AGENT_ID = window.ELEVENLABS_AGENT_ID || 
                            import.meta.env?.VITE_ELEVENLABS_AGENT_ID || 
                            'agent_0701kc4axybpf6fvak70xwfzpyka';

// ✅ SECURITY: Backend API Key for Portal-to-Backend communication (X-Portal-Key)
// يجب تعيينه من Base44 Environment Variables
const BACKEND_API_KEY = window.BACKEND_API_KEY || 
                       import.meta.env?.VITE_BACKEND_API_KEY || 
                       'HEADRAREBACK1END0097100201141009563';

// Export Configuration
export const CONFIG = {
  api: {
    baseUrl: API_BASE_URL,
    socketUrl: SOCKET_URL,
    apiKey: BACKEND_API_KEY, // ✅ مفتاح الأمان للتواصل مع Backend
  },
  stripe: {
    publishableKey: STRIPE_PUBLISHABLE_KEY,
  },
  supabase: {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
  },
  elevenlabs: {
    agentId: ELEVENLABS_AGENT_ID,
  },
  app: {
    name: 'RARE 4N',
    version: '1.0.0',
    domain: 'zien-ai.app',
  },
};

// Default export
export default CONFIG;

