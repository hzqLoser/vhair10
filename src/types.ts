
export enum Gender {
  Male = 'Male',
  Female = 'Female'
}

export enum StoreSort {
  Recommended = 'Recommended',
  Distance = 'Distance',
  Rating = 'Rating'
}

export interface Hairstyle {
  id: string;
  name: string;
  imageUrl: string;
  tags: string[];
  gender: Gender;
  category: 'long' | 'short' | 'curly' | 'straight' | 'color';
  heat: number;
  isCollected: boolean;
  description: string;
}

export interface Store {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  price: number;
  distance: string;
  tags: string[];
  description: string;
  isBookable: boolean;
  isSaved?: boolean;
}

export interface Barber {
  id: string;
  name: string;
  storeName: string;
  imageUrl: string;
  rating: number;
  tags: string[];
  description: string;
  yearsExperience: number;
}

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  image?: string;
  timestamp: string;
  type: 'text' | 'system' | 'card';
  cardData?: {
    originalImage: string;
    resultImage: string;
    hairName: string;
  };
}

export interface ChatSession {
  id: string;
  targetId: string;
  targetName: string;
  targetImage: string;
  targetRole: 'Store' | 'Barber';
  lastMessage: string;
  unreadCount: number;
  timestamp: string;
  messages: Message[];
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  tryOnCount: number;
  aiQuota: number;
  bio?: string;
}

export interface Topic {
  id: string;
  title: string;
  participants: number;
  color: string;
}

export interface UserShow {
  id: string;
  userName: string;
  userAvatar: string;
  beforeImage: string;
  afterImage: string;
  comment: string;
  likes: number;
  replies: number;
  saved: boolean;
  referenceHairstyleUrl: string;
  referenceHairstyleName: string;
}

export interface TryOnHistoryItem {
  id: string;
  date: string;
  hairstyleName: string;
  imageUrl: string;
  originalImageUrl?: string;
}
