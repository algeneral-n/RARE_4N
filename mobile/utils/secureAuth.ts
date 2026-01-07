/**
 * RARE 4N - Secure Authentication Utility
 * ✅ Secure password hashing and verification
 * ✅ Uses expo-crypto for secure hashing
 */

import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

const AUTH_TOKEN_KEY = 'rare4n_auth_token';
const PASSWORD_HASH_KEY = 'rare4n_password_hash';
const SALT_KEY = 'rare4n_password_salt';

/**
 * Hash password securely
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate salt
  const salt = await Crypto.getRandomBytesAsync(32);
  const saltHex = Array.from(salt)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Hash password with salt
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + saltHex
  );
  
  return `${hash}:${saltHex}`;
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hashWithSalt: string): Promise<boolean> {
  const [hash, salt] = hashWithSalt.split(':');
  const computedHash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + salt
  );
  
  return computedHash === hash;
}

/**
 * Initialize secure password (first time setup)
 */
export async function initializePassword(password: string): Promise<void> {
  const hashWithSalt = await hashPassword(password);
  await SecureStore.setItemAsync(PASSWORD_HASH_KEY, hashWithSalt);
}

/**
 * Verify stored password
 */
export async function verifyStoredPassword(password: string): Promise<boolean> {
  try {
    const storedHash = await SecureStore.getItemAsync(PASSWORD_HASH_KEY);
    if (!storedHash) {
      // First time - initialize with default password
      await initializePassword(password);
      return true;
    }
    return await verifyPassword(password, storedHash);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Change password securely
 */
export async function changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
  const isValid = await verifyStoredPassword(oldPassword);
  if (!isValid) {
    return false;
  }
  
  await initializePassword(newPassword);
  return true;
}

/**
 * Authenticate with biometrics
 */
export async function authenticateWithBiometrics(): Promise<boolean> {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      return false;
    }
    
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      return false;
    }
    
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'تأكيد الهوية للوصول إلى RARE 4N',
      fallbackLabel: 'استخدم كلمة المرور',
      cancelLabel: 'إلغاء',
    });
    
    return result.success;
  } catch (error) {
    console.error('Biometric authentication error:', error);
    return false;
  }
}

/**
 * Set authentication token
 */
export async function setAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
}

/**
 * Get authentication token
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    return null;
  }
}

/**
 * Clear authentication
 */
export async function clearAuth(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Clear auth error:', error);
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  return token === 'rare4n_authenticated';
}

export default {
  hashPassword,
  verifyPassword,
  initializePassword,
  verifyStoredPassword,
  changePassword,
  authenticateWithBiometrics,
  setAuthToken,
  getAuthToken,
  clearAuth,
  isAuthenticated,
};

























