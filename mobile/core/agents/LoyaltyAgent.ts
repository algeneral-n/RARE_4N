/**
 * LoyaltyAgent - Loyalty Program Management
 * Handles point checking, rewarding, and historical transaction tracking.
 */

import { BaseAgent } from './BaseAgent';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.zien-ai.app';

export class LoyaltyAgent extends BaseAgent {
  constructor() {
    super({
      id: 'loyalty',
      name: 'Loyalty Agent',
      description: 'Loyalty Program and Rewards Engine',
      capabilities: [
        'check_points',
        'add_points',
        'redeem_reward',
        'get_rewards',
        'get_history',
      ],
    });
  }

  protected async onExecuteAction(action: string, parameters: any): Promise<any> {
    const userId = parameters?.userId;
    if (!userId && action !== 'get_rewards') throw new Error('User ID is required');

    switch (action) {
      case 'check_points':
        return await this.fetchLoyalty(`/api/loyalty/points/${userId}`);

      case 'add_points':
        return await this.postLoyalty('/api/loyalty/points/add', { userId, points: parameters.points });

      case 'redeem_reward':
        return await this.postLoyalty('/api/loyalty/redeem', { userId, rewardId: parameters.rewardId });

      case 'get_rewards':
        return await this.fetchLoyalty('/api/loyalty/rewards');

      case 'get_history':
        return await this.fetchLoyalty(`/api/loyalty/history/${userId}`);

      default:
        throw new Error(`Action ${action} not implemented in LoyaltyAgent`);
    }
  }

  private async fetchLoyalty(endpoint: string) {
    const response = await fetch(`${API_URL}${endpoint}`);
    return await response.json();
  }

  private async postLoyalty(endpoint: string, body: any) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await response.json();
  }
}