import Taro from '@tarojs/taro';
import { HAIRSTYLES, STORES, BARBERS, TOPICS, USERSHOWS, MOCK_CHATS, MOCK_USER, MOCK_HISTORY } from '@/constants';
import { Hairstyle, Store, Barber, Topic, UserShow, ChatSession, User, TryOnHistoryItem } from '@/types';
import { generateHairstyleAI } from '@/services/geminiService';

// Use Taro.showLoading/hideLoading in real calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let currentUser = { ...MOCK_USER };

export const api = {
  getHairstyles: async (gender?: string, category?: string): Promise<Hairstyle[]> => {
    await delay(500);
    let data = [...HAIRSTYLES];
    if (gender) data = data.filter(h => h.gender === gender);
    if (category && category !== 'all') {
      data = data.filter(h => h.category.toLowerCase() === category.toLowerCase());
    }
    return data;
  },

  getSavedHairstyles: async (): Promise<Hairstyle[]> => {
    await delay(400);
    return HAIRSTYLES.filter(h => h.isCollected);
  },

  deleteSavedHairstyle: async (id: string): Promise<boolean> => {
    await delay(300);
    return true;
  },

  getStores: async (): Promise<Store[]> => {
    await delay(600);
    return [...STORES];
  },

  getSavedStores: async (): Promise<Store[]> => {
    await delay(400);
    return STORES.filter(s => s.isSaved);
  },

  toggleStoreSave: async (id: string): Promise<boolean> => {
    await delay(200);
    const store = STORES.find(s => s.id === id);
    if (store) store.isSaved = !store.isSaved;
    return true;
  },

  deleteSavedStore: async (id: string): Promise<boolean> => {
    await delay(300);
    return true;
  },

  getBarbers: async (): Promise<Barber[]> => {
    await delay(500);
    return [...BARBERS];
  },

  getTopics: async (): Promise<Topic[]> => {
    await delay(300);
    return [...TOPICS];
  },

  getUserShows: async (): Promise<UserShow[]> => {
    await delay(500);
    return [...USERSHOWS];
  },

  getUserProfile: async (): Promise<User> => {
    await delay(300);
    return { ...currentUser };
  },

  updateUserProfile: async (updates: Partial<User>): Promise<User> => {
    await delay(500);
    currentUser = { ...currentUser, ...updates };
    return { ...currentUser };
  },

  getTryOnHistory: async (): Promise<TryOnHistoryItem[]> => {
    await delay(400);
    return [...MOCK_HISTORY]; 
  },

  saveToHistory: async (item: TryOnHistoryItem): Promise<boolean> => {
    await delay(500);
    return true;
  },

  deleteHistoryItem: async (id: string): Promise<boolean> => {
    await delay(300);
    return true;
  },

  getChats: async (): Promise<ChatSession[]> => {
    await delay(400);
    return [...MOCK_CHATS];
  },

  sendMessage: async (sessionId: string, text: string): Promise<boolean> => {
    await delay(200);
    return true;
  },

  generateTryOn: async (originalImageBase64: string, hairstyleDescription: string): Promise<string> => {
    await delay(3000); // Simulate generation
    return await generateHairstyleAI({ originalImageBase64, hairstyleDescription });
  }
};