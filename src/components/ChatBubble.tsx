import { motion } from 'framer-motion';
import { Message } from '@/types';
import { formatTime, cn } from '@/utils/helpers';

interface ChatBubbleProps {
  message: Message;
  onQuickReply?: (reply: string) => void;
}

// 可爱的莓果装饰组件
function CuteBerryDecoration() {
  return (
    <motion.div
      className="absolute -top-2 -right-2"
      initial={{ scale: 0, rotate: -45 }}
      animate={{ 
        scale: [0, 1.2, 1], 
        rotate: [-45, 0],
        y: [0, -3, 0]
      }}
      transition={{ 
        scale: { duration: 0.4, ease: 'easeOut' },
        rotate: { duration: 0.3 },
        y: { 
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut'
        }
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        {/* 莓果主体 */}
        <motion.circle
          cx="12"
          cy="14"
          r="8"
          fill="#E85D75"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        {/* 高光 */}
        <ellipse cx="9" cy="11" rx="2" ry="1.5" fill="rgba(255,255,255,0.5)" />
        {/* 叶子 */}
        <motion.path
          d="M16 8 C18 6 19 8 16 10 L14 9 C15 7 14 6 16 8"
          fill="#4CAF50"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* 小茎 */}
        <path d="M12 6 L12 4" stroke="#388E3C" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

// 浮动的小叶子装饰
function FloatingLeaves() {
  return (
    <div className="absolute -bottom-1 -left-3">
      <motion.svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        animate={{ 
          y: [0, -4, 0],
          rotate: [0, 3, -3, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut'
        }}
      >
        <path
          d="M8 2 C4 4 2 8 8 14 C14 8 12 4 8 2"
          fill="#81C784"
          opacity="0.7"
        />
      </motion.svg>
    </div>
  );
}

// 爱心漂浮动画
function FloatingHearts() {
  return (
    <motion.div
      className="absolute -top-1 left-1/2"
      initial={{ opacity: 0, y: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.8, 0],
        y: [0, -20, -35],
        scale: [0, 1.2, 0.8]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        repeatDelay: 4,
        ease: 'easeOut'
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="#FF69B4">
        <path d="M6 11 C3 8 0 5 0 2 C0 1 1 0 2 0 C3 0 4 1 4 2 C4 5 6 7 6 11 C6 7 8 5 8 2 C8 1 9 0 10 0 C11 0 12 1 12 2 C12 5 9 8 6 11 Z" />
      </svg>
    </motion.div>
  );
}

export function ChatBubble({ message, onQuickReply }: ChatBubbleProps) {
  const isUser = message.type === 'user';
  // 检测消息内容中是否包含与自然相关的关键词
  const hasNatureKeywords = !isUser && (
    message.content.includes('莓') || 
    message.content.includes('果实') || 
    message.content.includes('花') ||
    message.content.includes('叶子') ||
    message.content.includes('森林') ||
    message.content.includes('小动物')
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex flex-col gap-2', isUser ? 'items-end' : 'items-start')}
    >
      <div
        className={cn(
          'max-w-[80%] px-4 py-3 rounded-2xl relative',
          isUser ? 'chat-bubble-user' : 'chat-bubble-ai'
        )}
      >
        {/* AI消息添加可爱装饰 */}
        {!isUser && hasNatureKeywords && (
          <>
            <CuteBerryDecoration />
            <FloatingLeaves />
            <FloatingHearts />
          </>
        )}
        
        <p className="text-sm leading-relaxed relative z-10">{message.content}</p>
        <span
          className={cn(
            'text-[10px] mt-1 block',
            isUser ? 'text-white/70' : 'text-forest-400'
          )}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>

      {!isUser && message.quickReplies && message.quickReplies.length > 0 && onQuickReply && (
        <div className="flex flex-wrap gap-2 max-w-[90%]">
          {message.quickReplies.map((reply) => (
            <motion.button
              key={reply}
              type="button"
              onClick={() => onQuickReply(reply)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/90 border border-forest-200 text-forest-700 hover:bg-forest-50 transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {reply}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
