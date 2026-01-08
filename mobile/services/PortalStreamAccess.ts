/**
 * RARE 4N - Portal Stream Access Service
 * Stream Access للبورتال - Real-time updates
 */

import { API_URL } from './config';
import io from 'socket.io-client';

class PortalStreamAccess {
  private static instance: PortalStreamAccess;
  private socket: any = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  private constructor() {}

  static getInstance(): PortalStreamAccess {
    if (!PortalStreamAccess.instance) {
      PortalStreamAccess.instance = new PortalStreamAccess();
    }
    return PortalStreamAccess.instance;
  }

  /**
   * Connect to portal stream
   */
  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(`${API_URL}/client-portal`, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Portal Stream Connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Portal Stream Disconnected');
    });

    // Listen for all events
    this.socket.onAny((event: string, data: any) => {
      const listeners = this.listeners.get(event);
      if (listeners) {
        listeners.forEach((listener) => listener(data));
      }
    });
  }

  /**
   * Disconnect from portal stream
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  /**
   * Subscribe to portal event
   */
  on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(event);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  /**
   * Emit event to portal
   */
  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  /**
   * Get portal data
   */
  async getPortalData(): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/client-portal/data`);
      if (!response.ok) {
        throw new Error(`Failed to get portal data: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Get portal data error:', error);
      throw error;
    }
  }

  /**
   * Update portal data
   */
  async updatePortalData(data: any): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/client-portal/data`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update portal data: ${response.status}`);
      }
    } catch (error) {
      console.error('Update portal data error:', error);
      throw error;
    }
  }
}

export const portalStreamAccess = PortalStreamAccess.getInstance();
export default portalStreamAccess;

 * RARE 4N - Portal Stream Access Service
 * Stream Access للبورتال - Real-time updates
 */

import { API_URL } from './config';
import io from 'socket.io-client';

class PortalStreamAccess {
  private static instance: PortalStreamAccess;
  private socket: any = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  private constructor() {}

  static getInstance(): PortalStreamAccess {
    if (!PortalStreamAccess.instance) {
      PortalStreamAccess.instance = new PortalStreamAccess();
    }
    return PortalStreamAccess.instance;
  }

  /**
   * Connect to portal stream
   */
  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(`${API_URL}/client-portal`, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Portal Stream Connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Portal Stream Disconnected');
    });

    // Listen for all events
    this.socket.onAny((event: string, data: any) => {
      const listeners = this.listeners.get(event);
      if (listeners) {
        listeners.forEach((listener) => listener(data));
      }
    });
  }

  /**
   * Disconnect from portal stream
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  /**
   * Subscribe to portal event
   */
  on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(event);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  /**
   * Emit event to portal
   */
  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  /**
   * Get portal data
   */
  async getPortalData(): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/client-portal/data`);
      if (!response.ok) {
        throw new Error(`Failed to get portal data: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Get portal data error:', error);
      throw error;
    }
  }

  /**
   * Update portal data
   */
  async updatePortalData(data: any): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/client-portal/data`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update portal data: ${response.status}`);
      }
    } catch (error) {
      console.error('Update portal data error:', error);
      throw error;
    }
  }
}

export const portalStreamAccess = PortalStreamAccess.getInstance();
export default portalStreamAccess;


