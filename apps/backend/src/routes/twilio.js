/**
 * RARE 4N - Twilio Routes
 * ✅ SMS, WhatsApp, Voice Routes
 */

import express from 'express';
import { sendSMS, sendWhatsApp, makePhoneCall, sendOTP, verifyOTP } from '../services/twilioService.js';

const router = express.Router();

/**
 * POST /api/twilio/send-sms
 * Send SMS
 */
router.post('/send-sms', async (req, res) => {
  try {
    const { to, message, from } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: 'to and message are required',
      });
    }

    const result = await sendSMS(to, message, from);
    res.json(result);
  } catch (error) {
    console.error('SMS route error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/twilio/send-whatsapp
 * Send WhatsApp message
 */
router.post('/send-whatsapp', async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: 'to and message are required',
      });
    }

    const result = await sendWhatsApp(to, message);
    res.json(result);
  } catch (error) {
    console.error('WhatsApp route error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/twilio/call
 * Make phone call (Portal alias)
 */
router.post('/call', async (req, res) => {
  try {
    const { to, message, from } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: 'to and message are required',
      });
    }

    const result = await makePhoneCall(to, message, from);
    res.json(result);
  } catch (error) {
    console.error('Phone call route error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/twilio/make-call
 * Make phone call
 */
router.post('/make-call', async (req, res) => {
  try {
    const { to, message, from } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: 'to and message are required',
      });
    }

    const result = await makePhoneCall(to, message, from);
    res.json(result);
  } catch (error) {
    console.error('Phone call route error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/twilio/send-otp
 * Send OTP
 */
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'phoneNumber is required',
      });
    }

    const result = await sendOTP(phoneNumber);
    res.json(result);
  } catch (error) {
    console.error('OTP route error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/twilio/verify
 * Verify OTP (Portal alias)
 */
router.post('/verify', async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;

    if (!phoneNumber || !code) {
      return res.status(400).json({
        success: false,
        error: 'phoneNumber and code are required',
      });
    }

    const result = await verifyOTP(phoneNumber, code);
    res.json(result);
  } catch (error) {
    console.error('OTP verify route error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/twilio/verify-otp
 * Verify OTP
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;

    if (!phoneNumber || !code) {
      return res.status(400).json({
        success: false,
        error: 'phoneNumber and code are required',
      });
    }

    const result = await verifyOTP(phoneNumber, code);
    res.json(result);
  } catch (error) {
    console.error('OTP verify route error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
























