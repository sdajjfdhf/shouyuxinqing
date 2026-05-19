export interface DbUser {
  id: string;
  created_at: string;
  updated_at: string;
  /** 匿名用户有值；仅 Auth 登录可为 null */
  device_id: string | null;
  /** 邮箱密码登录用户的邮箱；匿名访客一般为 null */
  email: string | null;
}

export interface DbEmotionRecord {
  id: string;
  created_at: string;
  user_id: string;
  date: string;
  mood: string;
  intensity: number;
  note?: string;
}

export interface DbChatMessage {
  id: string;
  created_at: string;
  user_id: string;
  content: string;
  type: 'user' | 'ai';
}

export interface DbUserStats {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  streak_days: number;
  meditation_minutes: number;
  chat_count: number;
  total_stars: number;
  level: number;
  level_name: string;
}

export interface DbSelectedAnimal {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  animal_id: string;
}
