import { create } from 'zustand';
import { 
  MoodType, 
  Message, 
  Animal, 
  UserStats, 
  EmotionRecord,
  TabType,
  EmotionTag,
} from '@/types';
import { generateId } from '@utils/helpers';
import { isSupabaseConfigured } from '@/lib/supabase';
import { emotionService, chatService, userStatsService, animalService } from '@/lib/services';
import { fetchDeepSeekResponse } from '@/lib/deepSeekService';

interface AppState {
  // 导航
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;

  // 文章详情
  selectedArticleId: string | null;
  setSelectedArticleId: (id: string | null) => void;

  authUserLabel: string | null;
  setAuthUserLabel: (label: string | null) => void;

  // 初始化
  isInitialized: boolean;
  initialize: () => Promise<void>;
  
  // 情绪
  todayMood: MoodType | null;
  setTodayMood: (mood: MoodType, extras?: { tags?: EmotionTag[]; memo?: string }) => void;
  refreshEmotionHistory: () => Promise<void>;
  emotionHistory: EmotionRecord[];
  addEmotionRecord: (record: EmotionRecord) => void;
  
  // 聊天
  messages: Message[];
  isTyping: boolean;
  addMessage: (content: string, type: 'user' | 'ai', quickReplies?: string[]) => void;
  sendUserMessage: (content: string) => void;
  
  // 用户
  userStats: UserStats;
  updateStats: (updates: Partial<UserStats>) => void;
  addStars: (count: number) => void;
  
  // 选中的动物
  selectedAnimal: Animal;
  setSelectedAnimal: (animal: Animal) => void;
  
  // 呼吸练习
  isBreathing: boolean;
  setIsBreathing: (value: boolean) => void;
}

const defaultAnimal: Animal = {
  id: '1',
  name: '小鹿露露',
  emoji: '🦌',
  personality: '温柔体贴',
  greeting: '今天过得怎么样？我一直在这里等你',
  color: 'from-amber-100 to-orange-100',
};

const defaultStats: UserStats = {
  streakDays: 12,
  meditationMinutes: 48,
  chatCount: 156,
  totalStars: 1280,
  level: 3,
  levelName: '萌芽者',
};

export const useStore = create<AppState>()((set, get) => ({
  // 导航
  currentTab: 'home',
  setCurrentTab: (tab) => set({ currentTab: tab }),

  // 文章详情
  selectedArticleId: null,
  setSelectedArticleId: (id) => set({ selectedArticleId: id }),

  authUserLabel: null,
  setAuthUserLabel: (label) => set({ authUserLabel: label }),

  // 初始化
  isInitialized: false,
  initialize: async () => {
    if (!isSupabaseConfigured) {
      set({
        emotionHistory: [],
        messages: [
          {
            id: generateId(),
            content:
              '晚上好呀～今天过得怎么样？我感觉到森林里有点安静，是不是想找人聊聊？（离线预览：连接数据库后对话与打卡会同步到云端）🌙',
            type: 'ai',
            timestamp: new Date(),
            quickReplies: ['工作任务太多', '人际关系', '自我要求太高'],
          },
        ],
        userStats: defaultStats,
        selectedAnimal: defaultAnimal,
        todayMood: null,
        isInitialized: true,
      });
      return;
    }

    try {
      const [emotions, messages, stats, animal] = await Promise.all([
        emotionService.getRecords(),
        chatService.getMessages(),
        userStatsService.getStats(),
        animalService.getSelectedAnimal(),
      ]);

      set({
        emotionHistory: emotions,
        messages: messages.length > 0 ? messages : [{
          id: generateId(),
          content: '晚上好呀～今天过得怎么样？我感觉到森林里有点安静，是不是想找人聊聊？🌙',
          type: 'ai',
          timestamp: new Date(),
          quickReplies: ['工作任务太多', '人际关系', '自我要求太高'],
        }],
        userStats: stats || defaultStats,
        selectedAnimal: animal || defaultAnimal,
        todayMood: emotions.find(e => e.date === new Date().toISOString().split('T')[0])?.mood || null,
        isInitialized: true,
      });
    } catch (error) {
      console.error('Failed to initialize from Supabase:', error);
      set({ isInitialized: true });
    }
  },
  
  // 情绪
  todayMood: null,
  setTodayMood: async (mood, extras) => {
    const today = new Date().toISOString().split('T')[0];
    set({ todayMood: mood });
    if (!isSupabaseConfigured) {
      set((state) => {
        const rest = state.emotionHistory.filter((e) => e.date !== today);
        const next: EmotionRecord = {
          date: today,
          mood,
          intensity: 5,
          tags: extras?.tags,
          memo: extras?.memo,
        };
        return { emotionHistory: [next, ...rest] };
      });
      return;
    }
    await emotionService.updateTodayMood(mood, 5, extras);
    const emotions = await emotionService.getRecords();
    set({
      emotionHistory: emotions,
      todayMood: emotions.find((e) => e.date === today)?.mood ?? mood,
    });
  },
  refreshEmotionHistory: async () => {
    if (!isSupabaseConfigured) return;
    try {
      const emotions = await emotionService.getRecords();
      const today = new Date().toISOString().split('T')[0];
      set({
        emotionHistory: emotions,
        todayMood: emotions.find((e) => e.date === today)?.mood ?? null,
      });
    } catch (e) {
      console.error('refreshEmotionHistory', e);
    }
  },
  emotionHistory: [],
  addEmotionRecord: async (record) => {
    if (!isSupabaseConfigured) {
      set((state) => ({
        emotionHistory: [record, ...state.emotionHistory],
      }));
      return;
    }
    try {
      await emotionService.addRecord(record);
      set((state) => ({
        emotionHistory: [record, ...state.emotionHistory],
      }));
    } catch (error) {
      console.error('Failed to save emotion record:', error);
    }
  },
  
  // 聊天
  messages: [{
    id: generateId(),
    content: '晚上好呀～今天过得怎么样？我感觉到森林里有点安静，是不是想找人聊聊？🌙',
    type: 'ai',
    timestamp: new Date(),
    quickReplies: ['工作任务太多', '人际关系', '自我要求太高'],
  }],
  isTyping: false,
  addMessage: async (content, type, quickReplies) => {
    if (!isSupabaseConfigured) {
      const msg: Message = {
        id: generateId(),
        content,
        type,
        timestamp: new Date(),
        quickReplies,
      };
      set((state) => ({
        messages: [...state.messages, msg],
      }));
      return;
    }
    try {
      const message = await chatService.addMessage(content, type);
      set((state) => ({
        messages: [...state.messages, { ...message, quickReplies }],
      }));
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  },
  sendUserMessage: async (content) => {
    const { todayMood } = get();
    
    // 直接添加用户消息
    const userMsg: Message = {
      id: generateId(),
      content,
      type: 'user',
      timestamp: new Date(),
    };
    set((state) => ({
      messages: [...state.messages, userMsg],
      isTyping: true,
    }));
    
    if (isSupabaseConfigured) {
      void userStatsService.incrementChatCount();
      void chatService.addMessage(content, 'user');
    }
    
    // 模拟思考时间（1-2秒）
    const thinkingTime = 1000 + Math.random() * 1000;
    
    setTimeout(async () => {
      // 使用 DeepSeek 生成智能回复
      const { messages: currentMessages } = get();
      
      // 将消息历史转换为后端需要的格式
      const context = currentMessages.slice(-5).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));
      
      const reply = await fetchDeepSeekResponse(
        content,
        context,
        todayMood || 'neutral'
      );
      
      const aiMsg: Message = {
        id: generateId(),
        content: reply,
        type: 'ai',
        timestamp: new Date(),
        quickReplies: ['工作任务太多', '和同事有矛盾', '压力太大', '想辞职'],
      };
      set((state) => ({
        messages: [...state.messages, aiMsg],
        isTyping: false,
      }));
      
      if (isSupabaseConfigured) {
        void chatService.addMessage(reply, 'ai');
      }
    }, thinkingTime);
  },
  
  // 用户
  userStats: defaultStats,
  updateStats: async (updates) => {
    set((state) => ({
      userStats: { ...state.userStats, ...updates },
    }));
    if (!isSupabaseConfigured) return;
    await userStatsService.updateStats(updates);
  },
  addStars: async (count) => {
    if (!isSupabaseConfigured) {
      set((state) => ({
        userStats: { ...state.userStats, totalStars: state.userStats.totalStars + count },
      }));
      return;
    }
    const newTotal = await userStatsService.addStars(count);
    set((state) => ({
      userStats: { ...state.userStats, totalStars: newTotal },
    }));
  },
  
  // 动物
  selectedAnimal: defaultAnimal,
  setSelectedAnimal: async (animal) => {
    set({ selectedAnimal: animal });
    if (!isSupabaseConfigured) return;
    await animalService.selectAnimal(animal.id);
  },
  
  // 呼吸练习
  isBreathing: false,
  setIsBreathing: (value) => set({ isBreathing: value }),
}));
