import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, TreePine, Award, Calendar, Star, Lock, ArrowRight } from 'lucide-react';
import { GlassCard } from '@components/GlassCard';
import { BEAUTIFUL_LITTLE_THINGS } from '@/data/beautifulLittleThings';
import { achievements } from '@/data/achievements';
import { useStore } from '@store/useStore';

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '今天'];

export function ForestPage() {
  const littleThingsRef = useRef<HTMLDivElement>(null);
  const { userStats, emotionHistory, setCurrentTab } = useStore();
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // 计算统计数据
  const stats = useMemo(() => ({
    streakDays: userStats.streakDays || 0,
    totalDays: emotionHistory.length || 0,
    meditationMinutes: userStats.meditationMinutes || 0,
    chatCount: userStats.chatCount || 0,
    moodRecordCount: emotionHistory.length || 0,
    totalStars: userStats.totalStars || 0,
    animalCount: 4,
    diaryCount: 0,
    sleepEarlyCount: 0,
    wakeEarlyCount: 0,
    courseCount: 0,
    shareCount: 0,
  }), [userStats, emotionHistory]);

  // 检查并解锁成就
  useEffect(() => {
    const newlyUnlocked: string[] = [];
    achievements.forEach((achievement) => {
      if (achievement.condition(stats) && !unlockedAchievements.includes(achievement.id)) {
        newlyUnlocked.push(achievement.id);
      }
    });

    if (newlyUnlocked.length > 0) {
      setUnlockedAchievements((prev) => [...prev, ...newlyUnlocked]);
      // 显示成就解锁通知
      const firstNew = achievements.find((a) => a.id === newlyUnlocked[0]);
      if (firstNew) {
        setShowNotification(firstNew.id);
        setTimeout(() => setShowNotification(null), 3000);
      }
    }
  }, [stats, unlockedAchievements]);
  
  // 根据真实的情绪历史数据生成图表
  const generateWeekData = () => {
    const data = emotionHistory && emotionHistory.length > 0 ? emotionHistory.slice(-7) : [];
    const weekData = [];
    for (let i = 0; i < 7; i++) {
      if (data[i] && typeof data[i].intensity === 'number') {
        // 将情绪强度转换为百分比 (1-5 -> 20-100)
        weekData.push((data[i].intensity / 5) * 100);
      } else {
        // 如果没有数据，使用随机值
        weekData.push(30 + Math.random() * 50);
      }
    }
    return weekData;
  };
  
  const weekData = generateWeekData();
  const treeCount = Math.min(stats.totalDays, 7); // 最多显示7棵树

  useEffect(() => {
    const el = littleThingsRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const next = el.scrollLeft + e.deltaY;
      const clamped = Math.max(0, Math.min(max, next));
      if (clamped === el.scrollLeft && (e.deltaY < 0 ? el.scrollLeft <= 0 : el.scrollLeft >= max)) {
        return;
      }
      el.scrollLeft = clamped;
      e.preventDefault();
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const scrollLittleThings = (direction: -1 | 1) => {
    const el = littleThingsRef.current;
    if (!el) return;
    const step = Math.max(180, Math.round(el.clientWidth * 0.72));
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <div className="min-w-0 space-y-6 pb-24">
      <section className="px-6 pt-6 text-center">
        <h1 className="mb-1 text-2xl font-bold text-forest-900">我的心灵森林</h1>
        <p className="text-sm text-forest-700">每一棵树都记录着你的情绪成长</p>
      </section>

      <section className="px-6">
        <GlassCard className="relative flex h-72 items-end justify-center gap-3 overflow-hidden p-6 cursor-pointer group">
          <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="absolute inset-0 bg-gradient-to-b from-blossom-50/80 via-forest-100/60 to-forest-200/80"
              onClick={() => setCurrentTab('forest-3d')}
            />
          
          {/* 背景装饰 */}
          <motion.div 
            className="absolute top-4 left-4 text-sm opacity-60"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >☀️</motion.div>
          <motion.div 
            className="absolute top-6 right-6 text-sm opacity-60"
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >☁️</motion.div>
          
          {/* 草地 */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-green-400/40 to-transparent" />
          
          {/* 树木 */}
          {Array.from({ length: treeCount }).map((_, index) => {
            const treeVariants = ['🌳', '🌲', '🌴', '🌿', '🪴', '🎋', '🌵'];
            const heights = ['h-14', 'h-18', 'h-22', 'h-16', 'h-20', 'h-12', 'h-16'];
            return (
              <motion.div
                key={index}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ delay: index * 0.15, duration: 0.6, ease: 'easeOut' }}
                className="relative z-10 flex flex-col items-center origin-bottom"
                whileHover={{ scale: 1.15, y: -8 }}
              >
                <motion.span 
                  className="text-4xl md:text-5xl filter drop-shadow-lg"
                  animate={{ rotate: [-2, 2, -2] }}
                  transition={{ duration: 4 + index, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {treeVariants[index % treeVariants.length]}
                </motion.span>
                <div className={`w-2 ${heights[index % heights.length]} bg-gradient-to-t from-amber-800 to-amber-600 rounded-full mt-[-8px] shadow-sm`} />
              </motion.div>
            );
          })}
          
          {/* 小动物装饰 */}
          <motion.div 
            animate={{ y: [0, -12, 0], x: [0, 5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-16 left-8 text-xl md:text-2xl hover:scale-125 transition-transform"
          >
            🐰
          </motion.div>
          <motion.div 
            animate={{ y: [0, -8, 0], x: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, delay: 0.5, ease: 'easeInOut' }}
            className="absolute bottom-20 right-10 text-xl md:text-2xl hover:scale-125 transition-transform"
          >
            🦋
          </motion.div>
          
          {/* 统计信息 */}
          <div className="absolute top-4 right-4 flex flex-col gap-1 bg-white/70 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm">
            <div className="flex items-center gap-1 text-xs text-forest-700">
              <TreePine className="w-3 h-3" />
              <span>{treeCount} 棵树</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-forest-700">
              <Calendar className="w-3 h-3" />
              <span>{stats.totalDays} 天</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-600">
              <Star className="w-3 h-3 fill-current" />
              <span>{stats.totalStars}</span>
            </div>
          </div>
          
          {/* 进入3D森林提示 */}
          <motion.div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm text-forest-700 font-medium">进入3D森林</span>
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ArrowRight className="w-4 h-4 text-forest-600" />
            </motion.div>
          </motion.div>
        </GlassCard>
      </section>

      <section className="min-w-0 px-6">
        <div className="mb-1 flex min-w-0 items-center justify-between gap-2 px-1">
          <div className="flex min-w-0 items-center gap-2">
            <Sparkles className="h-5 w-5 shrink-0 text-amber-500" aria-hidden />
            <h3 className="font-bold text-forest-800">美好小事</h3>
          </div>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              aria-label="向左查看上一张"
              onClick={() => scrollLittleThings(-1)}
              className="rounded-full border border-forest-200 bg-white/90 p-2 text-forest-700 shadow-sm active:scale-95 touch-manipulation"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="向右查看下一张"
              onClick={() => scrollLittleThings(1)}
              className="rounded-full border border-forest-200 bg-white/90 p-2 text-forest-700 shadow-sm active:scale-95 touch-manipulation"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
        {/*
          外层单独负责 overflow-x（内层 flex + w-max），避免与 display:flex 同层时在部分浏览器里无法横向滚动。
        */}
        <div
          ref={littleThingsRef}
          className="hide-scrollbar min-h-0 min-w-0 w-full overflow-x-auto overflow-y-hidden overscroll-x-contain [-webkit-overflow-scrolling:touch] snap-x snap-mandatory scroll-pl-0 scroll-pr-6"
          role="list"
          aria-label="美好小事图集"
        >
          <div className="flex w-max flex-nowrap gap-4 pb-2 pr-2">
            {BEAUTIFUL_LITTLE_THINGS.map((item) => (
              <article
                key={item.title}
                role="listitem"
                className="w-[min(78vw,280px)] shrink-0 snap-center"
              >
                <GlassCard className="overflow-hidden border border-white/40 p-0">
                  <div className="relative aspect-[4/5] w-full">
                    <img
                      src={item.imageSrc}
                      alt={`${item.title}：${item.caption}`}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/20 to-transparent"
                      aria-hidden
                    />
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h4 className="text-sm font-bold leading-snug drop-shadow-sm">{item.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-white/90 drop-shadow-sm">
                        {item.caption}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-bold text-forest-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            本周情绪概览
          </h3>
          <span className="text-xs text-forest-500">共 {Math.floor(stats.meditationMinutes / 5)} 次冥想</span>
        </div>
        <GlassCard className="p-5">
          <div className="flex justify-between items-end h-32 gap-2">
            {weekData.map((height, index) => {
              const isToday = index === 6;
              const moodColor = height >= 70 ? 'bg-green-400' : height >= 40 ? 'bg-yellow-400' : 'bg-red-400';
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-forest-100 rounded-t-2xl relative overflow-hidden" style={{ height: '100%' }}>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: `${height}%`, opacity: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`absolute bottom-0 w-full rounded-t-2xl ${moodColor} shadow-md`}
                    />
                    {isToday && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8, type: 'spring' }}
                        className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-sm"
                      />
                    )}
                  </div>
                  <span className={`text-xs ${isToday ? 'text-forest-800 font-bold' : 'text-forest-500'}`}>
                    {weekDays[index]}
                  </span>
                  <span className="text-xs text-forest-400">{Math.round(height)}%</span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </section>

      <section className="px-6">
        <div className="flex items-center gap-2 mb-3 px-1">
          <Award className="w-4 h-4 text-amber-500" />
          <h3 className="font-bold text-forest-800">森林成长记录</h3>
          <span className="text-sm font-bold text-forest-800 ml-auto">
            已解锁 {unlockedAchievements.length}/{achievements.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={isUnlocked ? { y: -3 } : {}}
              >
                <GlassCard className={`p-4 flex flex-col items-center text-center ${isUnlocked ? '' : 'opacity-60 grayscale'}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-2 shadow-sm ${isUnlocked ? 'bg-gradient-to-br from-amber-50 to-green-100' : 'bg-gray-100'}`}>
                    {isUnlocked ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: index * 0.1 }}
                      >
                        {achievement.icon}
                      </motion.span>
                    ) : (
                      <Lock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <h4 className={`font-bold text-xs mb-1 ${isUnlocked ? 'text-forest-900' : 'text-gray-500'}`}>
                    {isUnlocked ? achievement.title : '???'}
                  </h4>
                  <p className="text-xs text-forest-500 mb-2 line-clamp-1">
                    {isUnlocked ? achievement.description : '完成特定任务解锁'}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{achievement.stars}</span>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 成就解锁通知 */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
          >
            <GlassCard className="px-6 py-4 shadow-lg border-2 border-amber-400">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="text-3xl"
                >
                  🏆
                </motion.div>
                <div>
                  <p className="text-sm font-bold text-forest-900">成就解锁！</p>
                  <p className="text-xs text-forest-600">
                    {achievements.find((a) => a.id === showNotification)?.title}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
