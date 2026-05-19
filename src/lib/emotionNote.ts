import type { EmotionTag, EmotionRecord } from '@/types';

const NOTE_VERSION = 1;

export interface ParsedEmotionNote {
  memo?: string;
  tags?: EmotionTag[];
}

export function parseEmotionNote(note: string | null | undefined): ParsedEmotionNote {
  if (!note || !note.trim()) return {};
  try {
    const j = JSON.parse(note) as { v?: number; memo?: string; tags?: EmotionTag[] };
    if (j && typeof j === 'object' && j.v === NOTE_VERSION) {
      return {
        memo: typeof j.memo === 'string' ? j.memo : undefined,
        tags: Array.isArray(j.tags) ? (j.tags.filter(Boolean) as EmotionTag[]) : undefined,
      };
    }
  } catch {
    return { memo: note };
  }
  return { memo: note };
}

export function serializeEmotionNote(
  existingRaw: string | null | undefined,
  updates?: { tags?: EmotionTag[]; memo?: string }
): string | undefined {
  if (!updates) return existingRaw ?? undefined;
  const base = parseEmotionNote(existingRaw);
  const merged: ParsedEmotionNote = {
    tags: updates.tags !== undefined ? updates.tags : base.tags,
    memo: updates.memo !== undefined ? updates.memo : base.memo,
  };
  const hasTags = !!(merged.tags && merged.tags.length > 0);
  const hasMemo = !!(merged.memo && merged.memo.trim());
  if (!hasTags && !hasMemo) return undefined;
  return JSON.stringify({
    v: NOTE_VERSION,
    tags: hasTags ? merged.tags : undefined,
    memo: hasMemo ? merged.memo!.trim() : undefined,
  });
}

export function rowToEmotionRecord(row: {
  id?: string;
  date: string;
  mood: string;
  intensity: number;
  note?: string | null;
}): EmotionRecord {
  const parsed = parseEmotionNote(row.note ?? undefined);
  return {
    id: row.id,
    date: row.date,
    mood: row.mood as EmotionRecord['mood'],
    intensity: row.intensity,
    note: row.note ?? undefined,
    ...parsed,
  };
}
