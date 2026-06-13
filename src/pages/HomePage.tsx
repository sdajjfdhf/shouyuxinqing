import { motion } from 'framer-motion';
import { GlassCard } from '@components/GlassCard';
import { MoodSelector } from '@components/MoodSelector';
import { useStore } from '@store/useStore';
import { getGreeting } from '@utils/helpers';
import { Wind, Brain, BookOpen, Heart, ArrowRight } from 'lucide-react';

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
    setSelectedArticleId,
    setIsBreathing,
  } = useStore();

  const handleQuickAction = (feature: string) => {
    if (feature === 'breathe') {
      setIsBreathing(true);
    } else if (feature === 'knowledge') {
      setCurrentTab('knowledge');
    } else if (feature === 'diary') {
      setCurrentTab('diary');
    } else if (feature === 'meditation') {
      setCurrentTab('meditation');
    } else {
      console.log(`Opening ${feature}`);
    }
  };

  return (
    <div className="space-y-6 pb-24">

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
                <h3 className="font-bold text-forest-900 text-lg">🌲 森林里的小伙伴们</h3>
                <p className="text-forest-600 text-sm">小动物们正在森林草坪上玩耍呢~</p>
              </div>
              <span className="text-2xl">🌤️</span>
            </div>

            <div className="relative h-52 overflow-hidden rounded-3xl border border-blossom-100/60 bg-gradient-to-b from-sky-100 via-forest-50 to-forest-200">
              {/* 天空背景 */}
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-sky-200/60 via-sky-100/40 to-transparent" />
              
              {/* 太阳 */}
              <div className="absolute right-8 top-4 h-14 w-14 rounded-full bg-yellow-300 shadow-[0_0_60px_rgba(253,224,71,0.55)]" />
              
              {/* 云朵 */}
              <div className="absolute left-4 top-3 flex gap-1">
                <div className="w-6 h-4 bg-white/80 rounded-full" />
                <div className="w-8 h-5 bg-white/80 rounded-full" />
                <div className="w-5 h-4 bg-white/80 rounded-full" />
              </div>
              <div className="absolute left-20 top-5 flex gap-1">
                <div className="w-5 h-3 bg-white/60 rounded-full" />
                <div className="w-7 h-4 bg-white/60 rounded-full" />
                <div className="w-4 h-3 bg-white/60 rounded-full" />
              </div>

              {/* 远山 */}
              <div className="absolute left-0 right-0 bottom-20">
                <div className="absolute left-0 top-0 w-32 h-16 bg-forest-300/40 rounded-full" style={{ transform: 'translateX(-50%)' }} />
                <div className="absolute left-1/4 top-0 w-40 h-20 bg-forest-300/50 rounded-full" />
                <div className="absolute right-0 top-0 w-36 h-18 bg-forest-300/45 rounded-full" style={{ transform: 'translateX(50%)' }} />
              </div>

              {/* 森林树木 */}
              <div className="absolute left-2 bottom-16">
                <div className="w-8 h-16 bg-forest-600 rounded-t-full relative">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-6 bg-forest-500 rounded-t-full" />
                </div>
              </div>
              <div className="absolute left-8 bottom-14">
                <div className="w-10 h-20 bg-forest-700 rounded-t-full relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-8 bg-forest-600 rounded-t-full" />
                </div>
              </div>
              <div className="absolute right-2 bottom-16">
                <div className="w-9 h-18 bg-forest-600 rounded-t-full relative">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-11 h-7 bg-forest-500 rounded-t-full" />
                </div>
              </div>
              <div className="absolute right-10 bottom-14">
                <div className="w-11 h-22 bg-forest-700 rounded-t-full relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-13 h-9 bg-forest-600 rounded-t-full" />
                </div>
              </div>

              {/* 草地 */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-forest-400/60 via-forest-300/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-16 rounded-[50%_50%_0_0] bg-gradient-to-t from-forest-500/40 to-forest-300/50" />
              
              {/* 草地细节 */}
              <div className="absolute inset-x-0 bottom-0 h-20 overflow-hidden">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 12, 8] }}
                    transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }}
                    className="absolute bottom-0 w-1 bg-forest-600 rounded-t-full"
                    style={{ left: `${8 + i * 7}%`, height: `${10 + Math.random() * 8}px` }}
                  />
                ))}
              </div>

              {/* 萤火虫 */}
              <span className="firefly left-[12%] top-[28%]" />
              <span className="firefly left-[25%] top-[18%] [animation-delay:0.5s]" />
              <span className="firefly left-[40%] top-[25%] [animation-delay:1s]" />
              <span className="firefly left-[55%] top-[22%] [animation-delay:1.5s]" />
              <span className="firefly left-[70%] top-[20%] [animation-delay:2s]" />
              <span className="firefly left-[82%] top-[26%] [animation-delay:2.5s]" />
              <span className="firefly left-[35%] top-[38%] [animation-delay:0.8s]" />
              <span className="firefly left-[65%] top-[40%] [animation-delay:1.3s]" />

              {/* 飘落的花瓣 */}
              <motion.div
                animate={{ y: [0, 60], x: [0, 20] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute left-[20%] top-4 text-pink-300 text-xs"
              >🌸</motion.div>
              <motion.div
                animate={{ y: [0, 80], x: [0, -15] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear', delay: 2 }}
                className="absolute left-[70%] top-6 text-pink-200 text-xs"
              >🌸</motion.div>
              <motion.div
                animate={{ y: [0, 70], x: [0, 25] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'linear', delay: 4 }}
                className="absolute left-[50%] top-8 text-pink-300 text-xs"
              >🌸</motion.div>

              {/* 小松鼠在树上 */}
              <motion.div
                animate={{ y: [0, -2, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-10 bottom-30"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-600/80 backdrop-blur-sm border border-amber-500/50 flex items-center justify-center text-lg shadow-md">
                  🐿️
                </div>
              </motion.div>

              {/* 小兔子 */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-4 bottom-10"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/70 flex items-center justify-center text-3xl shadow-lg">
                  🐰
                </div>
              </motion.div>

              {/* 小狐狸 */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                className="absolute right-6 bottom-9"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/75 backdrop-blur-sm border border-white/70 flex items-center justify-center text-3xl shadow-lg">
                  🦊
                </div>
              </motion.div>

              {/* 小熊 */}
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                className="absolute left-20 bottom-5"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/70 flex items-center justify-center text-2xl shadow-md">
                  🐻
                </div>
              </motion.div>

              {/* 小熊猫 */}
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute right-20 bottom-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/70 flex items-center justify-center text-2xl shadow-md">
                  🐼
                </div>
              </motion.div>

              {/* 小鹿（中心位置） */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-1/2 -translate-x-1/2 bottom-14"
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

              {/* 小猫头鹰 */}
              <motion.div
                animate={{ rotate: [0, 3, 0, -3, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-14 bottom-28"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-200/80 backdrop-blur-sm border border-gray-300/50 flex items-center justify-center text-xl shadow-md">
                  🦉
                </div>
              </motion.div>

              {/* 小鸟 */}
              <motion.div
                animate={{ y: [0, -5, 0], x: [0, 3, 0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-[45%] top-10"
              >
                <span className="text-lg">🐦</span>
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
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-forest-400 via-blossom-400 to-blossom-500 p-5 text-white shadow-lg cursor-pointer"
          onClick={() => {
            setSelectedArticleId('0');
            setCurrentTab('knowledge');
          }}
        >
          <div className="absolute right-0 top-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-10 -mt-10" />
          <div className="absolute left-0 bottom-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16" />
          <div className="relative z-10">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium mb-2 inline-block backdrop-blur-sm">
              今日推荐
            </span>
            <h3 className="font-bold text-lg mb-1">如何应对"周日焦虑"？</h3>
            <p className="mb-3 text-sm text-white/90">
              5个实用技巧帮你缓解周末结束前的紧张感
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-bold text-forest-700 shadow-md transition-colors hover:bg-blossom-50"
            >
              阅读文章
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
