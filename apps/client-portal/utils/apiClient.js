/**
 * API Client Utility
 * Wrapper for fetch that automatically adds X-Portal-Key header
 * 
 * ✅ SECURITY: Ensures all Portal-to-Backend API calls include authentication
 */

import { CONFIG } from '../config.js';

/**
 * Fetch wrapper that automatically adds X-Portal-Key header
 * @param {string} url - API endpoint URL
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>}
 */
export async function apiFetch(url, options = {}) {
  // Ensure URL is absolute (starts with http) or relative to API base
  const fullUrl = url.startsWith('http') ? url : `${CONFIG.api.baseUrl}${url}`;
  
  // Merge headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // ✅ SECURITY: Add X-Portal-Key header if API key is configured
  if (CONFIG.api.apiKey) {
    headers['X-Portal-Key'] = CONFIG.api.apiKey;
  }

  // Create new options with merged headers
  const fetchOptions = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(fullUrl, fetchOptions);
    return response;
  } catch (error) {
    console.error('[API Client] Request failed:', error);
    throw error;
  }
}

/**
 * Convenience method for GET requests
 */
export async function apiGet(url, options = {}) {
  return apiFetch(url, { ...options, method: 'GET' });
}

/**
 * Convenience method for POST requests
 */
export async function apiPost(url, data, options = {}) {
  return apiFetch(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Convenience method for PUT requests
 */
export async function apiPut(url, data, options = {}) {
  return apiFetch(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Convenience method for DELETE requests
 */
export async function apiDelete(url, options = {}) {
  return apiFetch(url, { ...options, method: 'DELETE' });
}

/**
 * Parse JSON response with error handling
 */
export async function parseJsonResponse(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('[API Client] Failed to parse JSON response:', text);
    throw new Error('Invalid JSON response from server');
  }
}

export default {
  apiFetch,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  parseJsonResponse,
};

