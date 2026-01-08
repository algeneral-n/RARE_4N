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
import { requirePortalAuth } from '../middleware/portalAuth.js';

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

/**
 * POST /api/payments/create-intent
 * Create Stripe Payment Intent
 * Portal endpoint - uses Portal Auth
 */
router.post('/create-intent', requirePortalAuth, async (req, res) => {
  try {
    const { amount, currency = 'aed', metadata = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount is required and must be greater than 0',
      });
    }

    const result = await createPaymentIntent(amount, currency, metadata);

    if (result.success) {
      res.json({
        success: true,
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId,
        publishableKey: result.publishableKey,
        amount,
        currency,
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create payment intent',
    });
  }
});

/**
 * POST /api/payments/confirm
 * Confirm payment
 * Portal endpoint - uses Portal Auth
 */
router.post('/confirm', requirePortalAuth, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment Intent ID is required',
      });
    }

    const result = await verifyPaymentIntent(paymentIntentId);
    res.json(result);
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to confirm payment',
    });
  }
});

/**
 * POST /api/payments/webhook
 * Stripe webhook handler
 * No auth required (Stripe signature verification)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const stripe = (await import('stripe')).default;
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res.status(500).json({
        success: false,
        error: 'Webhook secret not configured',
      });
    }

    let event;
    try {
      event = stripeInstance.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({
        success: false,
        error: `Webhook Error: ${err.message}`,
      });
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        
        const io = req.app.get('io') || global.io;
        if (io) {
          io.of('/client-portal').emit('payment:succeeded', {
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            metadata: paymentIntent.metadata,
          });
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        
        if (io) {
          io.of('/client-portal').emit('payment:failed', {
            paymentIntentId: failedPayment.id,
            error: failedPayment.last_payment_error,
          });
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Webhook processing failed',
    });
  }
});

export default router;

