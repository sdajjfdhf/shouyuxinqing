import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@components/GlassCard';
import { ArrowLeft, Share2, MessageSquare, Copy, Check, Sparkles } from 'lucide-react';

const shareOptions = [
  { id: '1', name: '微信', icon: '💬', color: 'from-green-400 to-emerald-500', description: '分享给微信好友' },
  { id: '2', name: 'QQ', icon: '💜', color: 'from-blue-400 to-indigo-500', description: '分享给QQ好友' },
  { id: '3', name: '微博', icon: '🔥', color: 'from-red-400 to-pink-500', description: '分享到微博' },
  { id: '4', name: '朋友圈', icon: '📸', color: 'from-yellow-400 to-orange-500', description: '分享到朋友圈' },
  { id: '5', name: '短信', icon: '💌', color: 'from-purple-400 to-violet-500', description: '通过短信分享' },
  { id: '6', name: '邮件', icon: '📧', color: 'from-cyan-400 to-blue-500', description: '通过邮件分享' },
];

export default function SharePage({ onBack }: { onBack: () => void }) {
  const [copied, setCopied] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText('https://forest-healing.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (id: string) => {
    setSelectedOption(id);
    setTimeout(() => {
      setSelectedOption(null);
      alert('分享功能已触发！（实际应用中会调用系统分享接口）');
    }, 500);
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">分享给朋友</h1>
          <p className="text-sm text-gray-500">邀请好友一起探索森林</p>
        </div>
      </motion.div>

      {/* 分享卡片预览 */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <GlassCard className="p-6 bg-gradient-to-br from-green-400 to-emerald-500 text-white relative overflow-hidden">
          {/* 装饰背景 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-white/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">森林疗愈</h2>
                <p className="text-white/80 text-sm">您的专属心灵栖息地</p>
              </div>
            </div>
            <p className="text-white/90 mb-4">
              在繁忙的生活中，给自己一片宁静的森林。冥想、日记、心情记录，让心灵得到疗愈。
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                10000+ 用户
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                4.9 评分
              </span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* 分享链接 */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">分享链接</p>
              <p className="text-gray-800 font-medium truncate">https://forest-healing.com</p>
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                copied 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">已复制</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-sm font-medium">复制</span>
                </>
              )}
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* 分享选项 */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-green-400" />
          选择分享方式
        </h2>
        
        <div className="grid grid-cols-3 gap-3">
          {shareOptions.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare(option.id)}
              className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                selectedOption === option.id 
                  ? `bg-gradient-to-br ${option.color} text-white` 
                  : 'bg-white/80 hover:bg-white'
              }`}
            >
              <span className="text-3xl">{option.icon}</span>
              <span className={`text-sm font-medium ${selectedOption === option.id ? 'text-white' : 'text-gray-700'}`}>
                {option.name}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* 邀请奖励 */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <GlassCard className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400">
              <span className="text-lg">🎁</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">邀请好友获得奖励</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 每邀请1位好友：获得3天高级会员</li>
                <li>• 邀请3位好友：解锁稀有徽章</li>
                <li>• 邀请10位好友：终身高级会员</li>
              </ul>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* 温馨提示 */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center text-sm text-gray-500 mt-6"
      >
        🌲 和朋友一起，在森林中找到内心的平静
      </motion.p>
    </div>
  );
}