import { DB } from '../database/localDB.js';

/**
 * التحقق من بصمة صوت المالك (نادر)
 */
export const verifyOwnerVoice = (voiceId) => {
    const ownerVoiceId = '6ZVgc4q9LWAloWbuwjuu'; // بصمتك المعتمدة
    return voiceId === ownerVoiceId;
};

/**
 * تسجيل طلب عميل جديد في قاعدة البيانات المحلية
 */
export const registerNewClient = async (clientData) => {
    try {
        const newClient = {
            id: `rare_client_${Date.now()}`,
            ...clientData,
            createdAt: new Date().toISOString(),
            currency: 'AED' // العملة الافتراضية للإمارات
        };
        
        // حفظ في SQLite المحلي
        DB.users?.create?.(newClient); 
        return newClient;
    } catch (error) {
        throw new Error('فشل تسجيل العميل في الخدمة');
    }
};

export default { verifyOwnerVoice, registerNewClient };