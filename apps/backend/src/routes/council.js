/**
 * RARE 4N - Council Routes
 * مجلس الولاء والتقدم برئاسة RARE
 * GPT + Claude + Gemini
 */

import express from 'express';
import OpenAI from 'openai';
import axios from 'axios';

const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

/**
 * POST /api/council/debate
 * Start a debate with all AI models
 */
router.post('/debate', async (req, res) => {
  try {
    const { topic, context } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        error: 'الموضوع مطلوب',
      });
    }

    console.log('🏛️ Council debate started:', topic);

    const systemPrompt = `أنت عضو في مجلس RARE للذكاء الاصطناعي. 
رير هو رئيس المجلس ويتخذ القرار النهائي.
قدم رأيك بشكل مختصر ومفيد حول الموضوع التالي.
كن محترفاً ومباشراً.`;

    const userPrompt = `الموضوع: ${topic}\n${context ? `السياق: ${context}` : ''}`;

    const results = await Promise.allSettled([
      getGPTResponse(systemPrompt, userPrompt),
      getClaudeResponse(systemPrompt, userPrompt),
      getGeminiResponse(systemPrompt, userPrompt),
    ]);

    const gptResult = results[0];
    const claudeResult = results[1];
    const geminiResult = results[2];

    const opinions = [
      {
        model: 'GPT-4',
        role: 'المستشار التقني',
        opinion: gptResult.status === 'fulfilled' ? gptResult.value : 'غير متاح',
        available: gptResult.status === 'fulfilled',
      },
      {
        model: 'Claude',
        role: 'المستشار الأخلاقي',
        opinion: claudeResult.status === 'fulfilled' ? claudeResult.value : 'غير متاح',
        available: claudeResult.status === 'fulfilled',
      },
      {
        model: 'Gemini',
        role: 'المستشار الإبداعي',
        opinion: geminiResult.status === 'fulfilled' ? geminiResult.value : 'غير متاح',
        available: geminiResult.status === 'fulfilled',
      },
    ];

    const rareDecision = await getRAREDecision(topic, opinions);

    res.json({
      success: true,
      topic,
      council: {
        president: 'RARE',
        members: opinions,
      },
      decision: {
        by: 'RARE',
        content: rareDecision,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    console.error('Council debate error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/council/vote
 * Get votes from all AI models
 */
router.post('/vote', async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !options || !Array.isArray(options)) {
      return res.status(400).json({
        success: false,
        error: 'السؤال والخيارات مطلوبة',
      });
    }

    const votePrompt = `السؤال: ${question}\nالخيارات: ${options.join(', ')}\nاختر خياراً واحداً فقط ورده كنص.`;

    const results = await Promise.allSettled([
      getGPTResponse('اختر خياراً واحداً فقط.', votePrompt),
      getClaudeResponse('اختر خياراً واحداً فقط.', votePrompt),
      getGeminiResponse('اختر خياراً واحداً فقط.', votePrompt),
    ]);

    const votes = [
      { model: 'GPT-4', vote: results[0].status === 'fulfilled' ? results[0].value : null },
      { model: 'Claude', vote: results[1].status === 'fulfilled' ? results[1].value : null },
      { model: 'Gemini', vote: results[2].status === 'fulfilled' ? results[2].value : null },
    ];

    res.json({
      success: true,
      question,
      options,
      votes,
      consensus: findConsensus(votes),
    });
  } catch (error) {
    console.error('Council vote error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/council/status
 * Get council status
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    council: {
      president: 'RARE',
      members: ['GPT-4', 'Claude', 'Gemini'],
      status: 'active',
    },
  });
});

async function getGPTResponse(system, user) {
  try {
    if (!openai || !OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      max_tokens: 500,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('GPT error:', error.message);
    throw error;
  }
}

async function getClaudeResponse(system, user) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('Claude API key not configured');
    }
    
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        system: system,
        messages: [{ role: 'user', content: user }]
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.content[0].text;
  } catch (error) {
    console.error('Claude error:', error.response?.data?.error?.message || error.message);
    throw error;
  }
}

async function getGeminiResponse(system, user) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }
    
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [{
          parts: [{ text: `${system}\n\n${user}` }]
        }]
      },
      {
        headers: {
          'x-goog-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini error:', error.response?.data?.error?.message || error.message);
    throw error;
  }
}

async function getRAREDecision(topic, opinions) {
  try {
    const availableOpinions = opinions.filter(o => o.available);
    const opinionsSummary = availableOpinions
      .map(o => `${o.role} (${o.model}): ${o.opinion}`)
      .join('\n\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `أنت RARE، رئيس مجلس الذكاء الاصطناعي. 
بناءً على آراء المستشارين، اتخذ قراراً نهائياً حكيماً ومتوازناً.
كن مختصراً ومباشراً.`,
        },
        {
          role: 'user',
          content: `الموضوع: ${topic}\n\nآراء المستشارين:\n${opinionsSummary}\n\nما هو قرارك النهائي؟`,
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('RARE decision error:', error);
    return 'لم يتم اتخاذ قرار بسبب خطأ تقني';
  }
}

function findConsensus(votes) {
  const validVotes = votes.filter(v => v.vote);
  if (validVotes.length === 0) return null;

  const voteCounts = {};
  validVotes.forEach(v => {
    const vote = v.vote.toLowerCase().trim();
    voteCounts[vote] = (voteCounts[vote] || 0) + 1;
  });

  const sorted = Object.entries(voteCounts).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? sorted[0][0] : null;
}

export default router;
