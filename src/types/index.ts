export type MoodType = 'happy' | 'calm' | 'tired' | 'anxious' | 'sad' | 'excited';

export interface Mood {
  type: MoodType;
  label: string;
  emoji: string;
  color: string;
}

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  quickReplies?: string[];
}

export interface Animal {
  id: string;
  name: string;
  emoji: string;
  personality: string;
  greeting: string;
  color: string;
}

export interface UserStats {
  streakDays: number;
  meditationMinutes: number;
  chatCount: number;
  totalStars: number;
  level: number;
  levelName: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  author: string;
  authorEmoji: string;
  likes: number;
  imageGradient: string;
  content?: string;
}

export type TabType = 'home' | 'forest' | 'chat' | 'knowledge' | 'profile' | 'diary';

/** 情绪标签（与主导情绪区分，可多选） */
export type EmotionTag = 'anxious' | 'tired' | 'low' | 'irritable';

export interface EmotionRecord {
  id?: string;
  date: string;
  mood: MoodType;
  intensity: number;
  note?: string;
  tags?: EmotionTag[];
  memo?: string;
}
