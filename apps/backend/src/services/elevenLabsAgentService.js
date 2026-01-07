/**
 * RARE 4N - ElevenLabs Agent Service
 * AI Voice Agent for client communication
 */

import axios from 'axios';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_INTEGRATION_ID = process.env.ELEVENLABS_INTEGRATION_ID || 'POISff1Do4B1q3oBd7EB';
const ELEVENLABS_CONVAI_AGENT_ID = process.env.ELEVENLABS_CONVAI_AGENT_ID || 'agent_0701kc4axybpf6fvak70xwfzpyka';
const ELEVENLABS_SYSTEM_AGENT_ID = process.env.ELEVENLABS_SYSTEM_AGENT_ID || '9401kb2n0gf5e2wtp4sfs8chdmk1';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

const headers = {
  'xi-api-key': ELEVENLABS_API_KEY,
  'Content-Type': 'application/json'
};

/**
 * Get agent configuration
 */
export async function getAgentConfig(agentId = ELEVENLABS_CONVAI_AGENT_ID) {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY not configured');
  }

  try {
    const response = await axios.get(
      `${ELEVENLABS_API_URL}/convai/agents/${agentId}`,
      { headers }
    );

    return {
      success: true,
      agent: response.data
    };
  } catch (error) {
    console.error('Get agent config error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create conversation session with agent
 * ✅ دعم جميع اللغات واللهجات
 * ✅ حفظ شخصية المستخدم
 */
export async function createConversation(agentId = ELEVENLABS_CONVAI_AGENT_ID, context = {}) {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY not configured');
  }

  try {
    // Get user profile if userId is provided
    let userProfile = null;
    if (context.userId) {
      const { getDatabase } = await import('../database/localDB.js');
      const db = getDatabase();
      if (db) {
        const stmt = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?');
        userProfile = stmt.get(context.userId);
      }
    }

    // ✅ التحقق من Voice ID للمالك (Nader)
    const OWNER_VOICE_ID = '6ZVgc4q9LWAloWbuwjuu';
    const isOwner = context.voice_id === OWNER_VOICE_ID || context.owner === true;

    // Build context with user profile
    const conversationContext = {
      clientName: context.clientName || userProfile?.name || (isOwner ? 'Nader' : 'عميل'),
      projectType: context.projectType || 'تطبيق',
      language: context.language || userProfile?.language || 'ar',
      dialect: context.dialect || userProfile?.dialect || null,
      phone: context.phone || userProfile?.phone || (isOwner ? '+971529211077' : null),
      email: context.email || userProfile?.email || (isOwner ? 'gm@zien-ai.app' : null),
      personality: userProfile?.personality_traits ? JSON.parse(userProfile.personality_traits) : null,
      preferences: userProfile?.preferences ? JSON.parse(userProfile.preferences) : null,
      // Webhook URL for events
      webhook_url: `${process.env.API_DOMAIN || 'https://api.zien-ai.app'}/api/elevenlabs/webhook`,
      // ✅ Owner context
      owner: isOwner,
      ownerName: isOwner ? 'Nader' : null,
      ownerVoiceId: isOwner ? OWNER_VOICE_ID : null,
      commandExecution: isOwner, // تفعيل تنفيذ الأوامر للمالك
      librariesAccess: true, // الوصول للمكتبات
      // Knowledge Base URLs
      libraries_api: `${process.env.API_DOMAIN || 'https://api.zien-ai.app'}/api/libraries`,
      templates_api: `${process.env.API_DOMAIN || 'https://api.zien-ai.app'}/api/libraries/templates`,
      systems_api: `${process.env.API_DOMAIN || 'https://api.zien-ai.app'}/api/libraries/systems`,
      themes_api: `${process.env.API_DOMAIN || 'https://api.zien-ai.app'}/api/libraries/themes`,
      ...context
    };

    const response = await axios.post(
      `${ELEVENLABS_API_URL}/convai/conversations`,
      {
        agent_id: agentId,
        context: conversationContext
      },
      { headers }
    );

    return {
      success: true,
      conversationId: response.data.conversation_id,
      sessionUrl: response.data.session_url
    };
  } catch (error) {
    console.error('Create conversation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send message to agent and get response
 */
export async function sendMessage(conversationId, message, voiceResponse = true) {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY not configured');
  }

  try {
    const response = await axios.post(
      `${ELEVENLABS_API_URL}/convai/conversations/${conversationId}/messages`,
      {
        text: message,
        generate_audio: voiceResponse
      },
      { headers }
    );

    return {
      success: true,
      response: response.data.response,
      audioUrl: response.data.audio_url,
      emotion: response.data.emotion
    };
  } catch (error) {
    console.error('Send message error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Text to Speech for client communication
 */
export async function textToSpeech(text, voiceId = '21m00Tcm4TlvDq8ikWAM') {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY not configured');
  }

  try {
    const response = await axios.post(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true
        }
      },
      {
        headers: {
          ...headers,
          'Accept': 'audio/mpeg'
        },
        responseType: 'arraybuffer'
      }
    );

    return {
      success: true,
      audio: response.data,
      contentType: 'audio/mpeg'
    };
  } catch (error) {
    console.error('TTS error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get available voices
 */
export async function getVoices() {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY not configured');
  }

  try {
    const response = await axios.get(
      `${ELEVENLABS_API_URL}/voices`,
      { headers }
    );

    return {
      success: true,
      voices: response.data.voices.map(v => ({
        id: v.voice_id,
        name: v.name,
        category: v.category,
        labels: v.labels,
        previewUrl: v.preview_url
      }))
    };
  } catch (error) {
    console.error('Get voices error:', error);
    return {
      success: false,
      error: error.message,
      voices: []
    };
  }
}

/**
 * Client greeting message
 */
export async function greetClient(clientName, language = 'ar') {
  const greetings = {
    ar: `مرحباً ${clientName}! أنا مساعد RARE 4N الصوتي. كيف يمكنني مساعدتك اليوم؟`,
    en: `Hello ${clientName}! I'm RARE 4N voice assistant. How can I help you today?`
  };

  const text = greetings[language] || greetings.ar;
  return await textToSpeech(text);
}

/**
 * Project update announcement
 */
export async function announceUpdate(clientName, projectName, status, language = 'ar') {
  const messages = {
    ar: {
      building: `${clientName}، نود إعلامك أن مشروعك ${projectName} قيد البناء الآن.`,
      completed: `${clientName}، مشروعك ${projectName} جاهز! يمكنك تحميله الآن.`,
      pending: `${clientName}، مشروعك ${projectName} في قائمة الانتظار وسيبدأ قريباً.`
    },
    en: {
      building: `${clientName}, your project ${projectName} is now being built.`,
      completed: `${clientName}, your project ${projectName} is ready! You can download it now.`,
      pending: `${clientName}, your project ${projectName} is queued and will start soon.`
    }
  };

  const text = messages[language]?.[status] || messages.ar[status] || messages.ar.pending;
  return await textToSpeech(text);
}

/**
 * Handle client inquiry
 */
export async function handleInquiry(inquiry, context = {}) {
  const agentId = context.agentId || ELEVENLABS_CONVAI_AGENT_ID;
  
  const conversation = await createConversation(agentId, context);
  
  if (!conversation.success) {
    const fallbackResponse = generateFallbackResponse(inquiry, context);
    return {
      success: true,
      response: fallbackResponse,
      fallback: true
    };
  }

  const response = await sendMessage(conversation.conversationId, inquiry, true);
  
  return {
    success: response.success,
    response: response.response,
    audioUrl: response.audioUrl,
    conversationId: conversation.conversationId
  };
}

/**
 * Generate fallback response without API
 */
function generateFallbackResponse(inquiry, context) {
  const inquiryLower = inquiry.toLowerCase();
  
  if (inquiryLower.includes('سعر') || inquiryLower.includes('price') || inquiryLower.includes('تكلفة')) {
    return 'الأسعار تبدأ من 500 دولار للتطبيقات البسيطة. للحصول على عرض سعر مخصص، يرجى وصف مشروعك بالتفصيل.';
  }
  
  if (inquiryLower.includes('وقت') || inquiryLower.includes('time') || inquiryLower.includes('موعد')) {
    return 'عادة يستغرق البناء من 24 إلى 72 ساعة حسب تعقيد المشروع.';
  }
  
  if (inquiryLower.includes('دعم') || inquiryLower.includes('support') || inquiryLower.includes('مساعدة')) {
    return 'فريق الدعم متاح على مدار الساعة. يمكنك التواصل معنا عبر البريد الإلكتروني أو الواتساب.';
  }

  return 'شكراً لتواصلك معنا! سيقوم فريقنا بالرد عليك في أقرب وقت.';
}

/**
 * Get agent status
 */
export async function getAgentStatus() {
  return {
    configured: !!ELEVENLABS_API_KEY,
    convaiAgentId: ELEVENLABS_CONVAI_AGENT_ID,
    systemAgentId: ELEVENLABS_SYSTEM_AGENT_ID,
    ready: !!ELEVENLABS_API_KEY && !!ELEVENLABS_CONVAI_AGENT_ID
  };
}

export default {
  getAgentConfig,
  createConversation,
  sendMessage,
  textToSpeech,
  getVoices,
  greetClient,
  announceUpdate,
  handleInquiry,
  getAgentStatus
};

    ready: !!ELEVENLABS_API_KEY && !!ELEVENLABS_CONVAI_AGENT_ID
  };
}

export default {
  getAgentConfig,
  createConversation,
  sendMessage,
  textToSpeech,
  getVoices,
  greetClient,
  announceUpdate,
  handleInquiry,
  getAgentStatus
};

    ready: !!ELEVENLABS_API_KEY && !!ELEVENLABS_CONVAI_AGENT_ID
  };
}

export default {
  getAgentConfig,
  createConversation,
  sendMessage,
  textToSpeech,
  getVoices,
  greetClient,
  announceUpdate,
  handleInquiry,
  getAgentStatus
};

    ready: !!ELEVENLABS_API_KEY && !!ELEVENLABS_CONVAI_AGENT_ID
  };
}

export default {
  getAgentConfig,
  createConversation,
  sendMessage,
  textToSpeech,
  getVoices,
  greetClient,
  announceUpdate,
  handleInquiry,
  getAgentStatus
};

    ready: !!ELEVENLABS_API_KEY && !!ELEVENLABS_CONVAI_AGENT_ID
  };
}

export default {
  getAgentConfig,
  createConversation,
  sendMessage,
  textToSpeech,
  getVoices,
  greetClient,
  announceUpdate,
  handleInquiry,
  getAgentStatus
};

    ready: !!ELEVENLABS_API_KEY && !!ELEVENLABS_CONVAI_AGENT_ID
  };
}

export default {
  getAgentConfig,
  createConversation,
  sendMessage,
  textToSpeech,
  getVoices,
  greetClient,
  announceUpdate,
  handleInquiry,
  getAgentStatus
};
