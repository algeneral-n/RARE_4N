/**
 * RARE 4N - Permission Manager
 * Orchestrates system permission requests triggered by the Cognitive Loop.
 * Handles Location, Audio, Camera, and Notification permissions.
 */

import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import * as Camera from 'expo-camera';

// ملاحظة: إذا كنت ستستخدم التنبيهات، يجب تثبيت expo-notifications
// وإلا سيعود النظام برسالة "غير مثبت" كما هو موضح أدناه.

export type PermissionType = 'location' | 'audio' | 'notifications' | 'camera';

export interface PermissionStatus {
  type: PermissionType;
  granted: boolean;
  canAskAgain: boolean;
  message?: string;
}

export class PermissionManager {
  private static instance: PermissionManager;
  private permissionCache: Map<PermissionType, PermissionStatus> = new Map();

  private constructor() {}

  static getInstance(): PermissionManager {
    if (!PermissionManager.instance) {
      PermissionManager.instance = new PermissionManager();
    }
    return PermissionManager.instance;
  }

  /**
   * checkPermission: فحص حالة الإذن الحالية دون إظهار نافذة طلب للمستخدم
   */
  async checkPermission(type: PermissionType): Promise<PermissionStatus> {
    const cached = this.permissionCache.get(type);
    if (cached) return cached;

    let status: PermissionStatus;

    try {
      switch (type) {
        case 'location':
          const locationStatus = await Location.getForegroundPermissionsAsync();
          status = { type: 'location', granted: locationStatus.granted, canAskAgain: locationStatus.canAskAgain };
          break;

        case 'audio':
          const audioStatus = await Audio.getPermissionsAsync();
          status = { type: 'audio', granted: audioStatus.granted, canAskAgain: audioStatus.canAskAgain };
          break;

        case 'camera':
          const cameraStatus = await Camera.getCameraPermissionsAsync();
          status = { type: 'camera', granted: cameraStatus.granted, canAskAgain: cameraStatus.canAskAgain };
          break;

        case 'notifications':
          status = { type: 'notifications', granted: false, canAskAgain: false, message: 'Notification module integration pending' };
          break;

        default:
          status = { type, granted: false, canAskAgain: false, message: 'Unknown permission type' };
      }

      this.permissionCache.set(type, status);
      return status;
    } catch (error: any) {
      return { type, granted: false, canAskAgain: false, message: error.message };
    }
  }

  /**
   * requestPermission: طلب الإذن من المستخدم
   * CRITICAL: لا يتم استدعاؤه تلقائياً - فقط بعد تفعيل المستخدم يدوياً
   * يجب أن يتم استدعاؤه من UI button أو explicit user action
   */
  async requestPermission(type: PermissionType, userInitiated: boolean = false): Promise<PermissionStatus> {
    // SECURITY: منع الطلب التلقائي
    if (!userInitiated) {
      console.warn(`[PermissionManager] Permission request for ${type} blocked - not user-initiated`);
      return {
        type,
        granted: false,
        canAskAgain: false,
        message: 'Permission request must be initiated by user action',
      };
    }

    this.permissionCache.delete(type);

    let status: PermissionStatus;

    try {
      switch (type) {
        case 'location':
          const locationResult = await Location.requestForegroundPermissionsAsync();
          status = { type: 'location', granted: locationResult.granted, canAskAgain: locationResult.canAskAgain };
          break;

        case 'audio':
          const audioResult = await Audio.requestPermissionsAsync();
          status = { type: 'audio', granted: audioResult.granted, canAskAgain: audioResult.canAskAgain };
          break;

        case 'camera':
          const cameraResult = await Camera.requestCameraPermissionsAsync();
          status = { type: 'camera', granted: cameraResult.granted, canAskAgain: cameraResult.canAskAgain };
          break;

        default:
          status = { type, granted: false, canAskAgain: false, message: 'Permission request not supported for this type' };
      }

      this.permissionCache.set(type, status);
      return status;
    } catch (error: any) {
      return { type, granted: false, canAskAgain: false, message: error.message };
    }
  }

  clearCache(): void {
    this.permissionCache.clear();
  }
}