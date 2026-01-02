/**
 * MapsAgent - Navigation and Geolocation
 * Provides route calculations, location searching, and navigation initiation.
 */

import { BaseAgent } from './BaseAgent';

import { API_URL } from '../../services/config';

export class MapsAgent extends BaseAgent {
  constructor() {
    super({
      id: 'maps',
      name: 'Maps Agent',
      description: 'Maps, Routing, and Navigation Engine',
      capabilities: [
        'get_route',
        'search_location',
        'start_navigation',
        'geocode_address',
      ],
    });
  }

  protected async onExecuteAction(action: string, parameters: any): Promise<any> {
    switch (action) {
      case 'get_route':
        return await this.requestMaps('/api/maps/route', parameters);

      case 'search_location':
        return await this.requestMaps('/api/maps/search', parameters);

      case 'start_navigation':
        return await this.initiateNavigation(parameters);

      case 'geocode_address':
        return await this.requestMaps('/api/maps/geocode', parameters);

      default:
        throw new Error(`Action ${action} not found in MapsAgent`);
    }
  }

  private async requestMaps(endpoint: string, body: any) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.error || 'Map service failed');
    return json;
  }

  private async initiateNavigation(parameters: any) {
    if (!parameters?.from || !parameters?.to) throw new Error('Start and end points required');
    
    // إرسال حدث بدء الملاحة للواجهة لتفعيل شاشة الخرائط
    this.emit('agent:maps:navigation:started', {
      from: parameters.from,
      to: parameters.to,
      timestamp: Date.now()
    });

    return { success: true, message: 'Navigation engine active' };
  }
}