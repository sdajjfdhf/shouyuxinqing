import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@components/GlassCard';
import { LeafBackground } from '@components/LeafBackground';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Timer, Sparkles } from 'lucide-react';

const meditationGuides = [
  {
    id: 'forest',
    title: '森林漫步',
    description: '想象自己漫步在宁静的森林中，感受大自然的治愈力量',
    duration: 5,
    icon: '🌲',
    color: 'from-forest-400 to-forest-600',
  },
  {
    id: 'breath',
    title: '呼吸觉察',
    description: '专注于呼吸，感受气息的进出，让身心逐渐放松',
    duration: 10,
    icon: '💨',
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'body',
    title: '身体扫描',
    description: '从头顶到脚尖，逐步放松身体的每一个部位',
    duration: 15,
    icon: '🧘',
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 'mindfulness',
    title: '正念觉察',
    description: '觉察当下的想法和感受，不评判，不追随',
    duration: 8,
    icon: '✨',
    color: 'from-pink-400 to-pink-600',
  },
];

export function MeditationPage() {
  const [selectedGuide, setSelectedGuide] = useState(meditationGuides[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining]);

  useEffect(() => {
    if (isPlaying) {
      breathTimerRef.current = setInterval(() => {
        setBreathPhase((prev) => {
          if (prev === 'inhale') return 'hold';
          if (prev === 'hold') return 'exhale';
          return 'inhale';
        });
      }, 4000);
    } else {
      if (breathTimerRef.current) {
        clearInterval(breathTimerRef.current);
      }
    }

    return () => {
      if (breathTimerRef.current) {
        clearInterval(breathTimerRef.current);
      }
    };
  }, [isPlaying]);

  const handleStart = () => {
    setTimeRemaining(selectedGuide.duration * 60);
    setIsPlaying(true);
    setShowComplete(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimeRemaining(selectedGuide.duration * 60);
    setShowComplete(false);
    setBreathPhase('inhale');
  };

  const handleComplete = () => {
    setIsPlaying(false);
    setShowComplete(true);
    if (breathTimerRef.current) {
      clearInterval(breathTimerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathInstruction = () => {
    switch (breathPhase) {
      case 'inhale':
        return '吸气...';
      case 'hold':
        return '屏息...';
      case 'exhale':
        return '呼气...';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-forest-50 to-forest-100 pb-8">
      <LeafBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">🧘</span>
          </div>
          <div>
            <h1 className="font-bold text-forest-900">正念冥想</h1>
            <p className="text-xs text-forest-600">让心灵回归宁静</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center text-forest-600 hover:bg-white/80 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="px-6 space-y-6">
        {/* 选择冥想引导 */}
        <section>
          <h3 className="font-bold text-forest-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            选择冥想引导
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {meditationGuides.map((guide) => (
              <motion.div
                key={guide.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <GlassCard
                  onClick={() => {
                    setSelectedGuide(guide);
                    setTimeRemaining(guide.duration * 60);
                    setIsPlaying(false);
                    setShowComplete(false);
                  }}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedGuide.id === guide.id 
                      ? 'ring-2 ring-purple-400 shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{guide.icon}</span>
                    <span className="text-sm font-bold text-forest-900">{guide.title}</span>
                  </div>
                  <p className="text-xs text-forest-600 mb-2 line-clamp-2">
                    {guide.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-purple-600">
                    <Timer className="w-3 h-3" />
                    <span>{guide.duration}分钟</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 冥想计时器 */}
        <section>
          <GlassCard className="p-6">
            <AnimatePresence mode="wait">
              {showComplete ? (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-forest-500 flex items-center justify-center">
                    <span className="text-4xl">🌿</span>
                  </div>
                  <h3 className="font-bold text-xl text-forest-900 mb-2">冥想完成！</h3>
                  <p className="text-forest-600 text-sm mb-6">
                    你已完成 {selectedGuide.duration} 分钟的{selectedGuide.title}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="rounded-full bg-gradient-to-r from-purple-500 to-forest-500 px-6 py-3 text-white font-bold shadow-lg"
                  >
                    再次冥想
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="meditation"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  {/* 呼吸动画 */}
                  <div className="relative w-48 h-48 mx-auto mb-6">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-br opacity-20"
                      style={{ background: `linear-gradient(135deg, ${breathPhase === 'inhale' ? '#a855f7' : breathPhase === 'hold' ? '#6366f1' : '#8b5cf6'}, #10b981)` }}
                      animate={{
                        scale: breathPhase === 'inhale' ? [1, 1.3, 1.3] : breathPhase === 'hold' ? [1.3, 1.3, 1.3] : [1.3, 1, 1],
                        opacity: breathPhase === 'inhale' ? [0.2, 0.4, 0.4] : breathPhase === 'hold' ? [0.4, 0.4, 0.4] : [0.4, 0.2, 0.2],
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-100 to-forest-100 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-4xl">{selectedGuide.icon}</span>
                        <p className="text-xs text-forest-600 mt-2 font-medium">
                          {getBreathInstruction()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 时间显示 */}
                  <div className="text-center mb-6">
                    <p className="text-sm text-forest-600 mb-1">剩余时间</p>
                    <p className="text-4xl font-bold text-forest-900 font-mono">
                      {formatTime(timeRemaining || selectedGuide.duration * 60)}
                    </p>
                  </div>

                  {/* 控制按钮 */}
                  <div className="flex items-center justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleReset}
                      className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-forest-600 shadow-md"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={isPlaying ? handlePause : handleStart}
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-forest-500 flex items-center justify-center text-white shadow-lg"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                    </motion.button>
                    
                    <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center text-forest-400">
                      <span className="text-sm font-bold">{selectedGuide.duration}'</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </section>

        {/* 冥想小贴士 */}
        <section>
          <GlassCard className="p-4">
            <h4 className="font-bold text-forest-800 mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span> 冥想小贴士
            </h4>
            <ul className="space-y-2 text-sm text-forest-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>找一个安静舒适的环境，保持放松的姿势</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>注意力集中在呼吸上，当思绪飘走时温柔地拉回来</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>无需追求完美，每天坚持就是最好的练习</span>
              </li>
            </ul>
          </GlassCard>
        </section>
      </main>
    </div>
  );
}