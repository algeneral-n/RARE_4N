/**
 * RARE 4N - Google OAuth Service
 * خدمة تسجيل الدخول بـ Google
 */

import { API_URL } from './config';
import { storage } from '../utils/storage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  givenName?: string;
  familyName?: string;
}

class GoogleOAuthService {
  private static instance: GoogleOAuthService;
  private currentUser: GoogleUser | null = null;

  private constructor() {
    this.loadUser();
  }

  static getInstance(): GoogleOAuthService {
    if (!GoogleOAuthService.instance) {
      GoogleOAuthService.instance = new GoogleOAuthService();
    }
    return GoogleOAuthService.instance;
  }

  /**
   * Load user from storage
   */
  private async loadUser(): Promise<void> {
    try {
      const stored = await storage.get<GoogleUser>('google:user');
      if (stored) {
        this.currentUser = stored;
      }
    } catch (error) {
      console.error('Load Google user error:', error);
    }
  }

  /**
   * Save user to storage
   */
  private async saveUser(user: GoogleUser): Promise<void> {
    try {
      this.currentUser = user;
      await storage.set('google:user', user);
    } catch (error) {
      console.error('Save Google user error:', error);
    }
  }

  /**
   * Sign in with Google
   */
  async signIn(): Promise<GoogleUser> {
    try {
      const response = await fetch(`${API_URL}/api/auth/google/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Google sign-in failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        await this.saveUser(data.user);
        return data.user;
      }

      throw new Error(data.error || 'Sign-in failed');
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      await fetch(`${API_URL}/api/auth/google/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      this.currentUser = null;
      await storage.remove('google:user');
    } catch (error) {
      console.error('Google sign-out error:', error);
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): GoogleUser | null {
    return this.currentUser;
  }

  /**
   * Check if user is signed in
   */
  isSignedIn(): boolean {
    return this.currentUser !== null;
  }
}

export const googleOAuthService = GoogleOAuthService.getInstance();
export default googleOAuthService;

 * RARE 4N - Google OAuth Service
 * خدمة تسجيل الدخول بـ Google
 */

import { API_URL } from './config';
import { storage } from '../utils/storage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  givenName?: string;
  familyName?: string;
}

class GoogleOAuthService {
  private static instance: GoogleOAuthService;
  private currentUser: GoogleUser | null = null;

  private constructor() {
    this.loadUser();
  }

  static getInstance(): GoogleOAuthService {
    if (!GoogleOAuthService.instance) {
      GoogleOAuthService.instance = new GoogleOAuthService();
    }
    return GoogleOAuthService.instance;
  }

  /**
   * Load user from storage
   */
  private async loadUser(): Promise<void> {
    try {
      const stored = await storage.get<GoogleUser>('google:user');
      if (stored) {
        this.currentUser = stored;
      }
    } catch (error) {
      console.error('Load Google user error:', error);
    }
  }

  /**
   * Save user to storage
   */
  private async saveUser(user: GoogleUser): Promise<void> {
    try {
      this.currentUser = user;
      await storage.set('google:user', user);
    } catch (error) {
      console.error('Save Google user error:', error);
    }
  }

  /**
   * Sign in with Google
   */
  async signIn(): Promise<GoogleUser> {
    try {
      const response = await fetch(`${API_URL}/api/auth/google/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Google sign-in failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        await this.saveUser(data.user);
        return data.user;
      }

      throw new Error(data.error || 'Sign-in failed');
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      await fetch(`${API_URL}/api/auth/google/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      this.currentUser = null;
      await storage.remove('google:user');
    } catch (error) {
      console.error('Google sign-out error:', error);
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): GoogleUser | null {
    return this.currentUser;
  }

  /**
   * Check if user is signed in
   */
  isSignedIn(): boolean {
    return this.currentUser !== null;
  }
}

export const googleOAuthService = GoogleOAuthService.getInstance();
export default googleOAuthService;


