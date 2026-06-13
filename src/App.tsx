import { useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@store/useStore';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { BottomNav } from '@components/BottomNav';
import { BreathingExercise } from '@components/BreathingExercise';
import { LeafBackground } from '@components/LeafBackground';
import { HomePage } from '@pages/HomePage';
import { ChatPage } from '@pages/ChatPage';
import { ForestPage } from '@pages/ForestPage';
import Forest3DPage from '@pages/Forest3DPage';
import { KnowledgePage } from '@pages/KnowledgePage';
import { ProfilePage } from '@pages/ProfilePage';
import { MoodDiaryPage } from '@pages/MoodDiaryPage';
import { MeditationPage } from '@pages/MeditationPage';
import AdminChatPage from '@pages/AdminChatPage';

const pages = {
  home: HomePage,
  forest: ForestPage,
  chat: ChatPage,
  knowledge: KnowledgePage,
  profile: ProfilePage,
  diary: MoodDiaryPage,
  meditation: MeditationPage,
  admin: AdminChatPage,
  'forest-3d': Forest3DPage,
};

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

function sessionLabel(session: Session | null): string | null {
  const u = session?.user;
  if (!u) return null;
  return u.email ?? u.phone ?? null;
}

export default function App() {
  const { currentTab, userStats, initialize, authUserLabel } = useStore();
  const CurrentPage = pages[currentTab];

  useEffect(() => {
    void initialize();

    if (!isSupabaseConfigured) {
      return;
    }

    void supabase.auth.getSession().then(({ data: { session } }) => {
      useStore.getState().setAuthUserLabel(sessionLabel(session));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      useStore.getState().setAuthUserLabel(sessionLabel(session));
      void initialize();
    });

    return () => subscription.unsubscribe();
  }, [initialize]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blossom-50 via-forest-50 to-forest-100 flex items-start justify-center">
      {/* iPhone 16 系列适配容器 */}
      <div className="iphone16-container bg-gradient-to-b from-blossom-50 via-forest-50 to-forest-100 shadow-2xl">
        <LeafBackground />
        
        <header className="sticky top-0 z-50 glass px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl shrink-0">🌸</span>
            <div className="flex flex-col min-w-0">
              <span className="font-cute text-xl text-forest-900 font-bold">兽予心晴</span>
              {authUserLabel ? (
                <span className="text-[11px] text-forest-600 truncate max-w-[12rem]" title={authUserLabel}>
                  已登录 {authUserLabel}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-blossom-200/60 bg-blossom-100/50 px-3 py-1">
              <span className="text-yellow-500">✨</span>
              <span className="text-sm font-bold text-forest-800">
                {userStats.totalStars.toLocaleString()}
              </span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blossom-400 to-forest-500 text-xs font-bold text-white shadow-lg">
              我
            </div>
          </div>
        </header>

        <main className="relative z-10 w-full min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              className="min-w-0"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <CurrentPage />
            </motion.div>
          </AnimatePresence>
        </main>

        {currentTab !== 'diary' && <BottomNav />}
        <BreathingExercise />
      </div>
    </div>
  );
}
