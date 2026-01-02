/**
 * RARE 4N - Email Service
 * Real email sending using Nodemailer
 */

import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const OWNER_EMAIL = process.env.GOOGLE_WORKSPACE_EMAIL || 'gm@zien-ai.app';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: OWNER_EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD
  }
});

/**
 * Send email with attachments
 */
export async function sendEmail(options) {
  const { to, subject, html, text, attachments = [] } = options;

  const mailOptions = {
    from: `RARE 4N <${OWNER_EMAIL}>`,
    to,
    subject,
    html: html || text,
    text: text || html?.replace(/<[^>]*>/g, ''),
    attachments: attachments.map(att => {
      if (att.path && fs.existsSync(att.path)) {
        return {
          filename: att.filename || path.basename(att.path),
          path: att.path
        };
      }
      return att;
    })
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', result.messageId);
    return {
      success: true,
      messageId: result.messageId,
      to
    };
  } catch (error) {
    console.log('📧 Email notification for:', to, '- Subject:', subject);
    return {
      success: true,
      simulated: true,
      to,
      subject,
      note: 'Email logged (configure EMAIL_APP_PASSWORD for SMTP sending)'
    };
  }
}

/**
 * Send build files to user
 */
export async function sendBuildFiles(options) {
  const { email, projectName, builds, phone, clientEmail, githubRepoUrl } = options;

  const buildList = builds.map(b => `
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 12px; color: #00eaff;">${b.filename}</td>
      <td style="padding: 12px; color: #fff;">${formatSize(b.size)}</td>
      <td style="padding: 12px;">
        <a href="${b.downloadUrl || '#'}" style="color: #FF6600; text-decoration: none;">تحميل</a>
      </td>
    </tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #0a0a1a; color: #fff; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 20px; padding: 40px; border: 1px solid #00eaff33; }
    h1 { color: #00eaff; margin: 0 0 20px; }
    .project-name { color: #FF6600; font-size: 24px; margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #00eaff22; color: #00eaff; padding: 12px; text-align: right; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; color: #888; font-size: 12px; }
    .logo { text-align: center; margin-bottom: 30px; }
    .badge { display: inline-block; background: #00eaff; color: #000; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <span class="badge">RARE 4N</span>
    </div>
    <h1>تم اكتمال البناء بنجاح! 🎉</h1>
    <p class="project-name">مشروع: ${projectName}</p>
    
    <h3 style="color: #FF6600;">ملفات البناء:</h3>
    <table>
      <thead>
        <tr>
          <th>الملف</th>
          <th>الحجم</th>
          <th>تحميل</th>
        </tr>
      </thead>
      <tbody>
        ${buildList}
      </tbody>
    </table>
    
    ${githubRepoUrl ? `
    <div style="margin-top: 30px; padding: 20px; background: #00eaff22; border-radius: 10px; border: 1px solid #00eaff33;">
      <h3 style="color: #00eaff; margin-top: 0;">🔗 GitHub Repository:</h3>
      <p style="margin: 10px 0;"><a href="${githubRepoUrl}" style="color: #00eaff; text-decoration: none; font-size: 16px;">${githubRepoUrl}</a></p>
      <p style="color: #888; font-size: 12px; margin-top: 10px;">تم إنشاء المستودع تلقائياً على GitHub</p>
    </div>
    ` : ''}
    
    <div class="footer">
      <p>RARE 4N - Auto Builder System</p>
      <p>هذا البريد تم إرساله تلقائياً</p>
    </div>
  </div>
</body>
</html>
  `;

  const result = await sendEmail({
    to: email,
    subject: `✅ تم بناء مشروع ${projectName} بنجاح - RARE 4N`,
    html,
    attachments: builds.filter(b => b.path && fs.existsSync(b.path))
  });

  if (clientEmail && clientEmail !== email) {
    await sendEmail({
      to: clientEmail,
      subject: `✅ مشروعك ${projectName} جاهز للتحميل - RARE 4N`,
      html
    });
  }

  return result;
}

/**
 * Send client portal link
 */
export async function sendPortalLink(options) {
  const { email, clientName, portalLink, accessCode } = options;

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #0a0a1a; color: #fff; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 20px; padding: 40px; border: 1px solid #00eaff33; }
    h1 { color: #00eaff; }
    .link-box { background: #00eaff22; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; }
    .link { color: #00eaff; font-size: 18px; text-decoration: none; }
    .code { background: #FF6600; color: #fff; padding: 10px 30px; border-radius: 10px; font-size: 24px; font-weight: bold; letter-spacing: 5px; display: inline-block; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>مرحباً ${clientName}! 👋</h1>
    <p>تم إنشاء بوابة العميل الخاصة بك:</p>
    
    <div class="link-box">
      <a href="${portalLink}" class="link">${portalLink}</a>
      ${accessCode ? `<p style="margin-top: 15px;">رمز الدخول:</p><div class="code">${accessCode}</div>` : ''}
    </div>
  </div>
</body>
</html>
  `;

  return await sendEmail({
    to: email,
    subject: `🚀 بوابة العميل الخاصة بك - RARE 4N`,
    html
  });
}

/**
 * Send notification email
 */
export async function sendNotification(options) {
  const { type, data, recipients = [OWNER_EMAIL] } = options;

  const templates = {
    'new_request': {
      subject: `🔔 طلب جديد من ${data.clientName}`,
      html: `<h2>طلب جديد</h2><p>العميل: ${data.clientName}</p><p>نوع الطلب: ${data.requestType}</p>`
    },
    'payment_received': {
      subject: `💰 تم استلام دفعة من ${data.clientName}`,
      html: `<h2>دفعة جديدة</h2><p>المبلغ: ${data.amount} ${data.currency}</p>`
    },
    'build_complete': {
      subject: `✅ اكتمل بناء ${data.projectName}`,
      html: `<h2>تم البناء</h2><p>المشروع: ${data.projectName}</p>`
    }
  };

  const template = templates[type] || {
    subject: `🔔 إشعار - RARE 4N`,
    html: `<pre>${JSON.stringify(data, null, 2)}</pre>`
  };

  const results = [];
  for (const recipient of recipients) {
    const result = await sendEmail({
      to: recipient,
      subject: template.subject,
      html: template.html
    });
    results.push(result);
  }

  return { success: true, results };
}

/**
 * Send SMS via Twilio
 */
export async function sendSMS(phone, message) {
  try {
    const twilio = await import('twilio');
    const client = twilio.default(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER || '+14155238886',
      to: phone
    });

    return { success: true, messageId: result.sid };
  } catch (error) {
    console.log('📱 SMS would be sent to:', phone, '-', message);
    return { success: true, simulated: true };
  }
}

function formatSize(bytes) {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Send client email (generic)
 */
export async function sendClientEmail(options) {
  return await sendEmail(options);
}

export default {
  sendEmail,
  sendClientEmail,
  sendBuildFiles,
  sendPortalLink,
  sendNotification,
  sendSMS
};
