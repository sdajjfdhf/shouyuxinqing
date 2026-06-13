import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@components/GlassCard';
import { useStore } from '@store/useStore';
import { achievements, categories, AchievementStats } from '@data/achievements';
import { loadDiaryEncrypted, hasDiaryVault } from '@lib/localJournal';
import { ArrowLeft, Trophy, Star, Lock, Sparkles } from 'lucide-react';

// 粒子组件
function Particle({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{ left: x, top: y }}
      initial={{ opacity: 1, scale: 1, y: 0 }}
      animate={{ 
        opacity: [1, 1, 0],
        scale: [1, 1.5, 0],
        y: [0, -50, -100],
        x: [0, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 100]
      }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      <div 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
      />
    </motion.div>
  );
}

// 星星粒子
function StarParticle({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{ left: x, top: y }}
      initial={{ opacity: 1, scale: 0, rotate: 0 }}
      animate={{ 
        opacity: [1, 1, 0],
        scale: [0, 1.5, 0],
        rotate: [0, 360],
        y: [0, -60]
      }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
    </motion.div>
  );
}

export default function AchievementsPage({ onBack }: { onBack: () => void }) {
  const { userStats, emotionHistory, messages } = useStore();
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [diaryCount, setDiaryCount] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; type: 'particle' | 'star' }[]>([]);
  const [particleIdCounter, setParticleIdCounter] = useState(0);

  // 加载日记数量
  useEffect(() => {
    const loadDiaryCount = async () => {
      if (!hasDiaryVault()) {
        setDiaryCount(0);
        return;
      }
      // 尝试使用默认密码（预览模式）
      try {
        const entries = await loadDiaryEncrypted('123456');
        setDiaryCount(entries.length);
      } catch {
        setDiaryCount(0);
      }
    };
    loadDiaryCount();
  }, []);

  // 计算统计数据
  const stats: AchievementStats = {
    streakDays: userStats.streakDays || 0,
    totalDays: emotionHistory.length || 0,
    meditationMinutes: userStats.meditationMinutes || 0,
    chatCount: messages.length || 0,
    moodRecordCount: emotionHistory.length || 0,
    totalStars: userStats.totalStars || 0,
    animalCount: 4, // 默认值，后续可以从store获取
    diaryCount,
    sleepEarlyCount: 3, // 默认值
    wakeEarlyCount: 2, // 默认值
    courseCount: 2, // 默认值
    shareCount: 1, // 默认值
  };

  // 创建粒子效果
  const createParticles = useCallback(() => {
    const colors = ['#fbbf24', '#f59e0b', '#fcd34d', '#fde68a', '#ffffff'];
    const newParticles = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 20; i++) {
      const isStar = i % 3 === 0;
      newParticles.push({
        id: particleIdCounter + i,
        x: centerX + (Math.random() - 0.5) * 200,
        y: centerY + (Math.random() - 0.5) * 200,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: isStar ? 'star' : 'particle'
      });
    }

    setParticles(newParticles);
    setParticleIdCounter((prev) => prev + 20);

    setTimeout(() => setParticles([]), 2000);
  }, [particleIdCounter]);

  // 检查并解锁成就
  useEffect(() => {
    const newlyUnlocked: string[] = [];
    achievements.forEach((achievement) => {
      if (achievement.condition(stats) && !unlockedAchievements.includes(achievement.id)) {
        newlyUnlocked.push(achievement.id);
      }
    });

    if (newlyUnlocked.length > 0) {
      // 创建粒子效果
      createParticles();
      
      setUnlockedAchievements((prev) => [...prev, ...newlyUnlocked]);
      const firstNew = achievements.find((a) => a.id === newlyUnlocked[0]);
      if (firstNew) {
        setShowNotification(firstNew.id);
        setTimeout(() => setShowNotification(null), 3000);
      }
    }
  }, [stats, unlockedAchievements, createParticles]);

  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievements.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-green-50 to-emerald-100 p-4">
      {/* 头部 */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">成就徽章</h1>
          <p className="text-sm text-gray-500">已解锁 {unlockedCount} / {totalCount}</p>
        </div>
      </motion.div>

      {/* 统计卡片 */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="text-lg font-semibold text-gray-800">成就进度</span>
              </div>
              <p className="text-sm text-gray-500">继续努力，解锁更多徽章！</p>
            </div>
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#e5e7eb"
                  strokeWidth="6"
                  fill="none"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="url(#gradient)"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: 226, strokeDashoffset: 226 }}
                  animate={{ strokeDashoffset: 226 - (226 * unlockedCount) / totalCount }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-800">{Math.round((unlockedCount / totalCount) * 100)}%</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* 分类筛选 */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4"
      >
        {categories.map(category => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-full bg-white/80 hover:bg-white text-gray-700 text-sm font-medium whitespace-nowrap shadow-sm transition-colors"
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* 徽章网格 */}
      <div className="grid grid-cols-3 gap-3">
        {achievements.map((achievement, index) => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);
          const justUnlocked = !unlockedAchievements.includes(achievement.id);
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={isUnlocked ? { scale: 1.05, y: -3 } : {}}
            >
              <GlassCard className={`p-4 text-center relative overflow-hidden ${isUnlocked ? 'hover:shadow-lg' : ''}`}>
                {/* 光晕效果 */}
                {isUnlocked && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-radial from-yellow-200/50 to-transparent pointer-events-none"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  />
                )}
                
                {/* 锁定遮罩 */}
                {!isUnlocked && (
                  <motion.div 
                    initial={{ opacity: 1 }}
                    className="absolute inset-0 bg-gray-200/80 flex items-center justify-center z-10"
                  >
                    <Lock className="w-8 h-8 text-gray-400" />
                  </motion.div>
                )}
                
                {/* 星星效果 */}
                {isUnlocked && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="absolute top-1 right-1"
                  >
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </motion.div>
                )}
                
                {/* 图标 */}
                <motion.div
                  className={`text-4xl mb-2 ${!isUnlocked ? 'grayscale opacity-50' : ''}`}
                  animate={isUnlocked ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: isUnlocked ? Infinity : 0, duration: 2 }}
                  initial={justUnlocked ? { scale: 0, rotate: 360 } : { scale: 1 }}
                >
                  {achievement.icon}
                </motion.div>
                
                {/* 名称 */}
                <h3 className={`font-semibold text-sm mb-1 ${!isUnlocked ? 'text-gray-400' : 'text-gray-800'}`}>
                  {isUnlocked ? achievement.title : '???'}
                </h3>
                
                {/* 描述 */}
                <p className={`text-xs text-gray-500 mb-2 ${!isUnlocked ? 'opacity-50' : ''}`}>
                  {isUnlocked ? achievement.description : '完成特定任务解锁'}
                </p>
                
                {/* 星星数 */}
                <div className="flex items-center justify-center gap-1 text-xs text-amber-600">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{achievement.stars}</span>
                </div>
                
                {/* 闪光装饰 */}
                {isUnlocked && (
                  <motion.div
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Sparkles className="w-full h-full text-yellow-300/30" />
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* 粒子效果 */}
      {particles.map((particle) => (
        particle.type === 'star' ? (
          <StarParticle key={particle.id} x={particle.x} y={particle.y} />
        ) : (
          <Particle key={particle.id} x={particle.x} y={particle.y} color={particle.color} />
        )
      ))}

      {/* 成就解锁通知 */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8, rotateX: -180 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: 3, duration: 0.5 }}
            >
              <motion.div
                className="absolute -inset-2 bg-amber-400/30 rounded-2xl blur-lg"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
              <GlassCard className="px-8 py-5 shadow-xl border-2 border-amber-400 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 relative">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ 
                      rotate: [0, -15, 15, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="text-4xl"
                  >
                    🏆
                  </motion.div>
                  <div>
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-lg font-bold text-amber-800 flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      成就解锁！
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-sm text-amber-600 font-medium"
                    >
                      {achievements.find((a) => a.id === showNotification)?.title}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-1 mt-1 text-xs text-amber-500"
                    >
                      <Star className="w-3 h-3 fill-current" />
                      <span>+{achievements.find((a) => a.id === showNotification)?.stars} 星星</span>
                    </motion.div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 提示 */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-gray-500 mt-6"
      >
        继续探索森林，发现更多隐藏的徽章！
      </motion.p>
    </div>
  );
}