import { HAIRSTYLES, STORES, BARBERS, TOPICS, USERSHOWS, MOCK_CHATS, MOCK_USER, MOCK_HISTORY } from '@/constants'
import { Hairstyle, Store, Barber, Topic, UserShow, ChatSession, User, TryOnHistoryItem } from '@/types'
import { generateHairstyleAI } from '@/services/geminiService'

/**
 * Centralised mock API client.
 *
 * The project currently runs entirely on front-end mock data. Wrapping the
 * asynchronous access patterns in one module keeps page components clean and
 * makes it easy to replace the implementation with real HTTP calls later on.
 */

// Shared utility to mimic latency and keep UI loading states observable.
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Keep a simple in-memory user store so profile edits stay sticky per session.
let currentUser = { ...MOCK_USER }

export const api = {
  /** Fetch hairstyles with optional gender/category filters. */
  getHairstyles: async (gender?: string, category?: string): Promise<Hairstyle[]> => {
    await delay(500)
    let data = [...HAIRSTYLES]
    if (gender) data = data.filter(h => h.gender === gender)
    if (category && category !== 'all') {
      data = data.filter(h => h.category.toLowerCase() === category.toLowerCase())
    }
    return data
  },

  /** Items the user has collected (mocked). */
  getSavedHairstyles: async (): Promise<Hairstyle[]> => {
    await delay(400)
    return HAIRSTYLES.filter(h => h.isCollected)
  },

  deleteSavedHairstyle: async (_id: string): Promise<boolean> => {
    await delay(300)
    return true
  },

  /** Store listings + save toggles. */
  getStores: async (): Promise<Store[]> => {
    await delay(600)
    return [...STORES]
  },

  getSavedStores: async (): Promise<Store[]> => {
    await delay(400)
    return STORES.filter(s => s.isSaved)
  },

  toggleStoreSave: async (id: string): Promise<boolean> => {
    await delay(200)
    const storeIndex = STORES.findIndex(s => s.id === id)
    if (storeIndex >= 0) {
      STORES[storeIndex] = { ...STORES[storeIndex], isSaved: !STORES[storeIndex].isSaved }
    }
    return true
  },

  deleteSavedStore: async (_id: string): Promise<boolean> => {
    await delay(300)
    return true
  },

  /** Talent + topic feeds. */
  getBarbers: async (): Promise<Barber[]> => {
    await delay(500)
    return [...BARBERS]
  },

  getTopics: async (): Promise<Topic[]> => {
    await delay(300)
    return [...TOPICS]
  },

  getUserShows: async (): Promise<UserShow[]> => {
    await delay(500)
    return [...USERSHOWS]
  },

  /** User profile lifecycle. */
  getUserProfile: async (): Promise<User> => {
    await delay(300)
    return { ...currentUser }
  },

  updateUserProfile: async (updates: Partial<User>): Promise<User> => {
    await delay(500)
    currentUser = { ...currentUser, ...updates }
    return { ...currentUser }
  },

  /** Try-on history + persistence hooks. */
  getTryOnHistory: async (): Promise<TryOnHistoryItem[]> => {
    await delay(400)
    return [...MOCK_HISTORY]
  },

  saveToHistory: async (_item: TryOnHistoryItem): Promise<boolean> => {
    await delay(500)
    return true
  },

  deleteHistoryItem: async (_id: string): Promise<boolean> => {
    await delay(300)
    return true
  },

  /** Chat mocks. */
  getChats: async (): Promise<ChatSession[]> => {
    await delay(400)
    return [...MOCK_CHATS]
  },

  sendMessage: async (_sessionId: string, _text: string): Promise<boolean> => {
    await delay(200)
    return true
  },

  /**
   * Proxy to the Gemini service that simulates a server-side hairstyle
   * generation request. The mock delay makes the loader visible in UI demos.
   */
  generateTryOn: async (originalImageBase64: string, hairstyleDescription: string): Promise<string> => {
    await delay(3000)
    return await generateHairstyleAI({ originalImageBase64, hairstyleDescription })
  }
}
