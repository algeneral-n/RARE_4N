/**
 * RARE 4N - Emergency Contacts Service
 * خدمة جهات الاتصال الطارئة
 */

import { storage } from '../utils/storage';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'police' | 'ambulance' | 'fire' | 'personal' | 'custom';
  location?: { lat: number; lng: number };
  notes?: string;
}

class EmergencyContactsService {
  private static instance: EmergencyContactsService;
  private contacts: EmergencyContact[] = [];

  private constructor() {
    this.loadContacts();
  }

  static getInstance(): EmergencyContactsService {
    if (!EmergencyContactsService.instance) {
      EmergencyContactsService.instance = new EmergencyContactsService();
    }
    return EmergencyContactsService.instance;
  }

  /**
   * Load contacts from storage
   */
  private async loadContacts(): Promise<void> {
    try {
      const stored = await storage.get<EmergencyContact[]>('emergency:contacts');
      if (stored) {
        this.contacts = stored;
      } else {
        // Default emergency contacts
        this.contacts = [
          { id: 'police', name: 'الشرطة', phone: '999', type: 'police' },
          { id: 'ambulance', name: 'الإسعاف', phone: '997', type: 'ambulance' },
          { id: 'fire', name: 'الدفاع المدني', phone: '998', type: 'fire' },
        ];
        await this.saveContacts();
      }
    } catch (error) {
      console.error('Load emergency contacts error:', error);
    }
  }

  /**
   * Save contacts to storage
   */
  private async saveContacts(): Promise<void> {
    try {
      await storage.set('emergency:contacts', this.contacts);
    } catch (error) {
      console.error('Save emergency contacts error:', error);
    }
  }

  /**
   * Get all contacts
   */
  getContacts(): EmergencyContact[] {
    return [...this.contacts];
  }

  /**
   * Get contact by type
   */
  getContactByType(type: EmergencyContact['type']): EmergencyContact | undefined {
    return this.contacts.find((c) => c.type === type);
  }

  /**
   * Add contact
   */
  async addContact(contact: Omit<EmergencyContact, 'id'>): Promise<void> {
    const newContact: EmergencyContact = {
      ...contact,
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    this.contacts.push(newContact);
    await this.saveContacts();
  }

  /**
   * Update contact
   */
  async updateContact(id: string, updates: Partial<EmergencyContact>): Promise<void> {
    const index = this.contacts.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.contacts[index] = { ...this.contacts[index], ...updates };
      await this.saveContacts();
    }
  }

  /**
   * Delete contact
   */
  async deleteContact(id: string): Promise<void> {
    this.contacts = this.contacts.filter((c) => c.id !== id);
    await this.saveContacts();
  }

  /**
   * Get nearest emergency services (requires location)
   */
  async getNearestServices(location: { lat: number; lng: number }): Promise<EmergencyContact[]> {
    // This would integrate with maps API to find nearest services
    // For now, return default contacts
    return this.contacts.filter((c) => c.type !== 'personal' && c.type !== 'custom');
  }
}

export const emergencyContactsService = EmergencyContactsService.getInstance();
export default emergencyContactsService;

 * RARE 4N - Emergency Contacts Service
 * خدمة جهات الاتصال الطارئة
 */

import { storage } from '../utils/storage';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'police' | 'ambulance' | 'fire' | 'personal' | 'custom';
  location?: { lat: number; lng: number };
  notes?: string;
}

class EmergencyContactsService {
  private static instance: EmergencyContactsService;
  private contacts: EmergencyContact[] = [];

  private constructor() {
    this.loadContacts();
  }

  static getInstance(): EmergencyContactsService {
    if (!EmergencyContactsService.instance) {
      EmergencyContactsService.instance = new EmergencyContactsService();
    }
    return EmergencyContactsService.instance;
  }

  /**
   * Load contacts from storage
   */
  private async loadContacts(): Promise<void> {
    try {
      const stored = await storage.get<EmergencyContact[]>('emergency:contacts');
      if (stored) {
        this.contacts = stored;
      } else {
        // Default emergency contacts
        this.contacts = [
          { id: 'police', name: 'الشرطة', phone: '999', type: 'police' },
          { id: 'ambulance', name: 'الإسعاف', phone: '997', type: 'ambulance' },
          { id: 'fire', name: 'الدفاع المدني', phone: '998', type: 'fire' },
        ];
        await this.saveContacts();
      }
    } catch (error) {
      console.error('Load emergency contacts error:', error);
    }
  }

  /**
   * Save contacts to storage
   */
  private async saveContacts(): Promise<void> {
    try {
      await storage.set('emergency:contacts', this.contacts);
    } catch (error) {
      console.error('Save emergency contacts error:', error);
    }
  }

  /**
   * Get all contacts
   */
  getContacts(): EmergencyContact[] {
    return [...this.contacts];
  }

  /**
   * Get contact by type
   */
  getContactByType(type: EmergencyContact['type']): EmergencyContact | undefined {
    return this.contacts.find((c) => c.type === type);
  }

  /**
   * Add contact
   */
  async addContact(contact: Omit<EmergencyContact, 'id'>): Promise<void> {
    const newContact: EmergencyContact = {
      ...contact,
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    this.contacts.push(newContact);
    await this.saveContacts();
  }

  /**
   * Update contact
   */
  async updateContact(id: string, updates: Partial<EmergencyContact>): Promise<void> {
    const index = this.contacts.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.contacts[index] = { ...this.contacts[index], ...updates };
      await this.saveContacts();
    }
  }

  /**
   * Delete contact
   */
  async deleteContact(id: string): Promise<void> {
    this.contacts = this.contacts.filter((c) => c.id !== id);
    await this.saveContacts();
  }

  /**
   * Get nearest emergency services (requires location)
   */
  async getNearestServices(location: { lat: number; lng: number }): Promise<EmergencyContact[]> {
    // This would integrate with maps API to find nearest services
    // For now, return default contacts
    return this.contacts.filter((c) => c.type !== 'personal' && c.type !== 'custom');
  }
}

export const emergencyContactsService = EmergencyContactsService.getInstance();
export default emergencyContactsService;


