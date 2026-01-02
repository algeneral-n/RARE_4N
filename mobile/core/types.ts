/**
 * RARE 4N - Core Types
 * Shared type definitions to avoid circular dependencies
 */

// Log after module load to track execution
try {
  console.log('[types.ts] Module loaded');
} catch (e) {
  // Ignore logging errors
}

export interface KernelEvent {
  type: string;
  data: any;
  source?: string;
  timestamp?: number;
}

