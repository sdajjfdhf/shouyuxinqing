import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, TreePine, Star, Sparkles } from 'lucide-react';
import { useStore } from '@store/useStore';

// 3D树木组件
function Tree3D({ type, size = 1, position, onClick, isHovered }: { 
  type: 'pine' | 'oak' | 'cherry' | 'bamboo' | 'cypress';
  size: number;
  position: { x: number; y: number; z: number };
  onClick: () => void;
  isHovered: boolean;
}) {
  const treeStyles = {
    pine: {
      trunkColor: 'from-amber-700 to-amber-600',
      foliageColors: ['#2D5A27', '#3A7D32', '#4A9D42', '#5AB855'],
      shape: 'cone',
    },
    oak: {
      trunkColor: 'from-amber-800 to-amber-600',
      foliageColors: ['#1E4D1A', '#2A6B25', '#358A30', '#42A83C'],
      shape: 'round',
    },
    cherry: {
      trunkColor: 'from-amber-600 to-amber-500',
      foliageColors: ['#FFB7C5', '#FF91A4', '#FF6B8A', '#FF4D70'],
      shape: 'round',
    },
    bamboo: {
      trunkColor: 'from-green-600 to-green-500',
      foliageColors: ['#228B22', '#32CD32', '#00FF00'],
      shape: 'tall',
    },
    cypress: {
      trunkColor: 'from-amber-700 to-amber-600',
      foliageColors: ['#1A4D16', '#246B20', '#2D8A28'],
      shape: 'column',
    },
  };

  const style = treeStyles[type];
  const foliageSize = size * (type === 'bamboo' ? 0.4 : type === 'cypress' ? 0.5 : 0.8);

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, ${position.z}px) scale(${size})`,
      }}
      animate={{
        y: isHovered ? [-15, 0] : [0],
        rotateY: isHovered ? [-5, 5, -5] : [0],
      }}
      transition={{ 
        duration: isHovered ? 0.3 : 0.5,
        rotateY: { duration: 2, repeat: isHovered ? Infinity : 0 }
      }}
      onClick={onClick}
    >
      {/* 树干 */}
      <motion.div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[${type === 'bamboo' ? 8 : 12}px] bg-gradient-to-t ${style.trunkColor} rounded-t-sm`}
        style={{ 
          height: `${type === 'bamboo' ? 150 : type === 'cypress' ? 120 : 80}px`,
          transformOrigin: 'bottom center',
        }}
        animate={{ scaleX: isHovered ? 1.05 : 1 }}
      >
        {/* 树枝纹理 */}
        {type !== 'bamboo' && (
          <>
            <div className="absolute top-1/4 w-full h-1 bg-amber-900/30" />
            <div className="absolute top-1/2 w-full h-1 bg-amber-900/20" />
            <div className="absolute top-3/4 w-full h-1 bg-amber-900/30" />
          </>
        )}
        {/* 竹节 */}
        {type === 'bamboo' && (
          <>
            <div className="absolute top-1/5 w-full h-1.5 bg-green-700" />
            <div className="absolute top-2/5 w-full h-1.5 bg-green-700" />
            <div className="absolute top-3/5 w-full h-1.5 bg-green-700" />
            <div className="absolute top-4/5 w-full h-1.5 bg-green-700" />
          </>
        )}
      </motion.div>

      {/* 树冠 */}
      <div className="relative">
        {style.shape === 'cone' && (
          <>
            <motion.div
              className="absolute bottom-12 left-1/2 -translate-x-1/2 w-16 h-20"
              style={{
                background: `conic-gradient(from 135deg, ${style.foliageColors[0]} 0deg, ${style.foliageColors[1]} 90deg, ${style.foliageColors[2]} 180deg, ${style.foliageColors[3]} 270deg, ${style.foliageColors[0]} 360deg)`,
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                transform: `scale(${foliageSize})`,
              }}
              animate={{ scale: isHovered ? [foliageSize, foliageSize * 1.08, foliageSize] : foliageSize }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 left-1/2 -translate-x-1/2 w-12 h-16"
              style={{
                background: `conic-gradient(from 135deg, ${style.foliageColors[1]} 0deg, ${style.foliageColors[2]} 90deg, ${style.foliageColors[3]} 180deg, ${style.foliageColors[1]} 270deg, ${style.foliageColors[1]} 360deg)`,
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                transform: `scale(${foliageSize * 0.8})`,
              }}
              animate={{ scale: isHovered ? [foliageSize * 0.8, foliageSize * 0.86, foliageSize * 0.8] : foliageSize * 0.8 }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
            />
            <motion.div
              className="absolute bottom-26 left-1/2 -translate-x-1/2 w-8 h-12"
              style={{
                background: `conic-gradient(from 135deg, ${style.foliageColors[2]} 0deg, ${style.foliageColors[3]} 90deg, ${style.foliageColors[2]} 180deg, ${style.foliageColors[3]} 270deg, ${style.foliageColors[2]} 360deg)`,
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                transform: `scale(${foliageSize * 0.6})`,
              }}
              animate={{ scale: isHovered ? [foliageSize * 0.6, foliageSize * 0.64, foliageSize * 0.6] : foliageSize * 0.6 }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}

        {style.shape === 'round' && (
          <>
            <motion.div
              className="absolute bottom-16 left-1/2 -translate-x-1/2 rounded-full"
              style={{
                width: `${40 * foliageSize}px`,
                height: `${35 * foliageSize}px`,
                background: `radial-gradient(ellipse at 50% 60%, ${style.foliageColors[3]}, ${style.foliageColors[2]} 40%, ${style.foliageColors[1]} 70%, ${style.foliageColors[0]} 100%)`,
              }}
              animate={{ 
                scale: isHovered ? [1, 1.05, 1] : 1,
                y: [0, -3, 0],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-22 left-1/2 -translate-x-1/2 rounded-full"
              style={{
                width: `${32 * foliageSize}px`,
                height: `${28 * foliageSize}px`,
                background: `radial-gradient(ellipse at 50% 60%, ${style.foliageColors[3]}88, ${style.foliageColors[2]} 50%, ${style.foliageColors[1]} 100%)`,
              }}
              animate={{ 
                scale: isHovered ? [1, 1.04, 1] : 1,
                y: [0, -2, 0],
              }}
              transition={{ duration: 2.7, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="absolute bottom-27 left-1/2 -translate-x-1/2 rounded-full"
              style={{
                width: `${24 * foliageSize}px`,
                height: `${20 * foliageSize}px`,
                background: `radial-gradient(ellipse at 50% 60%, ${style.foliageColors[3]}, ${style.foliageColors[2]} 60%, ${style.foliageColors[1]} 100%)`,
              }}
              animate={{ 
                scale: isHovered ? [1, 1.03, 1] : 1,
                y: [0, -2, 0],
              }}
              transition={{ duration: 2.3, repeat: Infinity, delay: 0.4 }}
            />
          </>
        )}

        {style.shape === 'tall' && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  bottom: `${40 + i * 30}px`,
                  width: `${16 * foliageSize}px`,
                  height: `${20 * foliageSize}px`,
                  background: `linear-gradient(90deg, transparent, ${style.foliageColors[i % 3]}88, transparent)`,
                  borderRadius: '50%',
                }}
                animate={{ 
                  scaleX: isHovered ? [1, 1.1, 1] : 1,
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </>
        )}

        {style.shape === 'column' && (
          <>
            <motion.div
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
              style={{
                width: `${20 * foliageSize}px`,
                height: `${80 * foliageSize}px`,
                background: `linear-gradient(90deg, ${style.foliageColors[0]}, ${style.foliageColors[1]} 30%, ${style.foliageColors[2]} 60%, ${style.foliageColors[1]} 80%, ${style.foliageColors[0]})`,
                borderRadius: '10px 10px 50% 50%',
              }}
              animate={{ 
                scale: isHovered ? [1, 1.03, 1] : 1,
                y: [0, -5, 0],
              }}
              transition={{ duration: 3.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-14 left-1/2 -translate-x-1/2"
              style={{
                width: `${16 * foliageSize}px`,
                height: `${60 * foliageSize}px`,
                background: `linear-gradient(90deg, ${style.foliageColors[1]}99, ${style.foliageColors[2]} 40%, ${style.foliageColors[1]} 80%, ${style.foliageColors[1]}99)`,
                borderRadius: '8px 8px 50% 50%',
              }}
              animate={{ 
                scale: isHovered ? [1, 1.04, 1] : 1,
                y: [0, -3, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
            />
          </>
        )}
      </div>

      {/* 发光效果 */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.6, scale: 1.5 }}
          exit={{ opacity: 0 }}
          className="absolute -inset-8 bg-green-400/40 rounded-full blur-2xl"
        />
      )}
    </motion.div>
  );
}

// 蝴蝶组件
function Butterfly({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute"
      style={{
        transform: `translate3d(${Math.random() * 200 - 100}px, ${50 + Math.random() * 100}px, ${Math.random() * 100}px)`,
      }}
      animate={{
        x: [0, 50, 0, -50, 0],
        y: [0, -30, 10, -20, 0],
        rotate: [0, 15, -15, 10, 0],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24">
        <motion.g animate={{ scaleY: [1, 1.15, 1] }} transition={{ duration: 0.15, repeat: Infinity }}>
          <ellipse cx="12" cy="8" rx="5" ry="6" fill="#FF6B9D" opacity="0.9" />
          <ellipse cx="12" cy="16" rx="5" ry="6" fill="#FF8FB3" opacity="0.8" />
          <ellipse cx="7" cy="8" rx="3" ry="4" fill="#C0C0C0" />
          <ellipse cx="17" cy="8" rx="3" ry="4" fill="#C0C0C0" />
          <ellipse cx="7" cy="16" rx="3" ry="4" fill="#D0D0D0" />
          <ellipse cx="17" cy="16" rx="3" ry="4" fill="#D0D0D0" />
          <line x1="12" y1="4" x2="12" y2="20" stroke="#333" strokeWidth="1" />
          <line x1="12" y1="8" x2="5" y2="6" stroke="#333" strokeWidth="0.5" />
          <line x1="12" y1="8" x2="19" y2="6" stroke="#333" strokeWidth="0.5" />
          <line x1="12" y1="16" x2="5" y2="18" stroke="#333" strokeWidth="0.5" />
          <line x1="12" y1="16" x2="19" y2="18" stroke="#333" strokeWidth="0.5" />
        </motion.g>
      </svg>
    </motion.div>
  );
}

// 飘落的树叶
function FallingLeaf({ delay, color }: { delay: number; color: string }) {
  return (
    <motion.div
      className="absolute"
      style={{
        transform: `translate3d(${Math.random() * 300 - 150}px, -50px, ${Math.random() * 150 - 75}px)`,
      }}
      animate={{
        y: [0, 300],
        x: [0, 50, -30, 40, -20],
        rotate: [0, 360],
      }}
      transition={{
        duration: 10 + Math.random() * 8,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path
          d="M8 2 C4 4 2 8 8 14 C14 8 12 4 8 2"
          fill={color}
          opacity="0.8"
        />
        <path
          d="M8 4 L8 12"
          stroke={color}
          strokeWidth="0.5"
          opacity="0.5"
        />
      </svg>
    </motion.div>
  );
}

const Forest3DPage = () => {
  const { userStats, emotionHistory, selectedAnimal, setCurrentTab } = useStore();
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [hoveredTree, setHoveredTree] = useState<number | null>(null);
  const [showTreeInfo, setShowTreeInfo] = useState(false);
  const [treeDetail, setTreeDetail] = useState<{ index: number; date: string; mood: string; type: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalDays = emotionHistory.length || userStats.streakDays || 5;
  const treeCount = Math.min(totalDays, 15);

  // 生成树木数据
  const generateTrees = () => {
    const treeTypes: Array<'pine' | 'oak' | 'cherry' | 'bamboo' | 'cypress'> = ['pine', 'oak', 'cherry', 'bamboo', 'cypress'];
    const trees = [];

    for (let i = 0; i < treeCount; i++) {
      const treeType = treeTypes[i % treeTypes.length];
      const angle = (i / treeCount) * Math.PI * 2;
      const radius = 140 + (i % 4) * 50;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.random() * 30;

      const date = emotionHistory[i]?.date 
        ? new Date(emotionHistory[i].date)
        : new Date(Date.now() - i * 24 * 60 * 60 * 1000);

      const mood = emotionHistory[i]?.mood || ['happy', 'calm', 'neutral', 'sad', 'anxious'][Math.floor(Math.random() * 5)];

      trees.push({
        id: i,
        type: treeType,
        x,
        y,
        z,
        scale: 0.8 + (i % 5) * 0.15,
        date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', year: 'numeric' }),
        mood,
        growth: Math.min(70 + i * 4, 100),
      });
    }
    return trees;
  };

  const trees = generateTrees();

  // 鼠标移动控制视角
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      setRotationY(deltaX * 25);
      setRotationX(-deltaY * 18);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleTreeClick = (tree: typeof trees[0]) => {
    setTreeDetail({
      index: tree.id,
      date: tree.date,
      mood: tree.mood,
      type: tree.type,
    });
    setShowTreeInfo(true);
  };

  const getMoodEmoji = (mood: string) => {
    const moodMap: Record<string, string> = {
      happy: '😊',
      calm: '😌',
      neutral: '😐',
      sad: '😢',
      anxious: '😰',
    };
    return moodMap[mood] || '🌿';
  };

  const getTreeTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      pine: '松树',
      oak: '橡树',
      cherry: '樱花树',
      bamboo: '竹林',
      cypress: '柏树',
    };
    return typeMap[type] || '树木';
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200">
      {/* 远景山脉 */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-sky-500/30 to-transparent" />
      <motion.div 
        className="absolute top-8 left-0 right-0 h-24"
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 60, repeat: Infinity }}
      >
        <svg viewBox="0 0 1200 200" className="w-full h-full">
          <path d="M0,200 L0,120 Q150,60 300,100 Q450,40 600,90 Q750,50 900,80 Q1050,40 1200,100 L1200,200 Z" fill="#6B8E7B" opacity="0.4" />
          <path d="M0,200 L0,140 Q100,100 200,130 Q350,80 500,120 Q650,70 800,110 Q950,60 1100,100 L1200,200 Z" fill="#5A7A6A" opacity="0.5" />
          <path d="M0,200 L0,160 Q80,130 160,150 Q280,110 400,140 Q520,100 640,130 Q760,90 880,120 Q1000,85 1120,115 L1200,200 Z" fill="#4A6A5A" opacity="0.6" />
        </svg>
      </motion.div>

      {/* 云朵 */}
      <motion.div 
        className="absolute top-12 left-[5%] opacity-80"
        animate={{ x: [0, 80, 0], y: [0, -15, 0] }}
        transition={{ duration: 30, repeat: Infinity }}
      >
        <svg width="120" height="60" viewBox="0 0 120 60">
          <ellipse cx="40" cy="35" rx="30" ry="20" fill="white" />
          <ellipse cx="70" cy="30" rx="35" ry="25" fill="white" />
          <ellipse cx="90" cy="35" rx="25" ry="18" fill="white" />
          <ellipse cx="55" cy="25" rx="20" ry="15" fill="white" />
        </svg>
      </motion.div>
      <motion.div 
        className="absolute top-20 right-[10%] opacity-70"
        animate={{ x: [0, -60, 0], y: [0, 10, 0] }}
        transition={{ duration: 25, repeat: Infinity, delay: 5 }}
      >
        <svg width="100" height="50" viewBox="0 0 100 50">
          <ellipse cx="35" cy="30" rx="25" ry="18" fill="white" />
          <ellipse cx="60" cy="28" rx="30" ry="20" fill="white" />
          <ellipse cx="75" cy="32" rx="20" ry="15" fill="white" />
        </svg>
      </motion.div>
      <motion.div 
        className="absolute top-16 left-[40%] opacity-60"
        animate={{ x: [0, 40, 0], y: [0, -8, 0] }}
        transition={{ duration: 35, repeat: Infinity, delay: 3 }}
      >
        <svg width="80" height="40" viewBox="0 0 80 40">
          <ellipse cx="30" cy="25" rx="20" ry="14" fill="white" />
          <ellipse cx="50" cy="22" rx="22" ry="16" fill="white" />
        </svg>
      </motion.div>

      {/* 太阳 */}
      <motion.div 
        className="absolute top-10 right-[15%]"
        animate={{ scale: [1, 1.05, 1], rotate: [0, 8, -8, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        <div className="relative">
          <motion.div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 shadow-lg"
            animate={{ 
              boxShadow: [
                '0 0 30px rgba(255, 200, 100, 0.6)',
                '0 0 50px rgba(255, 200, 100, 0.8)',
                '0 0 30px rgba(255, 200, 100, 0.6)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* 太阳光晕 */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-8 bg-gradient-to-t from-yellow-300/60 to-transparent origin-bottom"
              style={{ transform: `translate(-50%, -100%) rotate(${i * 30}deg)` }}
              animate={{ opacity: [0.5, 1, 0.5], scaleY: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      </motion.div>

      {/* 返回按钮 */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setCurrentTab('forest')}
        className="absolute top-4 left-4 z-50 bg-white/90 backdrop-blur-md rounded-full p-3 shadow-xl hover:bg-white hover:shadow-2xl transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-5 h-5 text-forest-700" />
      </motion.button>

      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 text-center z-50"
      >
        <h1 className="text-2xl font-bold text-forest-900 drop-shadow-lg">🌲 我的心灵森林 🌲</h1>
        <p className="text-sm text-forest-700">{selectedAnimal.emoji} {selectedAnimal.name} 陪伴着你</p>
      </motion.div>

      {/* 统计信息 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-xl"
      >
        <div className="flex items-center gap-2 text-xs text-forest-700 mb-1">
          <TreePine className="w-4 h-4" />
          <span>{treeCount} 棵树</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-600">
          <Star className="w-4 h-4 fill-current" />
          <span>{userStats.totalStars} 星星</span>
        </div>
      </motion.div>

      {/* 3D森林容器 */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        <motion.div
          className="relative"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
          }}
          animate={{ rotateX: rotationX, rotateY: rotationY }}
          transition={{ type: 'spring', stiffness: 80, damping: 25 }}
        >
          {/* 远景地面 */}
          <motion.div
            className="absolute w-[600px] h-[600px] bg-gradient-to-br from-green-500/30 via-green-400/20 to-emerald-600/30 rounded-full"
            style={{ transform: 'rotateX(90deg) translateZ(-80px)' }}
            animate={{ scale: [1, 1.01, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          {/* 中景地面 */}
          <motion.div
            className="absolute w-[450px] h-[450px] bg-gradient-to-br from-green-400/50 via-green-500/40 to-emerald-500/50 rounded-full"
            style={{ transform: 'rotateX(90deg) translateZ(-40px)' }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />

          {/* 近景地面 */}
          <motion.div
            className="absolute w-[300px] h-[300px] bg-gradient-to-br from-green-300/70 via-green-400/60 to-emerald-400/70 rounded-full"
            style={{ transform: 'rotateX(90deg) translateZ(-10px)' }}
            animate={{ scale: [1, 1.015, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* 草地纹理 */}
          <motion.div
            className="absolute w-[200px] h-[200px] opacity-30"
            style={{ transform: 'rotateX(90deg) translateZ(-5px)' }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-2 bg-green-600 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
                animate={{ height: [4, 6, 4] }}
                transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() }}
              />
            ))}
          </motion.div>

          {/* 树木 */}
          {trees.map((tree, index) => (
            <Tree3D
              key={tree.id}
              type={tree.type}
              size={tree.scale}
              position={{ x: tree.x, y: tree.y, z: tree.z }}
              onClick={() => handleTreeClick(tree)}
              isHovered={hoveredTree === tree.id}
            />
          ))}

          {/* 中心动物 */}
          <motion.div
            className="absolute"
            style={{ transform: 'translateZ(40px)' }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 8, -8, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="relative">
              <motion.div
                className="text-7xl drop-shadow-2xl"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {selectedAnimal.emoji}
              </motion.div>
              {/* 动物光晕 */}
              <motion.div
                className="absolute inset-0 -m-4 bg-yellow-200/30 rounded-full blur-2xl"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* 蝴蝶 */}
          {[...Array(4)].map((_, i) => (
            <Butterfly key={i} delay={i * 2} />
          ))}

          {/* 飘落的树叶 */}
          {[...Array(6)].map((_, i) => (
            <FallingLeaf 
              key={i} 
              delay={i * 2.5} 
              color={['#8B4513', '#A0522D', '#D2691E', '#CD853F', '#DEB887'][i % 5]} 
            />
          ))}

          {/* 漂浮的萤火虫 */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-yellow-200 rounded-full shadow-lg"
              style={{
                boxShadow: '0 0 6px 2px rgba(255, 255, 100, 0.8)',
                transform: `translate3d(${Math.cos(i * 0.7) * 120}px, ${30 + Math.sin(i * 0.5) * 40 + Math.random() * 30}px, ${Math.sin(i * 0.6) * 100}px)`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                y: [0, -15, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* 底部草地渐变 */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-green-600/50 via-green-500/30 to-transparent" />
      
      {/* 底部花朵装饰 */}
      <motion.div 
        className="absolute bottom-10 left-[5%] text-3xl" 
        animate={{ 
          rotate: [0, 15, -15, 0],
          scale: [1, 1.1, 1],
        }} 
        transition={{ duration: 4, repeat: Infinity }}
      >🌸</motion.div>
      <motion.div 
        className="absolute bottom-14 right-[10%] text-2xl" 
        animate={{ 
          rotate: [0, -20, 20, 0],
          y: [0, -5, 0],
        }} 
        transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
      >🌼</motion.div>
      <motion.div 
        className="absolute bottom-8 left-[20%] text-2xl" 
        animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }} 
        transition={{ duration: 2.5, repeat: Infinity }}
      >🌷</motion.div>
      <motion.div 
        className="absolute bottom-12 right-[25%] text-xl" 
        animate={{ y: [0, -8, 0], rotate: [0, 10, -10, 0] }} 
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      >🌻</motion.div>

      {/* 树木详情弹窗 */}
      <AnimatePresence>
        {showTreeInfo && treeDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowTreeInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-green-100"
            >
              <div className="text-center">
                <motion.div
                  className="text-6xl mb-4 drop-shadow-lg"
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {trees[treeDetail.index]?.type === 'pine' && '🌲'}
                  {trees[treeDetail.index]?.type === 'oak' && '🌳'}
                  {trees[treeDetail.index]?.type === 'cherry' && '🌸'}
                  {trees[treeDetail.index]?.type === 'bamboo' && '🎋'}
                  {trees[treeDetail.index]?.type === 'cypress' && '🌿'}
                </motion.div>
                <h3 className="text-xl font-bold text-forest-900 mb-1">
                  {getTreeTypeName(treeDetail.type)}
                </h3>
                <p className="text-sm text-forest-600 mb-4">
                  种植于 {treeDetail.date}
                </p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl">{getMoodEmoji(treeDetail.mood)}</span>
                  <span className="text-sm text-forest-700 capitalize">
                    {treeDetail.mood === 'happy' && '快乐的一天'}
                    {treeDetail.mood === 'calm' && '平静的一天'}
                    {treeDetail.mood === 'neutral' && '普通的一天'}
                    {treeDetail.mood === 'sad' && '难过的一天'}
                    {treeDetail.mood === 'anxious' && '焦虑的一天'}
                  </span>
                </div>
                <div className="w-full bg-forest-100 rounded-full h-2.5 mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${trees[treeDetail.index]?.growth}%` }}
                    transition={{ duration: 1.2 }}
                    className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 h-2.5 rounded-full shadow-inner"
                  />
                </div>
                <p className="text-xs text-forest-500 mb-2">成长度: {trees[treeDetail.index]?.growth}%</p>
                <div className="flex items-center justify-center gap-1 text-xs text-amber-500 mb-6">
                  <Sparkles className="w-3 h-3" />
                  <span>每棵树都是你情绪成长的见证</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTreeInfo(false)}
                  className="w-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 text-white py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  继续探索森林
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 提示文字 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-forest-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full"
      >
        🌿 移动鼠标探索森林 · 点击树木查看详情 🌿
      </motion.div>
    </div>
  );
};

export default Forest3DPage;