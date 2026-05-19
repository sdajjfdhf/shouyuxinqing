import { motion } from 'framer-motion';
import { Home, TreePine, MessageCircle, BookOpen, User } from 'lucide-react';
import { TabType } from '@/types';
import { cn } from '@utils/helpers';
import { useStore } from '@store/useStore';

const tabs: { id: TabType; label: string; icon: typeof Home; badge?: number }[] = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'forest', label: '森林', icon: TreePine },
  { id: 'chat', label: '对话', icon: MessageCircle, badge: 3 },
  { id: 'knowledge', label: '学习', icon: BookOpen },
  { id: 'profile', label: '我的', icon: User },
];

export function BottomNav() {
  const { currentTab, setCurrentTab } = useStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass-dark border-t border-white/50 px-6 py-2 pb-safe z-50">
      <div className="flex justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              whileTap={{ scale: 0.9 }}
              className={cn(
                'flex flex-col items-center gap-1 p-2 relative transition-colors duration-300',
                isActive ? 'text-forest-600' : 'text-gray-400 hover:text-blossom-400'
              )}
            >
              <div className="relative">
                <Icon 
                  className={cn(
                    'w-6 h-6 transition-all duration-300',
                    isActive && 'stroke-[2.5px]'
                  )} 
                  fill={isActive ? 'currentColor' : 'none'}
                  fillOpacity={isActive ? 0.2 : 0}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-xs font-medium transition-all duration-300',
                isActive && 'scale-105'
              )}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-2 w-1 h-1 rounded-full bg-blossom-500"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
