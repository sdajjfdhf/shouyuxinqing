import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { GlassCard } from '@components/GlassCard';
import { HOME_NAV_NATURE_DESTINATIONS, PAGE_NATURE_THEMES } from '@/data/pageNatureThemes';
import type { TabType } from '@/types';

type HomeNavNatureStripProps = {
  onNavigate: (tab: TabType) => void;
};

export function HomeNavNatureStrip({ onNavigate }: HomeNavNatureStripProps) {
  return (
    <section className="min-w-0 px-6">
      <div className="mb-2 flex items-center gap-2 px-1">
        <Compass className="h-5 w-5 shrink-0 text-forest-600" aria-hidden />
        <h2 className="font-cute text-lg font-bold text-forest-900">一站一景</h2>
      </div>
      <p className="mb-3 px-1 text-xs leading-relaxed text-forest-600">
        森林 🦌 · 对话 🐰 · 学习 🦉 · 我的 🐻 · 情绪日记 🐱 — 点卡片进入对应页面
      </p>
      <div className="hide-scrollbar flex gap-3 overflow-x-auto overflow-y-hidden pb-1 [-webkit-overflow-scrolling:touch]">
        {HOME_NAV_NATURE_DESTINATIONS.map(({ tab, navLabel }, i) => {
          const t = PAGE_NATURE_THEMES[tab];
          return (
            <motion.button
              key={tab}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate(tab)}
              className="w-[min(42vw,168px)] shrink-0 touch-manipulation text-left"
            >
              <GlassCard hover className="overflow-hidden p-0">
                <div className="relative aspect-[4/5]">
                  <img
                    src={t.imageSrc}
                    alt={t.imageAlt}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-900/88 via-forest-900/15 to-transparent"
                    aria-hidden
                  />
                  <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-forest-800 shadow-sm backdrop-blur-sm">
                    {navLabel}
                  </span>
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-2.5 pr-12 text-white">
                    <p className="text-[10px] font-medium leading-snug text-white/90">{t.subtitle}</p>
                  </div>
                  <span
                    className="pointer-events-none absolute bottom-1 right-1.5 text-3xl leading-none drop-shadow-md"
                    aria-hidden
                  >
                    {t.animalEmoji}
                  </span>
                </div>
              </GlassCard>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
