import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@components/GlassCard';
import { useStore } from '@store/useStore';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { Target, Trophy, Bell, Heart, Share2, Settings, ChevronRight, Shield } from 'lucide-react';
import GoalsPage from './GoalsPage';
import AchievementsPage from './AchievementsPage';
import ReminderSettingsPage from './ReminderSettingsPage';
import EmergencyPage from './EmergencyPage';
import SharePage from './SharePage';
import AdminChatPage from './AdminChatPage';

const menuItems = [
  { icon: Target, label: '我的目标', color: 'bg-pink-100', page: 'goals' as const },
  { icon: Trophy, label: '成就徽章', color: 'bg-yellow-100', badge: '12/48', page: 'achievements' as const },
  { icon: Bell, label: '提醒设置', color: 'bg-blue-100', page: 'reminders' as const },
  { icon: Heart, label: '紧急求助', color: 'bg-purple-100', important: true, page: 'emergency' as const },
  { icon: Share2, label: '分享给朋友', color: 'bg-green-100', page: 'share' as const },
  { icon: Shield, label: '管理员面板', color: 'bg-red-100', page: 'admin' as const },
];

export function ProfilePage() {
  const { userStats, initialize, authUserLabel, setAuthUserLabel } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authHint, setAuthHint] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [, setCurrentPage] = useState<'profile' | 'goals' | 'achievements' | 'reminders' | 'emergency' | 'share' | 'admin'>('profile');

  async function handleSignUp() {
    setAuthHint(null);
    if (!isSupabaseConfigured) {
      setAuthHint(
        '当前为离线预览：未配置有效的 Supabase（根目录 .env 中的 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY）。配置后请重启开发服务再注册。'
      );
      return;
    }
    const trimmed = email.trim();
    if (!trimmed || !password) {
      setAuthHint('请先填写上面的邮箱和密码，再点注册。');
      return;
    }
    if (password.length < 6) {
      setAuthHint('密码至少 6 位（Supabase 规定），请改长一点再点注册。');
      return;
    }
    setAuthBusy(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmed,
        password,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
        },
      });
      if (error) throw error;
      if (data.session) {
        const u = data.session.user;
        setAuthUserLabel(u.email ?? u.phone ?? trimmed);
        setAuthHint('注册成功，已自动登录。');
        await initialize();
      } else if (data.user) {
        setAuthHint(
          '已注册。若你开启了「邮箱验证」，请先到邮箱里点确认链接，再回到这里点「登录」。想立刻能登录：Supabase → Authentication → Providers → Email → 关掉 Confirm email。另：URL Configuration 里把 Redirect URLs 加上预览地址（如 http://127.0.0.1:5178）。'
        );
        await initialize();
      } else {
        setAuthHint('未创建用户会话。请到 Supabase → Authentication → Providers → 确认 Email 已开启且允许新用户注册。');
        await initialize();
      }
    } catch (e) {
      setAuthHint(e instanceof Error ? e.message : '注册失败');
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleSignIn() {
    setAuthHint(null);
    if (!isSupabaseConfigured) {
      setAuthHint(
        '当前为离线预览：未配置 Supabase 时无法登录。请配置 .env 后重启 dev，或使用「启动兽予心晴-连数据库请用这个」配套说明连接数据库。'
      );
      return;
    }
    const trimmed = email.trim();
    if (!trimmed || !password) {
      setAuthHint('请先填写邮箱和密码，再点登录。');
      return;
    }
    setAuthBusy(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmed,
        password,
      });
      if (error) throw error;
      if (data.session?.user) {
        const u = data.session.user;
        setAuthUserLabel(u.email ?? u.phone ?? trimmed);
      }
      setAuthHint(null);
      setPassword('');
      await initialize();
    } catch (e) {
      let msg = e instanceof Error ? e.message : '登录失败';
      if (/email not confirmed|not confirmed/i.test(msg)) {
        msg =
          '该邮箱还未在邮件里完成验证。请到收件箱点 Supabase 的确认链接，或在 Supabase → Authentication → Providers → Email 里关闭 Confirm email。';
      }
      setAuthHint(msg);
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleSignOut() {
    if (!isSupabaseConfigured) {
      setAuthUserLabel(null);
      setAuthHint(null);
      return;
    }
    setAuthBusy(true);
    try {
      await supabase.auth.signOut();
      setAuthUserLabel(null);
      setAuthHint(null);
    } finally {
      setAuthBusy(false);
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <section className="px-6 pt-6">
        <GlassCard className="p-6 flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blossom-300 to-forest-400 rounded-3xl flex items-center justify-center text-3xl shadow-lg">
            🌸
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-forest-900 text-xl">森林旅人</h2>
            {authUserLabel ? (
              <p className="text-forest-600 text-xs break-all mt-0.5">当前账号：{authUserLabel}</p>
            ) : (
              <p className="text-forest-600 text-sm">加入兽予心晴第 {userStats.streakDays} 天</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-forest-100 text-forest-700 px-3 py-1 rounded-full text-xs font-medium">
                Lv.{userStats.level} {userStats.levelName}
              </span>
            </div>
          </div>
          <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
            <Settings className="w-6 h-6 text-forest-700" />
          </button>
        </GlassCard>
      </section>

      <section className="px-6 relative z-20">
        <GlassCard className="p-4 space-y-3">
          <h3 className="font-bold text-forest-900 text-sm">账号（Supabase）</h3>
          {authUserLabel ? (
            <div className="space-y-2">
              <p className="text-sm text-forest-700 break-all">已登录：{authUserLabel}</p>
              <p className="text-xs text-forest-500">
                该账号会出现在后台 Table Editor 的 <code className="bg-forest-100 px-1 rounded">users</code>{' '}
                表中，<code className="bg-forest-100 px-1 rounded">id</code> 与 Authentication 用户一致。
              </p>
              <button
                type="button"
                disabled={authBusy}
                onClick={() => void handleSignOut()}
                className="w-full py-2 rounded-xl bg-forest-200 text-forest-900 text-sm font-medium disabled:opacity-50"
              >
                退出登录
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="email"
                autoComplete="email"
                placeholder="邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-forest-200 bg-white/80 text-sm"
              />
              <input
                type="password"
                autoComplete="current-password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-forest-200 bg-white/80 text-sm"
              />
              <p className="text-xs text-forest-500">
                新用户请先点下面「注册账号」；密码至少 6 位。按钮只有「正在提交」时会暂时灰掉。
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  disabled={authBusy}
                  onClick={() => void handleSignUp()}
                  className="w-full min-h-[48px] py-3 rounded-xl bg-forest-600 text-white text-sm font-semibold disabled:opacity-60 active:scale-[0.98] transition-transform cursor-pointer touch-manipulation"
                >
                  {authBusy ? '提交中…' : '注册账号'}
                </button>
                <button
                  type="button"
                  disabled={authBusy}
                  onClick={() => void handleSignIn()}
                  className="w-full min-h-[48px] py-3 rounded-xl border-2 border-forest-600 bg-white/90 text-forest-800 text-sm font-semibold disabled:opacity-60 active:scale-[0.98] transition-transform cursor-pointer touch-manipulation"
                >
                  登录
                </button>
              </div>
              {authHint && (
                <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2 whitespace-pre-wrap">
                  {authHint}
                </p>
              )}
            </div>
          )}
        </GlassCard>
      </section>

      <section className="px-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: userStats.streakDays, label: '连续打卡', color: 'text-forest-600' },
            { value: userStats.meditationMinutes, label: '冥想分钟', color: 'text-blue-600' },
            { value: userStats.chatCount, label: '对话次数', color: 'text-purple-600' },
          ].map((stat, index) => (
            <GlassCard key={index} className="p-4 text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-forest-700 mt-1">{stat.label}</div>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="px-6 space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              whileTap={{ scale: 0.98 }}
            >
              <GlassCard 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/80 transition-colors"
                onClick={() => item.page && setCurrentPage(item.page)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-forest-700" />
                  </div>
                  <span className="font-medium text-forest-900">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="text-xs text-forest-600">{item.badge}</span>
                  )}
                  {item.important && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      重要
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-forest-400" />
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}

// 页面路由组件
export function ProfileRouter() {
  const [currentPage, setCurrentPage] = useState<'profile' | 'goals' | 'achievements' | 'reminders' | 'emergency' | 'share' | 'admin'>('profile');

  const renderPage = () => {
    switch (currentPage) {
      case 'goals':
        return <GoalsPage onBack={() => setCurrentPage('profile')} />;
      case 'achievements':
        return <AchievementsPage onBack={() => setCurrentPage('profile')} />;
      case 'reminders':
        return <ReminderSettingsPage onBack={() => setCurrentPage('profile')} />;
      case 'emergency':
        return <EmergencyPage onBack={() => setCurrentPage('profile')} />;
      case 'share':
        return <SharePage onBack={() => setCurrentPage('profile')} />;
      case 'admin':
        return <AdminChatPage onBack={() => setCurrentPage('profile')} />;
      default:
        return <ProfilePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-green-50 to-emerald-100">
      {renderPage()}
    </div>
  );
}
