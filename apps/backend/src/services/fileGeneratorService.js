/**
 * RARE 4N - File Generator Service
 * Generate any file type using GPT-4 and specialized APIs
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

// ✅ Ensure axios is available for video generation
if (!axios) {
  console.warn('axios not available for video generation');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const OUTPUT_DIR = path.join(process.cwd(), 'server/generated');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Generate file based on type and prompt
 */
export async function generateFile(type, prompt, options = {}) {
  const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  switch (type.toLowerCase()) {
    case 'pdf':
      return await generatePDF(prompt, fileId, options);
    case 'html':
      return await generateHTML(prompt, fileId, options);
    case 'image':
    case 'png':
    case 'jpg':
      return await generateImage(prompt, fileId, options);
    case 'video':
    case 'mp4':
      return await generateVideo(prompt, fileId, options);
    case 'audio':
    case 'mp3':
      return await generateAudio(prompt, fileId, options);
    case 'json':
      return await generateJSON(prompt, fileId, options);
    case 'csv':
      return await generateCSV(prompt, fileId, options);
    case 'markdown':
    case 'md':
      return await generateMarkdown(prompt, fileId, options);
    case 'code':
      return await generateCode(prompt, fileId, options);
    case 'excel':
    case 'xlsx':
      return await generateExcel(prompt, fileId, options);
    default:
      return await generateText(prompt, fileId, { ...options, extension: type });
  }
}

/**
 * Generate PDF document
 */
async function generatePDF(prompt, fileId, options) {
  const htmlContent = await generateHTMLContent(prompt, options);
  
  const filename = `${fileId}.pdf`;
  const filePath = path.join(OUTPUT_DIR, filename);

  try {
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
    });
    
    await browser.close();

  // ✅ Generate shareable link
  const shareableLink = `${process.env.API_BASE_URL || 'https://api.zien-ai.app'}/api/file-generator/download/${filename}`;

  return {
    success: true,
    fileId,
    filename,
    filePath,
    type: 'pdf',
    size: fs.statSync(filePath).size,
    downloadUrl: `/api/file-generator/download/${filename}`,
    shareableLink
  };
  } catch (error) {
    const fallbackHtml = `${fileId}.html`;
    fs.writeFileSync(path.join(OUTPUT_DIR, fallbackHtml), htmlContent);
    
    return {
      success: true,
      fileId,
      filename: fallbackHtml,
      filePath: path.join(OUTPUT_DIR, fallbackHtml),
      type: 'html',
      note: 'PDF generation requires puppeteer, HTML generated instead',
      downloadUrl: `/api/file-generator/download/${fallbackHtml}`
    };
  }
}

/**
 * Generate HTML page
 */
async function generateHTML(prompt, fileId, options) {
  const htmlContent = await generateHTMLContent(prompt, options);
  
  const filename = `${fileId}.html`;
  const filePath = path.join(OUTPUT_DIR, filename);
  
  fs.writeFileSync(filePath, htmlContent);

  // ✅ Generate shareable link
  const shareableLink = `${process.env.API_BASE_URL || 'https://api.zien-ai.app'}/api/file-generator/download/${filename}`;

  return {
    success: true,
    fileId,
    filename,
    filePath,
    type: 'html',
    size: fs.statSync(filePath).size,
    downloadUrl: `/api/file-generator/download/${filename}`,
    previewUrl: `/api/files/preview/${filename}`,
    shareableLink
  };
}

async function generateHTMLContent(prompt, options) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `أنت مصمم ويب محترف. قم بإنشاء صفحة HTML كاملة وجميلة مع CSS مضمن.
        - استخدم تصميم عصري وأنيق
        - الخطوط: Cairo أو Tajawal للعربية
        - ألوان جذابة ومتناسقة
        - تصميم متجاوب (responsive)
        - أضف gradients وshadows حديثة
        قم بإرجاع HTML فقط بدون أي شرح.`
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 4000
  });

  let html = response.choices[0].message.content;
  html = html.replace(/```html\n?/g, '').replace(/```\n?/g, '');
  
  return html;
}

/**
 * Generate Image using DALL-E 3
 */
async function generateImage(prompt, fileId, options) {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: options.size || '1024x1024',
    quality: options.quality || 'hd',
    style: options.style || 'vivid'
  });

  const imageUrl = response.data[0].url;
  const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  
  const filename = `${fileId}.png`;
  const filePath = path.join(OUTPUT_DIR, filename);
  
  fs.writeFileSync(filePath, imageResponse.data);

  // ✅ Generate shareable link
  const shareableLink = `${process.env.API_BASE_URL || 'https://api.zien-ai.app'}/api/file-generator/download/${filename}`;

  return {
    success: true,
    fileId,
    filename,
    filePath,
    type: 'image',
    size: fs.statSync(filePath).size,
    downloadUrl: `/api/file-generator/download/${filename}`,
    previewUrl: `/api/files/preview/${filename}`,
    shareableLink,
    revisedPrompt: response.data[0].revised_prompt
  };
}

/**
 * Generate Video using RunwayML, Pika, or OpenAI Sora (when available)
 */
async function generateVideo(prompt, fileId, options) {
  const RUNWAYML_API_KEY = process.env.RUNWAYML_API_KEY || process.env.RUNWAY_API_KEY;
  const PIKA_API_KEY = process.env.PIKA_API_KEY;
  const duration = options.duration || 5;
  const resolution = options.resolution || '1024x1024';
  const style = options.style || '';

  let videoUrl = null;
  let videoId = null;
  let provider = 'openai-sora';

  // ✅ Try OpenAI Sora first (when available)
  try {
    const soraResponse = await openai.video.generations.create({
      model: 'sora',
      prompt: style ? `${prompt}, style: ${style}` : prompt,
      duration: Math.min(Math.max(duration, 1), 60),
      resolution,
    });
    videoUrl = soraResponse.data[0].url;
    videoId = soraResponse.data[0].id;
    provider = 'openai-sora';
  } catch (soraError) {
    // ✅ Fallback to RunwayML
    if (RUNWAYML_API_KEY) {
      try {
        const runwayResponse = await axios.post(
          'https://api.runwayml.com/v1/generate',
          {
            prompt: style ? `${prompt}, style: ${style}` : prompt,
            duration: Math.min(Math.max(duration, 1), 10),
            resolution,
          },
          {
            headers: {
              'Authorization': `Bearer ${RUNWAYML_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (runwayResponse.data.video_url) {
          videoUrl = runwayResponse.data.video_url;
          videoId = runwayResponse.data.id;
          provider = 'runwayml';
        }
      } catch (runwayError) {
        console.warn('RunwayML error:', runwayError.message);
      }
    }

    // ✅ Fallback to Pika
    if (!videoUrl && PIKA_API_KEY) {
      try {
        const pikaResponse = await axios.post(
          'https://api.pika.art/v1/generate',
          {
            prompt: style ? `${prompt}, style: ${style}` : prompt,
            duration: Math.min(Math.max(duration, 1), 10),
            aspectRatio: '16:9',
          },
          {
            headers: {
              'Authorization': `Bearer ${PIKA_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (pikaResponse.data.video_url) {
          videoUrl = pikaResponse.data.video_url;
          videoId = pikaResponse.data.id;
          provider = 'pika';
        }
      } catch (pikaError) {
        console.warn('Pika error:', pikaError.message);
      }
    }
  }

  // ✅ If video generated, download and save
  if (videoUrl) {
    try {
      const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
      const filename = `${fileId}.mp4`;
      const filePath = path.join(OUTPUT_DIR, filename);
      fs.writeFileSync(filePath, videoResponse.data);

      return {
        success: true,
        fileId,
        filename,
        filePath,
        type: 'video',
        size: fs.statSync(filePath).size,
        downloadUrl: `/api/file-generator/download/${filename}`,
        previewUrl: `/api/files/preview/${filename}`,
        videoUrl,
        videoId,
        provider,
        duration,
        resolution,
      };
    } catch (downloadError) {
      console.error('Video download error:', downloadError);
      // Return URL if download fails
      return {
        success: true,
        fileId,
        filename: `${fileId}.mp4`,
        type: 'video',
        videoUrl,
        videoId,
        provider,
        duration,
        resolution,
        downloadUrl: videoUrl,
        note: 'Video generated. Download from URL.',
      };
    }
  }

  // ✅ Fallback: Generate video script if no video service available
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'أنت خبير في إنتاج الفيديو. قم بإنشاء سكريبت فيديو مفصل مع المشاهد والتعليقات الصوتية.'
      },
      { role: 'user', content: `أنشئ سكريبت فيديو عن: ${prompt}` }
    ],
    temperature: 0.7
  });

  const script = response.choices[0].message.content;
  
  const htmlContent = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>سكريبت فيديو</title>
  <style>
    body { font-family: 'Cairo', sans-serif; padding: 40px; background: linear-gradient(135deg, #1a1a2e, #16213e); color: #fff; min-height: 100vh; }
    .scene { background: rgba(255,255,255,0.1); padding: 20px; margin: 20px 0; border-radius: 15px; }
    h1 { color: #00eaff; }
    .voiceover { color: #FF6600; font-style: italic; }
  </style>
</head>
<body>
  <h1>سكريبت الفيديو</h1>
  <div class="content">${script.replace(/\n/g, '<br>')}</div>
</body>
</html>`;

  const filename = `${fileId}_script.html`;
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, htmlContent);

  return {
    success: true,
    fileId,
    filename,
    filePath,
    type: 'video-script',
    script,
    size: fs.statSync(filePath).size,
    downloadUrl: `/api/file-generator/download/${filename}`,
    note: 'تم إنشاء سكريبت الفيديو. لإنتاج الفيديو الفعلي، أضف RUNWAYML_API_KEY أو PIKA_API_KEY إلى .env'
  };
}

/**
 * Generate Audio using ElevenLabs or description
 */
async function generateAudio(prompt, fileId, options) {
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
  
  if (!ELEVENLABS_API_KEY) {
    const textResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'اكتب نص صوتي جاهز للتسجيل.' },
        { role: 'user', content: prompt }
      ]
    });

    const script = textResponse.choices[0].message.content;
    const filename = `${fileId}_audio_script.txt`;
    const filePath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filePath, script);

    return {
      success: true,
      fileId,
      filename,
      type: 'audio-script',
      script,
      downloadUrl: `/api/file-generator/download/${filename}`
    };
  }

  try {
    const response = await axios.post(
      'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM',
      {
        text: prompt,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        responseType: 'arraybuffer'
      }
    );

    const filename = `${fileId}.mp3`;
    const filePath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filePath, response.data);

    // ✅ Generate shareable link
    const shareableLink = `${process.env.API_BASE_URL || 'https://api.zien-ai.app'}/api/file-generator/download/${filename}`;

    return {
      success: true,
      fileId,
      filename,
      filePath,
      type: 'audio',
      size: fs.statSync(filePath).size,
      downloadUrl: `/api/file-generator/download/${filename}`,
      shareableLink
    };
  } catch (error) {
    console.error('ElevenLabs error:', error);
    throw error;
  }
}

/**
 * Generate JSON data
 */
async function generateJSON(prompt, fileId, options) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'أنشئ بيانات JSON صالحة بناءً على الوصف. أرجع JSON فقط بدون أي نص إضافي.'
      },
      { role: 'user', content: prompt }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7
  });

  const jsonContent = response.choices[0].message.content;
  const filename = `${fileId}.json`;
  const filePath = path.join(OUTPUT_DIR, filename);
  
  fs.writeFileSync(filePath, JSON.stringify(JSON.parse(jsonContent), null, 2));

  return {
    success: true,
    fileId,
    filename,
    filePath,
    type: 'json',
    data: JSON.parse(jsonContent),
    size: fs.statSync(filePath).size,
    downloadUrl: `/api/file-generator/download/${filename}`
  };
}

/**
 * Generate CSV data
 */
async function generateCSV(prompt, fileId, options) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'أنشئ بيانات CSV صالحة بناءً على الوصف. أرجع CSV فقط بدون أي نص إضافي. استخدم الفواصل كفاصل.'
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7
  });

  let csvContent = response.choices[0].message.content;
  csvContent = csvContent.replace(/```csv\n?/g, '').replace(/```\n?/g, '');
  
  const filename = `${fileId}.csv`;
  const filePath = path.join(OUTPUT_DIR, filename);
  
  fs.writeFileSync(filePath, csvContent);

  return {
    success: true,
    fileId,
    filename,
    filePath,
    type: 'csv',
    size: fs.statSync(filePath).size,
    downloadUrl: `/api/file-generator/download/${filename}`
  };
}

/**
 * Generate Markdown document
 */
async function generateMarkdown(prompt, fileId, options) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'أنشئ مستند Markdown مفصل ومنظم بشكل جيد مع عناوين وقوائم وتنسيق مناسب.'
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7
  });

  const mdContent = response.choices[0].message.content;
  const filename = `${fileId}.md`;
  const filePath = path.join(OUTPUT_DIR, filename);
  
  fs.writeFileSync(filePath, mdContent);

  return {
    success: true,
    fileId,
    filename,
    filePath,
    type: 'markdown',
    content: mdContent,
    size: fs.statSync(filePath).size,
    downloadUrl: `/api/file-generator/download/${filename}`
  };
}

/**
 * Generate Code in any language
 */
async function generateCode(prompt, fileId, options) {
  const language = options.language || 'javascript';
  const extension = options.extension || null;
  
  // دعم 12 نوع و 12 امتداد
  const extensions = {
    javascript: 'js',
    typescript: 'ts',
    python: 'py',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    csharp: 'cs',
    go: 'go',
    rust: 'rs',
    swift: 'swift',
    kotlin: 'kt',
    php: 'php',
    ruby: 'rb',
    html: 'html',
    css: 'css',
    sql: 'sql',
    jsx: 'jsx',
    tsx: 'tsx',
    vue: 'vue',
    svelte: 'svelte'
  };

  // دعم HTML CarPlay
  const isCarPlay = options.carplay === true || prompt.toLowerCase().includes('carplay');
  
  if (isCarPlay && (language === 'html' || extension === 'html')) {
    return await generateHTMLCarPlay(prompt, fileId, options);
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `أنت مبرمج محترف. اكتب كود ${language} نظيف ومنظم مع تعليقات توضيحية. أرجع الكود فقط.`
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3
  });

  let code = response.choices[0].message.content;
  code = code.replace(/```\w*\n?/g, '').replace(/```\n?/g, '');
  
  const ext = extensions[language.toLowerCase()] || 'txt';
  const filename = `${fileId}.${ext}`;
  const filePath = path.join(OUTPUT_DIR, filename);
  
  fs.writeFileSync(filePath, code);

  return {
    success: true,
    fileId,
    filename,
    filePath,
    type: 'code',
    language,
    code,
    size: fs.statSync(filePath).size,
    downloadUrl: `/api/file-generator/download/${filename}`
  };
}

/**
 * Generate HTML CarPlay file
 */
async function generateHTMLCarPlay(prompt, fileId, options) {
  const carPlayPrompt = `
أنشئ ملف HTML كامل لـ Apple CarPlay مع:
- تصميم متوافق مع CarPlay (Dark Mode)
- دعم Siri Integration
- Navigation Widget
- Media Controls
- Weather Widget
- Voice Commands
- Responsive Design للشاشات الكبيرة

الوصف: ${prompt}

أرجع HTML كامل مع CSS و JavaScript مضمن.
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `أنت مطور محترف في Apple CarPlay. أنشئ ملف HTML متوافق مع CarPlay مع:
- دعم Siri Integration
- Navigation Widget
- Media Controls  
- Weather Widget
- Voice Commands
- تصميم Dark Mode
- Responsive Design

أرجع HTML كامل فقط.`
      },
      { role: 'user', content: carPlayPrompt }
    ],
    temperature: 0.3,
    max_tokens: 4000
  });

  let html = response.choices[0].message.content;
  html = html.replace(/```html\n?/g, '').replace(/```\n?/g, '');

  // إضافة CarPlay Meta Tags
  const carPlayMeta = `
<meta name="apple-carplay" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<script>
  // Siri Integration
  if (window.SiriKit) {
    window.SiriKit.activate();
  }
  
  // CarPlay Navigation
  if (window.CarPlay) {
    window.CarPlay.init();
  }
</script>
`;

  html = html.replace('</head>', `${carPlayMeta}</head>`);

  const filename = `${fileId}_carplay.html`;
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, html);

  return {
    success: true,
    fileId,
    filename,
    filePath,
    type: 'html-carplay',
    language: 'html',
    code: html,
    size: fs.statSync(filePath).size,
    downloadUrl: `/api/file-generator/download/${filename}`,
    carplay: true
  };
}

/**
 * Generate Excel file
 */
async function generateExcel(prompt, fileId, options) {
  const jsonResponse = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'أنشئ بيانات JSON كمصفوفة من الكائنات لإنشاء جدول Excel. أرجع JSON فقط.'
      },
      { role: 'user', content: prompt }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7
  });

  const data = JSON.parse(jsonResponse.choices[0].message.content);
  
  let csvContent = '';
  if (data.data && Array.isArray(data.data) && data.data.length > 0) {
    const headers = Object.keys(data.data[0]);
    csvContent = headers.join(',') + '\n';
    data.data.forEach(row => {
      csvContent += headers.map(h => `"${row[h] || ''}"`).join(',') + '\n';
    });
  }

  const filename = `${fileId}.csv`;
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, csvContent);

  return {
    success: true,
    fileId,
    filename,
    filePath,
    type: 'csv',
    note: 'يمكن فتحه في Excel',
    size: fs.statSync(filePath).size,
    downloadUrl: `/api/file-generator/download/${filename}`
  };
}

/**
 * Generate Text file
 */
async function generateText(prompt, fileId, options) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'أنشئ محتوى نصي بناءً على الوصف.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7
  });

  const content = response.choices[0].message.content;
  const ext = options.extension || 'txt';
  const filename = `${fileId}.${ext}`;
  const filePath = path.join(OUTPUT_DIR, filename);
  
  fs.writeFileSync(filePath, content);

  return {
    success: true,
    fileId,
    filename,
    filePath,
    type: ext,
    content,
    size: fs.statSync(filePath).size,
    downloadUrl: `/api/file-generator/download/${filename}`
  };
}

/**
 * List all generated files
 */
export function listGeneratedFiles() {
  const files = fs.readdirSync(OUTPUT_DIR);
  return files.map(file => {
    const filePath = path.join(OUTPUT_DIR, file);
    const stats = fs.statSync(filePath);
    return {
      filename: file,
      size: stats.size,
      createdAt: stats.birthtime,
      downloadUrl: `/api/file-generator/download/${file}`
    };
  });
}

/**
 * Get file path for download
 */
export function getFilePath(filename) {
  const filePath = path.join(OUTPUT_DIR, filename);
  if (fs.existsSync(filePath)) {
    return filePath;
  }
  return null;
}

export default {
  generateFile,
  listGeneratedFiles,
  getFilePath
};
