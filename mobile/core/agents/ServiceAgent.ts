/**
 * ServiceAgent - System Service Control
 * Monitors and controls Backend, Cloudflare, and Widget statuses.
 */

import { BaseAgent } from './BaseAgent';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.zien-ai.app';

export class ServiceAgent extends BaseAgent {
  constructor() {
    super({
      id: 'service',
      name: 'Service Agent',
      description: 'Infrastructure and Service Monitoring',
      capabilities: ['control_backend', 'control_cloudflare', 'control_widget', 'check_service_status'],
    });
  }

  protected async onExecuteAction(action: string, parameters: any): Promise<any> {
    const service = parameters?.service || parameters?.command;
    
    switch (action) {
      case 'check_service_status':
        const response = await fetch(`${API_URL}/api/services/${service}/status`);
        return await response.json();
      case 'control_backend':
      case 'control_cloudflare':
        const ctrlRes = await fetch(`${API_URL}/api/services/${action.split('_')[1]}/${parameters.command}`, { method: 'POST' });
        return await ctrlRes.json();
      default:
        throw new Error(`Service action ${action} unknown`);
    }
  }
}