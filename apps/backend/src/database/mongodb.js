/**
 * RARE 4N - MongoDB Connection
 * اتصال MongoDB
 */

import { MongoClient, ServerApiVersion } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is required. Please set it in your .env file.');
}

let client = null;
let db = null;
let connectionRetries = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

/**
 * Initialize MongoDB connection with retry logic and connection pooling
 */
export async function initMongoDB() {
  try {
    if (client && db) {
      // Health check existing connection
      try {
        await client.db('admin').command({ ping: 1 });
        return db;
      } catch (error) {
        console.warn('⚠️ MongoDB health check failed, reconnecting...');
        await closeMongoDB();
      }
    }

    client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      // ✅ Connection Pooling
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    await client.db('admin').command({ ping: 1 });
    
    db = client.db('rare4n');
    connectionRetries = 0; // Reset on success
    console.log('✅ MongoDB connected successfully');

    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    connectionRetries++;
    
    if (connectionRetries < MAX_RETRIES) {
      console.warn(`⚠️ Retrying MongoDB connection (${connectionRetries}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return await initMongoDB(); // Recursive retry
    }
    
    throw error; // Re-throw after max retries
  }
}

/**
 * Get MongoDB database instance with health check
 */
export async function getMongoDB() {
  if (!db || !client) {
    return await initMongoDB();
  }
  
  try {
    // Health check
    await client.db('admin').command({ ping: 1 });
    return db;
  } catch (error) {
    console.warn('⚠️ MongoDB health check failed, reinitializing...');
    await closeMongoDB();
    return await initMongoDB();
  }
}

/**
 * Close MongoDB connection
 */
export async function closeMongoDB() {
  try {
    if (client) {
      await client.close();
      client = null;
      db = null;
      connectionRetries = 0;
      console.log('✅ MongoDB connection closed');
    }
  } catch (error) {
    console.error('❌ MongoDB close error:', error);
  }
}

/**
 * MongoDB Collections
 */
export const Collections = {
  users: 'users',
  sessions: 'sessions',
  conversations: 'conversations',
  files: 'files',
  vault: 'vault',
  builds: 'builds',
  logs: 'logs',
  settings: 'settings',
  awareness: 'awareness',
  consciousness: 'consciousness',
};
