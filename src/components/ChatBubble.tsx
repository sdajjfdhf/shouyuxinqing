import { motion } from 'framer-motion';
import { Message } from '@/types';
import { formatTime, cn } from '@/utils/helpers';

interface ChatBubbleProps {
  message: Message;
  onQuickReply?: (reply: string) => void;
}

export function ChatBubble({ message, onQuickReply }: ChatBubbleProps) {
  const isUser = message.type === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex flex-col gap-2', isUser ? 'items-end' : 'items-start')}
    >
      <div
        className={cn(
          'max-w-[80%] px-4 py-3 rounded-2xl',
          isUser ? 'chat-bubble-user' : 'chat-bubble-ai'
        )}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
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
            <button
              key={reply}
              type="button"
              onClick={() => onQuickReply(reply)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/90 border border-forest-200 text-forest-700 hover:bg-forest-50 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
