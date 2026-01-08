/**
 * RARE 4N - Awareness System
 * Manages Location, Time, Device status, and Environment sensing.
 */

import * as Location from 'expo-location';
import { RAREKernel } from './RAREKernel';

export class AwarenessSystem {
  private static instance: AwarenessSystem;
  private kernel: RAREKernel | null = null;

  static getInstance(): AwarenessSystem {
    if (!AwarenessSystem.instance) {
      AwarenessSystem.instance = new AwarenessSystem();
    }
    return AwarenessSystem.instance;
  }

  async init(kernel: RAREKernel) {
    this.kernel = kernel;
    
    // لا نطلب الصلاحية تلقائياً - فقط نفحص
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === 'granted') {
      this.updateLocation();
      this.startContinuousUpdates();
    }
  }

  private startContinuousUpdates() {
    // تحديث الموقع كل 5 دقائق
    setInterval(() => {
      this.updateLocation();
    }, 5 * 60 * 1000);
  }

  private async updateLocation() {
    try {
      const location = await Location.getCurrentPositionAsync({});
      this.kernel?.emit({
        type: 'awareness:location_update',
        data: location.coords
      });
    } catch (e) {
      console.error('Awareness error:', e);
    }
  }
}