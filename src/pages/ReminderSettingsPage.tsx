import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@components/GlassCard';
import { ArrowLeft, Bell, Moon, Sun, Volume2, VolumeX } from 'lucide-react';

interface Reminder {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  time: string;
  days: string[];
  sound: boolean;
}

const initialReminders: Reminder[] = [
  { id: '1', name: '早安提醒', icon: '🌅', enabled: true, time: '07:00', days: ['周一', '周二', '周三', '周四', '周五'], sound: true },
  { id: '2', name: '冥想时间', icon: '🧘', enabled: true, time: '12:00', days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], sound: true },
  { id: '3', name: '下午茶休息', icon: '☕', enabled: false, time: '15:00', days: ['周一', '周二', '周三', '周四', '周五'], sound: true },
  { id: '4', name: '睡前放松', icon: '🌙', enabled: true, time: '22:00', days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], sound: false },
];

const timeOptions = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00', '23:30'
];

const dayOptions = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export default function ReminderSettingsPage({ onBack }: { onBack: () => void }) {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [selectedReminder] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReminder, setNewReminder] = useState({ name: '', icon: '🌅', enabled: true, time: '09:00', days: dayOptions.slice(0, 5), sound: true });

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const toggleSound = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, sound: !r.sound } : r));
  };

  const updateTime = (id: string, time: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, time } : r));
  };

  const toggleDay = (id: string, day: string) => {
    setReminders(reminders.map(r => {
      if (r.id === id) {
        const days = r.days.includes(day) 
          ? r.days.filter(d => d !== day)
          : [...r.days, day];
        return { ...r, days };
      }
      return r;
    }));
  };

  const addReminder = () => {
    if (newReminder.name) {
      const reminder: Reminder = {
        id: Date.now().toString(),
        ...newReminder,
      };
      setReminders([...reminders, reminder]);
      setShowAddModal(false);
      setNewReminder({ name: '', icon: '🌅', enabled: true, time: '09:00', days: dayOptions.slice(0, 5), sound: true });
    }
  };

  const iconOptions = ['🌅', '🧘', '☕', '🌙', '🌸', '💧', '🍃', '✨'];

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
          <h1 className="text-2xl font-bold text-gray-800">提醒设置</h1>
          <p className="text-sm text-gray-500">管理您的日常提醒</p>
        </div>
      </motion.div>

      {/* 快捷设置 */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <GlassCard className="p-4 cursor-pointer hover:bg-white/80 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400">
              <Sun className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">日间模式</p>
              <p className="font-semibold text-gray-800">自动开启</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4 cursor-pointer hover:bg-white/80 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400">
              <Moon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">夜间模式</p>
              <p className="font-semibold text-gray-800">22:00 开启</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* 提醒列表 */}
      <div className="space-y-4">
        {reminders.map((reminder, index) => (
          <motion.div
            key={reminder.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <GlassCard className={`p-4 ${selectedReminder === reminder.id ? 'ring-2 ring-green-400' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* 图标 */}
                  <div className={`p-3 rounded-full ${reminder.enabled ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gray-200'}`}>
                    <span className="text-xl">{reminder.icon}</span>
                  </div>
                  
                  {/* 内容 */}
                  <div>
                    <h3 className="font-semibold text-gray-800">{reminder.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className={reminder.enabled ? 'text-green-500' : 'text-gray-400'}>
                        {reminder.enabled ? '已开启' : '已关闭'}
                      </span>
                      <span>·</span>
                      <span>{reminder.time}</span>
                    </div>
                    {/* 日期标签 */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {dayOptions.map(day => (
                        <span
                          key={day}
                          onClick={() => toggleDay(reminder.id, day)}
                          className={`px-2 py-0.5 rounded-full text-xs cursor-pointer transition-colors ${
                            reminder.days.includes(day)
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex flex-col gap-2">
                  {/* 开关 */}
                  <button
                    onClick={() => toggleReminder(reminder.id)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      reminder.enabled ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      animate={{ x: reminder.enabled ? 20 : 2 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                    />
                  </button>
                  {/* 声音开关 */}
                  <button
                    onClick={() => toggleSound(reminder.id)}
                    className={`p-2 rounded-full transition-colors ${
                      reminder.sound ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {reminder.sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {/* 时间选择器（展开状态） */}
              {selectedReminder === reminder.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 pt-4 border-t border-gray-100"
                >
                  <p className="text-sm text-gray-500 mb-2">设置时间</p>
                  <div className="flex flex-wrap gap-2">
                    {timeOptions.map(time => (
                      <button
                        key={time}
                        onClick={() => updateTime(reminder.id, time)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          reminder.time === time
                            ? 'bg-green-400 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* 添加提醒按钮 */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110"
      >
        <Bell className="w-6 h-6" />
      </motion.button>

      {/* 添加提醒弹窗 */}
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
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">添加新提醒</h2>
            
            <div className="space-y-4">
              {/* 提醒名称 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">提醒名称</label>
                <input
                  type="text"
                  value={newReminder.name}
                  onChange={e => setNewReminder({ ...newReminder, name: e.target.value })}
                  placeholder="例如：冥想时间"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              
              {/* 图标选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">选择图标</label>
                <div className="grid grid-cols-8 gap-2">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewReminder({ ...newReminder, icon })}
                      className={`p-2 rounded-lg transition-colors ${
                        newReminder.icon === icon 
                          ? 'bg-green-100 border-2 border-green-400' 
                          : 'bg-gray-100 border-2 border-transparent hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-xl">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 时间选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">提醒时间</label>
                <select
                  value={newReminder.time}
                  onChange={e => setNewReminder({ ...newReminder, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              
              {/* 重复日期 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">重复日期</label>
                <div className="flex flex-wrap gap-2">
                  {dayOptions.map(day => (
                    <button
                      key={day}
                      onClick={() => setNewReminder({
                        ...newReminder,
                        days: newReminder.days.includes(day)
                          ? newReminder.days.filter(d => d !== day)
                          : [...newReminder.days, day]
                      })}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        newReminder.days.includes(day)
                          ? 'bg-green-400 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 声音开关 */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">提醒声音</span>
                <button
                  onClick={() => setNewReminder({ ...newReminder, sound: !newReminder.sound })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    newReminder.sound ? 'bg-green-400' : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: newReminder.sound ? 20 : 2 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                  />
                </button>
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
                onClick={addReminder}
                disabled={!newReminder.name}
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