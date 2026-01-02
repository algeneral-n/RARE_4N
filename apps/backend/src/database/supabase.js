/**
 * RARE 4N - Supabase Connection
 * اتصال Supabase
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://fgvrilruqzajstprioqj.supabase.co';
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.EXPO_PUBLIC_SUPABASE_KEY || 'sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy';

let supabase = null;
let supabaseRetries = 0;
const SUPABASE_MAX_RETRIES = 3;
const SUPABASE_RETRY_DELAY = 5000;

/**
 * Initialize Supabase client with retry logic
 */
export function initSupabase() {
  try {
    if (supabase) {
      return supabase;
    }

    supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
      // ✅ Connection options
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'x-client-info': 'rare4n-backend',
        },
      },
    });

    supabaseRetries = 0; // Reset on success
    console.log('✅ Supabase connected successfully');
    return supabase;
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
    supabaseRetries++;
    
    if (supabaseRetries < SUPABASE_MAX_RETRIES) {
      console.warn(`⚠️ Retrying Supabase connection (${supabaseRetries}/${SUPABASE_MAX_RETRIES})...`);
      setTimeout(() => {
        return initSupabase();
      }, SUPABASE_RETRY_DELAY);
      return null;
    }
    
    throw error;
  }
}

/**
 * Get Supabase client with health check
 */
export async function getSupabase() {
  if (!supabase) {
    return initSupabase();
  }
  
  try {
    // Health check - simple query
    const { error } = await supabase.from('_health').select('1').limit(1);
    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist (OK)
      console.warn('⚠️ Supabase health check failed, reinitializing...');
      supabase = null;
      return initSupabase();
    }
    return supabase;
  } catch (error) {
    console.warn('⚠️ Supabase health check error, reinitializing...');
    supabase = null;
    return initSupabase();
  }
}

/**
 * Hybrid Database Strategy
 * Uses MongoDB for main data + Supabase for real-time features
 */
export class HybridDatabase {
  constructor() {
    this.mongodb = null;
    this.supabase = null;
  }

  async init() {
    try {
      // Initialize MongoDB
      const { initMongoDB } = await import('./mongodb.js');
      this.mongodb = await initMongoDB();

      // Initialize Supabase
      this.supabase = initSupabase();

      return {
        mongodb: this.mongodb,
        supabase: this.supabase,
      };
    } catch (error) {
      console.error('HybridDatabase init error:', error);
      throw error;
    }
  }

  /**
   * Save to MongoDB (main storage)
   */
  async saveToMongo(collection, data) {
    if (!this.mongodb) {
      throw new Error('MongoDB not initialized');
    }
    return await this.mongodb.collection(collection).insertOne(data);
  }

  /**
   * Save to Supabase (real-time sync)
   */
  async saveToSupabase(table, data) {
    if (!this.supabase) {
      throw new Error('Supabase not initialized');
    }
    const { data: result, error } = await this.supabase.from(table).insert(data);
    if (error) throw error;
    return result;
  }

  /**
   * Get from MongoDB
   */
  async getFromMongo(collection, query = {}) {
    if (!this.mongodb) {
      throw new Error('MongoDB not initialized');
    }
    return await this.mongodb.collection(collection).find(query).toArray();
  }

  /**
   * Get from Supabase
   */
  async getFromSupabase(table, query = {}) {
    if (!this.supabase) {
      throw new Error('Supabase not initialized');
    }
    const { data, error } = await this.supabase.from(table).select('*').match(query);
    if (error) throw error;
    return data;
  }
}

export default HybridDatabase;








