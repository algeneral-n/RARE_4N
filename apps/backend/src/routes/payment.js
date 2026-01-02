/**
 * Payment Routes - Stripe Integration
 * Payment = Approval System
 */

import express from 'express';
import { requireAuth } from '../middleware/userIsolation.js';
import { DB } from '../database/localDB.js';
import crypto from 'crypto';

const router = express.Router();

// Get Stripe keys from environment
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;

// Lazy load Stripe
let stripeClient = null;
async function getStripeClient() {
  if (stripeClient) return stripeClient;
  
  if (!STRIPE_SECRET_KEY) {
    console.warn('⚠️ STRIPE_SECRET_KEY not found in environment variables');
    return null;
  }
  
  try {
    const stripeModule = await import('stripe');
    stripeClient = stripeModule.default(STRIPE_SECRET_KEY);
    console.log('✅ Stripe client initialized');
    return stripeClient;
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
    return null;
  }
}

// Create Payment Intent
router.post('/create-intent', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { amount, currency, description, selections, favorites } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
      });
    }

    // Get Stripe client
    const stripe = await getStripeClient();
    
    if (!stripe) {
      return res.status(500).json({
        success: false,
        error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.',
      });
    }

    // Get user info
    const user = DB.users.findById(userId);
    
    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: (currency || 'aed').toLowerCase(),
      description: description || 'RARE System - Custom Development',
      metadata: {
        userId,
        userEmail: user?.email || '',
        userName: user?.name || '',
        selections: JSON.stringify(selections || {}),
        favorites: JSON.stringify(favorites || {}),
      },
    });

    // Create payment record in database
    const paymentId = `payment_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
    
    // TODO: Save to DB.payments table when created
    // DB.payments.create({
    //   id: paymentId,
    //   userId,
    //   stripePaymentIntentId: paymentIntent.id,
    //   amount,
    //   currency: currency || 'AED',
    //   status: 'pending',
    //   selections,
    //   favorites,
    // });

    // Notify owner
    await notifyOwner({
      type: 'payment_intent_created',
      userId,
      amount,
      currency: currency || 'AED',
      description,
      selections,
      favorites,
      paymentId,
    });

    res.json({
      success: true,
      paymentId,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      publishableKey: STRIPE_PUBLISHABLE_KEY,
      amount,
      currency: currency || 'AED',
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment intent',
    });
  }
});

// Payment Webhook (Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const stripe = await getStripeClient();
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    try {
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        // In development, parse without verification
        event = JSON.parse(req.body.toString());
        console.warn('⚠️ Stripe webhook signature verification skipped (STRIPE_WEBHOOK_SECRET not set)');
      }
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const metadata = paymentIntent.metadata || {};
      
      // Extract user data from metadata
      const userId = metadata.userId;
      const selections = metadata.selections ? JSON.parse(metadata.selections) : {};
      const favorites = metadata.favorites ? JSON.parse(metadata.favorites) : {};
      
      // Update payment status
      // DB.payments.updateStatus(paymentIntent.id, 'succeeded');
      
      // ✅ Send to Auto-Builder
      await sendToBuilder({
        userId,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency,
        selections,
        favorites,
        metadata,
      });
      
      // Notify owner
      await notifyOwner({
        type: 'payment_succeeded',
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        userId,
      });

      // Mark portal as read-only for this user
      // DB.userSettings.update(userId, { portalReadOnly: true });
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// Helper: Send to Auto-Builder
async function sendToBuilder(data) {
  try {
    const io = global.io;
    if (!io) {
      console.warn('⚠️ Socket.IO not available, cannot send to builder');
      return;
    }

    // Create build request
    const buildRequest = {
      id: `build_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`,
      userId: data.userId,
      paymentIntentId: data.paymentIntentId,
      amount: data.amount,
      currency: data.currency,
      selections: data.selections,
      favorites: data.favorites,
      status: 'pending',
      createdAt: Date.now(),
    };

    // Emit to auto-builder namespace
    io.of('/auto-builder').emit('client:request', {
      ...buildRequest,
      type: 'portal_payment',
      clientId: data.userId,
      requestDetails: {
        systems: data.selections.systems || [],
        theme: data.selections.theme,
        font: data.selections.font,
        favorites: data.favorites,
        price: data.amount,
        currency: data.currency,
      },
    });

    console.log('✅ Build request sent to Auto-Builder:', buildRequest.id);
  } catch (error) {
    console.error('Failed to send to builder:', error);
  }
}

// Helper: Notify Owner
async function notifyOwner(data) {
  try {
    console.log('🚨 Owner Notification:', {
      ...data,
      timestamp: new Date().toISOString(),
      ownerPhone: '+971529211077',
      ownerEmail: 'gm@zien-ai.app',
    });

    // Send via Socket.IO to owner dashboard
    const io = global.io;
    if (io) {
      io.of('/client-portal').emit('owner:notification', {
        ...data,
        timestamp: Date.now(),
      });
    }

    // TODO: Send WhatsApp/Email notification
    // const { sendOwnerNotification } = await import('../services/twilioTemplatesService.js');
    // await sendOwnerNotification(data);
  } catch (error) {
    console.error('Failed to notify owner:', error);
  }
}

export default router;
