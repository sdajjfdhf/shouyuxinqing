import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@components/GlassCard';
import { ArrowLeft, Plus, Target, Flame, Check } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  type: 'meditation' | 'mood' | 'sleep' | 'exercise';
  target: number;
  unit: string;
  progress: number;
  completed: boolean;
}

const initialGoals: Goal[] = [
  { id: '1', title: '每日冥想', type: 'meditation', target: 15, unit: '分钟', progress: 8, completed: false },
  { id: '2', title: '保持好心情', type: 'mood', target: 5, unit: '天', progress: 3, completed: false },
  { id: '3', title: '早睡挑战', type: 'sleep', target: 11, unit: '点前', progress: 0, completed: false },
];

const typeIcons = {
  meditation: '🧘',
  mood: '😊',
  sleep: '😴',
  exercise: '🏃',
};

const typeColors = {
  meditation: 'from-purple-400 to-pink-400',
  mood: 'from-yellow-400 to-orange-400',
  sleep: 'from-blue-400 to-indigo-400',
  exercise: 'from-green-400 to-teal-400',
};

export default function GoalsPage({ onBack }: { onBack: () => void }) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', type: 'meditation' as Goal['type'], target: 0, unit: '分钟' });

  const addGoal = () => {
    if (newGoal.title && newGoal.target > 0) {
      const goal: Goal = {
        id: Date.now().toString(),
        ...newGoal,
        progress: 0,
        completed: false,
      };
      setGoals([...goals, goal]);
      setShowAddModal(false);
      setNewGoal({ title: '', type: 'meditation', target: 0, unit: '分钟' });
    }
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const updateProgress = (id: string, progress: number) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, progress: Math.min(progress, goal.target) } : goal
    ));
  };

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
        <h1 className="text-2xl font-bold text-gray-800">我的目标</h1>
      </motion.div>

      {/* 目标统计 */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">总目标</p>
              <p className="text-xl font-bold text-gray-800">{goals.length}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-orange-400 to-red-400">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">进行中</p>
              <p className="text-xl font-bold text-gray-800">{goals.filter(g => !g.completed).length}</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* 目标列表 */}
      <div className="space-y-4">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <GlassCard className="p-4">
              <div className="flex items-start gap-4">
                {/* 图标 */}
                <div className={`p-3 rounded-full bg-gradient-to-br ${typeColors[goal.type]}`}>
                  <span className="text-xl">{typeIcons[goal.type]}</span>
                </div>
                
                {/* 内容 */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                    <button 
                      onClick={() => toggleGoal(goal.id)}
                      className={`p-2 rounded-full transition-colors ${
                        goal.completed 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* 进度条 */}
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>进度</span>
                      <span>{goal.progress} / {goal.target} {goal.unit}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(goal.progress / goal.target) * 100}%` }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${typeColors[goal.type]} rounded-full`}
                      />
                    </div>
                  </div>
                  
                  {/* 快捷按钮 */}
                  <div className="flex gap-2">
                    {goal.type === 'meditation' && (
                      <>
                        <button 
                          onClick={() => updateProgress(goal.id, goal.progress + 5)}
                          className="px-3 py-1 text-xs bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors"
                        >
                          +5分钟
                        </button>
                        <button 
                          onClick={() => updateProgress(goal.id, goal.progress + 10)}
                          className="px-3 py-1 text-xs bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors"
                        >
                          +10分钟
                        </button>
                      </>
                    )}
                    {goal.type === 'mood' && (
                      <button 
                        onClick={() => updateProgress(goal.id, goal.progress + 1)}
                        className="px-3 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition-colors"
                      >
                        完成一天
                      </button>
                    )}
                    {goal.type === 'sleep' && (
                      <button 
                        onClick={() => updateProgress(goal.id, goal.target)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        已早睡
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* 添加目标按钮 */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* 添加目标弹窗 */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">添加新目标</h2>
            
            <div className="space-y-4">
              {/* 目标名称 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">目标名称</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="例如：每日冥想"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              
              {/* 目标类型 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">目标类型</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['meditation', 'mood', 'sleep', 'exercise'] as Goal['type'][]).map(type => (
                    <button
                      key={type}
                      onClick={() => setNewGoal({ ...newGoal, type })}
                      className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${
                        newGoal.type === type 
                          ? 'bg-green-100 border-2 border-green-400' 
                          : 'bg-gray-100 border-2 border-transparent hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-xl">{typeIcons[type]}</span>
                      <span className="text-xs text-gray-600">
                        {type === 'meditation' ? '冥想' : type === 'mood' ? '心情' : type === 'sleep' ? '睡眠' : '运动'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 目标数值 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">目标值</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={e => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 0 })}
                    placeholder="目标数值"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <select
                    value={newGoal.unit}
                    onChange={e => setNewGoal({ ...newGoal, unit: e.target.value })}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <option value="分钟">分钟</option>
                    <option value="天">天</option>
                    <option value="次">次</option>
                    <option value="点前">点前</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={addGoal}
                disabled={!newGoal.title || newGoal.target <= 0}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                添加
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}