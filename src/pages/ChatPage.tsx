import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { ChatBubble } from '@components/ChatBubble';
import { useStore } from '@store/useStore';
import { formatTime } from '@utils/helpers';

export function ChatPage() {
  const { messages, sendUserMessage, setCurrentTab, selectedAnimal, isTyping } = useStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendUserMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blossom-50/95 to-forest-50 pb-32">
      <header className="sticky top-0 z-50 flex items-center gap-3 glass px-4 py-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentTab('home')}
          className="p-2 hover:bg-white/50 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-forest-700" />
        </motion.button>

        <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm animate-breathe">
          {selectedAnimal.emoji}
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-forest-900">{selectedAnimal.name}</h3>
          <p className="flex items-center gap-1 text-xs text-forest-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-blossom-400 to-forest-400" />
            在线
          </p>
        </div>

        <button type="button" className="p-2 hover:bg-white/50 rounded-full transition-colors">
          <MoreVertical className="w-6 h-6 text-forest-700" />
        </button>
      </header>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 pb-8">
        <div className="text-center text-xs text-forest-500 my-4">
          {formatTime(new Date())}
        </div>

        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            onQuickReply={(reply) => sendUserMessage(reply)}
          />
        ))}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
              {selectedAnimal.emoji}
            </div>
            <div className="bg-white/80 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-forest-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-forest-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-forest-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-[100px] left-0 right-0 z-40 mx-auto max-w-md border-t border-blossom-100/50 glass px-4 py-3">
        <div className="flex items-center gap-2">
          <button type="button" className="p-2 text-forest-600 hover:bg-forest-50 rounded-full transition-colors">
            <span className="text-xl">😊</span>
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`和${selectedAnimal.name}说说心里话...`}
            className="flex-1 rounded-full border-0 bg-white/85 px-4 py-3 text-sm text-forest-900 shadow-inner placeholder:text-forest-600/50 focus:outline-none focus:ring-2 focus:ring-blossom-300/80"
          />

          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="rounded-full bg-gradient-to-br from-forest-500 to-blossom-500 p-3 text-white shadow-lg transition-colors hover:from-forest-600 hover:to-blossom-600 disabled:from-forest-300 disabled:to-blossom-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
