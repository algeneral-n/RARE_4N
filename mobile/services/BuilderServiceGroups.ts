/**
 * RARE 4N - Builder Service Groups
 * مجموعات خدمات مقسمة منطقياً
 */

import { API_URL } from './config';

export interface ServiceGroup {
  id: string;
  name: string;
  nameAr: string;
  services: Service[];
  status: 'active' | 'inactive' | 'error';
}

export interface Service {
  id: string;
  name: string;
  nameAr: string;
  type: 'build' | 'deployment' | 'monitoring';
  status: 'running' | 'stopped' | 'error';
  endpoint?: string;
  lastCheck?: number;
}

class BuilderServiceGroups {
  private static instance: BuilderServiceGroups;
  private groups: ServiceGroup[] = [];

  private constructor() {
    this.initializeGroups();
  }

  static getInstance(): BuilderServiceGroups {
    if (!BuilderServiceGroups.instance) {
      BuilderServiceGroups.instance = new BuilderServiceGroups();
    }
    return BuilderServiceGroups.instance;
  }

  private initializeGroups(): void {
    this.groups = [
      {
        id: 'build-services',
        name: 'Build Services',
        nameAr: 'خدمات البناء',
        status: 'active',
        services: [
          {
            id: 'ios-build',
            name: 'iOS Build',
            nameAr: 'بناء iOS',
            type: 'build',
            status: 'stopped',
            endpoint: '/api/builds/ios',
          },
          {
            id: 'android-build',
            name: 'Android Build',
            nameAr: 'بناء Android',
            type: 'build',
            status: 'stopped',
            endpoint: '/api/builds/android',
          },
          {
            id: 'web-build',
            name: 'Web Build',
            nameAr: 'بناء Web',
            type: 'build',
            status: 'stopped',
            endpoint: '/api/builds/web',
          },
        ],
      },
      {
        id: 'deployment-services',
        name: 'Deployment Services',
        nameAr: 'خدمات النشر',
        status: 'active',
        services: [
          {
            id: 'github-deploy',
            name: 'GitHub Deployment',
            nameAr: 'نشر GitHub',
            type: 'deployment',
            status: 'stopped',
            endpoint: '/api/deploy/github',
          },
          {
            id: 'cloudflare-deploy',
            name: 'Cloudflare Deployment',
            nameAr: 'نشر Cloudflare',
            type: 'deployment',
            status: 'stopped',
            endpoint: '/api/deploy/cloudflare',
          },
        ],
      },
      {
        id: 'monitoring-services',
        name: 'Monitoring Services',
        nameAr: 'خدمات المراقبة',
        status: 'active',
        services: [
          {
            id: 'status-monitor',
            name: 'Status Monitor',
            nameAr: 'مراقب الحالة',
            type: 'monitoring',
            status: 'running',
            endpoint: '/api/monitor/status',
          },
          {
            id: 'logs-monitor',
            name: 'Logs Monitor',
            nameAr: 'مراقب السجلات',
            type: 'monitoring',
            status: 'running',
            endpoint: '/api/monitor/logs',
          },
        ],
      },
    ];
  }

  async getGroups(): Promise<ServiceGroup[]> {
    try {
      const response = await fetch(`${API_URL}/api/builds/service-groups`);
      const data = await response.json();
      if (data.success && data.groups) {
        this.groups = data.groups;
      }
    } catch (error) {
      console.error('Get service groups error:', error);
    }
    return this.groups;
  }

  async getGroupStatus(groupId: string): Promise<ServiceGroup | null> {
    try {
      const response = await fetch(`${API_URL}/api/builds/service-groups/${groupId}/status`);
      const data = await response.json();
      if (data.success && data.group) {
        const group = this.groups.find(g => g.id === groupId);
        if (group) {
          group.status = data.group.status;
          group.services = data.group.services;
        }
        return group || null;
      }
    } catch (error) {
      console.error('Get group status error:', error);
    }
    return this.groups.find(g => g.id === groupId) || null;
  }

  async checkServiceStatus(serviceId: string): Promise<Service | null> {
    try {
      const response = await fetch(`${API_URL}/api/builds/services/${serviceId}/status`);
      const data = await response.json();
      if (data.success && data.service) {
        const group = this.groups.find(g => g.services.some(s => s.id === serviceId));
        if (group) {
          const service = group.services.find(s => s.id === serviceId);
          if (service) {
            service.status = data.service.status;
            service.lastCheck = Date.now();
          }
          return service || null;
        }
      }
    } catch (error) {
      console.error('Check service status error:', error);
    }
    return null;
  }

  async startService(serviceId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/builds/services/${serviceId}/start`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        await this.checkServiceStatus(serviceId);
        return true;
      }
    } catch (error) {
      console.error('Start service error:', error);
    }
    return false;
  }

  async stopService(serviceId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/builds/services/${serviceId}/stop`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        await this.checkServiceStatus(serviceId);
        return true;
      }
    } catch (error) {
      console.error('Stop service error:', error);
    }
    return false;
  }

  getGroupsSync(): ServiceGroup[] {
    return this.groups;
  }
}

export default BuilderServiceGroups.getInstance();

