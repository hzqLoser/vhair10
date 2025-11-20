
import { HAIRSTYLES, STORES, BARBERS, TOPICS, USERSHOWS, MOCK_CHATS, MOCK_USER, MOCK_HISTORY } from '../constants';
import { Hairstyle, Store, Barber, Topic, UserShow, ChatSession, User, TryOnHistoryItem } from '../types';
import { generateHairstyleAI } from './geminiService';

/**
 * API 服务层
 * 用于统一管理前后端数据交互
 * 目前使用 setTimeout 模拟网络延迟，实际开发时请替换为 fetch/axios 调用后端 Go 接口
 */

// 模拟网络延迟工具
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 本地用户状态（模拟数据库持久化）
let currentUser = { ...MOCK_USER };

export const api = {
  
  // --- 发型相关 ---
  
  /**
   * 获取发型列表
   * @param gender 性别筛选
   * @param category 分类筛选
   */
  getHairstyles: async (gender?: string, category?: string): Promise<Hairstyle[]> => {
    await delay(500); // 模拟网络请求
    let data = [...HAIRSTYLES];
    if (gender) {
      data = data.filter(h => h.gender === gender);
    }
    if (category && category !== 'all') {
      data = data.filter(h => h.category.toLowerCase() === category.toLowerCase());
    }
    return data;
  },

  /**
   * 获取收藏的发型
   */
  getSavedHairstyles: async (): Promise<Hairstyle[]> => {
    await delay(400);
    return HAIRSTYLES.filter(h => h.isCollected);
  },

  /**
   * 取消收藏发型
   */
  deleteSavedHairstyle: async (id: string): Promise<boolean> => {
    await delay(300);
    console.log('[API] Saved Hairstyle Deleted:', id);
    // 在真实应用中，这里会发送 DELETE 请求到后端
    return true;
  },

  // --- 门店与技师相关 ---

  /**
   * 获取门店列表
   * @param sort 排序方式 (推荐/距离/评分) - 暂未实现逻辑，仅返回数据
   */
  getStores: async (): Promise<Store[]> => {
    await delay(600);
    return [...STORES];
  },

  /**
   * 获取收藏的门店
   */
  getSavedStores: async (): Promise<Store[]> => {
    await delay(400);
    return STORES.filter(s => s.isSaved);
  },

  /**
   * 切换门店收藏状态
   */
  toggleStoreSave: async (id: string): Promise<boolean> => {
    await delay(200);
    const store = STORES.find(s => s.id === id);
    if (store) {
      store.isSaved = !store.isSaved; // Mock update
    }
    return true;
  },

  /**
   * 取消收藏门店
   */
  deleteSavedStore: async (id: string): Promise<boolean> => {
    await delay(300);
    console.log('[API] Saved Store Deleted:', id);
    return true;
  },

  /**
   * 获取发型师列表
   */
  getBarbers: async (): Promise<Barber[]> => {
    await delay(500);
    return [...BARBERS];
  },

  // --- 广场社区相关 ---

  /**
   * 获取热门话题
   */
  getTopics: async (): Promise<Topic[]> => {
    await delay(300);
    return [...TOPICS];
  },

  /**
   * 获取发友秀（用户展示）
   */
  getUserShows: async (): Promise<UserShow[]> => {
    await delay(500);
    return [...USERSHOWS];
  },

  // --- 用户与历史记录 ---

  /**
   * 获取当前用户信息
   */
  getUserProfile: async (): Promise<User> => {
    await delay(300);
    return { ...currentUser };
  },

  /**
   * 更新用户信息
   */
  updateUserProfile: async (updates: Partial<User>): Promise<User> => {
    await delay(500);
    currentUser = { ...currentUser, ...updates };
    return { ...currentUser };
  },

  /**
   * 获取试戴历史记录
   */
  getTryOnHistory: async (): Promise<TryOnHistoryItem[]> => {
    await delay(400);
    // 实际场景应从后端获取
    return [...MOCK_HISTORY]; 
  },

  /**
   * 保存试戴结果到历史记录
   */
  saveToHistory: async (item: TryOnHistoryItem): Promise<boolean> => {
    await delay(500);
    console.log('[API] History Saved:', item);
    return true;
  },

  /**
   * 删除历史记录
   */
  deleteHistoryItem: async (id: string): Promise<boolean> => {
    await delay(300);
    console.log('[API] History Deleted:', id);
    return true;
  },

  // --- 消息与聊天 ---

  /**
   * 获取聊天会话列表
   */
  getChats: async (): Promise<ChatSession[]> => {
    await delay(400);
    return [...MOCK_CHATS];
  },

  /**
   * 发送消息
   * @param sessionId 会话ID
   * @param text 消息内容
   */
  sendMessage: async (sessionId: string, text: string): Promise<boolean> => {
    await delay(200);
    console.log(`[API] Sent to ${sessionId}: ${text}`);
    return true;
  },

  // --- AI 生成服务 ---

  /**
   * 执行 AI 试戴生成
   * @param originalImageBase64 用户上传的图片
   * @param hairstyleDescription 发型描述提示词
   */
  generateTryOn: async (originalImageBase64: string, hairstyleDescription: string): Promise<string> => {
    // 这里调用 geminiService，但在真实后端架构中，
    // 前端通常会将图片上传到后端，后端再调用 AI 模型，最后返回结果 URL。
    // 为了保持现有逻辑通畅，这里直接调用前端的 Gemini SDK 封装。
    return await generateHairstyleAI({ originalImageBase64, hairstyleDescription });
  }
};
