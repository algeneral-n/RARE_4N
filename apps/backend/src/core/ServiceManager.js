/**
 * RARE 4N - Service Manager
 * إدارة الخدمات مع PM2 - Backend و Cloudflare
 * ✅ جميع الخدمات مرتبطة بـ Cognitive Loop
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class ServiceManager {
  static instance = null;
  #kernel = null;
  #io = null;
  #services = {
    backend: { name: 'rare4n-backend', status: 'stopped', pid: null },
    cloudflare: { name: 'cloudflare-tunnel', status: 'stopped', pid: null },
  };

  constructor() {
    if (ServiceManager.instance) {
      return ServiceManager.instance;
    }
    ServiceManager.instance = this;
  }

  static getInstance() {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  /**
   * Initialize with Kernel (optional)
   */
  async init(kernel = null, io = null) {
    this.#kernel = kernel;
    this.#io = io;
    console.log('✅ Service Manager initialized');
    await this.updateServicesStatus();
  }

  /**
   * Start Backend service
   */
  async startBackend() {
    try {
      const backendPath = process.cwd();
      const { stdout, stderr } = await execAsync(
        `pm2 start src/server.js --name rare4n-backend --cwd "${backendPath}" --interpreter node`
      );
      await this.updateServicesStatus();
      
      if (this.#io) {
        this.#io.emit('service:status', { service: 'backend', status: 'running' });
      }
      
      return { success: true, message: 'Backend started successfully', output: stdout };
    } catch (error) {
      console.error('[ServiceManager] Backend start failed:', error);
      return { success: false, message: error.message || 'Failed to start backend' };
    }
  }

  /**
   * Stop Backend service
   */
  async stopBackend() {
    try {
      const { stdout } = await execAsync('pm2 stop rare4n-backend');
      await this.updateServicesStatus();
      
      if (this.#io) {
        this.#io.emit('service:status', { service: 'backend', status: 'stopped' });
      }
      
      return { success: true, message: 'Backend stopped successfully', output: stdout };
    } catch (error) {
      console.error('[ServiceManager] Backend stop failed:', error);
      return { success: false, message: error.message || 'Failed to stop backend' };
    }
  }

  /**
   * Start Cloudflare Tunnel
   */
  async startCloudflare() {
    try {
      const tunnelId = process.env.CLOUDFLARE_TUNNEL_ID || '8280d872-79cc-4b82-9de8-a86ab4bf9540';
      const { stdout } = await execAsync(
        `pm2 start cloudflared --name cloudflare-tunnel -- tunnel run ${tunnelId}`
      );
      await this.updateServicesStatus();
      
      if (this.#io) {
        this.#io.emit('service:status', { service: 'cloudflare', status: 'running' });
      }
      
      return { success: true, message: 'Cloudflare Tunnel started successfully', output: stdout };
    } catch (error) {
      console.error('[ServiceManager] Cloudflare start failed:', error);
      return { success: false, message: error.message || 'Failed to start Cloudflare tunnel' };
    }
  }

  /**
   * Stop Cloudflare Tunnel
   */
  async stopCloudflare() {
    try {
      const { stdout } = await execAsync('pm2 stop cloudflare-tunnel');
      await this.updateServicesStatus();
      
      if (this.#io) {
        this.#io.emit('service:status', { service: 'cloudflare', status: 'stopped' });
      }
      
      return { success: true, message: 'Cloudflare Tunnel stopped successfully', output: stdout };
    } catch (error) {
      console.error('[ServiceManager] Cloudflare stop failed:', error);
      return { success: false, message: error.message || 'Failed to stop Cloudflare tunnel' };
    }
  }

  /**
   * Restart service
   */
  async restartService(serviceName) {
    try {
      const service = this.#services[serviceName];
      if (!service) {
        return { success: false, message: `Unknown service: ${serviceName}` };
      }

      const { stdout } = await execAsync(`pm2 restart ${service.name}`);
      await this.updateServicesStatus();
      
      if (this.#io) {
        this.#io.emit('service:status', { service: serviceName, status: 'running' });
      }
      
      return { success: true, message: `${serviceName} restarted successfully`, output: stdout };
    } catch (error) {
      console.error(`[ServiceManager] ${serviceName} restart failed:`, error);
      return { success: false, message: error.message || `Failed to restart ${serviceName}` };
    }
  }

  /**
   * Get services status
   */
  async getStatus() {
    await this.updateServicesStatus();
    return { ...this.#services };
  }

  /**
   * Update services status from PM2
   */
  async updateServicesStatus() {
    try {
      const { stdout } = await execAsync('pm2 jlist');
      const apps = JSON.parse(stdout);

      // Reset status
      this.#services.backend.status = 'stopped';
      this.#services.backend.pid = null;
      this.#services.cloudflare.status = 'stopped';
      this.#services.cloudflare.pid = null;

      apps.forEach((app) => {
        if (app.name === 'rare4n-backend') {
          this.#services.backend.status = app.pm2_env?.status === 'online' ? 'running' : 'stopped';
          this.#services.backend.pid = app.pid || null;
        } else if (app.name === 'cloudflare-tunnel') {
          this.#services.cloudflare.status = app.pm2_env?.status === 'online' ? 'running' : 'stopped';
          this.#services.cloudflare.pid = app.pid || null;
        }
      });

      this.emitStatusUpdate();
    } catch (error) {
      console.error('[ServiceManager] Failed to get PM2 status:', error.message);
      // Set to stopped if PM2 is not available
      this.#services.backend.status = 'stopped';
      this.#services.backend.pid = null;
      this.#services.cloudflare.status = 'stopped';
      this.#services.cloudflare.pid = null;
    }
  }

  /**
   * Emit status update to Kernel
   */
  emitStatusUpdate() {
    if (this.#kernel) {
      try {
        this.#kernel.emit({
          type: 'services:status',
          data: { ...this.#services },
        });
      } catch (e) {
        console.warn('[ServiceManager] Kernel emit failed:', e.message);
      }
    }

    if (this.#io) {
      try {
        this.#io.emit('services:status', { ...this.#services });
      } catch (e) {
        console.warn('[ServiceManager] Socket.IO emit failed:', e.message);
      }
    }
  }
}

export default ServiceManager.getInstance();
