/**
 * RARE 4N - Security Scanner Service
 * ربط مع Google Web Security Scanner API
 */

import { API_URL } from './config';

export interface SecurityScanResult {
  vulnerabilities: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
  }>;
  score: number;
  status: 'safe' | 'warning' | 'critical';
}

class SecurityScannerService {
  private static instance: SecurityScannerService;

  private constructor() {}

  static getInstance(): SecurityScannerService {
    if (!SecurityScannerService.instance) {
      SecurityScannerService.instance = new SecurityScannerService();
    }
    return SecurityScannerService.instance;
  }

  async scanUrl(url: string): Promise<SecurityScanResult> {
    try {
      const response = await fetch(`${API_URL}/api/security/scan-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
        }),
      });

      const data = await response.json();

      if (data.success && data.result) {
        return this.formatScanResult(data.result);
      }

      throw new Error(data.error || 'Failed to scan URL');
    } catch (error: any) {
      console.error('Security scan error:', error);
      throw error;
    }
  }

  async scanCode(code: string, language: string): Promise<SecurityScanResult> {
    try {
      const response = await fetch(`${API_URL}/api/security/scan-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      const data = await response.json();

      if (data.success && data.result) {
        return this.formatScanResult(data.result);
      }

      throw new Error(data.error || 'Failed to scan code');
    } catch (error: any) {
      console.error('Security scan code error:', error);
      throw error;
    }
  }

  async scanFile(fileId: string): Promise<SecurityScanResult> {
    try {
      const response = await fetch(`${API_URL}/api/security/scan-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId,
        }),
      });

      const data = await response.json();

      if (data.success && data.result) {
        return this.formatScanResult(data.result);
      }

      throw new Error(data.error || 'Failed to scan file');
    } catch (error: any) {
      console.error('Security scan file error:', error);
      throw error;
    }
  }

  private formatScanResult(result: any): SecurityScanResult {
    const vulnerabilities = result.vulnerabilities || [];
    const criticalCount = vulnerabilities.filter((v: any) => v.severity === 'critical').length;
    const highCount = vulnerabilities.filter((v: any) => v.severity === 'high').length;

    let status: 'safe' | 'warning' | 'critical' = 'safe';
    if (criticalCount > 0) {
      status = 'critical';
    } else if (highCount > 0) {
      status = 'warning';
    }

    const score = Math.max(0, 100 - (criticalCount * 20 + highCount * 10 + vulnerabilities.length * 5));

    return {
      vulnerabilities,
      score,
      status,
    };
  }
}

export default SecurityScannerService.getInstance();

