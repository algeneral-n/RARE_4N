/**
 * RARE 4N - Emotion Engine Routes
 * Backend API for Emotion Detection
 */

import express from 'express';

const router = express.Router();

/**
 * POST /api/emotion/detect-text
 * Detect emotion from text
 */
router.post('/detect-text', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Text is required'
      });
    }
    
    const lower = text.toLowerCase();
    let emotion = 'neutral';
    let confidence = 0.75;
    let intensity = 0.5;
    const indicators = [];
    
    // Happy indicators
    if (/😊|😄|رائع|جميل|ممتاز|حلو|تمام|perfect|great|awesome/.test(lower)) {
      emotion = 'happy';
      confidence = 0.9;
      intensity = 0.8;
      indicators.push('positive words', 'emojis');
    }
    // Excited indicators
    else if (/!{2,}|wow|amazing|يااااا|مذهل|عظيم/.test(text)) {
      emotion = 'excited';
      confidence = 0.85;
      intensity = 0.9;
      indicators.push('exclamation marks', 'excitement words');
    }
    // Sad indicators
    else if (/😢|😔|حزين|للأسف|مش عارف|sad|unfortunately/.test(lower)) {
      emotion = 'sad';
      confidence = 0.88;
      intensity = 0.7;
      indicators.push('sadness words', 'negative sentiment');
    }
    // Angry indicators
    else if (/😡|غاضب|مش عاجبني|سيء|زعلان|angry|bad|terrible/.test(lower)) {
      emotion = 'angry';
      confidence = 0.87;
      intensity = 0.75;
      indicators.push('anger words', 'negative intensity');
    }
    // Confused indicators
    else if (/🤔|ليه|ازاي|مش فاهم|what|why|how|؟؟/.test(lower)) {
      emotion = 'confused';
      confidence = 0.82;
      intensity = 0.6;
      indicators.push('question words', 'uncertainty');
    }
    // Stressed indicators
    else if (/سريع|عاجل|urgent|quickly|asap|help/.test(lower)) {
      emotion = 'stressed';
      confidence = 0.8;
      intensity = 0.7;
      indicators.push('urgency words', 'time pressure');
    }
    
    res.json({
      success: true,
      emotion: {
        emotion,
        confidence,
        intensity,
        indicators: indicators.length > 0 ? indicators : ['no strong indicators']
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/emotion/detect-audio
 * Detect emotion from audio analysis
 */
router.post('/detect-audio', (req, res) => {
  try {
    const { pitch = 1.0, volume = 0.5, speed = 1.0 } = req.body;
    
    let emotion = 'neutral';
    let confidence = 0.7;
    let intensity = 0.5;
    const indicators = [];
    
    // High pitch + high volume = excited or angry
    if (pitch > 1.2 && volume > 0.7) {
      if (speed > 1.3) {
        emotion = 'excited';
        confidence = 0.85;
        intensity = 0.9;
        indicators.push('high pitch', 'high volume', 'fast speech');
      } else {
        emotion = 'angry';
        confidence = 0.82;
        intensity = 0.8;
        indicators.push('high pitch', 'high volume');
      }
    }
    // Low pitch + low volume = sad
    else if (pitch < 0.8 && volume < 0.4) {
      emotion = 'sad';
      confidence = 0.8;
      intensity = 0.7;
      indicators.push('low pitch', 'low volume');
    }
    // Moderate with variations = happy
    else if (pitch > 1.0 && volume > 0.5 && speed < 1.2) {
      emotion = 'happy';
      confidence = 0.78;
      intensity = 0.7;
      indicators.push('warm pitch', 'good volume');
    }
    // Fast speech + moderate volume = stressed
    else if (speed > 1.4 && volume > 0.6) {
      emotion = 'stressed';
      confidence = 0.76;
      intensity = 0.75;
      indicators.push('fast speech', 'moderate-high volume');
    } else {
      indicators.push('normal audio parameters');
    }
    
    res.json({
      success: true,
      emotion: {
        emotion,
        confidence,
        intensity,
        indicators
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/emotion/merge
 * Merge text and audio emotion detection
 */
router.post('/merge', (req, res) => {
  try {
    const { textEmotion, audioEmotion } = req.body;
    
    if (!textEmotion || !audioEmotion) {
      return res.status(400).json({
        success: false,
        error: 'Both textEmotion and audioEmotion are required'
      });
    }
    
    const textWeight = 0.6;
    const audioWeight = 0.4;
    
    // If both agree, high confidence
    if (textEmotion.emotion === audioEmotion.emotion) {
      return res.json({
        success: true,
        emotion: {
          emotion: textEmotion.emotion,
          confidence: 0.95,
          intensity: (textEmotion.intensity + audioEmotion.intensity) / 2,
          indicators: [...(textEmotion.indicators || []), ...(audioEmotion.indicators || [])]
        }
      });
    }
    
    // If disagree, use weighted confidence
    const textScore = textEmotion.confidence * textWeight;
    const audioScore = audioEmotion.confidence * audioWeight;
    
    if (textScore > audioScore) {
      return res.json({
        success: true,
        emotion: {
          ...textEmotion,
          confidence: textScore,
          indicators: [...(textEmotion.indicators || []), 'text priority']
        }
      });
    }
    
    return res.json({
      success: true,
      emotion: {
        ...audioEmotion,
        confidence: audioScore,
        indicators: [...(audioEmotion.indicators || []), 'audio priority']
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;


