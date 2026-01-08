/**
 * RARE 4N - List Layout Manager
 * إدارة أنواع القوائم المختلفة
 */

import { storage } from './storage';
import { ListType } from '../components/ListTypeSelector';

class ListLayoutManager {
  private static instance: ListLayoutManager;
  private currentListType: ListType = 'google-style';

  private constructor() {}

  static getInstance(): ListLayoutManager {
    if (!ListLayoutManager.instance) {
      ListLayoutManager.instance = new ListLayoutManager();
    }
    return ListLayoutManager.instance;
  }

  async getListType(): Promise<ListType> {
    try {
      const savedType = await storage.get<ListType>('listType:selected');
      if (savedType) {
        this.currentListType = savedType;
      }
      return this.currentListType;
    } catch (error) {
      console.error('Error getting list type:', error);
      return 'google-style';
    }
  }

  async setListType(type: ListType): Promise<boolean> {
    try {
      this.currentListType = type;
      await storage.set('listType:selected', type);
      return true;
    } catch (error) {
      console.error('Error setting list type:', error);
      return false;
    }
  }

  getCurrentListType(): ListType {
    return this.currentListType;
  }
}

export const listLayoutManager = ListLayoutManager.getInstance();
export default listLayoutManager;

 * RARE 4N - List Layout Manager
 * إدارة أنواع القوائم المختلفة
 */

import { storage } from './storage';
import { ListType } from '../components/ListTypeSelector';

class ListLayoutManager {
  private static instance: ListLayoutManager;
  private currentListType: ListType = 'google-style';

  private constructor() {}

  static getInstance(): ListLayoutManager {
    if (!ListLayoutManager.instance) {
      ListLayoutManager.instance = new ListLayoutManager();
    }
    return ListLayoutManager.instance;
  }

  async getListType(): Promise<ListType> {
    try {
      const savedType = await storage.get<ListType>('listType:selected');
      if (savedType) {
        this.currentListType = savedType;
      }
      return this.currentListType;
    } catch (error) {
      console.error('Error getting list type:', error);
      return 'google-style';
    }
  }

  async setListType(type: ListType): Promise<boolean> {
    try {
      this.currentListType = type;
      await storage.set('listType:selected', type);
      return true;
    } catch (error) {
      console.error('Error setting list type:', error);
      return false;
    }
  }

  getCurrentListType(): ListType {
    return this.currentListType;
  }
}

export const listLayoutManager = ListLayoutManager.getInstance();
export default listLayoutManager;


