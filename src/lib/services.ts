import { supabase } from './supabase';
import { rowToEmotionRecord, serializeEmotionNote } from './emotionNote';
import type { MoodType, EmotionRecord, Message, UserStats, Animal, EmotionTag } from '@/types';

const DEVICE_STORAGE_KEY = 'senyu_user_id';
const DB_USER_STORAGE_KEY = 'senyu_db_user_id';

/** 避免 Promise.all 并行时多次 insert 同一 device_id 触发 23505，导致整页初始化失败 */
let resolveUserIdInflight: Promise<string> | null = null;

/** 确保 Auth 用户在 public.users 中有行（id = auth.uid()），并写入邮箱供后台 Table Editor 查看 */
async function ensureAuthUserRow(authUserId: string, email: string | null): Promise<void> {
  const { data: row } = await supabase
    .from('users')
    .select('id, email')
    .eq('id', authUserId)
    .maybeSingle();
  if (row?.id) {
    if (email && row.email !== email) {
      const { error: upErr } = await supabase
        .from('users')
        .update({ email, updated_at: new Date().toISOString() })
        .eq('id', authUserId);
      if (upErr) throw upErr;
    }
    return;
  }

  const { error } = await supabase.from('users').insert({
    id: authUserId,
    device_id: null,
    email: email ?? null,
  });
  if (error && error.code !== '23505') throw error;
  if (error?.code === '23505' && email) {
    const { error: upErr } = await supabase
      .from('users')
      .update({ email, updated_at: new Date().toISOString() })
      .eq('id', authUserId);
    if (upErr) throw upErr;
  }
}

/** 浏览器侧稳定设备标识，对应表 users.device_id */
function getOrCreateDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_STORAGE_KEY);
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_STORAGE_KEY, deviceId);
  }
  return deviceId;
}

/**
 * 解析 Supabase 中 users 表的主键 id。
 * chat_messages / emotion_records 等表的外键是 users.id，不能直接使用 device 随机串。
 */
async function resolveDbUserId(): Promise<string> {
  if (resolveUserIdInflight) {
    return resolveUserIdInflight;
  }
  resolveUserIdInflight = resolveDbUserIdOnce().finally(() => {
    resolveUserIdInflight = null;
  });
  return resolveUserIdInflight;
}

async function resolveDbUserIdOnce(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.user?.id) {
    await ensureAuthUserRow(session.user.id, session.user.email ?? null);
    return session.user.id;
  }

  const cached = localStorage.getItem(DB_USER_STORAGE_KEY);
  if (cached) return cached;

  const deviceId = getOrCreateDeviceId();

  const { data: existing, error: selErr } = await supabase
    .from('users')
    .select('id')
    .eq('device_id', deviceId)
    .maybeSingle();

  if (selErr) throw selErr;
  if (existing?.id) {
    localStorage.setItem(DB_USER_STORAGE_KEY, existing.id);
    return existing.id;
  }

  const { data: created, error: insErr } = await supabase
    .from('users')
    .insert({ device_id: deviceId })
    .select('id')
    .single();

  if (!insErr && created?.id) {
    localStorage.setItem(DB_USER_STORAGE_KEY, created.id);
    return created.id;
  }

  if (insErr?.code === '23505') {
    const { data: afterRace, error: e2 } = await supabase
      .from('users')
      .select('id')
      .eq('device_id', deviceId)
      .maybeSingle();
    if (e2) throw e2;
    if (afterRace?.id) {
      localStorage.setItem(DB_USER_STORAGE_KEY, afterRace.id);
      return afterRace.id;
    }
  }

  if (insErr) throw insErr;
  throw new Error('创建用户行未返回 id');
}

export const emotionService = {
  async getRecords(): Promise<EmotionRecord[]> {
    const userId = await resolveDbUserId();
    const { data, error } = await supabase
      .from('emotion_records')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return (data || []).map((row) =>
      rowToEmotionRecord(row as {
        id?: string;
        date: string;
        mood: string;
        intensity: number;
        note?: string | null;
      })
    );
  },

  async addRecord(record: Omit<EmotionRecord, 'date'>): Promise<EmotionRecord> {
    const userId = await resolveDbUserId();
    const notePayload = serializeEmotionNote(undefined, {
      tags: record.tags,
      memo: record.memo ?? record.note,
    });
    const { data, error } = await supabase
      .from('emotion_records')
      .insert({
        user_id: userId,
        date: new Date().toISOString().split('T')[0],
        mood: record.mood,
        intensity: record.intensity,
        note: notePayload ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return rowToEmotionRecord(data as {
      id?: string;
      date: string;
      mood: string;
      intensity: number;
      note?: string | null;
    });
  },

  async updateTodayMood(
    mood: MoodType,
    intensity: number,
    extras?: { tags?: EmotionTag[]; memo?: string }
  ): Promise<void> {
    const userId = await resolveDbUserId();
    const today = new Date().toISOString().split('T')[0];

    const { data: existing } = await supabase
      .from('emotion_records')
      .select('id, note')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();

    const note =
      extras !== undefined
        ? serializeEmotionNote(existing?.note as string | null | undefined, extras) ?? null
        : (existing?.note as string | null | undefined) ?? null;

    if (existing?.id) {
      const patch: Record<string, unknown> = { mood, intensity };
      if (extras !== undefined) patch.note = note;
      await supabase.from('emotion_records').update(patch).eq('id', existing.id);
    } else {
      await supabase.from('emotion_records').insert({
        user_id: userId,
        date: today,
        mood,
        intensity,
        note: extras !== undefined ? note : null,
      });
    }
  },
};

export const chatService = {
  async getMessages(): Promise<Message[]> {
    const userId = await resolveDbUserId();
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) throw error;
    return (data || []).map((msg) => ({
      id: msg.id,
      content: msg.content,
      type: msg.type,
      timestamp: new Date(msg.created_at),
    }));
  },

  async addMessage(content: string, type: 'user' | 'ai'): Promise<Message> {
    const userId = await resolveDbUserId();
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        content,
        type,
      })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      content: data.content,
      type: data.type,
      timestamp: new Date(data.created_at),
    };
  },

  async clearMessages(): Promise<void> {
    const userId = await resolveDbUserId();
    await supabase.from('chat_messages').delete().eq('user_id', userId);
  },
};

export const userStatsService = {
  async getStats(): Promise<UserStats | null> {
    const userId = await resolveDbUserId();
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ? {
      streakDays: data.streak_days,
      meditationMinutes: data.meditation_minutes,
      chatCount: data.chat_count,
      totalStars: data.total_stars,
      level: data.level,
      levelName: data.level_name,
    } : null;
  },

  async updateStats(updates: Partial<UserStats>): Promise<void> {
    const userId = await resolveDbUserId();
    const dbUpdates: Record<string, unknown> = {};

    if (updates.streakDays !== undefined) dbUpdates.streak_days = updates.streakDays;
    if (updates.meditationMinutes !== undefined) dbUpdates.meditation_minutes = updates.meditationMinutes;
    if (updates.chatCount !== undefined) dbUpdates.chat_count = updates.chatCount;
    if (updates.totalStars !== undefined) dbUpdates.total_stars = updates.totalStars;
    if (updates.level !== undefined) dbUpdates.level = updates.level;
    if (updates.levelName !== undefined) dbUpdates.level_name = updates.levelName;

    const { data: existing } = await supabase
      .from('user_stats')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      await supabase
        .from('user_stats')
        .update({ ...dbUpdates, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
    } else {
      await supabase.from('user_stats').insert({
        user_id: userId,
        ...dbUpdates,
      });
    }
  },

  async addStars(count: number): Promise<number> {
    const stats = await this.getStats();
    const newTotal = (stats?.totalStars || 0) + count;
    await this.updateStats({ totalStars: newTotal });
    return newTotal;
  },

  async incrementChatCount(): Promise<void> {
    const stats = await this.getStats();
    await this.updateStats({ chatCount: (stats?.chatCount || 0) + 1 });
  },
};

export const animalService = {
  async getSelectedAnimal(): Promise<Animal | null> {
    const userId = await resolveDbUserId();
    const { data, error } = await supabase
      .from('selected_animals')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    if (data) {
      const { data: animal } = await supabase
        .from('animals')
        .select('*')
        .eq('id', data.animal_id)
        .single();
      return animal as Animal;
    }
    return null;
  },

  async selectAnimal(animalId: string): Promise<void> {
    const userId = await resolveDbUserId();
    const { data: existing } = await supabase
      .from('selected_animals')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      await supabase
        .from('selected_animals')
        .update({ animal_id: animalId, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
    } else {
      await supabase.from('selected_animals').insert({
        user_id: userId,
        animal_id: animalId,
      });
    }
  },
};
