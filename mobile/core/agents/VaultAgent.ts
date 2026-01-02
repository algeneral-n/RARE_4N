/**
 * VaultAgent - Secure Storage and Encryption
 * Manages local SecureStore and backend-encrypted data vault.
 */

import { BaseAgent } from './BaseAgent';
import * as SecureStore from 'expo-secure-store';

import { API_URL } from '../../services/config';

export class VaultAgent extends BaseAgent {
  constructor() {
    super({
      id: 'vault',
      name: 'Vault Agent',
      description: 'Secure Storage and Encryption Hub',
      capabilities: ['store_secure', 'retrieve_secure', 'delete_secure', 'encrypt_data', 'decrypt_data', 'scan_file'],
    });
  }

  protected async onExecuteAction(action: string, parameters: any): Promise<any> {
    switch (action) {
      case 'store_secure':
        return await SecureStore.setItemAsync(parameters.key, String(parameters.value));
      case 'retrieve_secure':
        return await SecureStore.getItemAsync(parameters.key);
      case 'delete_secure':
        return await SecureStore.deleteItemAsync(parameters.key);
      case 'encrypt_data':
        return await this.vaultRequest('/api/vault/encrypt', parameters.data);
      case 'scan_file':
        return await this.vaultRequest(`/api/vault/${parameters.fileId}/scan`, {}, 'POST');
      default:
        throw new Error(`Action ${action} not implemented in VaultAgent`);
    }
  }

  private async vaultRequest(endpoint: string, body: any, method = 'POST') {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: method === 'POST' ? JSON.stringify({ data: body }) : undefined,
    });
    return await response.json();
  }
}