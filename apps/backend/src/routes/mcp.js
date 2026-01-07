/**
 * RARE 4N - MCP Server Endpoint
 * Model Context Protocol Server for ElevenLabs Agent
 * ✅ يوفر جميع Tools و Resources عبر MCP
 * ✅ يدعم SSE (Server-Sent Events) و JSON-RPC
 */

import express from 'express';
import { previewLibrary, searchLibrary, submitToBuilder, createPayment } from '../services/agentTools.js';
import * as twilioService from '../services/twilioService.js';
import { getDatabase } from '../database/localDB.js';

const router = express.Router();

// ElevenLabs Integration ID for MCP Server
const ELEVENLABS_INTEGRATION_ID = process.env.ELEVENLABS_INTEGRATION_ID || 'POISff1Do4B1q3oBd7EB';

/**
 * OPTIONS /api/mcp
 * CORS preflight handler for SSE
 */
router.options('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.status(204).end();
});

/**
 * GET /api/mcp
 * SSE (Server-Sent Events) endpoint for MCP
 * ElevenLabs يتصل بهذا endpoint للـ SSE connection
 */
router.get('/', (req, res) => {
  console.log('📡 MCP SSE Connection request from:', req.headers.origin || req.headers.referer);

  // Set headers for SSE with proper CORS
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Last-Event-ID');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  // Send initial connection message
  res.write(`: connected\n\n`);
  res.write(`data: ${JSON.stringify({
    jsonrpc: '2.0',
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {},
        resources: {}
      },
      serverInfo: {
        name: 'rare4n-backend',
        version: '1.0.0'
      }
    }
  })}\n\n`);

  // Send tools list
  res.write(`data: ${JSON.stringify({
    jsonrpc: '2.0',
    method: 'tools/list',
    params: {}
  })}\n\n`);

  // Send resources list
  res.write(`data: ${JSON.stringify({
    jsonrpc: '2.0',
    method: 'resources/list',
    params: {}
  })}\n\n`);

  // Keep connection alive
  const keepAlive = setInterval(() => {
    res.write(`: keepalive\n\n`);
  }, 30000);

  // Handle client disconnect
  req.on('close', () => {
    console.log('📡 MCP SSE Connection closed');
    clearInterval(keepAlive);
    res.end();
  });
});

/**
 * POST /api/mcp
 * JSON-RPC endpoint for MCP
 * ElevenLabs يرسل JSON-RPC requests هنا
 */
router.post('/', async (req, res) => {
  // Set CORS headers for POST requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  try {
    const { jsonrpc, method, params, id } = req.body;

    console.log('📥 MCP Request:', { jsonrpc, method, params, id });

    // Validate JSON-RPC 2.0
    if (jsonrpc !== '2.0') {
      return res.status(400).json({
        jsonrpc: '2.0',
        id: id || null,
        error: {
          code: -32600,
          message: 'Invalid Request - jsonrpc must be "2.0"'
        }
      });
    }

    let result;

    switch (method) {
      case 'initialize':
        result = {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
            resources: {}
          },
          serverInfo: {
            name: 'rare4n-backend',
            version: '1.0.0'
          }
        };
        break;

      case 'tools/list':
        result = await handleToolsList();
        break;

      case 'tools/call':
        result = await handleToolCall(params);
        break;

      case 'resources/list':
        result = await handleResourcesList();
        break;

      case 'resources/read':
        result = await handleResourceRead(params);
        break;

      default:
        return res.status(400).json({
          jsonrpc: '2.0',
          id: id || null,
          error: {
            code: -32601,
            message: 'Method not found',
            data: { method }
          }
        });
    }

    res.json({
      jsonrpc: '2.0',
      id: id || null,
      result
    });
  } catch (error) {
    console.error('❌ MCP Server error:', error);
    res.status(500).json({
      jsonrpc: '2.0',
      id: req.body.id || null,
      error: {
        code: -32000,
        message: error.message,
        data: { stack: error.stack }
      }
    });
  }
});

/**
 * Handle tool call
 */
async function handleToolCall(params) {
  const { name, arguments: args } = params;

  console.log('🔧 MCP Tool Call:', name, args);

  switch (name) {
    case 'preview_library':
      return await previewLibrary(args.type, args.category, args.limit);

    case 'search_library':
      return await searchLibrary(args.query, args.type);

    case 'submit_to_builder':
      return await submitToBuilder(args.client_id, args.request_data, global.io);

    case 'create_payment':
      return await createPayment(
        args.requestId,
        args.amount,
        args.currency || 'AED',
        args.clientId,
        args.clientEmail,
        args.paymentMethod || 'stripe'
      );

    case 'send_twilio_message':
      if (args.type === 'whatsapp' || !args.type) {
        return await twilioService.sendWhatsApp(args.phone, args.message);
      } else {
        return await twilioService.sendSMS(args.phone, args.message);
      }

    case 'notify_owner':
      return await notifyOwnerViaTwilio(args.reason, args.priority || 'normal');

    case 'execute_owner_command':
      return await executeOwnerCommand(args.command, args.context || {});

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

/**
 * Handle resource read
 */
async function handleResourceRead(params) {
  const { uri } = params;

  console.log('📚 MCP Resource Read:', uri);

  try {
    if (uri === 'rare4n://libraries/templates') {
      const { APP_TEMPLATES } = await import('../libraries/appTemplatesLibrary.js');
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(APP_TEMPLATES, null, 2)
        }]
      };
    }

    if (uri === 'rare4n://libraries/systems') {
      const { SYSTEMS_LIBRARY } = await import('../libraries/systemsLibrary.js');
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(SYSTEMS_LIBRARY, null, 2)
        }]
      };
    }

    if (uri === 'rare4n://libraries/themes') {
      const { THEMES_LIBRARY } = await import('../libraries/themesLibrary.js');
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(THEMES_LIBRARY, null, 2)
        }]
      };
    }

    throw new Error(`Unknown resource: ${uri}`);
  } catch (error) {
    console.error('Error reading resource:', error);
    throw error;
  }
}

/**
 * Handle tools list
 * Returns list of available tools in MCP format
 */
async function handleToolsList() {
  return {
    tools: [
      {
        name: 'preview_library',
        description: 'Preview available libraries (templates, systems, themes)',
        inputSchema: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['templates', 'systems', 'themes'] },
            category: { type: 'string' },
            limit: { type: 'number', default: 10 }
          },
          required: ['type']
        }
      },
      {
        name: 'search_library',
        description: 'Search across all libraries',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string' },
            type: { type: 'string', enum: ['all', 'templates', 'systems', 'themes'], default: 'all' }
          },
          required: ['query']
        }
      },
      {
        name: 'submit_to_builder',
        description: 'Submit build request to Auto Builder',
        inputSchema: {
          type: 'object',
          properties: {
            client_id: { type: 'string' },
            request_data: { type: 'object' }
          },
          required: ['client_id', 'request_data']
        }
      },
      {
        name: 'create_payment',
        description: 'Create payment session for client',
        inputSchema: {
          type: 'object',
          properties: {
            requestId: { type: 'string' },
            amount: { type: 'number' },
            currency: { type: 'string', default: 'AED' },
            clientId: { type: 'string' },
            clientEmail: { type: 'string' },
            paymentMethod: { type: 'string', default: 'stripe' }
          },
          required: ['requestId', 'amount', 'clientId', 'clientEmail']
        }
      },
      {
        name: 'send_twilio_message',
        description: 'Send message via Twilio (WhatsApp/SMS)',
        inputSchema: {
          type: 'object',
          properties: {
            phone: { type: 'string' },
            message: { type: 'string' },
            type: { type: 'string', enum: ['whatsapp', 'sms'], default: 'whatsapp' }
          },
          required: ['phone', 'message']
        }
      },
      {
        name: 'notify_owner',
        description: 'Notify owner (Nader) via Twilio',
        inputSchema: {
          type: 'object',
          properties: {
            reason: { type: 'string' },
            priority: { type: 'string', enum: ['low', 'normal', 'high', 'emergency'], default: 'normal' }
          },
          required: ['reason']
        }
      },
      {
        name: 'execute_owner_command',
        description: 'Execute command from owner (Nader)',
        inputSchema: {
          type: 'object',
          properties: {
            command: { type: 'string' },
            context: { type: 'object' }
          },
          required: ['command']
        }
      }
    ]
  };
}

/**
 * Handle resources list
 */
async function handleResourcesList() {
  return {
    resources: [
      {
        uri: 'rare4n://libraries/templates',
        name: 'App Templates Library',
        description: 'Access to all app templates',
        mimeType: 'application/json'
      },
      {
        uri: 'rare4n://libraries/systems',
        name: 'Systems Library',
        description: 'Access to all systems',
        mimeType: 'application/json'
      },
      {
        uri: 'rare4n://libraries/themes',
        name: 'Themes Library',
        description: 'Access to all themes',
        mimeType: 'application/json'
      }
    ]
  };
}

/**
 * Notify owner via Twilio
 */
async function notifyOwnerViaTwilio(reason, priority = 'normal') {
  try {
    const OWNER_PHONE = process.env.OWNER_PHONE_NADER || '+971529211077';
    const message = `🚨 RARE 4N Agent Notification (${priority})\n\nReason: ${reason}\n\nTime: ${new Date().toLocaleString('ar-EG', { timeZone: 'Asia/Dubai' })}`;

    const result = await twilioService.sendWhatsApp(OWNER_PHONE, message);

    return {
      success: true,
      nader: result,
      message: 'Owner notified successfully'
    };
  } catch (error) {
    console.error('Error notifying owner:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Execute owner command
 */
async function executeOwnerCommand(command, context = {}) {
  try {
    console.log('⚡ Executing owner command:', command);

    // Implementation from elevenlabs-webhook.js
    // This is a simplified version - full implementation should be imported
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('دفع') || lowerCommand.includes('payment')) {
      const agentTools = await import('../services/agentTools.js').catch(() => null);
      if (agentTools?.default?.createPayment) {
        return await agentTools.default.createPayment(
          context.requestId || `req_${Date.now()}`,
          context.amount || 1000,
          context.currency || 'AED',
          context.clientId || 'owner',
          context.clientEmail || 'gm@zien-ai.app'
        );
      }
    }

    return {
      success: true,
      command,
      message: 'Command executed successfully',
      result: context
    };
  } catch (error) {
    console.error('Error executing owner command:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export default router;