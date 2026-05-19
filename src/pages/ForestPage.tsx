import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { GlassCard } from '@components/GlassCard';
import { BEAUTIFUL_LITTLE_THINGS } from '@/data/beautifulLittleThings';

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '今天'];

const achievements = [
  { icon: '🌱', title: '种下第一棵树', date: '2024年3月1日', stars: 50 },
  { icon: '📝', title: '连续记录7天', date: '2024年3月8日', stars: 100 },
  { icon: '🧘', title: '完成首次冥想', date: '2024年3月15日', stars: 80 },
];

export function ForestPage() {
  const littleThingsRef = useRef<HTMLDivElement>(null);
  const weekData = [60, 80, 40, 90, 50, 70, 30];

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
        <GlassCard className="relative flex h-64 items-end justify-center gap-4 overflow-hidden p-6">
          <div className="absolute inset-0 bg-gradient-to-b from-blossom-100/60 to-forest-100/80" />
          
          {[
            { emoji: '🌳', height: 'h-16', delay: 0 },
            { emoji: '🌲', height: 'h-20', delay: 0.5 },
            { emoji: '🌿', height: 'h-12', delay: 1 },
            { emoji: '🌳', height: 'h-16', delay: 1.5 },
          ].map((tree, index) => (
            <motion.div
              key={index}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: tree.delay, duration: 0.5 }}
              className="relative z-10 flex flex-col items-center origin-bottom animate-sway"
              style={{ animationDelay: `${tree.delay}s` }}
            >
              <span className="text-5xl filter drop-shadow-lg">{tree.emoji}</span>
              <div className={`w-2 ${tree.height} bg-amber-700 rounded-full mt-[-10px]`} />
            </motion.div>
          ))}
          
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-20 left-10 text-2xl"
          >
            🐰
          </motion.div>
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute bottom-16 right-12 text-2xl"
          >
            🦋
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
        <p className="mb-3 px-1 text-xs leading-relaxed text-forest-600">
          可左右滑动图集，或点两侧箭头。电脑也可把鼠标放在图集上，用滚轮上下拨动来横翻。
        </p>
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
        <h3 className="font-bold text-forest-800 mb-3 px-1">本周情绪概览</h3>
        <GlassCard className="p-5">
          <div className="flex justify-between items-end h-32 gap-2">
            {weekData.map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-forest-200 rounded-t-2xl relative overflow-hidden" style={{ height: '100%' }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`absolute bottom-0 w-full rounded-t-2xl ${index === 6 ? 'bg-purple-400' : 'bg-forest-400'}`}
                  />
                </div>
                <span className={`text-xs ${index === 6 ? 'text-forest-800 font-bold' : 'text-forest-600'}`}>
                  {weekDays[index]}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="px-6">
        <h3 className="font-bold text-forest-800 mb-3 px-1">森林成长记录</h3>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-forest-900 text-sm">{achievement.title}</h4>
                  <p className="text-xs text-forest-600">{achievement.date}</p>
                </div>
                <span className="text-xs text-forest-500 font-medium">+{achievement.stars} ⭐</span>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
