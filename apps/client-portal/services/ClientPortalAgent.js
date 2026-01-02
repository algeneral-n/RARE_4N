/**
 * RARE 4N - Client Portal Agent
 * Agent ذكي في Client Portal
 * ✅ يلبي جميع الطلبات
 * ✅ يعرض المكتبات ويقترح على العميل
 * ✅ يأخذ الطلب صوتياً أو كتابياً
 * ✅ يحفظ المعلومات ويرسلها لإشعارات Builder
 * ✅ ينشئ عملية الدفع
 * ✅ يتواصل مع المالك على رقمه وإيميله
 */

import { CONFIG } from '../config.js';
import io from 'socket.io-client';

export class ClientPortalAgent {
    constructor() {
        this.config = CONFIG;
        this.socket = null;
        this.isActive = false;
        this.currentClient = null;
        this.conversationHistory = [];
        this.learnedPreferences = {};
    }

    /**
     * Initialize Agent
     */
    async init() {
        try {
            // Initialize Socket.IO
            this.socket = io(this.config.api.socketUrl + '/client-portal', {
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 5,
            });

            this.socket.on('connect', () => {
                console.log('✅ Client Portal Agent Connected');
                this.isActive = true;
            });

            this.socket.on('agent:response', (data) => {
                this.handleAgentResponse(data);
            });

            // Listen for voice input
            this.setupVoiceListeners();

            console.log('✅ Client Portal Agent Initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Client Portal Agent:', error);
        }
    }

    /**
     * Setup voice listeners
     */
    setupVoiceListeners() {
        // Listen for voice transcription from ElevenLabs widget
        if (window.ElevenLabsConvAI) {
            window.ElevenLabsConvAI.on('transcription', (data) => {
                this.processVoiceInput(data.text, data.audio);
            });
        }

        // Listen for text input
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('agent-input')) {
                this.processTextInput(e.target.value);
            }
        });
    }

    /**
     * Process voice input
     */
    async processVoiceInput(text, audioUri) {
        if (!this.isActive) return;

        try {
            // Add to conversation history
            this.conversationHistory.push({
                type: 'user',
                text,
                timestamp: Date.now(),
                inputType: 'voice',
            });

            // Send to backend with full context
            if (this.socket?.connected) {
                this.socket.emit('agent:input', {
                    text,
                    audioUri,
                    client: this.currentClient,
                    context: {
                        conversationHistory: this.conversationHistory.slice(-10),
                        learnedPreferences: this.learnedPreferences,
                        currentPage: this.getCurrentPage(),
                    },
                    loyalty: {
                        owner: 'Nader',
                        absoluteLoyalty: true,
                        notifyOwner: true,
                    },
                });
            }

            // Show in UI
            this.displayUserMessage(text, 'voice');
        } catch (error) {
            console.error('Failed to process voice input:', error);
        }
    }

    /**
     * Process text input
     */
    async processTextInput(text) {
        if (!text.trim() || !this.isActive) return;

        try {
            // Add to conversation history
            this.conversationHistory.push({
                type: 'user',
                text,
                timestamp: Date.now(),
                inputType: 'text',
            });

            // Send to backend
            if (this.socket?.connected) {
                this.socket.emit('agent:input', {
                    text,
                    client: this.currentClient,
                    context: {
                        conversationHistory: this.conversationHistory.slice(-10),
                        learnedPreferences: this.learnedPreferences,
                        currentPage: this.getCurrentPage(),
                    },
                    loyalty: {
                        owner: 'Nader',
                        absoluteLoyalty: true,
                        notifyOwner: true,
                    },
                });
            }

            // Show in UI
            this.displayUserMessage(text, 'text');
        } catch (error) {
            console.error('Failed to process text input:', error);
        }
    }

    /**
     * Handle agent response
     */
    async handleAgentResponse(data) {
        try {
            const { response, intent, actions, suggestions, libraries } = data;

            // Add to conversation history
            this.conversationHistory.push({
                type: 'agent',
                text: response,
                timestamp: Date.now(),
                intent,
            });

            // Display response
            this.displayAgentMessage(response, intent);

            // Handle intent
            await this.handleIntent(intent, actions);

            // Show libraries if suggested
            if (libraries && libraries.length > 0) {
                this.displayLibraries(libraries);
            }

            // Show suggestions
            if (suggestions && suggestions.length > 0) {
                this.displaySuggestions(suggestions);
            }

            // Update learned preferences
            if (data.learning) {
                this.updateLearning(data.learning);
            }
        } catch (error) {
            console.error('Failed to handle agent response:', error);
        }
    }

    /**
     * Handle intent and actions
     */
    async handleIntent(intent, actions) {
        switch (intent) {
            case 'request_app':
            case 'request_system':
            case 'request_theme':
                await this.handleProjectRequest(actions);
                break;

            case 'view_libraries':
                await this.showLibraries();
                break;

            case 'create_payment':
                await this.createPayment(actions);
                break;

            case 'contact_owner':
                await this.contactOwner(actions);
                break;

            default:
                console.log('Unknown intent:', intent);
        }
    }

    /**
     * Handle project request
     */
    async handleProjectRequest(actions) {
        try {
            const request = {
                id: `req_${Date.now()}`,
                clientId: this.currentClient?.id || `client_${Date.now()}`,
                clientName: this.currentClient?.name || 'Unknown',
                clientEmail: this.currentClient?.email || '',
                type: actions?.type || 'template',
                description: actions?.description || '',
                selectedItem: actions?.selectedItem || null,
                status: 'pending',
                paymentStatus: 'pending',
                createdAt: new Date().toISOString(),
            };

            // Save client info
            if (actions?.clientInfo) {
                this.currentClient = {
                    ...this.currentClient,
                    ...actions.clientInfo,
                };
            }

            // Send to Builder
            if (this.socket?.connected) {
                this.socket.emit('client:request', request);
            }

            // Notify owner via Twilio
            await this.notifyOwner(request);

            // Show success message
            this.displayAgentMessage(
                `تم استلام طلبك بنجاح! سيتم التواصل معك قريباً.`,
                'success'
            );
        } catch (error) {
            console.error('Failed to handle project request:', error);
        }
    }

    /**
     * Show libraries
     */
    async showLibraries() {
        try {
            // Navigate to libraries page
            window.location.hash = '#libraries';

            // Load libraries
            const response = await fetch(`${this.config.api.baseUrl}/api/libraries`);
            const data = await response.json();

            if (data.success && data.libraries) {
                this.displayLibraries(data.libraries);
            }
        } catch (error) {
            console.error('Failed to show libraries:', error);
        }
    }

    /**
     * Create payment
     */
    async createPayment(actions) {
        try {
            const { amount, requestId, method = 'stripe' } = actions;

            if (!amount || amount <= 0) {
                this.displayAgentMessage('المبلغ غير صحيح', 'error');
                return;
            }

            // Create payment session
            const response = await fetch(`${this.config.api.baseUrl}/api/payments/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    requestId,
                    method, // 'apple_pay' or 'stripe'
                    clientId: this.currentClient?.id,
                    successUrl: `${window.location.origin}/#payment-success`,
                    cancelUrl: `${window.location.origin}/#payment-cancel`,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Initialize payment based on method
                if (method === 'apple_pay') {
                    await this.initiateApplePay(data.sessionId, amount);
                } else if (method === 'stripe') {
                    await this.initiateStripe(data.clientSecret, data.paymentIntentId);
                }
            } else {
                this.displayAgentMessage(`فشل إنشاء عملية الدفع: ${data.error}`, 'error');
            }
        } catch (error) {
            console.error('Failed to create payment:', error);
            this.displayAgentMessage('حدث خطأ في إنشاء عملية الدفع', 'error');
        }
    }

    /**
     * Initiate Apple Pay
     */
    async initiateApplePay(sessionId, amount) {
        // Apple Pay integration
        if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
            const session = new ApplePaySession(3, {
                countryCode: 'AE',
                currencyCode: 'AED',
                supportedNetworks: ['visa', 'masterCard', 'amex'],
                merchantCapabilities: ['supports3DS'],
                total: {
                    label: 'RARE 4N Project',
                    amount: amount.toFixed(2),
                },
            });

            session.onvalidatemerchant = async (event) => {
                try {
                    const validationURL = event.validationURL;
                    // Validate with backend
                    const response = await fetch(`${this.config.api.baseUrl}/api/payments/apple-pay/validate`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ validationURL, sessionId }),
                    });
                    const data = await response.json();
                    if (data.success) {
                        session.completeMerchantValidation(data.merchantSession);
                    } else {
                        session.abort();
                        this.displayAgentMessage('فشل التحقق من Apple Pay', 'error');
                    }
                } catch (error) {
                    console.error('Apple Pay validation error:', error);
                    session.abort();
                    this.displayAgentMessage('حدث خطأ في التحقق من Apple Pay', 'error');
                }
            };

            session.onpaymentauthorized = async (event) => {
                try {
                    // Process payment
                    const response = await fetch(`${this.config.api.baseUrl}/api/payments/apple-pay/process`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            sessionId,
                            payment: event.payment,
                            amount,
                            currency: 'aed',
                        }),
                    });
                    const data = await response.json();
                    if (data.success) {
                        session.completePayment(0); // Success
                        this.displayAgentMessage('تم الدفع بنجاح!', 'success');
                        // Notify builder
                        if (this.socket?.connected) {
                            this.socket.emit('payment:completed', {
                                sessionId,
                                transactionId: data.transactionId,
                                amount,
                            });
                        }
                    } else {
                        session.completePayment(1); // Failure
                        this.displayAgentMessage('فشل الدفع', 'error');
                    }
                } catch (error) {
                    console.error('Apple Pay processing error:', error);
                    session.completePayment(1);
                    this.displayAgentMessage('حدث خطأ في معالجة الدفع', 'error');
                }
            };

            session.begin();
        } else {
            this.displayAgentMessage('Apple Pay غير متاح على هذا الجهاز', 'error');
        }
    }

    /**
     * Initiate Stripe
     */
    async initiateStripe(clientSecret, paymentIntentId) {
        try {
            // Get publishable key from backend
            const keyResponse = await fetch(`${this.config.api.baseUrl}/api/payments/publishable-key`);
            const keyData = await keyResponse.json();

            if (!keyData.success || !keyData.publishableKey) {
                this.displayAgentMessage('Stripe غير متاح حالياً', 'error');
                return;
            }

            // Load Stripe.js if not already loaded
            if (!window.Stripe) {
                const script = document.createElement('script');
                script.src = 'https://js.stripe.com/v3/';
                script.onload = () => this.initiateStripePayment(keyData.publishableKey, clientSecret, paymentIntentId);
                document.head.appendChild(script);
            } else {
                await this.initiateStripePayment(keyData.publishableKey, clientSecret, paymentIntentId);
            }
        } catch (error) {
            console.error('Stripe initiation error:', error);
            this.displayAgentMessage('حدث خطأ في بدء عملية الدفع', 'error');
        }
    }

    /**
     * Initiate Stripe Payment
     */
    async initiateStripePayment(publishableKey, clientSecret, paymentIntentId) {
        try {
            const stripe = Stripe(publishableKey);
            const { error } = await stripe.confirmPayment({
                elements: stripe.elements({ clientSecret }),
                confirmParams: {
                    return_url: `${window.location.origin}/#payment-success`,
                },
            });

            if (error) {
                console.error('Stripe error:', error);
                this.displayAgentMessage(`خطأ في الدفع: ${error.message}`, 'error');
            } else {
                // Verify payment
                const verifyResponse = await fetch(`${this.config.api.baseUrl}/api/payments/stripe/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentIntentId }),
                });
                const verifyData = await verifyResponse.json();
                if (verifyData.success) {
                    this.displayAgentMessage('تم الدفع بنجاح!', 'success');
                    // Notify builder
                    if (this.socket?.connected) {
                        this.socket.emit('payment:completed', {
                            paymentIntentId,
                            amount: verifyData.amount,
                            currency: verifyData.currency,
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Stripe payment error:', error);
            this.displayAgentMessage('حدث خطأ في معالجة الدفع', 'error');
        }
    }

    /**
     * Contact owner
     */
    async contactOwner(actions) {
        try {
            const { message, type } = actions; // 'sms', 'whatsapp', or 'email'

            if (type === 'sms' || type === 'whatsapp') {
                // Send SMS or WhatsApp via Twilio
                const endpoint = type === 'whatsapp' ? '/api/twilio/send-whatsapp' : '/api/twilio/send-sms';
                const response = await fetch(`${this.config.api.baseUrl}${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: this.config.communication.phone.primary,
                        message: `New message from client ${this.currentClient?.name || 'Unknown'}: ${message}`,
                        from: this.currentClient?.phone || 'Unknown',
                    }),
                });
                const result = await response.json();
                if (result.success) {
                    this.displayAgentMessage('تم إرسال رسالتك للمالك بنجاح!', 'success');
                } else {
                    this.displayAgentMessage('فشل إرسال الرسالة. يرجى المحاولة لاحقاً.', 'error');
                }
            } else if (type === 'email') {
                // Send email
                const response = await fetch(`${this.config.api.baseUrl}/api/email/send`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: this.config.communication.email.primary,
                        subject: 'New Client Message',
                        body: message,
                        from: this.currentClient?.email || 'Unknown',
                    }),
                });
                const result = await response.json();
                if (result.success) {
                    this.displayAgentMessage('تم إرسال رسالتك للمالك بنجاح!', 'success');
                } else {
                    this.displayAgentMessage('فشل إرسال الرسالة. يرجى المحاولة لاحقاً.', 'error');
                }
            }
        } catch (error) {
            console.error('Failed to contact owner:', error);
            this.displayAgentMessage('حدث خطأ في إرسال الرسالة.', 'error');
        }
    }

    /**
     * Notify owner
     */
    async notifyOwner(request) {
        try {
            const message = `New client request from ${request.clientName || 'Unknown'}\nType: ${request.type}\nDescription: ${request.description || 'No description'}\nEmail: ${request.clientEmail || 'No email'}`;

            // Send SMS via Twilio
            const smsResponse = await fetch(`${this.config.api.baseUrl}/api/twilio/send-sms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: this.config.communication.phone.primary,
                    message: message,
                }),
            });
            const smsResult = await smsResponse.json();
            if (smsResult.success) {
                console.log('✅ Owner notified via SMS');
            }

            // Send WhatsApp via Twilio
            const whatsappResponse = await fetch(`${this.config.api.baseUrl}/api/twilio/send-whatsapp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: this.config.communication.phone.whatsapp || this.config.communication.phone.primary,
                    message: message,
                }),
            });
            const whatsappResult = await whatsappResponse.json();
            if (whatsappResult.success) {
                console.log('✅ Owner notified via WhatsApp');
            }

            // Send email
            const emailResponse = await fetch(`${this.config.api.baseUrl}/api/email/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: this.config.communication.email.primary,
                    subject: 'New Client Request - RARE 4N',
                    body: JSON.stringify(request, null, 2),
                }),
            });
            const emailResult = await emailResponse.json();
            if (emailResult.success) {
                console.log('✅ Owner notified via Email');
            }
        } catch (error) {
            console.error('Failed to notify owner:', error);
        }
    }

    /**
     * Display libraries
     */
    displayLibraries(libraries) {
        // Update UI with libraries
        const librariesContainer = document.getElementById('libraries-container');
        if (librariesContainer) {
            librariesContainer.innerHTML = libraries
                .map(
                    (lib) => `
                <div class="library-item">
                    <h3>${lib.name}</h3>
                    <p>${lib.description}</p>
                    <button onclick="agent.selectLibrary('${lib.id}')">Select</button>
                </div>
            `
                )
                .join('');
        }
    }

    /**
     * Display suggestions
     */
    displaySuggestions(suggestions) {
        // Show suggestions in UI
        console.log('Suggestions:', suggestions);
    }

    /**
     * Display user message
     */
    displayUserMessage(text, type) {
        // Show in chat UI
        console.log('User:', text, type);
    }

    /**
     * Display agent message
     */
    displayAgentMessage(text, intent) {
        // Show in chat UI
        console.log('Agent:', text, intent);
    }

    /**
     * Update learning
     */
    updateLearning(learning) {
        Object.assign(this.learnedPreferences, learning);
    }

    /**
     * Get current page
     */
    getCurrentPage() {
        return window.location.hash.replace('#', '') || 'home';
    }
}

// Export singleton
export const clientPortalAgent = new ClientPortalAgent();

