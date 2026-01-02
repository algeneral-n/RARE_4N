import express from 'express';
import { DB } from '../database/localDB.js';
import {
  createPaymentIntent,
  createCheckoutSession,
  getPaymentStatus
} from '../services/paymentService.js';
import { requireAuth } from '../middleware/userIsolation.js';

const router = express.Router();

// الوظيفة دي بتجبر العملة تكون درهم إماراتي
const DEFAULT_CURRENCY = 'AED';

/**
 * POST /api/financial/invoice
 * Create invoice
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/invoice', requireAuth, (req, res) => {
  try {
    const userId = req.userId; // From requireAuth middleware
    const { clientName, items, tax = 5 } = req.body; // الضريبة في الإمارات 5%
    
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const taxAmount = subtotal * (tax / 100);
    const total = subtotal + taxAmount;

    const invoice = { 
      id: `INV-UAE-${Date.now()}`, 
      userId, 
      clientName, 
      items, 
      subtotal, 
      tax, 
      taxAmount, 
      total, 
      currency: DEFAULT_CURRENCY, // مثبتة درهم
      status: 'pending' 
    };

    DB.invoices.create(invoice);
    res.json({ success: true, invoice });
  } catch (error) { res.status(500).json({ error: 'خطأ في إنشاء الفاتورة الإماراتي' }); }
});

/**
 * POST /api/financial/create-session
 * Create payment session
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/create-session', requireAuth, async (req, res) => {
  try {
    const { amount, metadata = {} } = req.body;
    // نمرر AED كعملة أساسية للسيرفس
    const session = await createCheckoutSession(amount, DEFAULT_CURRENCY, metadata);
    res.json({ success: true, url: session.url });
  } catch (error) { res.status(500).json({ error: 'فشل في فتح بوابة الدفع بالدرهم' }); }
});

export default router;