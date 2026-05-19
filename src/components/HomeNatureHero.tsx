import { motion } from 'framer-motion';
import { HOME_NATURE_HERO } from '@/data/pageNatureThemes';

export function HomeNatureHero() {
  const fullTile = HOME_NATURE_HERO.find((t) => t.span === 'full');
  const halfTiles = HOME_NATURE_HERO.filter((t) => t.span === 'half');

  return (
    <section className="space-y-3 px-6 pt-2">
      {fullTile ? (
        <motion.div
          key={fullTile.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`relative w-full overflow-hidden rounded-3xl border border-blossom-200/55 shadow-lg ${fullTile.minHeight}`}
        >
          <img
            src={fullTile.imageSrc}
            alt={fullTile.imageAlt}
            loading="eager"
            decoding="async"
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-900/55 via-blossom-900/15 to-transparent"
            aria-hidden
          />
          <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-forest-800 shadow-sm backdrop-blur-sm">
            {fullTile.label}
          </span>
          <p className="font-cute absolute bottom-3 left-4 max-w-[70%] text-sm font-bold text-white drop-shadow-md sm:text-base">
            {fullTile.tagline}
          </p>
          <span
            className="absolute bottom-2 right-3 text-[2.85rem] leading-none drop-shadow-lg sm:text-5xl"
            aria-hidden
          >
            {fullTile.animalEmoji}
          </span>
        </motion.div>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        {halfTiles.map((tile, j) => (
          <motion.div
            key={tile.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 + j * 0.06, duration: 0.38 }}
            className={`relative overflow-hidden rounded-2xl border border-blossom-200/50 shadow-md ${tile.minHeight}`}
          >
            <img
              src={tile.imageSrc}
              alt={tile.imageAlt}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-900/50 via-transparent to-blossom-100/10"
              aria-hidden
            />
            <span className="absolute left-2 top-2 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-forest-800 shadow-sm backdrop-blur-sm">
              {tile.label}
            </span>
            <p className="absolute bottom-2 left-2 right-10 font-cute text-[11px] font-bold leading-snug text-white drop-shadow-md">
              {tile.tagline}
            </p>
            <span className="absolute bottom-1 right-1.5 text-3xl drop-shadow-md" aria-hidden>
              {tile.animalEmoji}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
