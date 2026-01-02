/**
 * RARE 4N - Payment Routes
 * ✅ Stripe & Apple Pay Routes
 */

import express from 'express';
import {
  createPaymentIntent,
  createCheckoutSession,
  verifyPaymentIntent,
  validateApplePayMerchant,
  processApplePayPayment,
  getPublishableKey,
} from '../services/paymentService.js';
import { validate, schemas } from '../middleware/validation.js';
import { strictLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * GET /api/payments/publishable-key
 * Get Stripe publishable key
 */
router.get('/publishable-key', (req, res) => {
  const key = getPublishableKey();
  if (!key) {
    return res.status(500).json({
      success: false,
      error: 'Stripe not configured',
    });
  }
  res.json({
    success: true,
    publishableKey: key,
  });
});

/**
 * POST /api/payments/create
 * Create payment (Stripe or Apple Pay)
 * ✅ SECURITY: Protected with validation and rate limiting
 */
router.post('/create', 
  strictLimiter,
  validate(schemas.payment),
  async (req, res) => {
  try {
    const { amount, currency = 'aed', method = 'stripe', requestId, clientId, successUrl, cancelUrl } = req.body;

    const metadata = {
      requestId: requestId || `req_${Date.now()}`,
      clientId: clientId || 'unknown',
      timestamp: Date.now().toString(),
    };

    if (method === 'apple_pay') {
      // For Apple Pay, return session info
      res.json({
        success: true,
        method: 'apple_pay',
        amount,
        currency,
        sessionId: `apple_${Date.now()}`,
        metadata,
      });
    } else {
      // Stripe Payment Intent
      const result = await createPaymentIntent(amount, currency, metadata);

      if (result.success) {
        res.json({
          success: true,
          method: 'stripe',
          clientSecret: result.clientSecret,
          paymentIntentId: result.paymentIntentId,
          publishableKey: result.publishableKey,
          amount,
          currency,
        });
      } else {
        res.status(500).json(result);
      }
    }
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/payments/stripe/create-checkout
 * Create Stripe Checkout Session
 */
router.post('/stripe/create-checkout', async (req, res) => {
  try {
    const { amount, currency = 'aed', successUrl, cancelUrl, metadata = {} } = req.body;

    if (!amount || !successUrl || !cancelUrl) {
      return res.status(400).json({
        success: false,
        error: 'amount, successUrl, and cancelUrl are required',
      });
    }

    const result = await createCheckoutSession(amount, currency, successUrl, cancelUrl, metadata);
    res.json(result);
  } catch (error) {
    console.error('Checkout creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/payments/stripe/verify
 * Verify Stripe Payment Intent
 */
router.post('/stripe/verify', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: 'paymentIntentId is required',
      });
    }

    const result = await verifyPaymentIntent(paymentIntentId);
    res.json(result);
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/payments/apple-pay/validate
 * Validate Apple Pay Merchant
 */
router.post('/apple-pay/validate', async (req, res) => {
  try {
    const { validationURL, sessionId } = req.body;

    if (!validationURL) {
      return res.status(400).json({
        success: false,
        error: 'validationURL is required',
      });
    }

    const result = await validateApplePayMerchant(validationURL);
    res.json(result);
  } catch (error) {
    console.error('Apple Pay validation error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/payments/apple-pay/process
 * Process Apple Pay Payment
 */
router.post('/apple-pay/process', async (req, res) => {
  try {
    const { sessionId, payment, amount, currency = 'aed' } = req.body;

    if (!payment || !amount) {
      return res.status(400).json({
        success: false,
        error: 'payment and amount are required',
      });
    }

    const result = await processApplePayPayment(payment, amount, currency);

    if (result.success) {
      // Notify builder about payment
      const io = req.app.get('io');
      if (io) {
        io.of('/auto-builder').emit('payment:completed', {
          sessionId,
          transactionId: result.transactionId,
          amount,
          currency,
          timestamp: Date.now(),
        });
      }
    }

    res.json(result);
  } catch (error) {
    console.error('Apple Pay processing error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

