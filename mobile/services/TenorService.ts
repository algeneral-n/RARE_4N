/**
 * RARE 4N - Tenor Service
 * ربط مع Google Tenor API
 */

import { API_URL } from './config';

export interface GIFResult {
  id: string;
  url: string;
  preview: string;
  title: string;
  width: number;
  height: number;
}

class TenorService {
  private static instance: TenorService;

  private constructor() {}

  static getInstance(): TenorService {
    if (!TenorService.instance) {
      TenorService.instance = new TenorService();
    }
    return TenorService.instance;
  }

  async search(query: string, limit: number = 20): Promise<GIFResult[]> {
    try {
      const response = await fetch(`${API_URL}/api/tenor/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          limit,
        }),
      });

      const data = await response.json();

      if (data.success && data.gifs) {
        return data.gifs.map((gif: any) => ({
          id: gif.id,
          url: gif.url,
          preview: gif.preview,
          title: gif.title,
          width: gif.width,
          height: gif.height,
        }));
      }

      throw new Error(data.error || 'Failed to search GIFs');
    } catch (error: any) {
      console.error('Tenor search error:', error);
      throw error;
    }
  }

  async getTrending(limit: number = 20): Promise<GIFResult[]> {
    try {
      const response = await fetch(`${API_URL}/api/tenor/trending`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit,
        }),
      });

      const data = await response.json();

      if (data.success && data.gifs) {
        return data.gifs.map((gif: any) => ({
          id: gif.id,
          url: gif.url,
          preview: gif.preview,
          title: gif.title,
          width: gif.width,
          height: gif.height,
        }));
      }

      throw new Error(data.error || 'Failed to get trending GIFs');
    } catch (error: any) {
      console.error('Tenor trending error:', error);
      throw error;
    }
  }

  async getCategories(): Promise<Array<{ name: string; searchterm: string }>> {
    try {
      const response = await fetch(`${API_URL}/api/tenor/categories`);
      const data = await response.json();

      if (data.success && data.categories) {
        return data.categories;
      }

      throw new Error(data.error || 'Failed to get categories');
    } catch (error: any) {
      console.error('Tenor categories error:', error);
      throw error;
    }
  }
}

export default TenorService.getInstance();

