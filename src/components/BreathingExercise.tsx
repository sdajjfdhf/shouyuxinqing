import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useStore } from '@store/useStore';

type BreathPhase = 'inhale' | 'hold' | 'exhale';

const phaseConfig: Record<BreathPhase, { text: string; duration: number; scale: number }> = {
  inhale: { text: '吸气 4秒', duration: 4000, scale: 1.3 },
  hold: { text: '屏息 7秒', duration: 7000, scale: 1.3 },
  exhale: { text: '呼气 8秒', duration: 8000, scale: 1 },
};

export function BreathingExercise() {
  const { isBreathing, setIsBreathing } = useStore();
  const [phase, setPhase] = useState<BreathPhase>('inhale');

  useEffect(() => {
    if (!isBreathing) return;

    const cycle = async () => {
      const phases: BreathPhase[] = ['inhale', 'hold', 'exhale'];
      for (let i = 0; i < phases.length; i++) {
        if (!isBreathing) break;
        setPhase(phases[i]);
        await new Promise(resolve => setTimeout(resolve, phaseConfig[phases[i]].duration));
      }
      if (isBreathing) cycle();
    };

    cycle();
  }, [isBreathing]);

  if (!isBreathing) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-8 w-full max-w-sm text-center relative overflow-hidden"
        >
          <button
            onClick={() => setIsBreathing(false)}
            className="absolute top-4 right-4 text-forest-600 hover:text-forest-800 p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <h3 className="font-bold text-forest-900 text-xl mb-2">4-7-8 呼吸法</h3>
          <p className="text-forest-600 text-sm mb-8">帮助激活副交感神经系统，快速放松</p>

          <div className="relative w-48 h-48 mx-auto mb-8">
            <motion.div
              animate={{
                scale: phaseConfig[phase].scale,
                opacity: phase === 'exhale' ? 0.3 : 0.5,
              }}
              transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 0 }}
              className="absolute inset-0 bg-blue-200 rounded-full"
            />
            <motion.div
              animate={{
                scale: phaseConfig[phase].scale * 0.8,
                opacity: phase === 'exhale' ? 0.4 : 0.6,
              }}
              transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 0 }}
              className="absolute inset-4 bg-blue-300 rounded-full"
            />
            <motion.div
              animate={{
                scale: phaseConfig[phase].scale * 0.6,
                opacity: phase === 'exhale' ? 0.5 : 0.7,
              }}
              transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 0 }}
              className="absolute inset-8 bg-blue-400 rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center text-6xl">
              🫁
            </div>
          </div>

          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-forest-700 mb-2 font-bold text-lg"
          >
            {phaseConfig[phase].text}
          </motion.p>

          <div className="flex justify-center gap-2 mt-4">
            {(['inhale', 'hold', 'exhale'] as BreathPhase[]).map((p) => (
              <div
                key={p}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  p === phase ? 'bg-forest-500' : 'bg-forest-200'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
