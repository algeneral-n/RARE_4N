/**
 * RARE 4N - Client Portal Routes
 * الربط الشامل بين الواجهة، السوكيت، والأوتو بيلدر
 */
import express from 'express';
import portalService from '../services/clientPortalService.js';
import { requirePortalKey } from '../middleware/portalAuth.js';

const router = express.Router();

// ✅ SECURITY: Apply Portal API Key authentication to all Portal API routes
router.use(requirePortalKey);

/**
 * تسجيل عميل جديد (من خلال API)
 */
router.post('/register', async (req, res) => {
    try {
        const client = await portalService.registerNewClient(req.body);
        
        // إرسال إشعار فوري عبر Socket.IO إذا كان متاحاً
        const io = global.io;
        if (io) {
            io.of('/client-portal').emit('client:registered', {
                success: true,
                clientId: client.id,
                message: `مرحباً بك ${client.name} في رير 4N`
            });
            
            // إخطار الأوتو بيلدر بوجود عميل جديد
            io.of('/auto-builder').emit('client:connected', client);
        }

        res.json({ success: true, client });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
} );

/**
 * التحقق من بصمة صوت نادر لفتح "وضع المالك"
 */
router.post('/verify-owner', (req, res) => {
    const { voiceId } = req.body;
    const isOwner = portalService.verifyOwnerVoice(voiceId);
    
    if (isOwner) {
        res.json({ 
            success: true, 
            message: "أهلاً بك يا سيد نادر 👑", 
            mode: "OWNER",
            accessLevel: "FULL_CONTROL" 
        });
    } else {
        res.json({ 
            success: false, 
            mode: "CLIENT",
            message: "صلاحيات محدودة للعملاء" 
        });
    }
});

/**
 * مسار تقديم طلب بناء (Auto-Builder integration)
 */
router.post('/submit-request', async (req, res) => {
    const { clientId, requestDetails } = req.body;
    const io = global.io;

    const request = {
        id: `req_${Date.now()}`,
        clientId,
        details: requestDetails,
        status: 'pending_payment',
        currency: 'AED' //
    };

    if (io) {
        io.of('/auto-builder').emit('client:request', request);
    }

    res.json({ success: true, requestId: request.id });
});

/**
 * Initialize Client Portal Socket.IO
 */
function initializeClientPortal(io) {
  const clientNamespace = io.of('/client-portal');

  clientNamespace.on('connection', (socket) => {
    console.log('✅ Client Portal client connected:', socket.id);
    
    socket.on('client:register', (data) => {
      const clientId = data.clientId || `client_${Date.now()}`;
      socket.emit('client:registered', { success: true, clientId });
      io.of('/auto-builder').emit('client:connected', { ...data, clientId });
    });

    // ✅ استقبال أوامر من المالك للـ Agent
    socket.on('owner:command', (data) => {
      try {
        const { command, type, timestamp } = data;
        console.log('📨 Owner command to agent:', command);
        
        // إرسال الأمر للـ Agent عبر Socket
        socket.emit('agent:instruction', {
          command,
          type,
          timestamp: timestamp || new Date().toISOString(),
          source: 'owner',
        });
      } catch (error) {
        console.error('Error processing owner command:', error);
      }
    });

    // استقبال رسائل نصية من العميل
    socket.on('client:message', async (data) => {
      try {
        const { clientId, message, type = 'text' } = data;
        
        console.log(`📨 Client message from ${clientId}:`, message.substring(0, 50));
        
        // معالجة الرسالة مع الاجنت والـ tools
        const { default: agentTools } = await import('../services/agentTools.js');
        const { default: elevenLabsAgentService } = await import('../services/elevenLabsAgentService.js');
        
        // فحص إذا كانت الرسالة طلب معاينة مكتبة
        const messageLower = message.toLowerCase();
        let agentResponse = null;
        
        if (messageLower.includes('عرض') || messageLower.includes('معاينة') || messageLower.includes('مكتبة')) {
          // طلب معاينة المكتبات
          let libraryType = 'all';
          if (messageLower.includes('تطبيق') || messageLower.includes('template')) libraryType = 'templates';
          else if (messageLower.includes('نظام') || messageLower.includes('system')) libraryType = 'systems';
          else if (messageLower.includes('ثيم') || messageLower.includes('theme')) libraryType = 'themes';
          
          const preview = await agentTools.previewLibrary(libraryType, null, 10);
          
          if (preview.success) {
            const itemsList = preview.items.map(item => `- ${item.name} (${item.nameEn}): ${item.description || ''}`).join('\n');
            agentResponse = `إليك ${preview.count} عنصر من مكتبة ${libraryType === 'templates' ? 'التطبيقات' : libraryType === 'systems' ? 'الأنظمة' : 'الثيمات'}:\n\n${itemsList}\n\nاختر ما يناسبك وأخبرني.`;
          }
        } else if (messageLower.includes('بحث') || messageLower.includes('search')) {
          // طلب بحث
          const searchTerm = message.replace(/بحث|search|عن|about/gi, '').trim();
          if (searchTerm) {
            const searchResult = await agentTools.searchLibrary(searchTerm);
            if (searchResult.success) {
              const total = searchResult.results.templates.count + searchResult.results.systems.count + searchResult.results.themes.count;
              agentResponse = `وجدت ${total} نتيجة:\n\n`;
              
              if (searchResult.results.templates.count > 0) {
                agentResponse += `تطبيقات (${searchResult.results.templates.count}):\n`;
                searchResult.results.templates.items.forEach(t => {
                  agentResponse += `- ${t.name}\n`;
                });
              }
              
              if (searchResult.results.systems.count > 0) {
                agentResponse += `\nأنظمة (${searchResult.results.systems.count}):\n`;
                searchResult.results.systems.items.forEach(s => {
                  agentResponse += `- ${s.name}\n`;
                });
              }
              
              if (searchResult.results.themes.count > 0) {
                agentResponse += `\nثيمات (${searchResult.results.themes.count}):\n`;
                searchResult.results.themes.items.forEach(th => {
                  agentResponse += `- ${th.name}\n`;
                });
              }
            }
          }
        } else {
          // معالجة عادية مع الاجنت
          const result = await elevenLabsAgentService.handleInquiry(message, {
            clientId,
            type,
            timestamp: data.timestamp
          });
          
          agentResponse = result.response || result.message || 'شكراً على رسالتك. سأقوم بمعالجة طلبك قريباً.';
        }
        
        // إرسال الرد للعميل
        socket.emit('agent:response', {
          text: agentResponse || 'شكراً على رسالتك. سأقوم بمعالجة طلبك قريباً.',
          type: 'text'
        });
        
        // إرسال للـ Auto Builder إذا كان الطلب متعلق بمشروع
        if (messageLower.includes('مشروع') || messageLower.includes('تطبيق') || messageLower.includes('نظام')) {
          io.of('/auto-builder').emit('client:inquiry', {
            clientId,
            inquiry: message,
            timestamp: data.timestamp
          });
        }
      } catch (error) {
        console.error('Client message error:', error);
        socket.emit('agent:response', {
          text: 'عذراً، حدث خطأ في معالجة رسالتك. يرجى المحاولة مرة أخرى.',
          type: 'error'
        });
      }
    });
    
    // استقبال طلب إرسال للبيلدر من الاجنت
    socket.on('agent:submit_request', async (data) => {
      try {
        const { clientId, requestData, paymentMethod = 'stripe' } = data;
        const { default: agentTools } = await import('../services/agentTools.js');
        
        const result = await agentTools.submitToBuilder(clientId, requestData, io);
        
        if (result.success) {
          socket.emit('agent:response', {
            text: `تم تسجيل طلبك بنجاح! السعر المقدر: ${result.estimatedPrice} ${result.currency}. جاري إنشاء عملية الدفع...`,
            type: 'success'
          });
          
          // إنشاء عملية الدفع
          const payment = await agentTools.createPayment(
            result.requestId,
            result.estimatedPrice,
            result.currency,
            clientId,
            requestData.clientEmail,
            paymentMethod
          );
          
          if (payment.success) {
            socket.emit('agent:payment_ready', {
              paymentMethod: payment.paymentMethod,
              paymentUrl: payment.paymentUrl,
              sessionId: payment.sessionId,
              bankDetails: payment.bankDetails,
              contactInfo: payment.contactInfo,
              amount: result.estimatedPrice,
              currency: result.currency,
              requestId: result.requestId,
            });
          } else {
            socket.emit('agent:response', {
              text: `عذراً، حدث خطأ في إنشاء عملية الدفع: ${payment.error}. يرجى التواصل معنا: +971529211077 أو gm@zien-ai.app`,
              type: 'error'
            });
          }
        } else {
          socket.emit('agent:response', {
            text: `عذراً، حدث خطأ: ${result.error}. يرجى التواصل معنا: +971529211077 أو gm@zien-ai.app`,
            type: 'error'
          });
        }
      } catch (error) {
        console.error('Submit request error:', error);
        socket.emit('agent:response', {
          text: `حدث خطأ في تسجيل الطلب. يرجى التواصل معنا: +971529211077 أو gm@zien-ai.app`,
          type: 'error'
        });
      }
    });

    // استقبال رسائل صوتية من العميل
    socket.on('client:voice-message', async (data) => {
      try {
        const { clientId, audio, format } = data;
        
        console.log(`🎤 Voice message from ${clientId}`);
        
        // تحويل الصوت إلى نص
        const { transcribeWithWhisper } = await import('../services/whisperService.js');
        const transcription = await transcribeWithWhisper(audio, 'ar');
        
        // إرسال النص للاجنت
        socket.emit('client:message', {
          clientId,
          message: transcription,
          type: 'voice',
          timestamp: data.timestamp
        });
        
        // معالجة النص مع الاجنت
        const { default: elevenLabsAgentService } = await import('../services/elevenLabsAgentService.js');
        const result = await elevenLabsAgentService.handleInquiry(transcription, {
          clientId,
          type: 'voice',
          timestamp: data.timestamp
        });
        
        // إرسال الرد النصي والصوتي
        socket.emit('agent:response', {
          text: result.response || result.message || 'شكراً على رسالتك الصوتية.',
          type: 'text'
        });
        
        // توليد رد صوتي
        if (result.response) {
          const { textToSpeech } = await import('../services/elevenlabsService.js');
          const audioResponse = await textToSpeech(result.response, undefined, 'ar');
          
          socket.emit('agent:voice-response', {
            audio: audioResponse,
            text: result.response
          });
        }
      } catch (error) {
        console.error('Voice message error:', error);
        socket.emit('agent:response', {
          text: 'عذراً، حدث خطأ في معالجة الرسالة الصوتية.',
          type: 'error'
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Client Portal client disconnected:', socket.id);
    });
  });
  
  console.log('✅ Client Portal Socket.IO namespace initialized');
}

export default router;
export { initializeClientPortal };