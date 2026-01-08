/**
 * RARE 4N - Google Services Integration
 * Dialogflow, Natural Language, Cloud Storage, Security Scanner, Tenor
 */

import { API_URL } from './config';

// Dialogflow Service
export class DialogflowService {
  async processIntent(text: string, language: string = 'ar'): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/google/dialogflow/intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language }),
      });
      return await response.json();
    } catch (error) {
      console.error('Dialogflow error:', error);
      throw error;
    }
  }
}

// Natural Language Service
export class SentimentAnalysisService {
  async analyzeSentiment(text: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/google/natural-language/sentiment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      return await response.json();
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      throw error;
    }
  }

  async extractEntities(text: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/google/natural-language/entities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      return await response.json();
    } catch (error) {
      console.error('Entity extraction error:', error);
      throw error;
    }
  }
}

// Cloud Storage Service
export class GoogleCloudStorageService {
  async uploadFile(file: any, path: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', path);

      const response = await fetch(`${API_URL}/api/google/cloud-storage/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Cloud storage upload error:', error);
      throw error;
    }
  }

  async downloadFile(path: string): Promise<Blob> {
    try {
      const response = await fetch(`${API_URL}/api/google/cloud-storage/download?path=${encodeURIComponent(path)}`);
      return await response.blob();
    } catch (error) {
      console.error('Cloud storage download error:', error);
      throw error;
    }
  }
}

// Security Scanner Service
export class SecurityScannerService {
  async scanUrl(url: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/google/security-scanner/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      return await response.json();
    } catch (error) {
      console.error('Security scan error:', error);
      throw error;
    }
  }
}

// Tenor Service
export class TenorService {
  async searchGifs(query: string, limit: number = 10): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/api/google/tenor/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      const data = await response.json();
      return data.gifs || [];
    } catch (error) {
      console.error('Tenor search error:', error);
      return [];
    }
  }
}

export const dialogflowService = new DialogflowService();
export const sentimentAnalysisService = new SentimentAnalysisService();
export const cloudStorageService = new GoogleCloudStorageService();
export const securityScannerService = new SecurityScannerService();
export const tenorService = new TenorService();

 * RARE 4N - Google Services Integration
 * Dialogflow, Natural Language, Cloud Storage, Security Scanner, Tenor
 */

import { API_URL } from './config';

// Dialogflow Service
export class DialogflowService {
  async processIntent(text: string, language: string = 'ar'): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/google/dialogflow/intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language }),
      });
      return await response.json();
    } catch (error) {
      console.error('Dialogflow error:', error);
      throw error;
    }
  }
}

// Natural Language Service
export class SentimentAnalysisService {
  async analyzeSentiment(text: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/google/natural-language/sentiment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      return await response.json();
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      throw error;
    }
  }

  async extractEntities(text: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/google/natural-language/entities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      return await response.json();
    } catch (error) {
      console.error('Entity extraction error:', error);
      throw error;
    }
  }
}

// Cloud Storage Service
export class GoogleCloudStorageService {
  async uploadFile(file: any, path: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', path);

      const response = await fetch(`${API_URL}/api/google/cloud-storage/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Cloud storage upload error:', error);
      throw error;
    }
  }

  async downloadFile(path: string): Promise<Blob> {
    try {
      const response = await fetch(`${API_URL}/api/google/cloud-storage/download?path=${encodeURIComponent(path)}`);
      return await response.blob();
    } catch (error) {
      console.error('Cloud storage download error:', error);
      throw error;
    }
  }
}

// Security Scanner Service
export class SecurityScannerService {
  async scanUrl(url: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/google/security-scanner/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      return await response.json();
    } catch (error) {
      console.error('Security scan error:', error);
      throw error;
    }
  }
}

// Tenor Service
export class TenorService {
  async searchGifs(query: string, limit: number = 10): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/api/google/tenor/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      const data = await response.json();
      return data.gifs || [];
    } catch (error) {
      console.error('Tenor search error:', error);
      return [];
    }
  }
}

export const dialogflowService = new DialogflowService();
export const sentimentAnalysisService = new SentimentAnalysisService();
export const cloudStorageService = new GoogleCloudStorageService();
export const securityScannerService = new SecurityScannerService();
export const tenorService = new TenorService();


