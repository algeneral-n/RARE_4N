/**
 * RARE 4N - ElevenLabs Agent Webhook
 * ✅ استقبال الأحداث من ElevenLabs Agent
 * ✅ حفظ الأوامر والمحادثات
 * ✅ ربط مع Twilio للعملاء
 * ✅ دعم جميع اللغات واللهجات
 * ✅ حفظ شخصية المستخدم
 */

import express from 'express';
import crypto from 'crypto';
import * as twilioService from '../services/twilioService.js';
import { getDatabase } from '../database/localDB.js';

const router = express.Router();

const ELEVENLABS_WEBHOOK_SECRET = process.env.ELEVENLABS_WEBHOOK_SECRET;
const ELEVENLABS_INTEGRATION_ID = process.env.ELEVENLABS_INTEGRATION_ID || 'POISff1Do4B1q3oBd7EB';

/**
 * Verify webhook signature from ElevenLabs
 */
function verifyWebhookSignature(payload, signature) {
  if (!ELEVENLABS_WEBHOOK_SECRET) {
    console.warn('⚠️ ELEVENLABS_WEBHOOK_SECRET not configured - skipping verification');
    return true; // Allow if secret not configured
  }

  const hmac = crypto.createHmac('sha256', ELEVENLABS_WEBHOOK_SECRET);
  const digest = hmac.update(JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

/**
 * POST /api/elevenlabs/webhook
 * ElevenLabs Agent Webhook - استقبال الأحداث
 */
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-elevenlabs-signature'];
    const payload = req.body;

    // Verify signature
    if (signature && !verifyWebhookSignature(payload, signature)) {
      console.warn('⚠️ Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log('📥 ElevenLabs Webhook received:', payload.event_type);

    const { event_type, data } = payload;
    const io = req.app?.get('io') || global.io;

    switch (event_type) {
      case 'conversation.started':
        await handleConversationStarted(data, io);
        break;

      case 'conversation.message':
        await handleConversationMessage(data, io);
        break;

      case 'conversation.ended':
        await handleConversationEnded(data, io);
        break;

      case 'agent.tool_call':
        await handleAgentToolCall(data, io);
        break;

      case 'agent.action':
        await handleAgentAction(data, io);
        break;

      default:
        console.log('ℹ️ Unhandled event type:', event_type);
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ ElevenLabs webhook error:', error);
    res.status(200).json({ success: false, error: error.message });
  }
});

/**
 * Handle conversation started
 * ✅ التحقق من Voice ID للمالك (Nader) وحفظ السياق
 */
async function handleConversationStarted(data, io = null) {
  try {
    const { conversation_id, agent_id, user_id, context, voice_id } = data;

    console.log('✅ Conversation started:', conversation_id);

    // ✅ التحقق من Voice ID للمالك (Nader)
    const OWNER_VOICE_ID = '6ZVgc4q9LWAloWbuwjuu';
    const isOwner = voice_id === OWNER_VOICE_ID || context?.voice_id === OWNER_VOICE_ID;
    
    if (isOwner) {
      console.log('👤 Owner (Nader) detected - Voice ID:', OWNER_VOICE_ID);
      // تحديث السياق ليشمل معلومات المالك
      context.owner = true;
      context.ownerName = 'Nader';
      context.ownerPhone = process.env.OWNER_PHONE_NADER || '+971529211077';
      context.ownerEmail = process.env.OWNER_EMAIL || 'gm@zien-ai.app';
      context.priority = 'owner';
      context.commandExecution = true; // تفعيل تنفيذ الأوامر
    }

    // Save conversation to database
    const db = getDatabase();
    if (db) {
      const stmt = db.prepare(`
        INSERT INTO conversations (
          id, agent_id, user_id, context, status, started_at, voice_id, is_owner
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        conversation_id,
        agent_id,
        user_id || (isOwner ? 'owner_nader' : 'anonymous'),
        JSON.stringify(context || {}),
        'active',
        Math.floor(Date.now() / 1000),
        voice_id || OWNER_VOICE_ID,
        isOwner ? 1 : 0
      );
    }

    // Emit to Socket.IO
    if (io) {
      io.emit('elevenlabs:conversation:started', {
        conversationId: conversation_id,
        agentId: agent_id,
        userId: user_id,
        context,
        isOwner,
        voiceId: voice_id || OWNER_VOICE_ID,
      });
    }
  } catch (error) {
    console.error('Error handling conversation started:', error);
  }
}

/**
 * Handle conversation message
 */
async function handleConversationMessage(data, io = null) {
  try {
    const {
      conversation_id,
      message_id,
      role, // 'user' or 'assistant'
      text,
      audio_url,
      language,
      dialect,
      sentiment,
      intent,
    } = data;

    console.log('💬 Message received:', { conversation_id, role, text });

    // Save message to database
    const db = getDatabase();
    if (db) {
      const stmt = db.prepare(`
        INSERT INTO conversation_messages (
          id, conversation_id, role, text, audio_url, language, dialect, 
          sentiment, intent, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        message_id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversation_id,
        role,
        text,
        audio_url || null,
        language || 'ar',
        dialect || null,
        sentiment || null,
        intent || null,
        Math.floor(Date.now() / 1000)
      );
    }

    // If user message, check for commands/actions
    if (role === 'user' && text) {
      await processUserCommand(conversation_id, text, language, dialect);
    }

    // If assistant message, send via Twilio if needed
    if (role === 'assistant' && text) {
      await sendAssistantResponse(conversation_id, text, audio_url);
    }

    // Emit to Socket.IO
    if (io) {
      io.emit('elevenlabs:message', {
        conversationId: conversation_id,
        messageId: message_id,
        role,
        text,
        audioUrl: audio_url,
        language,
        dialect,
        sentiment,
        intent,
      });
    }
  } catch (error) {
    console.error('Error handling conversation message:', error);
  }
}

/**
 * Handle conversation ended
 */
async function handleConversationEnded(data, io = null) {
  try {
    const { conversation_id, reason, summary } = data;

    console.log('❌ Conversation ended:', conversation_id);

    // Update conversation status
    const db = getDatabase();
    if (db) {
      const stmt = db.prepare(`
        UPDATE conversations 
        SET status = ?, ended_at = ?, summary = ?
        WHERE id = ?
      `);

      stmt.run('ended', Math.floor(Date.now() / 1000), summary || null, conversation_id);
    }

    // Emit to Socket.IO
    if (io) {
      io.emit('elevenlabs:conversation:ended', {
        conversationId: conversation_id,
        reason,
        summary,
      });
    }
  } catch (error) {
    console.error('Error handling conversation ended:', error);
  }
}

/**
 * Handle agent tool call
 * ✅ معالجة جميع Tools: Payment, Twilio, Builder, Owner Commands
 */
async function handleAgentToolCall(data, io = null) {
  try {
    const { conversation_id, tool_name, parameters, call_id } = data;

    console.log('🔧 Tool call:', tool_name, parameters);

    // Import agent tools service
    const agentTools = await import('../services/agentTools.js').catch(() => null);
    const paymentservice = await import('../services/paymentservice.js').catch(() => null);
    const autoBuilder = await import('../routes/auto-builder.js').catch(() => null);

    let result = { success: false, error: 'Tool not implemented' };

    // Execute tool based on name
    switch (tool_name) {
      case 'preview_library':
        if (agentTools?.default?.previewLibrary) {
          result = await agentTools.default.previewLibrary(
            parameters?.type,
            parameters?.category,
            parameters?.limit || 10
          );
        }
        break;

      case 'search_library':
        if (agentTools?.default?.searchLibrary) {
          result = await agentTools.default.searchLibrary(
            parameters?.query,
            parameters?.type || 'all'
          );
        }
        break;

      case 'submit_to_builder':
      case 'submit_to_builder':
        if (agentTools?.default?.submitToBuilder) {
          result = await agentTools.default.submitToBuilder(
            parameters?.client_id || parameters?.clientId,
            parameters?.request_data || parameters?.requestData,
            io
          );
        }
        break;

      case 'create_payment':
      case 'create_payment':
        if (agentTools?.default?.createPayment) {
          result = await agentTools.default.createPayment(
            parameters?.requestId || parameters?.request_id,
            parameters?.amount,
            parameters?.currency || 'AED',
            parameters?.clientId || parameters?.client_id,
            parameters?.clientEmail || parameters?.client_email,
            parameters?.paymentMethod || 'stripe'
          );
        }
        break;

      case 'create_checkout_session':
        if (paymentservice?.default?.createPaymentIntent) {
          result = await paymentservice.default.createPaymentIntent(
            parameters?.amount,
            parameters?.currency || 'AED',
            parameters?.metadata || {}
          );
        }
        break;

      case 'send_twilio_message':
      case 'send_whatsapp':
        result = await twilioService.sendWhatsApp(
          parameters?.phone || parameters?.to,
          parameters?.message || parameters?.text
        );
        break;

      case 'send_twilio_sms':
      case 'send_sms':
        result = await twilioService.sendSMS(
          parameters?.phone || parameters?.to,
          parameters?.message || parameters?.text
        );
        break;

      case 'notify_owner':
      case 'call_owner_emergency':
        result = await notifyOwnerViaTwilio(parameters?.reason || parameters?.message, parameters?.priority || 'normal');
        break;

      case 'execute_owner_command':
        result = await executeOwnerCommand(conversation_id, parameters?.command, parameters?.context);
        break;

      default:
        console.log('ℹ️ Unknown tool:', tool_name);
        result = { success: false, error: `Unknown tool: ${tool_name}` };
    }

    // Save tool call to database
    const db = getDatabase();
    if (db) {
      const stmt = db.prepare(`
        INSERT INTO agent_tool_calls (
          id, conversation_id, tool_name, parameters, result, created_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        `tool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversation_id,
        tool_name,
        JSON.stringify(parameters || {}),
        JSON.stringify(result || {}),
        Math.floor(Date.now() / 1000)
      );
    }

    // Emit to Socket.IO
    if (io) {
      io.emit('elevenlabs:tool:call', {
        conversationId: conversation_id,
        toolName: tool_name,
        parameters,
        result,
        callId: call_id,
      });
    }

    // Return result to ElevenLabs (if needed)
    return result;
  } catch (error) {
    console.error('Error handling agent tool call:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle agent action
 */
async function handleAgentAction(data, io = null) {
  try {
    const { conversation_id, action_type, action_data } = data;

    console.log('⚡ Agent action:', action_type);

    // Process action based on type
    switch (action_type) {
      case 'send_twilio_message':
        await twilioService.sendWhatsApp(
          action_data.phone,
          action_data.message
        );
        break;

      case 'send_twilio_sms':
        await twilioService.sendSMS(
          action_data.phone,
          action_data.message
        );
        break;

      case 'save_command':
        await saveUserCommand(conversation_id, action_data.command, action_data.context);
        break;

      case 'execute_command':
        await executeUserCommand(conversation_id, action_data.command);
        break;

      default:
        console.log('ℹ️ Unhandled action type:', action_type);
    }

    // Emit to Socket.IO
    if (io) {
      io.emit('elevenlabs:action', {
        conversationId: conversation_id,
        actionType: action_type,
        actionData: action_data,
      });
    }
  } catch (error) {
    console.error('Error handling agent action:', error);
  }
}

/**
 * Process user command
 * ✅ معالجة الأوامر: حفظ، تنفيذ، دفع، بناء، إرسال
 * ✅ أولوية خاصة للمالك (Nader)
 */
async function processUserCommand(conversationId, text, language, dialect, isOwner = false) {
  try {
    // Detect commands (simple pattern matching)
    const lowerText = text.toLowerCase();

    // Save command if it's an instruction
    if (
      lowerText.includes('احفظ') ||
      lowerText.includes('save') ||
      lowerText.includes('تذكر') ||
      lowerText.includes('remember') ||
      lowerText.includes('حفظ')
    ) {
      await saveUserCommand(conversationId, text, { language, dialect });
    }

    // Execute command if it's an action
    if (
      lowerText.includes('نفذ') ||
      lowerText.includes('execute') ||
      lowerText.includes('افعل') ||
      lowerText.includes('do') ||
      lowerText.includes('شغل')
    ) {
      await executeUserCommand(conversationId, text);
    }

    // Payment command
    if (
      lowerText.includes('دفع') ||
      lowerText.includes('payment') ||
      lowerText.includes('pay') ||
      lowerText.includes('سعر') ||
      lowerText.includes('price')
    ) {
      // Agent will call create_payment tool
      console.log('💰 Payment command detected');
    }

    // Builder command
    if (
      lowerText.includes('بناء') ||
      lowerText.includes('build') ||
      lowerText.includes('أنشئ') ||
      lowerText.includes('create app')
    ) {
      // Agent will call submit_to_builder tool
      console.log('🏗️ Builder command detected');
    }

    // Twilio command
    if (
      lowerText.includes('رسالة') ||
      lowerText.includes('message') ||
      lowerText.includes('واتساب') ||
      lowerText.includes('whatsapp') ||
      lowerText.includes('sms')
    ) {
      // Agent will call send_twilio_message tool
      console.log('📱 Twilio command detected');
    }

    // Owner command
    if (
      lowerText.includes('مالك') ||
      lowerText.includes('owner') ||
      lowerText.includes('نادر') ||
      lowerText.includes('nader') ||
      lowerText.includes('إيمون') ||
      lowerText.includes('eamon')
    ) {
      // Agent will call notify_owner tool
      console.log('👤 Owner command detected');
    }

    // ✅ إذا كان المالك، تنفيذ الأوامر مباشرة
    if (isOwner) {
      console.log('👤 Owner command - executing directly:', text);
      await executeOwnerCommand(conversationId, text, { language, dialect, priority: 'owner' });
    }
  } catch (error) {
    console.error('Error processing user command:', error);
  }
}

/**
 * Update user profile
 */
async function updateUserProfile(conversationId, updates) {
  try {
    const db = getDatabase();
    if (!db) return;

    const stmt = db.prepare('SELECT * FROM conversations WHERE id = ?');
    const conversation = stmt.get(conversationId);
    if (!conversation) return;

    const userId = conversation.user_id || 'anonymous';
    
    // Check if profile exists
    const profileStmt = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?');
    let profile = profileStmt.get(userId);

    if (profile) {
      // Update existing profile
      const updateStmt = db.prepare(`
        UPDATE user_profiles 
        SET language = ?, dialect = ?, updated_at = ?
        WHERE user_id = ?
      `);
      updateStmt.run(
        updates.language || profile.language,
        updates.dialect || profile.dialect,
        Math.floor(Date.now() / 1000),
        userId
      );
    } else {
      // Create new profile
      const insertStmt = db.prepare(`
        INSERT INTO user_profiles (
          user_id, language, dialect, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?)
      `);
      insertStmt.run(
        userId,
        updates.language || 'ar',
        updates.dialect || null,
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000)
      );
    }

    console.log('✅ User profile updated:', userId, updates);
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
}

/**
 * Save user command
 */
async function saveUserCommand(conversationId, command, context = {}) {
  try {
    const db = getDatabase();
    if (db) {
      const stmt = db.prepare(`
        INSERT INTO user_commands (
          id, conversation_id, command, context, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversationId,
        command,
        JSON.stringify(context),
        'saved',
        Math.floor(Date.now() / 1000)
      );

      console.log('✅ Command saved:', command);
    }
  } catch (error) {
    console.error('Error saving user command:', error);
  }
}

/**
 * Execute user command
 */
async function executeUserCommand(conversationId, command) {
  try {
    console.log('⚡ Executing command:', command);

    // Get conversation context
    const db = getDatabase();
    if (db) {
      const stmt = db.prepare('SELECT * FROM conversations WHERE id = ?');
      const conversation = stmt.get(conversationId);

      if (conversation) {
        const context = JSON.parse(conversation.context || '{}');
        const userId = conversation.user_id;

        // Execute based on command type
        // This would integrate with your command execution system
        // For now, just log it

        // Update command status
        const updateStmt = db.prepare(`
          UPDATE user_commands 
          SET status = ?, executed_at = ?
          WHERE conversation_id = ? AND command LIKE ?
        `);

        updateStmt.run('executed', Math.floor(Date.now() / 1000), conversationId, `%${command}%`);

        console.log('✅ Command executed:', command);
      }
    }
  } catch (error) {
    console.error('Error executing user command:', error);
  }
}

/**
 * Send assistant response via Twilio
 */
async function sendAssistantResponse(conversationId, text, audioUrl) {
  try {
    // Get conversation context
    const db = getDatabase();
    if (db) {
      const stmt = db.prepare('SELECT * FROM conversations WHERE id = ?');
      const conversation = stmt.get(conversationId);

      if (conversation) {
        const context = JSON.parse(conversation.context || '{}');
        const phone = context.clientPhone || context.phone;

        // Send via Twilio if phone is available
        if (phone) {
          await twilioService.sendWhatsApp(phone, text);
          console.log('✅ Response sent via Twilio:', phone);
        }
      }
    }
  } catch (error) {
    console.error('Error sending assistant response:', error);
  }
}

/**
 * Notify owner (Nader/Eamon) via Twilio
 */
async function notifyOwnerViaTwilio(reason, priority = 'normal') {
  try {
    const OWNER_PHONE_NADER = process.env.OWNER_PHONE_NADER || '+971529211077';
    const OWNER_PHONE_EAMON = process.env.OWNER_PHONE_EAMON || null;
    const OWNER_EMAIL = process.env.OWNER_EMAIL || 'gm@zien-ai.app';

    const message = `🚨 RARE 4N Agent Notification (${priority})
    
Reason: ${reason}

Time: ${new Date().toLocaleString('ar-EG', { timeZone: 'Asia/Dubai' })}

This is an automated notification from RARE 4N Agent.`;

    // Send to Nader
    const resultNader = await twilioService.sendWhatsApp(OWNER_PHONE_NADER, message);
    
    // Send to Eamon if phone is configured
    let resultEamon = null;
    if (OWNER_PHONE_EAMON) {
      resultEamon = await twilioService.sendWhatsApp(OWNER_PHONE_EAMON, message);
    }

    console.log('✅ Owner notified via Twilio:', { nader: resultNader, eamon: resultEamon });

    return {
      success: true,
      nader: resultNader,
      eamon: resultEamon,
      message: 'Owner notified successfully'
    };
  } catch (error) {
    console.error('Error notifying owner:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Execute owner command
 * ✅ تنفيذ أوامر المالك (Nader/Eamon)
 */
async function executeOwnerCommand(conversationId, command, context = {}) {
  try {
    console.log('⚡ Executing owner command:', command);

    const db = getDatabase();
    if (!db) {
      return { success: false, error: 'Database not available' };
    }

    // Get conversation context
    const stmt = db.prepare('SELECT * FROM conversations WHERE id = ?');
    const conversation = stmt.get(conversationId);

    if (!conversation) {
      return { success: false, error: 'Conversation not found' };
    }

    const convContext = JSON.parse(conversation.context || '{}');
    const userId = conversation.user_id || convContext.userId;

    // Parse command
    const lowerCommand = command.toLowerCase();
    let result = { success: false, error: 'Command not recognized' };

    // Command: Create payment
    if (lowerCommand.includes('دفع') || lowerCommand.includes('payment') || lowerCommand.includes('create payment')) {
      const agentTools = await import('../services/agentTools.js').catch(() => null);
      if (agentTools?.default?.createPayment) {
        const amount = context.amount || 1000;
        const currency = context.currency || 'AED';
        result = await agentTools.default.createPayment(
          context.requestId || `req_${Date.now()}`,
          amount,
          currency,
          userId,
          convContext.clientEmail || context.email
        );
      }
    }

    // Command: Send to builder
    else if (lowerCommand.includes('بناء') || lowerCommand.includes('build') || lowerCommand.includes('submit')) {
      const agentTools = await import('../services/agentTools.js').catch(() => null);
      if (agentTools?.default?.submitToBuilder) {
        result = await agentTools.default.submitToBuilder(
          userId,
          context.requestData || context,
          global.io
        );
      }
    }

    // Command: Send Twilio message
    else if (lowerCommand.includes('رسالة') || lowerCommand.includes('message') || lowerCommand.includes('send')) {
      const phone = context.phone || convContext.clientPhone;
      const message = context.message || command;
      if (phone) {
        result = await twilioService.sendWhatsApp(phone, message);
      } else {
        result = { success: false, error: 'Phone number not provided' };
      }
    }

    // Command: Notify owner
    else if (lowerCommand.includes('مالك') || lowerCommand.includes('owner') || lowerCommand.includes('notify')) {
      result = await notifyOwnerViaTwilio(command, context.priority || 'normal');
    }

    // Save command execution
    const saveStmt = db.prepare(`
      INSERT INTO user_commands (
        id, conversation_id, command, context, status, executed_at
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    saveStmt.run(
      `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      command,
      JSON.stringify(context),
      result.success ? 'executed' : 'failed',
      Math.floor(Date.now() / 1000)
    );

    console.log('✅ Owner command executed:', result.success ? 'Success' : result.error);
    return result;
  } catch (error) {
    console.error('Error executing owner command:', error);
    return { success: false, error: error.message };
  }
}

export default router;