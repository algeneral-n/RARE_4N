// import vision from '@google-cloud/vision'; // Optional - only if package is installed
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

// إعداد عميل Google Vision (optional - only if package is installed)
let client = null;
let visionModule = null;

// Initialize client lazily
async function initVisionClient() {
  if (client !== null) return client; // Already initialized
  
  try {
    // Use dynamic import with try-catch to avoid parse-time errors
    const visionImport = await import('@google-cloud/vision').catch(() => null);
    if (visionImport && visionImport.ImageAnnotatorClient) {
      const ImageAnnotatorClient = visionImport.ImageAnnotatorClient;
      client = new ImageAnnotatorClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
      });
    } else {
      client = false; // Mark as unavailable
    }
  } catch (error) {
    // Google Cloud Vision not available - use fallback
    console.warn('⚠️ Google Cloud Vision not available, using OpenAI Vision fallback');
    client = false; // Mark as unavailable
  }
  
  return client;
}

/**
 * تحليل شامل للصورة
 * @param {string} imagePath - مسار الصورة المحلي
 * @param {Array} features - المميزات المطلوبة (LABEL_DETECTION, FACE_DETECTION, etc.)
 */
export const analyzeImage = async (imagePath, features = ['LABEL_DETECTION', 'TEXT_DETECTION', 'FACE_DETECTION', 'SAFE_SEARCH_DETECTION']) => {
  try {
    await initVisionClient();
    
    if (!client || client === false) {
      // Fallback: use OpenAI Vision
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this image and describe what you see.' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
          ]
        }]
      });
      
      return {
        labelAnnotations: [],
        textAnnotations: [],
        faceAnnotations: [],
        safeSearchAnnotation: { adult: 'UNKNOWN', spoof: 'UNKNOWN', medical: 'UNKNOWN', violence: 'UNKNOWN', racy: 'UNKNOWN' },
        description: response.choices[0].message.content
      };
    }
    
    const [result] = await client.annotateImage({
      image: { source: { filename: imagePath } },
      features: features.map(type => ({ type }))
    });

    return result;
  } catch (error) {
    console.error('Vision Service Error:', error);
    throw new Error(`فشل تحليل الصورة: ${error.message}`);
  }
};

/**
 * وظيفة محددة للكشف عن المحتوى الآمن (Safe Search)
 * تم إصلاحها لتعمل مع ملف vision.js المعدل
 */
export const checkSafeSearch = async (imagePath) => {
  try {
    await initVisionClient();
    
    if (!client || client === false) {
      // Fallback
      return {
        adult: 'UNKNOWN',
        spoof: 'UNKNOWN',
        medical: 'UNKNOWN',
        violence: 'UNKNOWN',
        racy: 'UNKNOWN',
      };
    }
    
    const [result] = await client.safeSearchDetection(imagePath);
    const detections = result.safeSearchAnnotation;
    return {
      adult: detections.adult,
      spoof: detections.spoof,
      medical: detections.medical,
      violence: detections.violence,
      racy: detections.racy,
    };
  } catch (error) {
    console.error('Safe Search Error:', error);
    throw new Error('فشل فحص الأمان للصورة');
  }
};

/**
 * استخراج النصوص (OCR) بطريقة Vision API
 */
export const extractText = async (imagePath) => {
  try {
    await initVisionClient();
    
    if (!client || client === false) {
      // Fallback: use ocrService
      const ocrService = await import('./ocrService.js');
      const result = await ocrService.extractTextFromImage(imagePath);
      return result.text || '';
    }
    
    const [result] = await client.textDetection(imagePath);
    const fullText = result.fullTextAnnotation ? result.fullTextAnnotation.text : '';
    return fullText;
  } catch (error) {
    console.error('OCR Vision Error:', error);
    throw new Error('فشل استخراج النص من الصورة');
  }
};

/**
 * التعرف على الشعارات (Logos)
 */
export const detectLogos = async (imagePath) => {
  try {
    await initVisionClient();
    
    if (!client || client === false) {
      // Fallback
      return [];
    }
    
    const [result] = await client.logoDetection(imagePath);
    const logos = result.logoAnnotations;
    return logos.map(logo => ({
      description: logo.description,
      score: logo.score
    }));
  } catch (error) {
    console.error('Logo Detection Error:', error);
    throw new Error('فشل التعرف على الشعارات');
  }
};

/**
 * Detect text (alias for extractText)
 */
export const detectText = async (imagePath) => {
  const text = await extractText(imagePath);
  return { text };
};

/**
 * Detect objects in image
 */
export const detectObjects = async (imagePath) => {
  try {
    await initVisionClient();
    
    if (!client || client === false) {
      // Fallback: use analyzeImage
      const result = await analyzeImage(imagePath, ['LABEL_DETECTION']);
      return {
        objects: result.labelAnnotations || [],
      };
    }
    
    const [result] = await client.objectLocalization(imagePath);
    return {
      objects: result.localizedObjectAnnotations || [],
    };
  } catch (error) {
    console.error('Object Detection Error:', error);
    // Fallback to labels
    const result = await analyzeImage(imagePath, ['LABEL_DETECTION']);
    return {
      objects: result.labelAnnotations || [],
    };
  }
};

/**
 * Detect faces in image
 */
export const detectFaces = async (imagePath) => {
  try {
    await initVisionClient();
    
    if (!client || client === false) {
      // Fallback: use analyzeImage
      const result = await analyzeImage(imagePath, ['FACE_DETECTION']);
      return {
        faces: result.faceAnnotations || [],
      };
    }
    
    const [result] = await client.faceDetection(imagePath);
    return {
      faces: result.faceAnnotations || [],
    };
  } catch (error) {
    console.error('Face Detection Error:', error);
    // Fallback
    return {
      faces: [],
    };
  }
};

/**
 * Check safety (alias for checkSafeSearch)
 */
export const checkSafety = async (imagePath) => {
  return await checkSafeSearch(imagePath);
};

/**
 * Extract dominant colors
 */
export const getColors = async (imagePath) => {
  try {
    await initVisionClient();
    
    if (!client || client === false) {
      // Fallback
      return {
        colors: [],
      };
    }
    
    const [result] = await client.imageProperties(imagePath);
    const colors = result.imagePropertiesAnnotation?.dominantColors?.colors || [];
    return {
      colors: colors.map(c => ({
        color: c.color,
        score: c.score,
        pixelFraction: c.pixelFraction,
      })),
    };
  } catch (error) {
    console.error('Color Extraction Error:', error);
    return {
      colors: [],
    };
  }
};

const visionServiceExport = {
  analyzeImage,
  checkSafeSearch,
  extractText,
  detectLogos,
  detectText,
  detectObjects,
  detectFaces,
  checkSafety,
  getColors,
};

export default visionServiceExport;