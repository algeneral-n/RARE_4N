/**
 * RARE 4N - Agent Tools
 * Tools للاجنت لمعاينة المكتبات وتسجيل الطلبات وإنشاء الدفع
 */

import { APP_TEMPLATES } from '../libraries/appTemplatesLibrary.js';
import { SYSTEMS_LIBRARY } from '../libraries/systemsLibrary.js';
import { THEMES_LIBRARY } from '../libraries/themesLibrary.js';

/**
 * Tool: preview_library - معاينة المكتبات
 */
export async function previewLibrary(type, category = null, limit = 10) {
  try {
    let results = [];
    
    switch (type) {
      case 'templates':
      case 'apps':
        results = APP_TEMPLATES;
        if (category) {
          results = results.filter(t => t.category === category);
        }
        break;
      case 'systems':
        results = SYSTEMS_LIBRARY;
        if (category) {
          results = results.filter(s => s.category === category);
        }
        break;
      case 'themes':
        results = THEMES_LIBRARY;
        break;
      default:
        return {
          success: false,
          error: 'نوع المكتبة غير صحيح. استخدم: templates, systems, themes'
        };
    }
    
    return {
      success: true,
      type,
      category: category || 'all',
      count: results.length,
      items: results.slice(0, limit).map(item => ({
        id: item.id,
        name: item.name,
        nameEn: item.nameEn,
        description: item.description || '',
        category: item.category || '',
        ...(item.primary && { primary: item.primary, secondary: item.secondary })
      }))
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Tool: submit_to_builder - إرسال الطلب للبيلدر
 */
export async function submitToBuilder(clientId, requestData, io = null) {
  try {
    const { type, selectedItem, clientName, clientEmail, clientPhone, description } = requestData;
    
    if (!type || !selectedItem || !clientName || !clientEmail) {
      return {
        success: false,
        error: 'بيانات ناقصة: type, selectedItem, clientName, clientEmail مطلوبة'
      };
    }
    
    const request = {
      id: `req_${Date.now()}`,
      clientId,
      clientName,
      clientEmail,
      clientPhone: clientPhone || '',
      type, // 'template', 'system', 'theme'
      selectedItem,
      description: description || '',
      status: 'pending_payment',
      createdAt: new Date().toISOString()
    };
    
    // إرسال للـ Auto Builder عبر Socket.IO
    if (io) {
      io.of('/auto-builder').emit('client:request', request);
    }
    
    // حساب السعر المقدر
    const estimatedPrice = calculatePrice(type, selectedItem);
    
    return {
      success: true,
      requestId: request.id,
      request,
      estimatedPrice,
      currency: 'AED',
      message: 'تم تسجيل طلبك بنجاح. جاري إنشاء عملية الدفع...'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Tool: create_payment - إنشاء عملية دفع (Stripe, Apple Pay, Bank Transfer)
 */
export async function createPayment(requestId, amount, currency = 'AED', clientId, clientEmail, paymentMethod = 'stripe') {
  try {
    if (!requestId || !amount || !clientId || !clientEmail) {
      return {
        success: false,
        error: 'بيانات ناقصة: requestId, amount, clientId, clientEmail مطلوبة'
      };
    }
    
    // استيراد خدمة الدفع
    const paymentMethodsService = await import('./paymentMethodsService.js');
    
    const result = await paymentMethodsService.createPayment(
      paymentMethod,
      amount,
      currency,
      {
        clientId,
        clientEmail,
        requestId,
        source: 'agent',
        type: 'project_build'
      }
    );
    
    if (result.success) {
      return {
        success: true,
        paymentMethod: result.method,
        paymentUrl: result.paymentUrl || null,
        sessionId: result.sessionId || null,
        bankDetails: result.bankDetails || null,
        contactInfo: result.contactInfo || null,
        message: paymentMethod === 'bank_transfer' 
          ? 'يرجى إتمام التحويل البنكي والتواصل معنا'
          : 'تم إنشاء عملية الدفع بنجاح'
      };
    } else {
      return result;
    }
  } catch (error) {
    console.error('Create payment error:', error);
    return {
      success: false,
      error: error.message || 'حدث خطأ في إنشاء عملية الدفع'
    };
  }
}

/**
 * Tool: search_library - البحث في المكتبات
 */
export async function searchLibrary(query, type = 'all') {
  try {
    if (!query || query.trim().length < 2) {
      return {
        success: false,
        error: 'يرجى إدخال كلمة بحث (حرفين على الأقل)'
      };
    }
    
    const searchTerm = query.toLowerCase();
    let results = {
      templates: [],
      systems: [],
      themes: []
    };
    
    if (type === 'all' || type === 'templates') {
      results.templates = APP_TEMPLATES.filter(t =>
        t.name.toLowerCase().includes(searchTerm) ||
        t.nameEn.toLowerCase().includes(searchTerm) ||
        (t.description && t.description.toLowerCase().includes(searchTerm))
      );
    }
    
    if (type === 'all' || type === 'systems') {
      results.systems = SYSTEMS_LIBRARY.filter(s =>
        s.name.toLowerCase().includes(searchTerm) ||
        s.nameEn.toLowerCase().includes(searchTerm) ||
        (s.description && s.description.toLowerCase().includes(searchTerm))
      );
    }
    
    if (type === 'all' || type === 'themes') {
      results.themes = THEMES_LIBRARY.filter(th =>
        th.name.toLowerCase().includes(searchTerm) ||
        th.nameEn.toLowerCase().includes(searchTerm)
      );
    }
    
    return {
      success: true,
      query,
      results: {
        templates: {
          count: results.templates.length,
          items: results.templates.slice(0, 10)
        },
        systems: {
          count: results.systems.length,
          items: results.systems.slice(0, 10)
        },
        themes: {
          count: results.themes.length,
          items: results.themes.slice(0, 10)
        }
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * حساب السعر المقدر
 */
function calculatePrice(type, selectedItem) {
  const basePrices = {
    template: 1000,
    system: 2000,
    theme: 500
  };
  
  const basePrice = basePrices[type] || 1000;
  
  // إضافة سعر إضافي حسب التعقيد
  const complexityMultiplier = selectedItem.category === 'ai' ? 1.5 : 1;
  
  return Math.round(basePrice * complexityMultiplier);
}

export default {
  previewLibrary,
  submitToBuilder,
  createPayment,
  searchLibrary
};

