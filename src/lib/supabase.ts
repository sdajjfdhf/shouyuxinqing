import { createClient } from '@supabase/supabase-js';

function readEnv(key: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'): string {
  const raw = import.meta.env[key];
  if (typeof raw !== 'string') return '';
  let s = raw.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

/** 合法的 Supabase 项目 URL（支持标准 *.supabase.co） */
function isValidPublicSupabaseUrl(url: string): boolean {
  const normalized = url.replace(/\/$/, '').trim();
  if (!normalized || normalized.includes('.supabase.cohttp')) return false;
  try {
    const u = new URL(normalized);
    if (u.protocol !== 'https:') return false;
    return u.hostname.endsWith('.supabase.co') && u.hostname.length > '.supabase.co'.length;
  } catch {
    return false;
  }
}

const supabaseUrl = readEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = readEnv('VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  isValidPublicSupabaseUrl(supabaseUrl)
);

/** 未配置时使用占位地址，避免模块加载即抛错导致白屏；网络请求会失败并由 store 捕获 */
const effectiveUrl = isSupabaseConfigured
  ? supabaseUrl.replace(/\/$/, '')
  : 'https://abcdefghijklmnopqrst.supabase.co';

const effectiveKey = isSupabaseConfigured
  ? supabaseAnonKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjo5OTk5OTk5OTk5fQ.offline-preview-placeholder-key';

if (!isSupabaseConfigured) {
  console.warn(
    '[兽予心晴] 未检测到有效的 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY，已启用离线预览（界面可用，云同步与登录不可用）。连接数据库请在项目根目录配置 .env 后重启 dev 服务。'
  );
}

export const supabase = createClient(effectiveUrl, effectiveKey);
