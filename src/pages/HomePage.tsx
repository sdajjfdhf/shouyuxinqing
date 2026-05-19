import { motion } from 'framer-motion';
import { HomeNatureHero } from '@components/HomeNatureHero';
import { HomeNavNatureStrip } from '@components/HomeNavNatureStrip';
import { GlassCard } from '@components/GlassCard';
import { MoodSelector } from '@components/MoodSelector';
import { useStore } from '@store/useStore';
import { getGreeting } from '@utils/helpers';
import { Wind, Brain, BookOpen, Heart } from 'lucide-react';

const quickActions = [
  { icon: Wind, label: '呼吸练习', color: 'bg-blue-100', feature: 'breathe' },
  { icon: Brain, label: '正念冥想', color: 'bg-purple-100', feature: 'meditation' },
  { icon: BookOpen, label: '情绪日记', color: 'bg-yellow-100', feature: 'diary' },
  { icon: Heart, label: '心理小知识', color: 'bg-pink-100', feature: 'knowledge' },
];

export function HomePage() {
  const { 
    todayMood, 
    setTodayMood, 
    selectedAnimal, 
    setCurrentTab,
    setIsBreathing,
  } = useStore();

  const handleQuickAction = (feature: string) => {
    if (feature === 'breathe') {
      setIsBreathing(true);
    } else if (feature === 'knowledge') {
      setCurrentTab('knowledge');
    } else if (feature === 'diary') {
      setCurrentTab('diary');
    } else {
      console.log(`Opening ${feature}`);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <HomeNatureHero />

      <section className="px-6 pt-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="mb-1 text-2xl font-bold text-forest-900">
            {getGreeting()}，旅人 🌙
          </h1>
          <p className="text-sm text-forest-700">
            风里飘着淡淡的花香，今天想被世界怎样温柔对待？
          </p>
        </motion.div>
      </section>

      <HomeNavNatureStrip onNavigate={setCurrentTab} />

      <section className="px-6">
        <GlassCard className="p-5">
          <h3 className="font-bold text-forest-800 mb-4 flex items-center gap-2 text-lg">
            <span>🎭</span> 此刻的心情是？
          </h3>
          <MoodSelector 
            selectedMood={todayMood} 
            onSelect={setTodayMood} 
          />
        </GlassCard>
      </section>

      <section className="px-6">
        <GlassCard className="p-5 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-36 h-36 bg-yellow-100/70 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-green-200/70 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-forest-900 text-lg">森林草坪小聚会</h3>
                <p className="text-forest-600 text-sm">小伙伴们都在等你，来坐一会儿吧</p>
              </div>
              <span className="text-2xl">🌤️</span>
            </div>

            <div className="relative h-44 overflow-hidden rounded-3xl border border-blossom-100/60 bg-gradient-to-b from-blossom-50 via-forest-50 to-forest-200">
              <div className="absolute inset-0 bg-gradient-to-b from-blossom-100/50 via-transparent to-forest-200/50" />
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blossom-200/35 via-sky-100/25 to-transparent" />
              <div className="absolute left-6 top-5 h-10 w-10 rounded-full bg-blossom-200/90 shadow-[0_0_40px_rgba(242,147,179,0.45)]" />
              <div className="absolute right-5 top-2 h-16 w-10 rounded-full bg-forest-200/50 blur-2xl" />

              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-forest-300/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-5 h-12 rounded-[50%] bg-forest-200/55 blur-sm" />
              <span className="firefly left-[14%] top-[32%]" />
              <span className="firefly left-[28%] top-[20%] [animation-delay:0.6s]" />
              <span className="firefly left-[44%] top-[28%] [animation-delay:1.1s]" />
              <span className="firefly left-[62%] top-[18%] [animation-delay:1.7s]" />
              <span className="firefly left-[78%] top-[30%] [animation-delay:2.4s]" />
              <span className="firefly left-[70%] top-[42%] [animation-delay:0.9s]" />

              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-1/2 -translate-x-1/2 bottom-12"
              >
                <div
                  onClick={() => setCurrentTab('chat')}
                  className="deer-avatar ring-4 ring-white/70 shadow-xl"
                >
                  <span className="deer-ear left" />
                  <span className="deer-ear right" />
                  <span className="deer-head">
                    <span className="deer-eye left" />
                    <span className="deer-eye right" />
                    <span className="deer-nose" />
                  </span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-6 bottom-11"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/70 flex items-center justify-center text-2xl shadow-md">
                  🐰
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="absolute right-8 bottom-10"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/70 flex items-center justify-center text-2xl shadow-md">
                  🦊
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                className="absolute left-16 bottom-3"
              >
                <div className="w-11 h-11 rounded-2xl bg-white/65 backdrop-blur-sm border border-white/70 flex items-center justify-center text-xl shadow-md">
                  🐻
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 4.3, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                className="absolute right-16 bottom-2"
              >
                <div className="w-11 h-11 rounded-2xl bg-white/65 backdrop-blur-sm border border-white/70 flex items-center justify-center text-xl shadow-md">
                  🐼
                </div>
              </motion.div>
            </div>

            <div className="mt-4">
              <h4 className="font-bold text-forest-900">{selectedAnimal.name}</h4>
              <p className="text-forest-600 text-sm mt-1 mb-3 line-clamp-2">
                "{selectedAnimal.greeting}"
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentTab('chat')}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-forest-500 to-blossom-500 px-4 py-2 text-sm font-bold text-white shadow-lg transition-colors hover:from-forest-600 hover:to-blossom-600"
              >
                <span>💬</span> 和大家一起聊聊
              </motion.button>
            </div>
          </div>
        </GlassCard>
      </section>

      <section className="px-6">
        <h3 className="font-bold text-forest-800 mb-3 px-1">森林疗愈室</h3>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.feature}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <GlassCard
                  hover
                  onClick={() => handleQuickAction(action.feature)}
                  className="p-4"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-forest-700" />
                  </div>
                  <h4 className="font-bold text-forest-900">{action.label}</h4>
                  <p className="text-xs text-forest-600 mt-1">
                    {action.feature === 'breathe' && '4-7-8 放松呼吸法'}
                    {action.feature === 'meditation' && '10分钟森林冥想'}
                    {action.feature === 'diary' && '记录今日心情'}
                    {action.feature === 'knowledge' && '每日心理学贴士'}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-forest-400 via-blossom-400 to-blossom-500 p-5 text-white shadow-lg">
          <div className="absolute right-0 top-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-10 -mt-10" />
          <div className="relative z-10">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium mb-2 inline-block backdrop-blur-sm">
              今日推荐
            </span>
            <h3 className="font-bold text-lg mb-1">如何应对"周日焦虑"？</h3>
            <p className="mb-3 text-sm text-white/90">
              5个实用技巧帮你缓解周末结束前的紧张感
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-forest-700 shadow-md transition-colors hover:bg-blossom-50"
            >
              阅读文章 →
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}
