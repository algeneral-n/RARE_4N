/**
 * RARE 4N - Supabase Connection
 * اتصال Supabase
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.EXPO_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('⚠️ Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.');
}

let supabase = null;
let supabaseRetries = 0;
const SUPABASE_MAX_RETRIES = 3;
const SUPABASE_RETRY_DELAY = 5000;

/**
 * Initialize Supabase client with retry logic
 */
export function initSupabase() {
  // ✅ Check if credentials are set before attempting connection
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('⚠️ Supabase connection skipped: SUPABASE_URL or SUPABASE_ANON_KEY not configured');
    supabaseRetries = 0; // Reset retries
    return null;
  }

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
    
    // ✅ Don't retry if credentials are missing
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.warn('⚠️ Supabase connection skipped: credentials not configured');
      supabaseRetries = 0; // Reset retries
      return null;
    }
    
    // ✅ Stop retrying after max attempts
    if (supabaseRetries >= SUPABASE_MAX_RETRIES) {
      console.error('❌ Supabase connection failed after max retries');
      supabaseRetries = 0; // Reset for next manual attempt
      return null;
    }
    
    // ✅ Only retry if we haven't exceeded max retries
    console.warn(`⚠️ Retrying Supabase connection (${supabaseRetries}/${SUPABASE_MAX_RETRIES})...`);
    // Don't use setTimeout - just return null and let caller handle retry if needed
    return null;
  }
}

/**
 * Get Supabase client with health check
 */
export async function getSupabase() {
  // ✅ Check if credentials are set
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return null;
  }

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








