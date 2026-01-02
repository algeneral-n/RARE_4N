/**
 * RARE 4N - Builder Agent
 * Core engine for Auto App Building, Code Generation, and AI Media Creation.
 * Integrates via Socket.IO for real-time terminal output and HTTP for file uploads.
 */

import { BaseAgent } from './BaseAgent';
import io from 'socket.io-client';

import { API_URL } from '../../services/config';

export class BuilderAgent extends BaseAgent {
  private socket: any;

  constructor() {
    super({
      id: 'builder',
      name: 'Builder Agent',
      description: 'Auto Builder and App Generation Engine',
      capabilities: [
        'build_app',
        'get_templates',
        'get_themes',
        'get_systems',
        'execute_command',
        'upload_files',
        'list_builds',
        'generate_code',
        'generate_image',
        'generate_video',
        'generate_presentation',
        'generate_html',
      ],
    });
  }

  /**
   * onInit: إنشاء الاتصال الحي بالسيرفر لمتابعة عملية البناء لحظة بلحظة.
   */
  protected async onInit(): Promise<void> {
    this.socket = io(`${API_URL}/auto-builder`, {
      transports: ['websocket'],
      reconnection: true,
    });

    this.socket.on('connect', () => {
      console.log('[BuilderAgent] Connected to build-server pipeline');
    });

    this.socket.on('terminal:output', (data: any) => {
      // إرسال مخرجات الـ Terminal للواجهة لعرض التقدم للمستخدم
      this.emit('builder:terminal:output', data);
    });

    this.socket.on('build:complete', (data: any) => {
      this.emit('builder:build:complete', data);
    });

    this.socket.on('error', (error: any) => {
      console.error('[BuilderAgent] Socket Error:', error);
      this.emit('builder:error', error);
    });
  }

  protected async onStart(): Promise<void> {}

  protected async onStop(): Promise<void> {
    if (this.socket) this.socket.disconnect();
  }

  /**
   * onExecuteAction: تنفيذ الأوامر الصادرة من الـ Cognitive Loop.
   */
  protected async onExecuteAction(action: string, parameters: any): Promise<any> {
    switch (action) {
      case 'build_app':
        if (!parameters.projectName) throw new Error('Project name is required');
        return await this.buildApp(parameters);

      case 'execute_command':
        if (!parameters.command) throw new Error('Command text is required');
        return await this.executeCommand(parameters.command);

      case 'generate_code':
        return await this.generateAIContent('codegen', parameters);

      case 'generate_image':
        return await this.generateAIContent('codegen/image', parameters);

      default:
        throw new Error(`Action ${action} is not implemented in BuilderAgent`);
    }
  }

  /**
   * buildApp: بدء عملية بناء التطبيق ورفع الملفات اللازمة.
   */
  private async buildApp(parameters: any): Promise<any> {
    const formData = new FormData();
    Object.keys(parameters).forEach(key => {
      if (key !== 'files') formData.append(key, parameters[key]);
    });

    if (parameters.files) {
      parameters.files.forEach((file: any) => {
        formData.append('files', {
          uri: file.uri,
          name: file.name,
          type: file.type || 'application/octet-stream',
        } as any);
      });
    }

    try {
      const response = await fetch(`${API_URL}/api/auto-builder/build`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = await response.json();

      if (data.success) {
        // إشعار العميل اكتمال البناء عبر نظام التكامل
        const { TerminalIntegrationService } = await import('../services/TerminalIntegrationService');
        const integration = new TerminalIntegrationService();
        
        if (data.clientEmail) {
          await integration.notifyClientComprehensive(
            data.clientId, data.clientPhone, data.clientEmail,
            `تم اكتمال بناء مشروعك: ${data.projectName}`, data.downloadUrl
          );
        }
        return data;
      }
      throw new Error(data.error || 'Build process failed');
    } catch (error: any) {
      this.emit('agent:builder:error', { error: error.message });
      throw error;
    }
  }

  private async executeCommand(command: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.emit('terminal:command', { command });
      this.socket.once('terminal:output', (data: any) => {
        if (data.error) reject(new Error(data.error));
        else resolve(data);
      });
    });
  }

  private async generateAIContent(endpoint: string, params: any): Promise<any> {
    const response = await fetch(`${API_URL}/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await response.json();
  }
}