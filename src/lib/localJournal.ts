import { encryptWithPassword, decryptWithPassword, type EncryptedPayload } from './crypto';

const TREE_KEY = 'senyu_tree_hole_v1';
const FRAG_KEY = 'senyu_fragments_v1';
const DIARY_KEY = 'senyu_diary_vault_v1';

export interface TreeHolePost {
  id: string;
  content: string;
  createdAt: string;
}

export interface FragmentPost {
  id: string;
  content: string;
  createdAt: string;
}

export interface DiaryEntry {
  id: string;
  content: string;
  createdAt: string;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** 匿名树洞：仅存本机浏览器，不上传服务器 */
export function loadTreeHole(): TreeHolePost[] {
  return readJson<TreeHolePost[]>(TREE_KEY, []);
}

export function addTreeHole(content: string): TreeHolePost {
  const list = loadTreeHole();
  const post: TreeHolePost = {
    id: crypto.randomUUID(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };
  list.unshift(post);
  writeJson(TREE_KEY, list.slice(0, 200));
  return post;
}

export function clearTreeHole() {
  localStorage.removeItem(TREE_KEY);
}

/** 情绪碎碎念 */
export function loadFragments(): FragmentPost[] {
  return readJson<FragmentPost[]>(FRAG_KEY, []);
}

export function addFragment(content: string): FragmentPost {
  const list = loadFragments();
  const post: FragmentPost = {
    id: crypto.randomUUID(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };
  list.unshift(post);
  writeJson(FRAG_KEY, list.slice(0, 300));
  return post;
}

export function clearFragments() {
  localStorage.removeItem(FRAG_KEY);
}

export function hasDiaryVault(): boolean {
  return !!localStorage.getItem(DIARY_KEY);
}

export async function saveDiaryEncrypted(
  password: string,
  entries: DiaryEntry[]
): Promise<void> {
  const payload = await encryptWithPassword(password, JSON.stringify(entries));
  writeJson(DIARY_KEY, payload);
}

export async function loadDiaryEncrypted(password: string): Promise<DiaryEntry[]> {
  const raw = localStorage.getItem(DIARY_KEY);
  if (!raw) return [];
  const payload = JSON.parse(raw) as EncryptedPayload;
  const text = await decryptWithPassword(password, payload);
  const data = JSON.parse(text) as DiaryEntry[];
  return Array.isArray(data) ? data : [];
}
